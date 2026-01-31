import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigatewayv2_integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambdaRuntime from "aws-cdk-lib/aws-lambda";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FirstSqsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // creating 2 lambdas - producer and consumer
    const producer = new NodejsFunction(this, "ProducerFunction", {
      runtime: lambdaRuntime.Runtime.NODEJS_22_X,
      handler: "producerHandler",
      entry: path.join(__dirname, "../src/lambdas/handler.ts"),
      functionName: `${this.stackName}-producer-function`,
    });
    const consumer = new NodejsFunction(this, "ProducerFunction", {
      runtime: lambdaRuntime.Runtime.NODEJS_22_X,
      handler: "consumerHandler",
      entry: path.join(__dirname, "../src/lambdas/handler.ts"),
      functionName: `${this.stackName}-consumer-function`,
    });
    // initiate the api instance
    const api = new apigatewayv2.HttpApi(this, `${this.stackName}-Api`, {
      apiName: `${this.stackName}-Api`,
      corsPreflight: {
        allowHeaders: ["*"],
        allowMethods: [apigatewayv2.CorsHttpMethod.ANY],
        allowOrigins: ["*"],
      },
    });
    // adding routes
    api.addRoutes({
      path: "/orders",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2_integrations.HttpLambdaIntegration(
        "ProducerLambdaIntegration",
        producer,
      ),
    });
  }
}

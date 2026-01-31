import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambdaBase from "aws-cdk-lib/aws-lambda";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FirstSqsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // creating 2 lambdas - producer and consumer
    const producer = new NodejsFunction(this, "ProducerFunction", {
      runtime: lambdaBase.Runtime.NODEJS_22_X,
      handler: "producerHandler",
      entry: path.join(__dirname, "../src/lambdas/handler.ts"),
      functionName: `${this.stackName}-producer-function`,
    });
    const consumer = new NodejsFunction(this, "ProducerFunction", {
      runtime: lambdaBase.Runtime.NODEJS_22_X,
      handler: "consumerHandler",
      entry: path.join(__dirname, "../src/lambdas/handler.ts"),
      functionName: `${this.stackName}-consumer-function`,
    });
    // initiate the api instance with apigateway v1
    const api = new apigateway.RestApi(this, "OrdersAPI");
    // adding routes
    const orders = api.root.addResource("orders");
    // adding method
    orders.addMethod("POST", new apigateway.LambdaIntegration(producer));
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url!,
    });
  }
}

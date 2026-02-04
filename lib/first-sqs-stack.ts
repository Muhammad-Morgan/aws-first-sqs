import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambdaBase from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources"; //
import * as sqs from "aws-cdk-lib/aws-sqs";

export class FirstSqsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // creating queue
    const queue = new sqs.Queue(this, "OrdersQueue", {
      visibilityTimeout: cdk.Duration.seconds(30),
      queueName: `${this.stackName}-orders-queue`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    // creating 2 lambdas - producer and consumer
    const producer = new NodejsFunction(this, "ProducerFunction", {
      runtime: lambdaBase.Runtime.NODEJS_22_X,
      handler: "producerHandler",
      entry: path.join(__dirname, "../src/lambdas/handler.ts"),
      functionName: `${this.stackName}-producer-function`,
      environment: {
        QUEUE_URL: queue.queueUrl,
      }, //adding queue url in the env var of the relevant lambda
    });
    //granting access to producer
    queue.grantSendMessages(producer);
    const consumer = new NodejsFunction(this, "ConsumerFunction", {
      runtime: lambdaBase.Runtime.NODEJS_22_X,
      handler: "consumerHandler",
      entry: path.join(__dirname, "../src/lambdas/handler.ts"),
      functionName: `${this.stackName}-consumer-function`,
    });
    // granting access to consumer
    consumer.addEventSource(
      new lambdaEventSources.SqsEventSource(queue, {
        batchSize: 10, //controls how many messages we're going to get at the same time
      }),
    );
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

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  SQSEvent,
} from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const sqs = new SQSClient({ region: "us-east-1" });
// the lambda that is attached to the HTTP path, and it gets orderId and places in the queue
export async function producerHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const { orderId } = JSON.parse(event.body!);
    // sending message
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.QUEUE_URL!, //queue url
        MessageBody: JSON.stringify({
          orderId,
        }),
      }),
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order placed in the queue",
        orderId,
      }),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating order",
      }),
    };
  }
}
// grap the message from the queue, and will do something with orderId.
export async function consumerHandler(event: SQSEvent): Promise<void> {
  console.log("TEMP : ", event);
  // dead letter queue
  throw new Error("Test");
  const messages = event.Records; // graping messages
  for (const message of messages) {
    const { orderId } = JSON.parse(message.body);
    console.log("Processing order: ", orderId);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // a delaying FN
    console.log("Finished processing order: ", orderId);
  }
}

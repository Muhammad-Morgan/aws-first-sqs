import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function producerHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const { orderId } = JSON.parse(event.body!);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order created",
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
export async function consumerHandler(): Promise<void> {
  console.log("finished processing order");
}

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export async function producerHandler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log("Producer: ", event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "ay 7aga",
    }),
  };
}
export async function consumerHandler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log("Consumer: ", event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "ay 7aga",
    }),
  };
}

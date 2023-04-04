import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResultContext,
} from "aws-lambda";
import { ERROR_MESSAGES } from "../../../../shared/constants";

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: APIGatewayAuthorizerResultContext
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const { authorizationToken, methodArn: Resource } = event;
    const tokenBase64 = authorizationToken.split(" ")[1];

    console.log("tokenBase64", tokenBase64);
    const [userName, password] = Buffer.from(tokenBase64, "base64")
      .toString("utf-8")
      .split(":");
    const Effect =
      userName === process.env["AUTH_USER"] &&
      password === process.env["AUTH_PASSWORD"]
        ? "Allow"
        : "Deny";

    return Promise.resolve({
      principalId: tokenBase64,
      context,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect,
            Resource,
          },
        ],
      },
    });
  } catch (e) {
    return Promise.reject(new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
  }
};

export const main = basicAuthorizer;

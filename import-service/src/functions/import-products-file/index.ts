import { handlerPath } from "@libs/handler-resolver";
import {
  BASIC_AUTHORIZER_LAMBDA_ARN_EXPORT_NAME,
  ERROR_MESSAGES,
} from "../../../../shared/constants";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          name: "basicAuthorizer",
          arn: {
            "Fn::ImportValue": BASIC_AUTHORIZER_LAMBDA_ARN_EXPORT_NAME,
          },
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: "token",
        },
        responseData: {
          200: {
            description: ERROR_MESSAGES.OK,
            bodyType: "importProductsFileResponse",
          },
          400: {
            description: `${ERROR_MESSAGES.REQUIRED_PARAMETER_MISSING}: name`,
          },
          500: {
            description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          },
        },
      },
    },
  ],
};

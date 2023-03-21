import { handlerPath } from "@libs/handler-resolver";
import { ERROR_MESSAGES } from "../../../../shared/constants";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        request: {
          parameters: {
            paths: {
              name: true,
            },
          },
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

import { handlerPath } from "@libs/handler-resolver";
import { ERROR_MESSAGES } from "../../../../shared/constants";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        responseData: {
          200: {
            description: ERROR_MESSAGES.OK,
            // bodyType: "createProductResponse",
          },
          400: {
            description: ERROR_MESSAGES.BAD_REQUEST,
          },
          500: {
            description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          },
        },
      },
    },
  ],
};

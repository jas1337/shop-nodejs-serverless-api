import { handlerPath } from "@libs/handler-resolver";
import { ERROR_MESSAGES } from "../../utils/api_utils";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors: true,
        responseData: {
          200: {
            description: ERROR_MESSAGES.OK,
            bodyType: "createProductResponse",
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

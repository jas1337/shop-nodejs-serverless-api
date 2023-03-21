import { handlerPath } from "@libs/handler-resolver";
import { ERROR_MESSAGES } from "../../../../shared/constants";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{productId}",
        request: {
          parameters: {
            paths: {
              productId: true,
            },
          },
        },
        responseData: {
          200: {
            description: ERROR_MESSAGES.OK,
            bodyType: "getProductByIdResponse",
          },
          404: {
            description: ERROR_MESSAGES.NOT_FOUND,
          },
          500: {
            description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          },
        },
      },
    },
  ],
};

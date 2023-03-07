import { handlerPath } from "@libs/handler-resolver";
import { ERROR_MESSAGES } from "../../utils/api_utils";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        responseData: {
          200: {
            description: ERROR_MESSAGES.OK,
            bodyType: "getProductListResponse",
          },
          500: {
            description: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          },
        },
      },
    },
  ],
};

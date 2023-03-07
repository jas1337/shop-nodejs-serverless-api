import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { MOCK_PRODUCT_LIST } from "../../mocks/product-list_mock";
import { ERROR_MESSAGES } from "../../utils/api_utils";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  try {
    return formatJSONResponse(200, MOCK_PRODUCT_LIST);
  } catch (e) {
    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(getProductsList);

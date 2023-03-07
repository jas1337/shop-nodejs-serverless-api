import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { MOCK_PRODUCT_LIST } from "../../mocks/product-list_mock";
import { ERROR_MESSAGES } from "../../utils/api_utils";

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event
) => {
  try {
    const { productId } = event.pathParameters;
    const product = MOCK_PRODUCT_LIST.find(({ id }) => id == productId);

    if (!product) {
      return formatJSONResponse(404, { message: ERROR_MESSAGES.NOT_FOUND });
    }

    return formatJSONResponse(200, { product });
  } catch (e) {
    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(getProductById);

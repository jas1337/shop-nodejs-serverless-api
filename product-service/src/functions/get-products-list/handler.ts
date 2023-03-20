import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { ERROR_MESSAGES } from "../../utils/api_utils";
import { ProductsService } from "../../services/products_service";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  try {
    const products = await ProductsService.getProductsList();

    return formatJSONResponse(200, products);
  } catch (e) {
    console.log(e);
    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(getProductsList);

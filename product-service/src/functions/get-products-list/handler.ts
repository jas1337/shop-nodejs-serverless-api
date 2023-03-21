import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { ERROR_MESSAGES } from "../../../../shared/constants";
import { ProductsService } from "../../services/products_service";
import { logger, withRequest } from "../../../../shared/utils/logger_utils";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
  context
) => {
  withRequest(event, context);
  logger.info(event, "event");

  try {
    const products = await ProductsService.getProductsList();

    return formatJSONResponse(200, products);
  } catch (e) {
    logger.error(e);

    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(getProductsList);

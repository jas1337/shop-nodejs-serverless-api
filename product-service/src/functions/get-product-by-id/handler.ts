import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { ERROR_MESSAGES } from "../../utils/api_utils";
import { ProductsService } from "../../services/products_service";
import { logger, withRequest } from "../../../../shared/utils/logger_utils";

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
  context
) => {
  withRequest(event, context);
  logger.info(event, "event");

  try {
    const { productId } = event.pathParameters;
    const product = await ProductsService.getProductById(productId);

    if (!product) {
      logger.error(`${ERROR_MESSAGES.NOT_FOUND} id:${productId}`);

      return formatJSONResponse(404, { message: ERROR_MESSAGES.NOT_FOUND });
    }

    return formatJSONResponse(200, { product });
  } catch (e) {
    logger.error(e);

    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(getProductById);

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { ERROR_MESSAGES } from "../../utils/api_utils";
import { ProductsService } from "../../services/products_service";
import { logger, withRequest } from "../../utils/logger_utils";

type createProductSchema = {
  type: "object";
  properties: {
    title: { type: "string" };
    description: { type: "string" };
    price: { type: "integer" };
    count: { type: "integer" };
  };
  required: ["title", "description", "price", "count"];
};

const createProduct: ValidatedEventAPIGatewayProxyEvent<
  createProductSchema
> = async (event, context) => {
  withRequest(event, context);
  logger.info(event, "event");

  try {
    const { title, description, price, count } = event.body;

    const missingFields = Object.entries({
      title: "asddsad",
      description: "dasasdd",
      price: "",
      count: "",
    }).reduce((acc, [key, value]) => [...acc, ...(!value ? [key] : [])], []);

    if (missingFields.length) {
      logger.error(`Missing values for fields: ${missingFields.join(",")}`);

      return formatJSONResponse(400, ERROR_MESSAGES.BAD_REQUEST);
    }

    const product = await ProductsService.createProduct({
      title,
      description,
      price,
      count,
    });

    return formatJSONResponse(200, product);
  } catch (e) {
    logger.error(e);

    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(createProduct);

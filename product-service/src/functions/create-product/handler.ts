import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { ERROR_MESSAGES } from "../../utils/api_utils";
import { ProductsService } from "../../services/products_service";

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
> = async (event) => {
  try {
    const { title, description, price, count } = event.body;

    if (
      [title, description, price, count].some(
        (property) => property === undefined
      )
    ) {
      console.log('400');
      return formatJSONResponse(400, ERROR_MESSAGES.BAD_REQUEST);
    }

    const product = await ProductsService.createProduct({
      title,
      description,
      price,
      count,
    });
    console.log(product);
    return formatJSONResponse(200, product);
  } catch (e) {
    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(createProduct);

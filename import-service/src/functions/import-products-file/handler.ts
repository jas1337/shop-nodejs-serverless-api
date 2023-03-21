import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { logger, withRequest } from "../../../../shared/utils/logger_utils";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<never> = async (
  event,
  context
) => {
  withRequest(event, context);
  logger.info(event, "event");

  return formatJSONResponse(event);
};

export const main = middyfy(importProductsFile);

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { logger, withRequest } from "../../../../shared/utils/logger_utils";
import { ERROR_MESSAGES } from "../../../../shared/constants";
import { ImportService } from "../../services/import_service";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<never> = async (
  event,
  context
) => {
  withRequest(event, context);
  logger.info(event, "event");

  try {
    const { name } = event.queryStringParameters;
    if (!name) {
      logger.error(`${ERROR_MESSAGES.REQUIRED_PARAMETER_MISSING}: name`);

      return formatJSONResponse(400, {
        message: `${ERROR_MESSAGES.REQUIRED_PARAMETER_MISSING}: name`,
      });
    }

    const signedUrl = await ImportService.getSingedUrl(name);

    return formatJSONResponse(200, signedUrl);
  } catch (e) {
    logger.error(e);

    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(importProductsFile);

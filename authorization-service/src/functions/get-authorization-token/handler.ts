import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { ERROR_MESSAGES } from "../../../../shared/constants";
import { logger, withRequest } from "../../../../shared/utils/logger_utils";

const getAuthorizationToken: ValidatedEventAPIGatewayProxyEvent<
  string
> = async (event, context) => {
  withRequest(event, context);
  logger.info(event, "event");

  try {
    const token = Buffer.from(
      `${process.env["AUTH_USER"]}:${process.env["AUTH_PASSWORD"]}`
    ).toString("base64");

    return formatJSONResponse(200, token);
  } catch (e) {
    logger.error(e);

    return formatJSONResponse(500, {
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const main = middyfy(getAuthorizationToken);

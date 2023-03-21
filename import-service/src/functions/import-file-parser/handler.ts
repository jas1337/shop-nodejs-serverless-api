// import type { S3Handler } from 'aws-lambda'
import { middyfy } from "@libs/lambda";
import { formatJSONResponse } from "@libs/api-gateway";

// import { logger, withRequest } from "../../../../shared/utils/logger_utils";
// import { ERROR_MESSAGES } from "../../../../shared/constants";
// import { ImportService } from "../../services/import-service";

const importFileParser: any = async (event, context) => {
  // withRequest(event, context);
  // logger.info(event, "event");
  console.log("RECORDS", event.Records, context);
  for (let record of event.Records) {
    console.log("JAS1337", record);
    // await ImportService.parseFile(record.s3.object.key)
  }
  // try {
  //   const { name } = event.pathParameters;
  //   if (!name) {
  //     logger.error(`${ERROR_MESSAGES.REQUIRED_PARAMETER_MISSING}: name`);
  //
  //     return formatJSONResponse(400, {
  //       message: `${ERROR_MESSAGES.REQUIRED_PARAMETER_MISSING}: name`,
  //     });
  //   }
  //
  //   const signedUrl = await ImportService.getSingedUrl(name);
  //
  return formatJSONResponse(200, "signedUrl");
  // } catch (e) {
  //   logger.error(e);
  //
  //   return formatJSONResponse(500, {
  //     message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  //   });
  // }
};

export const main = middyfy(importFileParser);

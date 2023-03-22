import { S3Event, S3Handler } from "aws-lambda";

import { logger, withRequest } from "../../../../shared/utils/logger_utils";
import { ImportService } from "../../services/import-service";

const importFileParser: S3Handler = async (event: S3Event, context) => {
  withRequest(event, context);
  logger.info(event, "event");

  for (let record of event.Records) {
    await ImportService.parseFile(record.s3.object.key);
  }
};

export const main = importFileParser;

import { S3, SQS } from "aws-sdk";
import csv from "csv-parser";
import { logger } from "../../../shared/utils/logger_utils";
import { ValidationUtils } from "../../../shared/utils/validation_utils";

export class ImportService {
  static s3 = new S3();
  static sqs = new SQS();

  static async getSingedUrl(fileName: string) {
    return await this.s3.getSignedUrlPromise("putObject", {
      Bucket: process.env["BUCKET_NAME"],
      Key: `uploaded/${fileName}`,
      ContentType: "text/csv",
      Expires: 60,
    });
  }

  static async parseFile(sourcePath) {
    const Bucket = process.env["BUCKET_NAME"];
    const targetPath = sourcePath.replace("uploaded", "parsed");

    return new Promise((resolve, reject) => {
      const s3Stream = this.s3
        .getObject({
          Bucket,
          Key: sourcePath,
        })
        .createReadStream();
      const entries = [];

      s3Stream
        .pipe(
          csv({
            separator: ";",
            headers: ["id", "title", "description", "price", "count"],
            skipLines: 1,
          })
        )
        .on("data", async (data) => {
          const missingFields =
            ValidationUtils.validateRequiredProductFields(data);

          if (missingFields.length) {
            logger.error(
              `Missing values for fields: ${missingFields.join(",")}`
            );

            return;
          }
          const { title, description, price, count } = data;

          entries.push({ title, description, price, count });
        })
        .on("error", (e) => {
          logger.error(`Error on parsing csv file "${sourcePath}"`);
          return reject(e);
        })
        .on("end", async (data) => {
          logger.info(`Successfully parsed "${sourcePath}"`);
          try {
            await this.s3
              .copyObject({
                Bucket,
                CopySource: `${Bucket}/${sourcePath}`,
                Key: targetPath,
              })
              .promise();
            logger.info(`Copied "${sourcePath}" to ${targetPath}`);

            await this.s3
              .deleteObject({
                Bucket,
                Key: sourcePath,
              })
              .promise();
            logger.info(`Removed "${sourcePath}"`);

            if (entries.length) {
              await this.sqs
                .sendMessageBatch({
                  QueueUrl: process.env["CATALOG_ITEMS_QUEUE_URL"],
                  Entries: entries.map((entry, index) => ({
                    Id: `${index}`,
                    MessageBody: JSON.stringify(entry),
                  })),
                })
                .promise();
              logger.info(
                `Sending batch SQS message with ${entries.length} ${
                  entries.length > 1 ? "entries" : "entry"
                }`
              );
            }

            return resolve(data);
          } catch (e) {
            logger.error(e);
            return reject(e);
          }
        });
    });
  }
}

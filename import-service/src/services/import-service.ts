import { S3 } from "aws-sdk";
import csv from "csv-parser";
import { logger } from "../../../shared/utils/logger_utils";

export class ImportService {
  static s3 = new S3();

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

      s3Stream
        .pipe(csv())
        .on("data", (data) => {
          logger.info(`Parsing data ${data}`);
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
            return resolve(data);
          } catch (e) {
            logger.error(e);
            return reject(e);
          }
        });
    });
  }
}

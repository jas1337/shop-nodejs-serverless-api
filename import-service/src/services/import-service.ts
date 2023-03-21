import { S3 } from "aws-sdk";
// import csv from 'csv-parser'

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

  static async parseFile() {}
}

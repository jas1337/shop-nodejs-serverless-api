import { DynamoDB } from "aws-sdk";

export class DbUtils {
  static dynamoDb = new DynamoDB.DocumentClient();

  static async findInDb({
    TableName,
    KeyConditionExpression,
    ExpressionAttributeValues,
  }) {
    return await this.dynamoDb
      .query({
        TableName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      })
      .promise();
  }

  static async scanDb({ TableName }) {
    return await this.dynamoDb
      .scan({
        TableName,
      })
      .promise();
  }

  static async transactWriteDb(params) {
    return await this.dynamoDb.transactWrite(params).promise();
  }
}

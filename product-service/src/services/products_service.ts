import { DynamoDB } from "aws-sdk";
import { IProduct } from "../types/product_interface";
import { generateUuid } from "../utils/string_utils";
import { IStock } from "../types/stock_interface";
import { IProductWithCount } from "../types/product-with-count_interface";

export class ProductsService {
  static dynamoDb = new DynamoDB.DocumentClient();

  static async createProduct({
    title,
    description,
    price,
    count,
  }: Omit<IProductWithCount, "id">): Promise<IProductWithCount | null> {
    const uuid = generateUuid();
    const product: IProduct = { id: uuid, title, description, price };
    const stock: IStock = { productId: uuid, count };
    console.log(product);
    try {
      await this.dynamoDb
          .transactWrite({
            TransactItems: [
              {
                Put: {
                  TableName: "products",
                  Item: product,
                },
              },
              {
                Put: {
                  TableName: "stocks",
                  Item: stock,
                },
              },
            ],
          })
          .promise();
    } catch (c) {
      console.log('ERROR', c)
      throw c
    }


    return this.getProductById(uuid);
  }

  static async getProductById(id: string): Promise<IProductWithCount | null> {
    const productsResults = await this.findInDb("products", "id = :id", {
      ":id": id,
    });
    const stocksResults = await this.findInDb(
      "stocks",
      "product_id = :productId",
      {
        ":productId": id,
      }
    );
    const product = productsResults.Items[0];
    const stock = stocksResults.Items[0];

    if (!product || !stock) {
      return null;
    }

    return {
      ...product,
      count: stock.count,
    } as IProductWithCount;
  }

  static async findInDb(
    TableName: string,
    KeyConditionExpression: string,
    ExpressionAttributeValues: object
  ) {
    return await this.dynamoDb
      .query({
        TableName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      })
      .promise();
  }

  static getProductList(): Promise<IProduct[]> {
    return Promise.resolve([]);
  }
}

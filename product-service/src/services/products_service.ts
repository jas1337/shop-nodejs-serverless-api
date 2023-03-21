import { IProduct } from "../types/product_interface";
import { StringUtils } from "../../../shared/utils/string_utils";
import { IStock } from "../types/stock_interface";
import { IProductWithCount } from "../types/product-with-count_interface";
import { DbUtils } from "../utils/db_utils";

export class ProductsService {
  static async createProduct({
    title,
    description,
    price,
    count,
  }: Omit<IProductWithCount, "id">): Promise<IProductWithCount | null> {
    const uuid = StringUtils.generateUuid();
    const product: IProduct = { id: uuid, title, description, price };
    const stock: IStock = { product_id: uuid, count };

    await DbUtils.transactWriteDb({
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
    });

    return this.getProductById(uuid);
  }

  static async getProductById(id: string): Promise<IProductWithCount | null> {
    const productsResults = await DbUtils.findInDb({
      TableName: "products",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    });
    const product = productsResults.Items[0];
    const stock = await this.getStockByProductId(id);

    if (!product || !stock) {
      return null;
    }

    return {
      ...product,
      count: stock.count,
    } as IProductWithCount;
  }

  static async getStockByProductId(id: string): Promise<IStock | null> {
    const stocksResults = await DbUtils.findInDb({
      TableName: "stocks",
      KeyConditionExpression: "product_id = :productId",
      ExpressionAttributeValues: {
        ":productId": id,
      },
    });
    const stock = stocksResults.Items[0];

    if (!stock) {
      return null;
    }

    return stock as IStock;
  }

  static async getProductsList(): Promise<IProductWithCount[]> {
    const results = await DbUtils.scanDb({ TableName: "products" });
    const products = results.Items as IProduct[];

    return Promise.all(
      products.map((product) => this.attachProductCount(product))
    );
  }

  static async attachProductCount(
    product: IProduct
  ): Promise<IProductWithCount> {
    const stock = await this.getStockByProductId(product.id);

    return {
      ...product,
      count: stock.count,
    } as IProductWithCount;
  }
}

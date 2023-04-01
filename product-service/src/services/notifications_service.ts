import { SNS } from "aws-sdk";

export class NotificationsService {
  static sns = new SNS();

  static async notifyProductsCreated(
    products: {
      title: string;
      description: string;
      price: number;
      count: number;
    }[]
  ) {
    const productsValue = products.reduce((acc, { price, count }) => {
      acc += price * count;
      return acc;
    }, 0);
    const productsInfo = products.reduce(
      (acc, { title, description, price, count }, index) => {
        acc += `------- ${index + 1} ------- \n`;
        acc += `Title: ${title} \n`;
        acc += `Description: ${description} \n`;
        acc += `Price: ${price} \n`;
        acc += `Count: ${count} \n\n`;
        return acc;
      },
      ""
    );

    await this.sns
      .publish({
        TopicArn: process.env["CREATE_PRODUCT_TOPIC_ARN"],
        Subject: `New ${
          products.length > 1
            ? `products (${products.length}) were`
            : "product was"
        } created`,
        Message: `Created products:\n ${productsInfo}`,
        MessageAttributes: {
          productsValue: {
            DataType: "Number",
            StringValue: `${productsValue}`,
          },
        },
      })
      .promise();
  }
}

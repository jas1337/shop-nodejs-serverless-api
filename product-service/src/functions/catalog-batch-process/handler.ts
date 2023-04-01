import type { SQSHandler } from "aws-lambda";

import { ValidationUtils } from "../../../../shared/utils/validation_utils";
import { ProductsService } from "../../services/products_service";
import { logger, withRequest } from "../../../../shared/utils/logger_utils";
import { NotificationsService } from "../../services/notifications_service";

const catalogBatchProcess: SQSHandler = async (event, context) => {
  withRequest(event, context);
  logger.info(event, "event");

  try {
    const products = [];

    for (const [index, record] of event.Records.entries()) {
      const { title, description, price, count } = JSON.parse(record.body);

      const missingFields = ValidationUtils.validateRequiredProductFields({
        title,
        description,
        price,
        count,
      });

      if (missingFields.length) {
        logger.error(
          `Product creation failed. Missing values for fields: ${missingFields.join(
            ","
          )} in row ${index + 1}`
        );

        return;
      }
      const product = await ProductsService.createProduct({
        title,
        description,
        price,
        count,
      });

      products.push(product);
      logger.info("Successful creation of product ", title);
    }

    if (products.length) {
      await NotificationsService.notifyProductsCreated(products);
    } else {
      logger.info("No products were created");
    }
  } catch (e) {
    logger.error(e);
  }
};

export const main = catalogBatchProcess;

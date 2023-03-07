import { Product } from "../models/product_model";

export const MOCK_PRODUCT_LIST = Array(10)
  .fill({})
  .map(
    (_product, index) =>
      new Product({
        id: index,
        title: `Product ${index}`,
        description: `Description of Product ${index}`,
        price: (Math.random() * 1000).toFixed(2),
        count: 2,
      })
  );

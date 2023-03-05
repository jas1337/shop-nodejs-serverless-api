'use strict';

const {MOCK_PRODUCT_LIST} = require('../../mocks/products-list');

module.exports.getProductById = async (event) => {
  const {productId} = event;
  const product = MOCK_PRODUCT_LIST.find(({id}) => id == productId);

  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify(
          {
            message: 'Product not found',
          },
          null,
          2
      ),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
        {
          item: product,
        },
        null,
        2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

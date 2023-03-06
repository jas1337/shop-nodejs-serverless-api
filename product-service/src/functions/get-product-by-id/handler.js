'use strict';

const {MOCK_PRODUCT_LIST} = require('../../mocks/products-list');
const {headers} = require('../../utils/api_utils');

module.exports.getProductById = async (event) => {
  const {productId} = event.pathParameters;
  const product = MOCK_PRODUCT_LIST.find(({id}) => id == productId);

  if (!product) {
    return {
      statusCode: 404,
      headers,
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
    headers,
    body: JSON.stringify(
        {product},
        null,
        2
    ),
  };
};

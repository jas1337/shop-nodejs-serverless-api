'use strict';

const {MOCK_PRODUCT_LIST} = require('../../mocks/products-list');

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
        {
          items: MOCK_PRODUCT_LIST,
        },
        null,
        2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

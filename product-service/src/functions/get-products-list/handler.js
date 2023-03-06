'use strict';

const {MOCK_PRODUCT_LIST} = require('../../mocks/products-list');
const {headers} = require('../../utils/api_utils');

module.exports.getProductsList = async () => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(
        MOCK_PRODUCT_LIST,
        null,
        2
    ),
  };
};

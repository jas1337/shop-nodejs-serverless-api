const Product = require('../models/product_model');

module.exports.MOCK_PRODUCT_LIST = Array(10)
    .fill({})
    .map((product, index) => new Product({
        id: index,
        title: `Product ${index}`,
        description: `Description of Product ${index}`,
        price: (Math.random() * 1000).toFixed(2),
    }));
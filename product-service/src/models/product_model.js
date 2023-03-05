module.exports = class Product {
  /** @type {string} */
  id;

  /** @type {string} */
  title;

  /** @type {string} */
  description;

  /** @type {string} */
  price;

  constructor({
      id,
      title,
      description,
      price,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
  }
}
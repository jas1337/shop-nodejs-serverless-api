export class Product {
  /** @type {string} */
  id: string;

  /** @type {string} */
  title: string;

  /** @type {string} */
  description: string;

  /** @type {string} */
  price: string;

  /** @type {string} */
  count: string;

  constructor({ id, title, description, price, count }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.count = count;
  }
}

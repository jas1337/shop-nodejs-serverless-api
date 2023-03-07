import { IProduct } from "../types/product_interface";

export class Product implements IProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  count: string;

  constructor({ id, title, description, price, count }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.count = count;
  }
}

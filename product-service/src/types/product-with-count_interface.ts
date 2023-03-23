import { IProduct } from "./product_interface";

export type IProductWithCount = IProduct & { count: number };

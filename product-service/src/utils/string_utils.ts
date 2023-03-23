import { randomUUID } from "crypto";

export class StringUtils {
  static generateUuid(): string {
    return randomUUID();
  }
}

export class ValidationUtils {
  static validateRequiredProductFields(data): Array<string> {
    const { title, description, price, count } = data;

    return (<any>Object)
      .entries({
        title,
        description,
        price,
        count,
      })
      .reduce((acc, [key, value]) => [...acc, ...(!value ? [key] : [])], []);
  }
}

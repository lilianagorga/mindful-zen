import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return embeddedPrefixes.join('') + (customName || propertyName);
  }

  relationName(propertyName: string): string {
    return propertyName;
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return `${relationName}${this.capitalizeFirstLetter(referencedColumnName)}`;
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    void firstPropertyName;
    void secondPropertyName;
    return `${firstTableName}${this.capitalizeFirstLetter(secondTableName)}`;
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return `${tableName}${this.capitalizeFirstLetter(columnName || propertyName)}`;
  }

  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentName: string,
  ): string {
    return `${parentTableName}${this.capitalizeFirstLetter(parentName)}`;
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

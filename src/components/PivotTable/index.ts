export { Table } from "./components/Table/Table";
export { TableManager as default } from "./components/Manager/Manager";

export type AggregationTypes = "sum" | "min" | "max";
export interface PivotConfig {
  /**
   * List of row Dimensions.
   */
  rows: string[];
  /**
   * List of column Dimensions.
   */
  columns: string[];
  /**
   * Aggregation type.
   *
   * How to summarize the data.
   *
   * Supported values sum, min, max
   */
  aggregationType: AggregationTypes;
  /**
   * Metric to aggregate.
   * For now, we only support a single metric of number type.
   */
  valueProperty: string;
}

export interface DataEntry {
  [key: string]: number | string;
}

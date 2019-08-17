import { Aggregator, AggregationTypes } from "../Aggregator";

interface PivotConfig {
  rows: string[];
  columns: string[];
  aggregationType: AggregationTypes;
  value: string;
}

interface DataRow {
  [key: string]: number | string;
}

export class Pivot {
  public constructor(data: DataRow[], config: PivotConfig) {
    const dimensions = [...config.columns, ...config.rows];
    const aggregation = new Aggregator({
      data,
      dimensions,
      value: config.value,
      aggregationType: "sum"
    });

    const aggregated = aggregation.groups();

    const columns = new Map<string, string[]>();
    const rows = new Map<string, string[]>();
    const values = new Map();

    aggregated.forEach(aggregationRow => {
      const { dimensions, value } = aggregationRow;
      const columnValues = config.columns.map(key => String(dimensions[key]));
      const rowValues = config.rows.map(key => String(dimensions[key]));

      columns.set(this.keyForValues(columnValues), columnValues);
      rows.set(this.keyForValues(rowValues), rowValues);
      values.set(this.rowColumnKey(rowValues, columnValues), value);
    });

    this.columns = Array.from(columns.values());
    this.rows = Array.from(rows.values());
    this.values = values;
  }

  public columns: string[][];
  public rows: string[][];
  public values: Map<string, number>;

  public getValue(
    rowValues: string[],
    columnValues: string[]
  ): number | undefined {
    const valueKey = this.rowColumnKey(rowValues, columnValues);
    return this.values.get(valueKey);
  }

  private keyForValues = (values: string[]) => `${values.join("__")}`;
  private rowColumnKey = (rowValues: string[], columnValues: string[]) =>
    `R:${this.keyForValues(rowValues)}|C:${this.keyForValues(columnValues)}`;
}

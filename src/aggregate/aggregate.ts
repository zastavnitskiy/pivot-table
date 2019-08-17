import { aggregationFunctions } from "./aggregationFunctions";
import { Aggregator } from "./Aggregator";

export interface AggregationEntry {
  [key: string]: number | string;
}

interface AggregationConfig {
  dimensions: string[];
  aggregationType: "sum";
  value: string;
}

type AggregationRow = {
  dimensions: DimensionValues;
  value: number;
};

export interface AggregationFn {
  (entries: number[]): number;
}

export interface DimensionValues {
  [key: string]: number | string;
}

export function aggregate(
  data: AggregationEntry[],
  config: AggregationConfig
): AggregationRow[] {
  // push into array for total calculations
  const aggregator = new Aggregator(
    config.dimensions,
    config.value,
    aggregationFunctions[config.aggregationType]
  );

  for (let entry of data) {
    aggregator.addEntry(entry);
  }

  return aggregator.groups();
}

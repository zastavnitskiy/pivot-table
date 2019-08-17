const sum = (numbers: number[]): number =>
  numbers.reduce((sum, number) => sum + number);

export type AggregationTypes = "sum" | "min" | "max";

export const aggregationFunctions = {
  sum,
  max: (values: number[]): number => Math.max(...values),
  min: (values: number[]): number => Math.min(...values)
};

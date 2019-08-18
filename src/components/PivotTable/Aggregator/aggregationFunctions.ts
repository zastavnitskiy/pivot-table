const sum = (numbers: number[]): number =>
  Math.round(numbers.reduce((sum, number) => sum + number));

export const aggregationFunctions = {
  sum,
  max: (values: number[]): number => Math.max(...values),
  min: (values: number[]): number => Math.min(...values)
};

import { Aggregator } from ".";

import data from "../mockedData/small-subset.json";
import fullData from "../mockedData/sales-orders.json";

describe("AggregationClass", () => {
  it("should aggregate", () => {
    const aggregation = new Aggregator({
      data: data,
      dimensions: ["category", "subCategory"],
      value: "sales",
      aggregationType: "sum"
    });
    expect(aggregation.groups()).toHaveLength(9);
  });

  it("should aggregate big data", () => {
    const aggregation = new Aggregator({
      data: fullData,
      dimensions: ["state"],
      value: "sales",
      aggregationType: "sum"
    });
    expect(aggregation.groups()).toHaveLength(48);
  });

  xit("should throw if dimension is not found in data", () => {
    expect(() => {
      new Aggregator({
        data: data,
        dimensions: ["state01"],
        value: "sales",
        aggregationType: "sum"
      });
    }).toThrow();
  });
});

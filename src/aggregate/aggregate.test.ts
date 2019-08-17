import { aggregate } from "./aggregate";

import data from "../mockedData/small-subset.json";
import fullData from "../mockedData/sales-orders.json";

describe("aggregation function", () => {
  it("should aggregate", () => {
    const aggregated = aggregate(data, {
      dimensions: ["category", "subCategory", "state"],
      value: "sales",
      aggregationType: "sum"
    });

    expect(aggregated.lengh).toEqual(6);
  });

  it("should aggregate big data set", () => {
    const aggregated = aggregate(fullData, {
      dimensions: ["category", "subCategory", "state"],
      value: "sales",
      aggregationType: "sum"
    });

    expect(aggregated.lengh).toEqual(6);
  });
});

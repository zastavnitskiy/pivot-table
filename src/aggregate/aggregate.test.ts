import { Aggregator } from "./";

import data from "../mockedData/small-subset.json";
import fullData from "../mockedData/sales-orders.json";

describe("AggregationClass", () => {
  it("should aggregate", () => {});

  it("should have pivot table representation", () => {
    const pivot = Aggregator.pivot(data, {
      columns: ["state"],
      rows: ["category", "subCategory"],
      aggregationType: "sum",
      value: "sales"
    });
    console.log("pivot", JSON.stringify(pivot, null, 2));
    // [{
    //   columns: ['Category', 'Subcategory'],
    //   rows: ['State']
    // }]
  });
});

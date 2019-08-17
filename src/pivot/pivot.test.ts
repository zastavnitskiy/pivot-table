import { pivot, aggregate } from "./pivot";

import data from "../mockedData/small-subset.json";
import fullData from "../mockedData/sales-orders.json";

xdescribe("pivot function: core data aggregation logic", () => {
  it("should aggregate simple data", () => {
    const aggregated = pivot(data, {
      columns: "state",
      index: ["category", "subCategory"],
      values: "sales"
    });
    const grandTotalRow = aggregated[aggregated.length - 1];

    /**
     * This is how pivoted data looks looks for simple data set
     * *               / *         / California  / Kentucky / All
     * Office Supplies / Labels    / 14.62       / 0        / 14.62
     * Office Total    /           / 14.62       / 0        / 14.62
     * Furniture       / Bookcases / 0           / 261.96   / 261.96
     * Furniture       / Chairs    / 0           / 731.94   / 731.94
     * Furniture Total /           / 0           / 993.9    / 993.9
     * Grand Total     /           / 14.62       / 993.9    / 1008.52
     */

    expect(aggregated.length).toEqual(6);
    expect(grandTotalRow.columns[0].name).toEqual("California");
    expect(grandTotalRow.columns[0].value).toEqual(14.62);
    expect(grandTotalRow.columns[1].value).toEqual(993.9);
    expect(grandTotalRow.columns[2].value).toEqual(1008.52);
  });

  it("should aggregate full dataset", () => {
    const aggregated = pivot(fullData, {
      columns: "state",
      index: ["category", "subCategory"],
      values: "sales"
    });
    const grandTotalRow = aggregated[aggregated.length - 1];
    expect(aggregated.length).toEqual(21);
    expect(grandTotalRow.columns[0].name).toEqual("Alabama");
    expect(grandTotalRow.columns[0].value).toEqual(13899);
  });
});

describe("aggregation function", () => {
  it("should aggregate", () => {
    const aggregated = aggregate(data, {
      dimensions: ["category", "subCategory", "state"],
      value: "sales",
      aggregationType: "sum"
    });

    /**
     * 
     * 
    [
      {
        dimensions: {
          category: "Office Supplies",
          subCategory: "__total__",
          state: "California"
        },
        value: 14.62
      },
      {
        dimensions: {
          category: "Office Supplies",
          subCategory: "Labels",
          state: "California"
        },
        value: 14.62
      },
      ...,
      {
          dimensions: {
              category: "__total__",
              subCategory: "__total__",
              state: "__total__"
          },
          value: 1008.52
      }
    ];
    */

    expect(aggregated.lengh).toEqual(6);
  });
});

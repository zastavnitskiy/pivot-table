import { Pivot } from "./Pivot";
import data from "../../mockedData/small-subset.json";

describe("Pivot class", () => {
  it("should take data and return pivot instance", () => {
    const pivotData = new Pivot(data, {
      columns: ["state"],
      rows: ["category", "subCategory"],
      aggregationType: "sum",
      valueProperty: "sales"
    });

    expect(pivotData.rows).toHaveLength(9);
    expect(pivotData.columns).toHaveLength(3);

    expect(pivotData.getValue(pivotData.rows[0], pivotData.columns[1])).toEqual(
      262
    );

    expect(pivotData.getValue(["*", "*"], ["*"])).toEqual(1009);
  });

  it("should take match snapshots", () => {
    const pivotData = new Pivot(data, {
      columns: ["state"],
      rows: ["category", "subCategory"],
      aggregationType: "sum",
      valueProperty: "sales"
    });

    expect(pivotData.rows).toMatchInlineSnapshot(`
      Array [
        Array [
          "Furniture",
          "Bookcases",
        ],
        Array [
          "Furniture",
          "Chairs",
        ],
        Array [
          "Furniture",
          "*",
        ],
        Array [
          "Office Supplies",
          "Labels",
        ],
        Array [
          "Office Supplies",
          "*",
        ],
        Array [
          "*",
          "Bookcases",
        ],
        Array [
          "*",
          "Chairs",
        ],
        Array [
          "*",
          "Labels",
        ],
        Array [
          "*",
          "*",
        ],
      ]
    `);
    expect(pivotData.columns).toMatchInlineSnapshot(`
      Array [
        Array [
          "California",
        ],
        Array [
          "Kentucky",
        ],
        Array [
          "*",
        ],
      ]
    `);
  });
});

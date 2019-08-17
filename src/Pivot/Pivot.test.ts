import { Pivot } from "./Pivot";
import data from "../mockedData/small-subset.json";

describe("Pivot class", () => {
  it("should take data and return pivot instance", () => {
    const pivotData = new Pivot(data, {
      columns: ["state"],
      rows: ["category", "subCategory"],
      aggregationType: "sum",
      value: "sales"
    });

    expect(pivotData.rows).toHaveLength(3);
    expect(pivotData.columns).toHaveLength(2);

    expect(pivotData.getValue(pivotData.rows[0], pivotData.columns[0])).toEqual(
      261.96
    );

    expect(
      pivotData.getValue(pivotData.rows[0], pivotData.columns[1])
    ).toBeUndefined();
  });
});

import { dimensionGroupsForEntry, dimensionKeyPermutations } from "./utilities";

import data from "../../mockedData/small-subset.json";
import fullData from "../../mockedData/sales-orders.json";

describe("utilities", () => {
  describe("dimensionKeyPermutations", () => {
    it("should generate permutations", () => {
      const permutations = dimensionKeyPermutations(["a", "b"]);
      expect(permutations).toMatchInlineSnapshot(`
        Array [
          Array [],
          Array [
            "a",
          ],
          Array [
            "b",
          ],
          Array [
            "a",
            "b",
          ],
        ]
      `);
    });
  });

  describe("dimensionGroupsForEntry", () => {
    it("should generate all combinations", () => {
      const combinations = dimensionGroupsForEntry(
        ["state", "category", "subCategory"],
        data[0]
      );

      expect(combinations).toMatchInlineSnapshot(`
        Array [
          Object {
            "category": "Furniture",
            "state": "Kentucky",
            "subCategory": "Bookcases",
          },
          Object {
            "category": "Furniture",
            "state": "*",
            "subCategory": "Bookcases",
          },
          Object {
            "category": "*",
            "state": "Kentucky",
            "subCategory": "Bookcases",
          },
          Object {
            "category": "Furniture",
            "state": "Kentucky",
            "subCategory": "*",
          },
          Object {
            "category": "*",
            "state": "*",
            "subCategory": "Bookcases",
          },
          Object {
            "category": "*",
            "state": "Kentucky",
            "subCategory": "*",
          },
          Object {
            "category": "Furniture",
            "state": "*",
            "subCategory": "*",
          },
          Object {
            "category": "*",
            "state": "*",
            "subCategory": "*",
          },
        ]
      `);
      expect(combinations).toHaveLength(8);
    });
  });
});

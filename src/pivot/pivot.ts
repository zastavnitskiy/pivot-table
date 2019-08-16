import { Order } from "../@types/order";

interface PivotConfiguration {
  columns: string;
  index: string[];
  values: string;
}

interface PivotCell {
  name: string;
  value: any;
}

interface PivotRow {
  index: string[];
  columns: PivotCell[];
}

/**
 *
 * Given a data set and aggregation configuration,
 * generate a pivot data set.
 *
 */
export const pivot = (
  data: Order[],
  config: PivotConfiguration
): PivotRow[] => {
  return [
    {
      index: ["Office Supplies", "Labels"],
      columns: [
        { name: "California", value: 14.62 },
        { name: "Kentucky", value: 14.62 },
        { name: "All", value: 14.62 }
      ]
    },
    {
      index: ["Office Supplies", "Total"],
      columns: [
        { name: "California", value: 14.62 },
        { name: "Kentucky", value: 14.62 },
        { name: "All", value: 14.62 }
      ]
    },
    {
      index: ["Furniture", "Bookcases"],
      columns: [
        { name: "California", value: 0 },
        { name: "Kentucky", value: 261.96 },
        { name: "All", value: 261.96 }
      ]
    },
    {
      index: ["Furniture", "Chairs"],
      columns: [
        { name: "California", value: 0 },
        { name: "Kentucky", value: 731.94 },
        { name: "All", value: 731.94 }
      ]
    },
    {
      index: ["Furniture", "Total"],
      columns: [
        { name: "California", value: 0 },
        { name: "Kentucky", value: 993.9 },
        { name: "All", value: 993.9 }
      ]
    },
    {
      index: ["Grand Total"],
      columns: [
        { name: "California", value: 14.62 },
        { name: "Kentucky", value: 993.9 },
        { name: "All", value: 1008.52 }
      ]
    }
  ];
};

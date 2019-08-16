import { Order, Metric } from "../@types/order";

/**
 * Seems like pivoting functionality can be even more generic — instead of specifying rows and columns,
 * we can simple specify a list of dimensions.
 *
 * Rows and columns can be introduced later in the rendering step.
 *
 * Will continue with this implementation for now, maybe will refactor later.
 */
interface PivotConfiguration {
  columns: string;
  index: string[];
  values: Metric;
}

interface PivotCell {
  name: string;
  value: any;
}

interface PivotRow {
  index: string[];
  columns: PivotCell[];
}

const aggregate = (orders: Order[], valueProperty: Metric): number => {
  return orders.reduce((sum, order) => sum + order[valueProperty], 0);
};

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
  const dimensions = [...config.index, config.columns];

  const grouped = new Map<string, Order[]>();

  data.forEach(order => {
    const key =
      order[dimensions[0]] +
      "__" +
      order[dimensions[1]] +
      "__" +
      order[dimensions[2]];

    const groupOrders = grouped.get(key) || [];
    groupOrders.push(order);
    grouped.set(key, groupOrders);
  });

  console.log(grouped);

  const aggregated = Array.from(grouped.entries()).map(([key, groupOrders]) => {
    return {
      key,
      [dimensions[0]]: groupOrders[0][dimensions[0]],
      [dimensions[1]]: groupOrders[0][dimensions[1]],
      [dimensions[2]]: groupOrders[0][dimensions[2]],
      orders: groupOrders.length,
      value: aggregate(groupOrders, config.values)
    };
  });

  // wip

  // For each of the dimensions, generate cell value + total
  // filter our empty values
  // build pivot table based on that data
  // this is not pivoting, but aggregation step

  console.log(aggregated);

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

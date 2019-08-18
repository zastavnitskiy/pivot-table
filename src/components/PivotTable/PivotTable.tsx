import React from "react";
import { Pivot } from "../../Pivot";
import styles from "./PivotTable.module.css";
import { convertToTree, Node, sortWithTotals, classnames } from "./utilities";
interface DataRow {
  [key: string]: string | number;
}

interface PivotTableProps {
  data: DataRow[];
}
interface CellData {
  colSpan?: number;
  rowSpan?: number;
  value?: React.ReactNode;
  className?: string;
}

interface RowData {
  cells: CellData[];
}

interface TableRowProps {
  row: any;
}
const TableGroup: React.FC<TableRowProps> = props => {
  const { row } = props;
  const category = row.name;
  const rowChildren = Object.keys(row.children).sort(sortWithTotals);

  return (
    <tbody>
      {rowChildren.map((subCategory, index) => {
        const cells = [];
        let rowClassname = styles.regularRow;

        /**
         * We also aggregate subcategories, e.g. categry=*, subcategory="soemthing"
         *
         * While in this data set this is not needed, I'll keep it on
         * the data level and only hide in presentation.
         */

        if (category === "*" && subCategory !== "*") {
          return null;
        } else if (category === "*" && subCategory === "*") {
          /**
           * Grand Total Label
           */
          cells.push(
            <th key="Grand Total Header" colSpan={2}>
              Grand Total
            </th>
          );
          rowClassname = styles.grandTotalRow;
        } else if (category !== "*" && subCategory === "*") {
          /**
           * Total labels for categories
           */
          cells.push(
            <th key={`${category} total header`} colSpan={2}>
              {category} total
            </th>
          );
          rowClassname = styles.totalRow;
        } else if (index === 0) {
          /**
           * Group top level categories for multiple subcategory rows.
           */
          cells.push(
            <th
              key={category + "header"}
              rowSpan={rowChildren.length - 1}
              className={styles.headerColumn__primary}
            >
              {category}
            </th>,
            <th key={subCategory + "header"}>{subCategory}</th>
          );
        } else {
          cells.push(<th key={subCategory + "header"}>{subCategory}</th>);
        }

        /**
         * Finally display column values
         */
        for (let state of Object.keys(row.children[subCategory].children).sort(
          sortWithTotals
        )) {
          cells.push(
            <td
              key={category + subCategory + state + "value"}
              className={state === "*" ? styles.totalColumn : ""}
            >
              {row.children[subCategory].children[state].value || 0}
            </td>
          );
        }

        return (
          <tr key={subCategory + index} className={rowClassname}>
            {cells}
          </tr>
        );
      })}
    </tbody>
  );
};

export const PivotTable: React.FC<PivotTableProps> = props => {
  const pivotData = new Pivot(props.data, {
    columns: ["state"],
    rows: ["category", "subCategory"],
    aggregationType: "sum",
    value: "sales"
  });

  const rowsRoot = convertToTree(pivotData.rows);
  const columnsRoot = convertToTree(pivotData.columns);
  const columns = Object.keys(columnsRoot.children).sort(sortWithTotals);
  const categories = Object.keys(rowsRoot.children).sort(sortWithTotals);

  const rowGroups: Node[] = [];
  for (let category of categories) {
    const categoryObj: Node = {
      name: category,
      children: {}
    };

    const subCategories = Object.keys(
      rowsRoot.children[category].children
    ).sort(sortWithTotals);

    for (let subCategory of subCategories) {
      const subCategoryObj: Node = {
        name: subCategory,
        children: {}
      };
      for (let state of columns) {
        const stateObj: Node = {
          name: state,
          children: {},
          value: pivotData.getValue([category, subCategory], [state])
        };

        subCategoryObj.children[state] = stateObj;
      }

      categoryObj.children[subCategory] = subCategoryObj;
    }
    rowGroups.push(categoryObj);
  }

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.topHeaderRow}>
            <th colSpan={2}>Products</th>
            <th colSpan={columns.length - 1}>States</th>
            <th></th>
          </tr>
          <tr
            className={classnames(
              styles.topHeaderRow,
              styles.topHeaderRow__secondary
            )}
          >
            <th>Category</th>
            <th>Sub-Category</th>
            {columns.map(columnHeader => (
              <th
                key={`column-header-${columnHeader}`}
                className={styles.topHeaderCell__value}
              >
                {columnHeader === "*" ? "Grand Total" : columnHeader}
              </th>
            ))}
          </tr>
        </thead>
        {rowGroups.map(rowGroup => (
          <TableGroup key={`row-group-${rowGroup.name}`} row={rowGroup} />
        ))}
      </table>
    </div>
  );
};

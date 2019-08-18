import React from "react";
import { Pivot } from "../../Pivot";
import styles from "./PivotTable.module.css";
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

const sortPivotValueArrays = (valueArray: string[][]): string[][] => {
  return valueArray.sort((valueArray1: string[], valueArray2: string[]) => {
    return valueArray1.join("_").localeCompare(valueArray2.join("_"));
  });
};

export const PivotTable: React.FC<PivotTableProps> = props => {
  const pivotData = new Pivot(props.data, {
    columns: ["state"],
    rows: ["category", "subCategory"],
    aggregationType: "sum",
    value: "sales"
  });

  //group data into category groups

  const columns = sortPivotValueArrays(pivotData.columns);
  const rows = sortPivotValueArrays(pivotData.rows);

  const tableData: RowData[] = [
    {
      cells: [
        { colSpan: rows[0].length },
        { colSpan: columns.length, value: "States" }
      ]
    },
    {
      cells: [
        { colSpan: rows[0].length },
        ...columns.map(value => ({
          value: value[0] === "*" ? "Grand Total" : value
        }))
      ]
    }
  ];

  for (let rowValues of rows) {
    const rowHeaderCells = [];

    if (rowValues.filter(value => value !== "*").length) {
      rowHeaderCells.push(
        ...rowValues.map(value => ({
          value: value === "*" ? "Total" : value,
          className: value === "*" ? styles.heading : ""
        }))
      );
    } else {
      rowHeaderCells.push({
        value: "Grand Total",
        className: styles.heading,
        colSpan: rowValues.length
      });
    }

    const row: RowData = {
      cells: [...rowHeaderCells]
    };

    for (let columnValues of columns) {
      row.cells.push({
        value: pivotData.getValue(rowValues, columnValues) || 0,
        className: [...rowValues, ...columnValues].find(value => value === "*")
          ? styles.heading
          : ""
      });
    }
    tableData.push(row);
  }
  console.timeEnd("Pivot Render");

  return (
    <div>
      Table comes here
      {/* <table className={styles.table}>
        <col />
        <col />
        <colgroup span={3} />
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col" />
            <th colSpan={3}>States</th>
          </tr>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Sub-Category</th>
            <th>Alabama</th>
            <th>California</th>
            <th>New York</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowSpan={3} scope="rowgroup">
              Furniture
            </th>
            <th scope="row">Bookcases</th>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr>
            <th scope="row">Chairs</th>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr>
            <th scope="row">Furnishings</th>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr className={styles.total}>
            <th scope="row" colSpan={2}>
              Total Furniture
            </th>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
        </tbody>
      </table> */}
      <table>
        <tbody>
          {tableData.map(rowData => (
            <tr>
              {rowData.cells.map(
                (cellData): React.ReactElement => (
                  <td
                    colSpan={cellData.colSpan}
                    rowSpan={cellData.rowSpan}
                    className={cellData.className}
                  >
                    {cellData.value}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

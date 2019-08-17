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
  return valueArray.sort((valueArray1: string[], valueArray2: string[]) =>
    valueArray1.join("_").localeCompare(valueArray2.join("_"))
  );
};

export const PivotTable: React.FC<PivotTableProps> = props => {
  const pivotData = new Pivot(props.data, {
    columns: ["state"],
    rows: ["category", "subCategory"],
    aggregationType: "sum",
    value: "sales"
  });

  const columns = sortPivotValueArrays(pivotData.columns);
  const rows = sortPivotValueArrays(pivotData.rows).filter(
    values => values[0] !== "*" || (values[0] === "*" && values[1] === "*")
  );

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

  return (
    <div>
      Table comes here
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

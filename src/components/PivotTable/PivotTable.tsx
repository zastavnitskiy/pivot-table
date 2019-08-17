import React from "react";
import { Pivot } from "../../Pivot";
interface DataRow {
  [key: string]: string | number;
}

interface PivotTableProps {
  data: DataRow[];
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
  const rows = sortPivotValueArrays(pivotData.rows);

  const tableData = [
    [<td />, <td />, <td colSpan={columns.length}>States</td>],
    [<td />, <td />, ...columns.map(value => <td>{value}</td>)]
  ];

  for (let rowValues of rows) {
    const row: any[] = [rowValues.map(value => <td>{value}</td>)];
    for (let columnValues of columns) {
      row.push(<td>{pivotData.getValue(rowValues, columnValues) || 0}</td>);
    }
    tableData.push(row);
  }

  return (
    <div>
      Table comes here
      <table>
        {tableData.map(row => (
          <tr>{row}</tr>
        ))}
      </table>
    </div>
  );
};

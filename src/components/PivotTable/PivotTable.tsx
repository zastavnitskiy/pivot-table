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

  //   [
  //     [{
  //       type: "regular" //header, total, grandTotal,
  //       value: '100',
  //       colSpan: undefined,
  //       rowSpan: undefined
  //     }]
  //   ];

  interface CellData {
    colSpan?: number;
    rowSpan?: number;
    value?: React.ReactNode;
  }

  interface RowData {
    cells: CellData[];
  }

  const tableData: RowData[] = [
    {
      cells: [
        { colSpan: rows[0].length },
        { colSpan: columns.length, value: "States" }
      ]
    },
    {
      cells: [{ colSpan: rows[0].length }, ...columns.map(value => ({ value }))]
    }
  ];

  for (let rowValues of rows) {
    const row: RowData = {
      cells: [...rowValues.map(value => ({ value }))]
    };

    for (let columnValues of columns) {
      row.cells.push({
        value: pivotData.getValue(rowValues, columnValues) || 0
      });
    }
    tableData.push(row);
  }

  return (
    <div>
      Table comes here
      <table>
        {tableData.map(rowData => (
          <tr>
            {rowData.cells.map(
              (cellData): React.ReactElement => (
                <td colSpan={cellData.colSpan} rowSpan={cellData.rowSpan}>
                  {cellData.value}
                </td>
              )
            )}
          </tr>
        ))}
      </table>
    </div>
  );
};

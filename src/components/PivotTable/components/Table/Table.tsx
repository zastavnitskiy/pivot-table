import React from "react";
import { Pivot } from "../../Pivot";
import styles from "./Table.module.css";
import { classnames, formatNumber } from "../../utilities";
import { DataRow } from "../../types";
import { ManagerProps } from "../Manager/Manager";

export interface TableProps
  extends Pick<
    ManagerProps,
    | "aggregationType"
    | "valueProperty"
    | "rows"
    | "columns"
    | "rowsLabel"
    | "columnsLabel"
    | "labelOverrides"
  > {
  data: DataRow[];
}
export const Table: React.FC<TableProps> = props => {
  const label = (original: string): React.ReactNode =>
    (props.labelOverrides && props.labelOverrides[original]) || original;

  const pivotData = new Pivot(props.data, {
    columns: props.columns,
    rows: props.rows,
    aggregationType: props.aggregationType,
    value: props.valueProperty //todo rename value property in Pivot and Aggregator
  });

  const rows = pivotData.rows;
  const columns = pivotData.columns;

  const tableMarkup: React.ReactElement[] = [];
  const theadMarkup: React.ReactElement[] = [];

  theadMarkup.push(
    <tr
      className={classnames(styles.topHeaderRow, styles.topHeaderRow__primary)}
    >
      <th colSpan={props.rows.length} className={classnames(styles.stickyCell)}>
        {props.rowsLabel}
      </th>
      <th colSpan={columns.length}>{props.columnsLabel}</th>
    </tr>
  );

  for (let i = 0; i < props.columns.length; i++) {
    const rowData = [];
    if (i === props.columns.length - 1) {
      for (let k = 0; k < props.rows.length; k++) {
        rowData.push(
          <th className={classnames(styles.stickyCell)}>
            {label(props.rows[k])}
          </th>
        );
      }
    } else {
      for (let k = 0; k < props.rows.length; k++) {
        rowData.push(<th></th>);
      }
    }

    for (let column of columns) {
      rowData.push(
        <th className={styles.topHeaderCell__value}>
          {column[i] === "*" ? "Total" : column[i]}
        </th>
      );
    }

    theadMarkup.push(
      <tr
        className={classnames(
          styles.topHeaderRow,
          i > 0 && styles.topHeaderRow__secondary
        )}
      >
        {rowData}
      </tr>
    );
  }

  tableMarkup.push(<thead>{theadMarkup}</thead>);

  let tbodyRowGroupMarkup: React.ReactElement[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const previousRow = rows[i - 1];
    const nextRow = rows[i + 1];
    const rowData = [];

    /** For each row we need to calculate several features
     * to properly style it and select text
     */
    let isGrandTotalRow = true;
    let isTotalRow = false;
    let isSubCategoryAggregation =
      row.lastIndexOf("*") >= 0 && row.lastIndexOf("*") !== row.length - 1;

    let isFirstOfTopLevelCategory = !previousRow || previousRow[0] !== row[0];
    let isLastOfTopLevelCategory = !nextRow || nextRow[0] !== row[0];

    if (isSubCategoryAggregation) {
      continue;
    }

    for (let rowValue of row) {
      if (rowValue === "*") {
        isTotalRow = true;
      } else {
        isGrandTotalRow = false;
      }
    }

    if (isGrandTotalRow) {
      rowData.push(
        <th className={classnames(styles.stickyCell)} colSpan={row.length}>
          Grand total
        </th>
      );
    } else if (isTotalRow) {
      rowData.push(
        <th colSpan={row.length} className={classnames(styles.stickyCell)}>
          {row.filter(rowValue => rowValue !== "*").join("-") + "   total"}
        </th>
      );
    } else {
      row.forEach((rowValue, index) => {
        rowData.push(
          <td
            className={classnames(
              styles.headerColumn,
              index === 0
                ? styles.headerColumn__primary
                : styles.headerColumn__secondary,
              styles.stickyCell
            )}
          >
            {isFirstOfTopLevelCategory || index > 0 ? rowValue : ""}
          </td>
        );
      });
    }

    for (let column of columns) {
      const value = pivotData.getValue(row, column) || 0;
      rowData.push(<td>{formatNumber(value)}</td>);
    }

    tbodyRowGroupMarkup.push(
      <tr
        className={classnames(
          isGrandTotalRow && styles.grandTotalRow,
          isTotalRow ? styles.totalRow : styles.row
        )}
      >
        {rowData}
      </tr>
    );

    if (isLastOfTopLevelCategory) {
      tableMarkup.push(<tbody>{tbodyRowGroupMarkup}</tbody>);
      tbodyRowGroupMarkup = [];
    }
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>{tableMarkup}</table>
    </div>
  );
};

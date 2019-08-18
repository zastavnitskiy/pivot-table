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

/**
 *
 * Table Component — it's responsible for rendering the table headers and values,
 * grouping headers, etc.
 *
 * It needs some refactoring, if I will have time I will do that.
 *
 * For now, the code is a bit complex and has comments.
 *
 */
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

  /**
   * First, prepare blue header.
   */
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
    const rowData: React.ReactElement[] = [];
    /**
     * First columns will display row dimension titles(or)
     */
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

    /**
     * Other columns with display column dimension values.
     */
    for (let column of columns) {
      rowData.push(
        <th className={styles.topHeaderCell__value}>
          {column[i] === "*" ? "Total" : column[i]}
        </th>
      );
    }

    /**
     * Finally, push rows into thead block with some classes on top.
     */
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

  /**
   * And push that into the table markup.
   */
  tableMarkup.push(<thead>{theadMarkup}</thead>);

  /**
   * Next step, populate table data.
   *
   * We will use a tbody group for each
   * of the top-level row dimensions.
   *
   *
   */
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

    /**
     * Again, first we populate row headers.
     *
     */
    if (isGrandTotalRow) {
      /** Grand Total row takes full width of the row header block(colspand=rowDimensions.length) */
      rowData.push(
        <th className={classnames(styles.stickyCell)} colSpan={row.length}>
          Grand total
        </th>
      );
    } else if (isTotalRow) {
      /** Dimension Total row takes full width of the row header block(colspand=rowDimensions.length) */
      rowData.push(
        <th colSpan={row.length} className={classnames(styles.stickyCell)}>
          {row.filter(rowValue => rowValue !== "*").join("-") + "   total"}
        </th>
      );
    } else {
      /** For regular rows, header will display dimension values.
       *
       * Hover, we only display primary dimension value for the
       * first row in given dimension group.
       */
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

    /**
     * And now populate values for the categories.
     */
    for (let column of columns) {
      const value = pivotData.getValue(row, column) || 0;
      rowData.push(<td>{formatNumber(value)}</td>);
    }

    /**
     * Last code block is responsible for closing tbody groups and creating new ones, every time we
     * the primary row dimension is changed.
     */
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

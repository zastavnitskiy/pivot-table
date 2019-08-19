import React from "react";
import { Pivot } from "../../Pivot";
import styles from "./Table.module.css";
import { classnames, formatNumber } from "../../utilities";
import { PivotConfig, DataEntry } from "../../index";
export interface TableProps extends PivotConfig {
  data: DataEntry[];
  /**
   * Header of row dimension columns, e.g. Products
   */
  rowsLabel?: React.ReactNode;
  /**
   * Header of metric columns, e.g. States
   */
  columnsLabel?: React.ReactNode;
  /**
   * Overrides for data entry property names:
   * subCategories → Sub-Categories
   */
  labelOverrides?: {
    [key: string]: React.ReactNode;
  };
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

  const columnDimensionKeys = props.columns;
  const rowDimensionKeys = props.rows;

  const pivotData = new Pivot(props.data, {
    columns: columnDimensionKeys,
    rows: rowDimensionKeys,
    aggregationType: props.aggregationType,
    valueProperty: props.valueProperty //todo rename value property in Pivot and Aggregator
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
      key="table_thead_row_primary"
      className={classnames(styles.topHeaderRow, styles.topHeaderRow__primary)}
    >
      <th
        colSpan={rowDimensionKeys.length}
        className={classnames(styles.stickyCell)}
      >
        {props.rowsLabel || null}
      </th>
      <th colSpan={columns.length}>{props.columnsLabel || null}</th>
    </tr>
  );

  /**
   * In the header, there are columnDimensionKeys.length rows.
   *
   * Each row in a correspoding column will display columnDomensionValue.
   *
   * However, top/left quadrant is special: it will display rowDimensionKeys
   */
  columnDimensionKeys.forEach((columnDimensionKey, columnDimensionIndex) => {
    const rowData: React.ReactElement[] = [];
    /**
     * First columns will display rowDimensionKeys
     */
    rowDimensionKeys.forEach(rowDimensionKey => {
      const value =
        columnDimensionIndex === columnDimensionKeys.length - 1
          ? label(rowDimensionKey)
          : "";

      rowData.push(
        <th
          key={"thead_row_row_dimension_key_" + rowDimensionKey}
          className={classnames(styles.stickyCell)}
        >
          {value}
        </th>
      );
    });

    /**
     * columnDimensionKeys
     */
    columns.forEach(column => {
      const columnDimensionValue = column[columnDimensionIndex];
      rowData.push(
        <th
          className={styles.topHeaderCell__value}
          key={"thead_row_cell_" + columnDimensionValue}
        >
          {columnDimensionValue === "*"
            ? "Total"
            : column[columnDimensionIndex]}
        </th>
      );
    });

    /**
     * Finally, push rows into thead block with some classes on top.
     */
    theadMarkup.push(
      <tr
        className={classnames(
          styles.topHeaderRow,
          columnDimensionIndex > 0 && styles.topHeaderRow__secondary
        )}
        key={"thead_row_" + columnDimensionKey}
      >
        {rowData}
      </tr>
    );
  });

  /**
   * And push that into the table markup.
   */
  tableMarkup.push(<thead key="thead">{theadMarkup}</thead>);

  /**
   * Next step, populate table data.
   *
   * We will use a tbody group for each
   * of the top-level row dimensions.
   *
   *
   */
  let tbodyRowGroupMarkup: React.ReactElement[] = [];

  rows.forEach((row, rowIndex) => {
    const previousRow = rows[rowIndex - 1];
    const nextRow = rows[rowIndex + 1];
    const rowData = [];

    /** For each row we need to calculate several features
     * to properly style it and select text
     */
    const isGrandTotalRow = row.filter(v => v === "*").length === row.length;
    const isTotalRow = row.indexOf("*") >= 0;
    const isSubCategoryAggregation =
      row.lastIndexOf("*") >= 0 && row.lastIndexOf("*") !== row.length - 1;
    const topLevelCategory = row[0];
    const isFirstOfTopLevelCategory =
      !previousRow || previousRow[0] !== topLevelCategory;
    const isLastOfTopLevelCategory =
      !nextRow || nextRow[0] !== topLevelCategory;
    const rowKeyPrefix = "row-" + row.join("--");
    if (isSubCategoryAggregation) {
      return;
    }

    /**
     * First we populate row headers.
     *
     * There is some special logic here:
     *
     */
    if (isGrandTotalRow) {
      /** 1. Grand total row spans onto rowDimensionLeys.length columns  */
      rowData.push(
        <th
          key={"grand-total"}
          className={classnames(styles.stickyCell)}
          colSpan={row.length}
        >
          Grand total
        </th>
      );
    } else if (isTotalRow) {
      /** 2. Dimension total row spans onto rowDimensionLeys.length columns */

      /** Also value has basic support of > 2 dimensions, however, this should be improved. */
      const value =
        row.filter(rowValue => rowValue !== "*").join("-") + "   total";

      rowData.push(
        <th
          key={"total"}
          colSpan={row.length}
          className={classnames(styles.stickyCell)}
        >
          {value}
        </th>
      );
    } else {
      /** For regular rows, header will display dimension values.
       *
       * However, we only display primary dimension value for the
       * first row in given dimension group.
       */
      row.forEach((rowValue, rowValueIndex) => {
        rowData.push(
          <td
            key={rowValue}
            className={classnames(
              styles.headerColumn,
              rowValueIndex === 0
                ? styles.headerColumn__primary
                : styles.headerColumn__secondary,
              styles.stickyCell
            )}
          >
            {isFirstOfTopLevelCategory || rowValueIndex > 0 ? rowValue : ""}
          </td>
        );
      });
    }

    /**
     * And now populate values for the categories.
     */
    columns.forEach(column => {
      const value = pivotData.getValue(row, column) || 0;
      rowData.push(<td key={column.join("--")}>{formatNumber(value)}</td>);
    });

    /**
     * Last code block is responsible for closing tbody groups and creating new ones, every time we
     * the primary row dimension is changed.
     */
    tbodyRowGroupMarkup.push(
      <tr
        key={rowKeyPrefix}
        className={classnames(
          isGrandTotalRow && styles.grandTotalRow,
          isTotalRow ? styles.totalRow : styles.row
        )}
      >
        {rowData}
      </tr>
    );

    if (isLastOfTopLevelCategory) {
      tableMarkup.push(
        <tbody key={topLevelCategory}>{tbodyRowGroupMarkup}</tbody>
      );
      tbodyRowGroupMarkup = [];
    }
  });

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>{tableMarkup}</table>
    </div>
  );
};

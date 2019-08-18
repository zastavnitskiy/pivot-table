import React, { useState, useEffect } from "react";
import { DataRow } from "../../types";
import { Header } from "../Header/Header";
import { Table } from "../Table/Table";
import { AggregationTypes } from "../../Aggregator";

interface TextOverrides {
  [key: string]: React.ReactNode;
}
export interface ManagerProps {
  /**
   * Table Name
   */
  tableName: React.ReactNode;
  /**
   * Async function that returns the data. Can be a wrapper
   * around fetch, axios or any other backend client.
   */
  fetchData: FetchDataFn;
  /**
   * List of row Dimensions.
   */
  rows: string[];
  /**
   * List of column Dimensions.
   */
  columns: string[];
  /**
   * Aggregation type..
   *
   * For now, only 'sum' is supported.
   */
  aggregationType: AggregationTypes;
  /**
   * Metric to aggregate.
   * For now, we only support a single metric of number type.
   */
  valueProperty: string;

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
  labelOverrides?: TextOverrides;
}

interface FetchDataFn {
  (): Promise<DataRow[]>;
}

export const TableManager: React.FC<ManagerProps> = props => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<DataRow[] | null>(null);
  const { fetchData } = props;

  useEffect(() => {
    let isCurrent = true;
    const doAsyncWork = async () => {
      const data = await fetchData();
      if (isCurrent) {
        setData(data);
        setLoading(false);
      }
    };

    doAsyncWork();
    return () => {
      isCurrent = false;
    };
  }, [fetchData]);

  let content: React.ReactNode = null;

  if (isLoading) {
    content = "Loading...";
  } else if (data) {
    content = (
      <Table
        data={data}
        rows={props.rows}
        columns={props.columns}
        aggregationType={props.aggregationType}
        valueProperty={props.valueProperty}
        rowsLabel={props.rowsLabel}
        columnsLabel={props.columnsLabel}
        labelOverrides={props.labelOverrides}
      ></Table>
    );
  }

  return (
    <div>
      <Header tableName={props.tableName}></Header>
      {content}
    </div>
  );
};

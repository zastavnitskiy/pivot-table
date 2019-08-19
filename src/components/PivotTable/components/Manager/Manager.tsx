import React, { useState, useEffect } from "react";
import { DataEntry } from "../../index";
import { Header } from "../Header/Header";
import { Table, TableProps } from "../Table/Table";

interface FetchDataFn {
  (): Promise<DataEntry[]>;
}

export interface ManagerProps extends Omit<TableProps, "data"> {
  /**
   * Table Name
   */
  tableName: React.ReactNode;
  /**
   * Async function that returns the data. Can be a wrapper
   * around fetch, axios or any other backend client.
   */
  fetchData: FetchDataFn;
}

export const TableManager: React.FC<ManagerProps> = props => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<DataEntry[] | null>(null);
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

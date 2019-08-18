import React, { useState, useEffect } from "react";
import { DataRow } from "../../types";
import { Header } from "../Header/Header";
import { Table } from "../Table/Table";
import { AggregationTypes } from "../../../../Aggregator";

export interface ManagerProps {
  tableName: string;
  fetchData: FetchDataFn;
  rows: string[];
  columns: string[];
  aggregationType: AggregationTypes;
  valueProperty: string;
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

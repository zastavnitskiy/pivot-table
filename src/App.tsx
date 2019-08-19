import React from "react";
import PivotTable from "./PivotTable";
import data from "./mockedData/sales-orders.json";

const sleep = async (ms: number) =>
  new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });

/**
 * Naive way of mocking loading data from backend in async manner.
 */
const fetchData = async () => {
  await sleep(100);
  return data;
};

function App() {
  return (
    <div className="App">
      <PivotTable
        /** Table name */
        tableName="Sum Sales"
        /** Async function that returns data.
         * Can be a wrapper around fetch, axios or any
         * backend service
         */
        fetchData={fetchData}
        /**
         * Row dimensions
         */
        rows={["category", "subCategory"]}
        /**
         * Column dimensions
         */
        columns={["state"]}
        /**
         * Aggregation type.
         *
         * Supported values are sum, min, max.
         */
        aggregationType="sum"
        /**
         * Matric name that we will use for aggregation.
         */
        valueProperty={"sales"}
        /**
         * Header of the row dimension columns.
         */
        rowsLabel="Products"
        /**
         * Header of the column dimension columns.
         */
        columnsLabel="States"
        /**
         * Overrides of the row dimension names,
         * allowes nice user facing labels:
         * subCategory → Sub-Category
         */
        labelOverrides={{
          category: "Category",
          subCategory: "Sub-Category"
        }}
      />
    </div>
  );
}

export default App;

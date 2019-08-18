import React from "react";
import "./App.css";
import PivotTable from "./components/PivotTable";
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
        tableName="Sum Sales"
        fetchData={fetchData}
        rows={["category", "subCategory"]}
        columns={["state", "segment"]}
        aggregationType="sum"
        valueProperty={"sales"}
        rowsLabel="Products"
        columnsLabel="States"
      />
    </div>
  );
}

export default App;

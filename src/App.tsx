import React from "react";
import "./App.css";
import PivotTable from "./components/PivotTable";
import data from "./mockedData/sales-orders.json";

const sleep = async (ms: number) =>
  new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });

function App() {
  return (
    <div className="App">
      <PivotTable
        tableName="Sum Sales"
        fetchData={async () => {
          /**
           * Naive way of mocking loading data from backend in async manner.
           */
          await sleep(100);
          return data;
        }}
        rows={["category", "subCategory"]}
        columns={["state"]}
        aggregationType="sum"
        valueProperty={"sales"}
      />
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";
import { Table } from "./components/PivotTable";
import data from "./mockedData/sales-orders.json";

function App() {
  return (
    <div className="App">
      <Table tableName="Sum Sales" data={data} />
    </div>
  );
}

export default App;

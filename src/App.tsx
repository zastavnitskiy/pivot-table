import React from "react";
import "./App.css";
import { PivotTable } from "./components/PivotTable";
import data from "./mockedData/sales-orders.json";

function App() {
  return (
    <div className="App">
      <h3>Pivot table</h3>
      <PivotTable data={data} />
    </div>
  );
}

export default App;

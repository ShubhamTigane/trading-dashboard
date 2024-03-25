import React from "react";
import ChartComponent from "./components/ChartComponent";
import TableComponent from "./components/TableComponent";

function App() {
  return (
    <div className="App">
      <div className="container border">
        <div>
          <ChartComponent />
          <TableComponent />
        </div>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import ddperiod from "../data/ddperiod.json";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year}`;
};

const TableComponent = () => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered custom-table">
        <thead className="table-light">
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Drawdown Days</th>
            <th>Trading Days</th>
            <th>Total Trades</th>
            <th>Max Drawdown</th>
            <th>Max Drawdown Date</th>
            <th>Time for Max Drawdown</th>
            <th>Time for Recovery</th>
          </tr>
        </thead>
        <tbody>
          {ddperiod.data.map((item, index) => (
            <tr key={index}>
              <td>{formatDate(item.Start_Date)}</td>
              <td>{formatDate(item.End_Date)}</td>
              <td>{item.Drawdown_days}</td>
              <td>{item.Trading_days}</td>
              <td>{item.Total_Trades}</td>
              <td>{item.Max_Drawdown}</td>
              <td>{formatDate(item.Max_Drawdown_Date)}</td>
              <td>{item.Time_for_max_drawdown}</td>
              <td>{item.Time_for_recovery}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

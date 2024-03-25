import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import returns from "../data/returns.json";
import periodsData from "../data/ddperiod.json";
import logo from "../static/logo.png";

const ChartComponent = ({ data }) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    // Create the chart instance
    const chart = createChart(chartContainer.current, {
      width: chartContainer.current.clientWidth,
      height: 500,
      // autoSize: true,
    });

    // Apply options to the chart
    // chart.applyOptions({
    //   watermark: {
    //     color: "rgba(11, 94, 29, 0.4)",
    //     visible: true,
    //     text: "MaticAlgos",
    //     fontSize: 24,
    //     horzAlign: "center",
    //     vertAlign: "bottom",
    //   },
    // });

    chart.timeScale().fitContent();

    //  first series (line chart) to the chart for PNL
    const pnlSeries = chart.addLineSeries({
      title: "PNL",
    });
    const xData = returns.data.combined.map((item) => item.date);
    const ydata1 = returns.data.combined.map((item) => item.pnl);
    pnlSeries.setData(xData.map((x, i) => ({ time: x, value: ydata1[i] })));

    //  second series (area chart) to the chart for Cumsum
    const cumsumSeries = chart.addAreaSeries({
      title: "Cumsum",
      lineColor: "rgba(157, 255, 127, 1)",
    });
    const yData2 = returns.data.combined.map((item) => item.cumsum);
    cumsumSeries.setData(xData.map((x, i) => ({ time: x, value: yData2[i] })));

    //highlighted area series for each period
    periodsData.data.forEach((period) => {
      const { Start_Date: startDate, End_Date: endDate } = period;
      const startIndex = xData.findIndex((date) => date === startDate);
      const endIndex = xData.findIndex((date) => date === endDate);

      if (startIndex !== -1 && endIndex !== -1) {
        const highlightSeries = chart.addAreaSeries({
          title: `Drawdown Period (${startDate})-(${endDate}) `,
          lineColor: "rgba(190, 0, 0, 1)",
          topColor: "rgba(255, 106, 106, 1)",
          bottomColor: "rgba(255, 0, 0, 0.3)",
          lineWidth: 3,
        });

        const highlightData = xData
          .slice(startIndex, endIndex + 1)
          .map((x, i) => ({
            time: x,
            value: Math.max(ydata1[startIndex + i], yData2[startIndex + i]),
          }));
        highlightSeries.setData(highlightData);
      }
    });

    return () => {
      chart.remove();
    };
  }, [data]);

  return (
    <div>
      <div ref={chartContainer} style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 20,
            zIndex: 20,
            color: "black",
            fontSize: 30,
          }}
        >
          Drawdown Period
        </div>
        <img
          src={logo}
          alt="Logo"
          style={{
            position: "absolute",
            bottom: 20,
            zIndex: 20,
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 100,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 100,
            left: 20,
            display: "flex",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "rgba(157, 255, 127, 1)",
              marginRight: 5,
            }}
          ></div>
          <span>Cumsum</span>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "rgba(33, 150, 243, 1)",
              marginLeft: 20,
              marginRight: 5,
            }}
          ></div>
          <span>PNL</span>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;

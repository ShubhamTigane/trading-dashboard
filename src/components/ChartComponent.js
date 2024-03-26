import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import returns from "../data/returns.json";
import periodsData from "../data/ddperiod.json";
import logo from "../static/logo.png";

const ChartComponent = ({ data }) => {
  const chartContainer = useRef(null);

  const [pnlPrice, setPnlPrice] = useState(null);
  const [cumsumPrice, setCumsumPrice] = useState(null);

  const tooltipRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(null);

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

    //
    // Subscribe to crosshair move events
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const pnlPriceData = param.seriesData.get(pnlSeries);
        setPnlPrice(pnlPriceData);
        const cumsumPriceData = param.seriesData.get(cumsumSeries);
        setCumsumPrice(cumsumPriceData);

        const coordinate = pnlSeries.priceToCoordinate(pnlPriceData.value);

        const shiftedCoordinate = param.point.x;

        tooltipRef.current.style.display = "block";
        tooltipRef.current.style.left = shiftedCoordinate + "px";
        tooltipRef.current.style.top = coordinate + "px";

        const chartRect = chartContainer.current.getBoundingClientRect();
        const tooltipHeight = tooltipRef.current.offsetHeight;
        const topPadding = 10;
        const mouseY = param.point.y + chartRect.top;

        if (mouseY + tooltipHeight + topPadding <= window.innerHeight) {
          tooltipRef.current.style.top = mouseY + topPadding + "px";
        } else {
          tooltipRef.current.style.top =
            window.innerHeight - tooltipHeight + "px";
        }

        setCurrentTime(new Date(param.time).toLocaleDateString());
      } else {
        tooltipRef.current.style.display = "none";
      }
    });

    //

    return () => {
      chart.remove();
    };
  }, [data]);

  return (
    <div>
      <div ref={chartContainer} style={{ position: "relative" }}>
        <div
          ref={tooltipRef}
          style={{
            color: "black",
            fontSize: "17px",
            position: "absolute",
            width: 180,
            height: 180,
            border: "2px solid",
            borderColor: "#1ad2ad",
            zIndex: 1000,
            background: "#FAFAFA",
            textAlign: "center",
            margin: "4px 0px",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 0 7px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* <h3>MaticAlgos</h3> */}
          <p>
            <img
              src={logo}
              alt="Logo"
              style={{
                width: 100,
              }}
            />
          </p>
          <p>Cumsum : {cumsumPrice?.value} </p>
          <p>PNL : {pnlPrice?.value} </p>
          <p>Date : {currentTime} </p>
        </div>

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
            top: 20,
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

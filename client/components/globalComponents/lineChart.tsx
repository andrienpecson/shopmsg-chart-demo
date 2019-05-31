import React from "react";
import { Line } from "react-chartjs-2";

{/* Custom Legend */ }
const generateLegend = ({ backgroundColor, label }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
      <div style={{ backgroundColor: backgroundColor, height: 6, width: 15, marginRight: 5 }}></div>
      <span style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.45)" }}>{label}</span>
    </div>
  )
}

const lineChart = ({ data, labels, options = {} }) => {
  const dataObj = {
    labels: labels,
    datasets: data
  };
  const optionsObj = {
    ...{
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          ticks: {
            fontColor: "rgba(0, 0, 0, 0.45)"
          }
        }],
        yAxes: [{
          display: false
        }]
      },
      elements: {
        point: {
          radius: 0
        }
      },
      legend: {
        display: false
      },
      ticks: {
        fontFamily: "sans-serif"
      },
      tooltips: {
        mode: "index",
        intersect: false
      },
      hover: {
        mode: "index",
        intersect: false
      }
    },
    options
  };
  return (
    <div>
      <div style={{ display: "flex" }}>
        {
          (data).map((o, index) => {
            return (
              <div key={index}>
                {
                  generateLegend(o)
                }
              </div>
            )
          })
        }
      </div>
      <div>
        <Line
          data={dataObj}
          options={optionsObj}
        />
      </div>
    </div>
  )
};


export default lineChart;
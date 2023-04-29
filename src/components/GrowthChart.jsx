import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { monthNames, numFormatter } from "../helpers";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function GrowthChart({ sessionsData, days }) {
  const [followersData, setFollowersData] = useState([])
  const [categories, setCategories] = useState([])
  useEffect(() => {
    let followersData = []
    let categories = []
    sessionsData?.slice(-days).forEach(items => {
      const day = new Date(items.start_time).getDate()
      const month = new Date(items.start_time).getMonth()+1
      const monthName = monthNames[month]
      categories.push(`${monthName} ${day}`);
      followersData.push(items.profile.followers);
    })
    setCategories(categories);
    setFollowersData(followersData)

  }, [sessionsData, days])
  

  const options = {
    dataLabels: {
      enabled: false,
    },
    // colors: ["#0087fe"],
    colors: ["#7ea5ff"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100]
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: true
        }
      },
      show: true,
      padding: {
        left: 0,
        right: 0,
      },
    },
    tooltip: {
      enabled: true,
    },
    chart: {
      id: "line",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      axisTicks: {
        show: true
      },
      labels: {
        offsetX: -15,
        offsetY: 0,
        formatter: function (val, index) {
          return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
        },
      },
    },
  }

  return (
    <div>
      <div className="rounded-md text-gray20 w-full">
        <div className="px-3">
          <Chart
            options={options}

            series={[{
              name: "Followers",
              data: followersData
            }]}

            type="area"
            height="400"
          />
        </div>
      </div>
    </div>
  );
}

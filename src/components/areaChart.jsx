import React, { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Select, MenuItem, FormControl, Typography } from "@mui/material";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/DataSaverOffOutlined";
import * as TransactionAPI from "../api/transactionApi";
import "../index.css";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const AreaCharts = () => {
  const [salesData, setSalesData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All");

  useEffect(() => {
    TransactionAPI.getAll()
      .then((res) => res.records)
      .then((transactions) => {
        setSalesData(transactions);
      })
      .catch((error) => console.error("Error fetching sales data:", error));
  }, []);

  const handleProductChange = (product) => {
    setSelectedProduct(product);
  };

  const filteredData =
    selectedProduct !== "All"
      ? salesData.filter(
          (transaction) =>
            transaction.productName === selectedProduct ||
            (selectedProduct === "Other" &&
              !["CPO", "PKO", "TBS"].includes(transaction.productName))
        )
      : salesData;

  const productNames = ["CPO", "PKO", "TBS", "Other"];

  const monthlyData = monthNames.map((monthName, monthIndex) => {
    const monthTotal = { name: monthName };

    productNames.forEach((productName) => {
      monthTotal[productName] = 0;
    });

    const monthTransactions = filteredData.filter(
      (transaction) =>
        new Date(transaction.originWeighOutTimestamp).getMonth() === monthIndex
    );

    monthTransactions.forEach((transaction) => {
      if (productNames.includes(transaction.productName)) {
        monthTotal[transaction.productName] += 1;
      } else {
        monthTotal["Other"] += 1;
      }
    });

    return monthTotal;
  });

  // Fill in missing months with zero transactions
  for (let i = 0; i < 12; i++) {
    const monthIndex = monthlyData.findIndex(
      (data) => monthNames.indexOf(data.name) === i
    );

    if (monthIndex === -1) {
      const newMonthTotal = { name: monthNames[i] };
      productNames.forEach((productName) => {
        newMonthTotal[productName] = 0;
      });
      monthlyData.splice(i, 0, newMonthTotal);
    }
  }

  return (
    <div className="grafik">
      <div className="title">
        <Typography fontSize="18px">
          <PieChartOutlineOutlinedIcon sx={{ mb: 0.5, mr: 1 }} />
          Sales
        </Typography>
      </div>
      <FormControl
        sx={{
          mt: "auto",
          minWidth: 200,
        }}
        size="small"
      >
        <Select
          value={selectedProduct}
          onChange={(e) => handleProductChange(e.target.value)}
          displayEmpty
          sx={{
            color: selectedProduct === "" ? "gray" : "black",
            fontSize: "15px",
            borderRadius: "10px",
          }}
        >
          <MenuItem value="All">-- Pilih Product --</MenuItem>
          <MenuItem value="CPO">CPO</MenuItem>
          <MenuItem value="PKO">PKO</MenuItem>
          <MenuItem value="TBS">TBS</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      <div className="areaChart">
        <div className="chart">
          <hr />
          <ResponsiveContainer width="100%" height="110%">
            <AreaChart
              data={monthlyData}
              width={500}
              height={500}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip />
              <Legend iconType="square" />
              <Area
                type="monotone"
                dataKey="CPO"
                stackId="1"
                stroke="rgb(27, 170, 218)"
                fill="rgb(27, 170, 218)"
              />
              <Area
                type="monotone"
                dataKey="PKO"
                stackId="1"
                stroke="rgb(9, 170, 9)"
                fill="rgb(9, 170, 9)"
              />
              <Area
                type="monotone"
                dataKey="TBS"
                stackId="1"
                stroke="rgb(247, 166, 53)"
                fill="rgb(247, 166, 53)"
              />
              <Area
                type="monotone"
                dataKey="Other"
                stackId="1"
                stroke="rgb(255, 38, 0)"
                fill="rgb(255, 38, 0)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AreaCharts;

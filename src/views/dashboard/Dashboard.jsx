import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import * as TransactionAPI from "../../api/transactionApi";

const data = [
  { name: "January", value: 70 },
  { name: "February", value: 39 },
  { name: "March", value: 10 },
  { name: "April", value: 85 },
  { name: "May", value: 30 },
  { name: "June", value: 70 },
  { name: "July", value: 35 },
];

const Dashboard = () => {
  const [CPOProduct, setCPOProduct] = useState(0);
  const [PKOProduct, setPKOProduct] = useState(0);
  const [TBSProduct, setTBSProduct] = useState(0);
  const [OtherProduct, setOtherProduct] = useState(0);

  useEffect(() => {
    TransactionAPI.getAll()
      .then((res) => res.records)
      .then((transactions) => {
        // Filter transaksi berdasarkan produk "CPO"
        const CPOProduct = transactions.filter(
          (transaction) => transaction.productName === "CPO"
        );
        setCPOProduct(CPOProduct.length);
        // Filter transaksi berdasarkan produk "PKO"
        const PKOProduct = transactions.filter(
          (transaction) => transaction.productName === "PKO"
        );
        setPKOProduct(PKOProduct.length);
        // Filter transaksi berdasarkan produk "TBS"
        const TBSProduct = transactions.filter(
          (transaction) => transaction.productName === "TBS"
        );
        setTBSProduct(TBSProduct.length);
        // Filter transaksi berdasarkan produk "Other"
        const OtherProduct = transactions.filter(
          (transaction) =>
            transaction.productName !== "CPO" &&
            transaction.productName !== "PKO" &&
            transaction.productName !== "TBS"
        );
        setOtherProduct(OtherProduct.length);
      })
      .catch((error) => console.error("Error fetching province data:", error));
  }, []);

  return (
    <div>
      {/* Kotak di atas (4 kotak) */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: "primary.main" }}>
            <Typography variant="h6">CPO TRANSACTION {CPOProduct}</Typography>
            <Typography>Content for Box 1</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: "success.main" }}>
            <Typography variant="h6">PKO TRANSACTION {PKOProduct}</Typography>
            <Typography>Content for Box 2</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: "warning.main" }}>
            <Typography variant="h6">TBS  {TBSProduct}</Typography>
            <Typography>Content for Box 3</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: "error.main" }}>
            <Typography variant="h6">Other TRANSACTION {OtherProduct}</Typography>
            <Typography>Content for Box 4</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <paper elevation={3} sx={{ p: 2, backgroundColor: "warning.main" }}>
            <LineChart width={1000} height={500} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;

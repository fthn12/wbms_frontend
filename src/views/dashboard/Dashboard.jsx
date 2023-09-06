import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import * as TransactionAPI from "../../api/transactionApi";
import AreaCharts from "../../components/areaChart";
import PieCharts from "../../components/pieChart";
import BarChartIcon from "@mui/icons-material/EqualizerOutlined";

const Dashboard = () => {
  const [CPOProduct, setCPOProduct] = useState(0);
  const [PKOProduct, setPKOProduct] = useState(0);
  const [TBSProduct, setTBSProduct] = useState(0);
  const [OtherProduct, setOtherProduct] = useState(0);

  useEffect(() => {
    const lowerCaseProductName = (productName) => productName.toLowerCase();

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
          (transaction) =>
            lowerCaseProductName(transaction.productName) === "tbs internal" ||
            lowerCaseProductName(transaction.productName) === "tbs eksternal"
        );
        setTBSProduct(TBSProduct.length);
        // Filter transaksi berdasarkan produk "Other"
        const OtherProduct = transactions.filter(
          (transaction) =>
            transaction.productName !== "CPO" &&
            transaction.productName !== "PKO" &&
            !(
              lowerCaseProductName(transaction.productName) ===
                "tbs internal" ||
              lowerCaseProductName(transaction.productName) === "tbs eksternal"
            )
        );
        setOtherProduct(OtherProduct.length);

        const totalTBS = TBSProduct.length;
        setTBSProduct(totalTBS);
      })
      .catch((error) => console.error("Error fetching province data:", error));
  }, []);

  return (
    <div className="dashboard">
      <Box my={2}>
        <Typography variant="h5" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROWS 1 */}
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right, #0B63F6, #003CC5)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              {CPOProduct}
            </Typography>
            <Typography variant="h7" color="white">
              CPO TRANSACTION
            </Typography>
          </Box>
          <BarChartIcon sx={{ fontSize: 90, color: "#283593", mr: 2 }} />
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#33cc33, #009933)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              {PKOProduct}
            </Typography>
            <Typography variant="h7" color="white">
              PKO TRANSACTION
            </Typography>
          </Box>
          <BarChartIcon sx={{ fontSize: 90, color: "#2e7d32", mr: 2 }} />
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107 )",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              {TBSProduct}
            </Typography>
            <Typography variant="h7" color="white">
              TBS TRANSACTION
            </Typography>
          </Box>
          <BarChartIcon sx={{ fontSize: 90, color: "#ff8f00", mr: 2 }} />
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#f44336,#d32f2f)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              {OtherProduct}
            </Typography>
            <Typography variant="h7" color="white">
              OTHERS TRANSACTION
            </Typography>
          </Box>
          <BarChartIcon sx={{ fontSize: 90, color: "#b71c1c", mr: 2 }} />
        </Box>
        <Box gridColumn="span 8" pt={3}>
          <Paper elevation={5} sx={{ p: 3, mx: 1, borderRadius: "10px" }}>
            <div style={{ width: "auto", height: "45vh" }}>
              <AreaCharts />
            </div>
          </Paper>
        </Box>
        <Box gridColumn="span 4" pt={3}>
          <Paper elevation={5} sx={{ p: 3, mx: 1, borderRadius: "10px" }}>
            <div style={{ width: "auto", height: "45vh" }}>
              <PieCharts />
            </div>
          </Paper>
        </Box>
      </Box>
    </div>
  );
};
export default Dashboard;

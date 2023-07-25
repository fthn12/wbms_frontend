import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Grid,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik } from "formik";
import useSWR from "swr";
import { red, blue } from "@mui/material/colors";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import {
  RowGroupingModule,
  ValuesDropZonePanel,
} from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AddCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreateRole from "../../../views/usermanagement/roles/createRole";
import Config from "../../../configs";
import * as TransactionAPI from "../../../api/transactionApi";

import PageHeader from "../../../components/PageHeader";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const RoleList = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ paddingLeft: 120, paddingRight: 120, paddingBottom: 60 }}>
      <Box sx={{ pt: 2, pb: 2, pl: 2 }}>
        <h4>Roles List</h4>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: "10px 10px 10px 10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "auto" }}
            >
              <h4 ml={3}>Administrator</h4>
              <br />
              <h6 sx={{ fontSize: "15px", fontWeight: "bold", color: "grey" }}>
                Total users with this role: 5
              </h6>
              <br />
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "gray",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ul>
                  <li className="listItemStyle">All Admin Controls</li>
                  <li className="listItemStyle">
                    View and Edit Financial Summaries
                  </li>
                  <li className="listItemStyle">Enabled Bulk Reports</li>
                  <li className="listItemStyle">View and Edit Payouts</li>
                  <li className="listItemStyle">View and Edit Disputes</li>
                </ul>
              </Typography>
              <Box
                display="flex"
                sx={{
                  pt: 2,
                  pl: 2,
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  style={{ textTransform: "none" }}
                >
                  View Role
                </Button>
              </Box>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,

              borderRadius: "10px 10px 10px 10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "auto" }}
            >
              <h4 ml={3}>Mill Head</h4>
              <br />
              <h6 sx={{ fontSize: "15px", fontWeight: "bold", color: "grey" }}>
                Total users with this role: 5
              </h6>
              <br />
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "gray",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ul>
                  <li className="listItemStyle">All Admin Controls</li>
                  <li className="listItemStyle">
                    View and Edit Financial Summaries
                  </li>
                  <li className="listItemStyle">Enabled Bulk Reports</li>
                  <li className="listItemStyle">View and Edit Payouts</li>
                  <li className="listItemStyle">View and Edit Disputes</li>
                </ul>
              </Typography>
              <Box
                display="flex"
                sx={{
                  pt: 2,
                  pl: 2,
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  style={{ textTransform: "none" }}
                >
                  View Role
                </Button>
                <Box>
                  <Button variant="outlined" style={{ textTransform: "none" }}>
                    Edit Role
                  </Button>
                </Box>
              </Box>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,

              borderRadius: "10px 10px 10px 10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "auto" }}
            >
              <h4 ml={3}>Manager</h4>
              <br />
              <h6 sx={{ fontSize: "15px", fontWeight: "bold", color: "grey" }}>
                Total users with this role: 5
              </h6>
              <br />
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "gray",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ul>
                  <li className="listItemStyle">All Admin Controls</li>
                  <li className="listItemStyle">
                    View and Edit Financial Summaries
                  </li>
                  <li className="listItemStyle">Enabled Bulk Reports</li>
                  <li className="listItemStyle">View and Edit Payouts</li>
                  <li className="listItemStyle">View and Edit Disputes</li>
                </ul>
              </Typography>
              <Box
                display="flex"
                sx={{
                  pt: 2,
                  pl: 2,
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  style={{ textTransform: "none" }}
                >
                  View Role
                </Button>
                <Box>
                  <Button variant="outlined" style={{ textTransform: "none" }}>
                    Edit Role
                  </Button>
                </Box>
              </Box>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,

              borderRadius: "10px 10px 10px 10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "auto" }}
            >
              <h4 ml={3}>Supervisor</h4>
              <br />
              <h6 sx={{ fontSize: "15px", fontWeight: "bold", color: "grey" }}>
                Total users with this role: 5
              </h6>
              <br />
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "gray",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ul>
                  <li className="listItemStyle">All Admin Controls</li>
                  <li className="listItemStyle">
                    View and Edit Financial Summaries
                  </li>
                  <li className="listItemStyle">Enabled Bulk Reports</li>
                  <li className="listItemStyle">View and Edit Payouts</li>
                  <li className="listItemStyle">View and Edit Disputes</li>
                </ul>
              </Typography>
              <Box
                display="flex"
                sx={{
                  pt: 2,
                  pl: 2,
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  style={{ textTransform: "none" }}
                >
                  View Role
                </Button>
                <Box>
                  <Button variant="outlined" style={{ textTransform: "none" }}>
                    Edit Role
                  </Button>
                </Box>
              </Box>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,

              borderRadius: "10px 10px 10px 10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "auto" }}
            >
              <h4 ml={3}>Staf</h4>
              <br />
              <h6 sx={{ fontSize: "15px", fontWeight: "bold", color: "grey" }}>
                Total users with this role: 5
              </h6>
              <br />
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "gray",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ul>
                  <li className="listItemStyle">All Admin Controls</li>
                  <li className="listItemStyle">
                    View and Edit Financial Summaries
                  </li>
                  <li className="listItemStyle">Enabled Bulk Reports</li>
                  <li className="listItemStyle">View and Edit Payouts</li>
                  <li className="listItemStyle">View and Edit Disputes</li>
                </ul>
              </Typography>
              <Box
                display="flex"
                sx={{
                  pt: 2,
                  pl: 2,
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  style={{ textTransform: "none" }}
                >
                  View Role
                </Button>
                <Box>
                  <Button variant="outlined" style={{ textTransform: "none" }}>
                    Edit Role
                  </Button>
                </Box>
              </Box>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,

              pt: 22.5,
              pb: 22.5,
              borderRadius: "10px 10px 10px 10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "center", // Center the content horizontally
              alignItems: "center", // Center the content vertically
              flexDirection: "column", // Arrange the content in a column
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "auto" }}
            >
              <Box
                display="flex"
                sx={{
                  gap: "10px",
                }}
              >
                <Button
                  type="submit"
                  variant="text"
                  style={{
                    textTransform: "none",
                    fontSize: "23px",
                    fontWeight: "bold",
                    color: "gray",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <AddCircleIcon
                    sx={{
                      fontSize: "25px",
                      color: "gray",
                      mr: 1,
                    }}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  />
                  Tambah Role Baru
                </Button>
              </Box>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <CreateRole isOpen={isOpen} onClose={setIsOpen} />
    </div>
  );
};

export default RoleList;

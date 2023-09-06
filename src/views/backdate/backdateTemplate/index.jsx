import React, { useMemo, useRef, useState } from "react";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { red, indigo } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "@ag-grid-community/core";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import * as TransactionAPI from "../../../api/transactionApi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Papa from "papaparse";
import EditTemplate from "./editTemplate";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const BackdateTemplate = () => {
  const gridRef = useRef();
  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: false,
    filter: true,
  };

  const autoGroupColumnDef = useMemo(
    () => ({
      cellRendererParams: {
        suppressCount: true,
        checkbox: true,
      },
      field: "transportVehiclePlateNo",
      width: 230,
    }),
    []
  );

  const [isDataSaved, setIsDataSaved] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editColumnDefs, setEditColumnDefs] = useState([]);

  // ...

  const handleRowClick = (params) => {
    setEditFormData(params.data);
    setIsEditFormVisible(true);

    // Set definisi kolom yang sesuai dengan data yang akan diedit
    const dataKeys = Object.keys(params.data);
    const newEditColumnDefs = columnDefs.filter((col) =>
      dataKeys.includes(col.field)
    );
    setEditColumnDefs(newEditColumnDefs);
  };

  const handleFormClose = () => {
    setIsEditFormVisible(false);
    setEditFormData({});
  };

  const handleSave = () => {
    TransactionAPI.create(uploadedData)
      .then(() => {
        setIsDataSaved(true);
        toast.success("Data saved successfully.");
      })
      .catch((error) => {
        Swal.fire("Error", "Failed to save data.", "error");
        console.error("Error saving data:", error);
      });
  };

  const handleSearch = (value) => {
    console.log("Search Value:", value);
    const filteredData = uploadedData.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(value.toLowerCase())
    );
    console.log("Filtered Data:", filteredData);
    gridRef.current.api.setRowData(filteredData);
  };

  const clearUploadedData = (rowIndex, columnId) => {
    console.log("Clearing data for row:", rowIndex, "column:", columnId);
    const updatedData = [...uploadedData];
    const rowToUpdate = updatedData.find((row) => row.id === rowIndex);

    if (rowToUpdate) {
      delete rowToUpdate[columnId];
      setUploadedData(updatedData);
    }
  };

  const processUploadedData = (csvData) => {
    setIsDataSaved(false);
    const headers = Object.keys(csvData[0]);
    const newColumnDefs = headers.map((header) => ({
      headerName: header,
      colId: header,
      field: header,
      filter: true,
      sortable: true,
    }));

    const dataWithId = csvData.map((row, index) => ({ ...row, id: index }));

    newColumnDefs.push({
      headerName: "Action",
      maxWidth: 110,
      cellRenderer: (params) => {
        return (
          <Box display="flex" justifyContent="center">
            <Box
              display="flex"
              bgcolor={red[800]}
              borderRadius="5px"
              padding="7px 5px "
              color="white"
              onClick={() => {
                clearUploadedData(params.data.id, params.colDef.field);
                console.log("Field:", params.colDef.field);
              }}
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <CancelOutlinedIcon sx={{ fontSize: "25px" }} />
            </Box>
          </Box>
        );
      },
    });

    setColumnDefs(newColumnDefs);
    setUploadedData(dataWithId);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 3,
            mx: 3,
            mb: 5,
            mt: 2,
            borderTop: "5px solid #000",
            borderRadius: "10px 10px 10px 10px",
          }}
        >
          <div style={{ marginBottom: "5px" }}>
            <Box display="flex">
              <Typography fontSize="20px">Backdate Template</Typography>
              <Box ml="auto">
                <Button
                  color="success"
                  ml="auto"
                  variant="contained"
                  component="label"
                  sx={{
                    fontSize: "11px",
                    padding: "8px 8px",
                    color: "white",
                    marginLeft: "8px",
                  }}
                >
                  <UploadFileOutlinedIcon
                    sx={{ mr: "5px", fontSize: "17px" }}
                  />
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      Papa.parse(file, {
                        complete: (result) => {
                          processUploadedData(result.data);
                        },
                        header: true,
                      });
                    }}
                  />
                </Button>
              </Box>
            </Box>
            <hr />
            <Box display="flex" pb={1}>
              <Button
                variant="contained"
                sx={{
                  fontSize: "11px",
                  padding: "8px 8px",
                  color: "white",
                  marginLeft: "8px",
                }}
                onClick={handleSave}
              >
                <SaveOutlinedIcon sx={{ mr: "5px", fontSize: "17px" }} />
                Simpan
              </Button>
              <Box
                display="flex"
                borderRadius="5px"
                ml="auto"
                border="solid grey 1px"
              >
                <InputBase
                  sx={{ ml: 2, flex: 2, fontSize: "13px" }}
                  placeholder="Search"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <IconButton
                  type="button"
                  sx={{ p: 1 }}
                  onClick={() => handleSearch("")}
                >
                  <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                </IconButton>
              </Box>
            </Box>
          </div>
          <div
            className="ag-theme-alpine"
            style={{ width: "auto", height: "70vh" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={uploadedData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection="multiple"
              rowGroupPanelShow="always"
              enableRangeSelection="true"
              groupSelectsChildren="true"
              suppressRowClickSelection="true"
              autoGroupColumnDef={autoGroupColumnDef}
              pagination="true"
              paginationAutoPageSize="true"
              groupDefaultExpanded="1"
              onRowClicked={handleRowClick}
            />
          </div>
          {isEditFormVisible && (
            <div>
              <EditTemplate
                data={editFormData}
                columnDefs={editColumnDefs}
                onSave={(editedData) => {
                  // Set data yang telah diedit kembali ke tabel AgGrid
                  const updatedData = [...uploadedData];
                  const rowIndex = updatedData.findIndex(
                    (row) => row.id === editFormData.id
                  );
                  if (rowIndex !== -1) {
                    updatedData[rowIndex] = editedData;
                    setUploadedData(updatedData);
                  }

                  setIsEditFormVisible(false);
                }}
                onCancel={handleFormClose}
              />
            </div>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BackdateTemplate;

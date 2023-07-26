import React, { useState, useEffect } from "react";
import { Grid, Paper, Button, Box, Typography } from "@mui/material";
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
import * as RolesAPI from "../../../api/roleApi";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateRole from "../../../views/usermanagement/roles/createRole";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const RoleList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState([]);

  const fetcher = () =>
    RolesAPI.getAll().then((res) => res.data.role.records);
  useEffect(() => {
    fetcher().then((dataRole) => {
      setRoles(dataRole);
    });
  }, []);

  return (
    <div style={{ paddingLeft: 120, paddingRight: 120, paddingBottom: 60 }}>
      <Box sx={{ pt: 2, pb: 2, pl: 2 }}>
        <h4>Roles List</h4>
      </Box>
      <Grid container spacing={4}>
        {roles.map((role) => (
          <Grid key={role.id} item xs={12} sm={6} md={4} lg={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                borderRadius: "10px 10px 10px 10px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                className="ag-theme-alpine"
                style={{ width: "auto", height: "29vh" }}
              >
                <h4 ml={3}>{role.name}</h4>
                <br />
                <h6
                  sx={{ fontSize: "15px", fontWeight: "bold", color: "grey" }}
                >
                  Total users with this role: 5
                </h6>
                <br />
                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  {role.description}
                </Typography>
              </div>
              <Box display="flex" justifyContent="flex-start" gap="15px" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ textTransform: "none" }}
                >
                  View Role
                </Button>
                {!["Administrator", "administrator"].includes(role.name) && (
                  <Button variant="outlined" style={{ textTransform: "none" }}>
                    Edit Role
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}

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

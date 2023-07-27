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
import * as RolesAPI from "../../../api/provinceApi";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateRole from "../../../views/usermanagement/roles/createRole";
import EditRole from "../../../views/usermanagement/roles/editRole";
import { LinkContainer } from "react-router-bootstrap";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const RoleList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetcher = () =>
    RolesAPI.getAll().then((res) => res.data.province.records);
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
                <LinkContainer to="/viewrole"  style={{ textTransform: "none" }}>
                <Button
                  type="submit"
                  variant="contained"
                 
                >
                  View Role
                </Button></LinkContainer>
                {!["Administrator", "administrator"].includes(role.name) && (
                  <Button
                    variant="outlined"
                    style={{ textTransform: "none" }}
                    onClick={() => {
                      setSelectedRole(role);
                      setIsEditOpen(true);
                    }}
                  >
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
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    position: "relative", // Tambahkan properti posisi relatif pada Paper
  }}
>
  <div
    className="ag-theme-alpine"
    style={{ width: "auto", height: "34vh" }}
  >
    <Box
      display="flex"
      sx={{
        position: "absolute", 
        top: "50%", // Posisikan di tengah vertikal (50% dari atas)
        left: "50%", // Posisikan di tengah horizontal (50% dari kiri)
        transform: "translate(-50%, -50%)", // Geser posisi ke tengah (50% dari lebar dan tinggi elemen)
        flexDirection: "column", // Susun konten dalam kolom
        alignItems: "center", // Posisikan konten di tengah secara horizontal
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
        Tambah Role 
      </Button>
    </Box>
  </div>
</Paper>

        </Grid>
      </Grid>
      <CreateRole isOpen={isOpen} onClose={setIsOpen} />
      <EditRole
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtRole={selectedRole}
      />
    </div>
  );
};

export default RoleList;

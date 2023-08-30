import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCollapse from "react-collapsed";
import "./style.css";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControl,
  IconButton,
  FormLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Masonry from "@mui/lab/Masonry";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik, Form, FieldArray, Field } from "formik";
import * as yup from "yup";
import { grey, blue } from "@mui/material/colors";
import * as RolesAPI from "../../../api/roleApi";
import SelectBox from "../../../components/selectbox";
import { dtAttrJson } from "../../../data/attributeListObj";

const CreateRoles = ({ isOpen, onClose }) => {
  const [expanded, setExpanded] = useState(null);

  const toggleAccordion = (index) => {
    setExpanded(index === expanded ? null : index);
  };
  const resourcesList = [
    "Company",
    "Customer",
    "Driver",
    "Mill",
    "Product",
    "Semai",
    "Site",
    "StorageTank",
    "Transaction",
    "TransportVehicle",
    "Weighbridge",
  ];
  const [checkboxes, setCheckboxes] = useState(
    resourcesList.map((resource, index) => ({
      id: index,
      label: resource,
      checked: true,
    }))
  );
  const [selectedResources, setSelectedResources] = useState([]);
  const [attrOptions, setAttrOptions] = useState(dtAttrJson);
  const handleCheckboxChange = (id, values, setFieldValue) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      )
    );
  };
  const handleSelectAll = () => {
    const allChecked = checkboxes.every((checkbox) => checkbox.checked);
    const updatedCheckboxes = checkboxes.map((checkbox) => ({
      ...checkbox,
      checked: !allChecked,
    }));
    setCheckboxes(updatedCheckboxes);
  };
  const actionOptions = ["read", "create", "update", "delete"];
  const [possesionList, setPossesionList] = useState(
    Array(actionOptions.length).fill("own")
  );
  const [grants, setGrants] = useState(
    actionOptions.map((action, index) => ({
      action: action,
      possession: possesionList[index],
      attributes: [
        {
          attr: "",
        },
      ],
    }))
  );
  const [permissions, setPermissions] = useState({ resource: "", grants });
  const generateInitialValues = (permissions) => ({
    name: "",
    permissions,
  });
  // Use the useEffect to update selectedResources
  useEffect(() => {
    const updatedResources = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    setSelectedResources(updatedResources);
  }, [checkboxes]);

  useEffect(() => {
    setPermissions(selectedResources.map((resource) => ({ resource, grants })));
    setAttrOptions(
      Object.keys(dtAttrJson)
        .filter((resource) => selectedResources.includes(resource))
        .reduce((obj, key) => {
          obj[key] = dtAttrJson[key];
          return obj;
        }, {})
    );
  }, [selectedResources, grants]);

  // Create

  useEffect(() => {
    const successMessage = localStorage.getItem("successMessage");

    if (successMessage) {
      // Hapus pesan dari storage web
      localStorage.removeItem("successMessage");

      // Menampilkan toast alert
      toast.success(successMessage);
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const asArray = Object.entries(values);
    const filtered = asArray.filter(([key, value]) => value !== "");
    const filteredValues = Object.fromEntries(filtered);
    try {
      await RolesAPI.create(filteredValues);
      console.log("Data Berhasil Disimpan");
      // Simpan pesan berhasil di storage web
      localStorage.setItem("successMessage", "Data Berhasil Disimpan");
      // Memuat ulang halaman
      window.location.reload();
    } catch (error) {
      console.error("Data Gagal Disimpan:", error);
      toast.error("Data Gagal Disimpan: " + error.message);
    } finally {
      setSubmitting(false);
      resetForm();
      onClose("", false);
    }
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("required"),
  });

  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    color: theme.palette.text.secondary,
    transition: "max-width 0.3s ease-in-out",
  }));
  return (
    <Dialog open={isOpen} fullWidth maxWidth={"xl"}>
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}
      >
        Tambah Roles
        <IconButton
          sx={{
            color: "black",
            position: "absolute",
            right: "15px",
            top: "20px",
          }}
          onClick={() => {
            onClose("", false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          enableReinitialize
          onSubmit={handleSubmit}
          initialValues={generateInitialValues(permissions)}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // backgroundColor: "#f8f8f8",
                  marginBottom: "20px",
                }}
              >
                <Box
                  display="block"
                  padding={2}
                  paddingBottom={3}
                  paddingLeft={3}
                  paddingRight={3}
                  gap="20px"
                >
                  <FormControl sx={{ mb: 2 }}>
                    <FormLabel
                      sx={{
                        color: "black",
                        marginBottom: "8px",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      Role Name
                    </FormLabel>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      size="small"
                      placeholder="Masukkan Nama"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      name="name"
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </FormControl>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkboxes.every((checkbox) => checkbox.checked)}
                      onChange={handleSelectAll}
                    />
                    Select All
                  </label>
                  {checkboxes.map((checkbox) => (
                    <div key={checkbox.id} sx={{ }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checkbox.checked}
                          onChange={() =>
                            handleCheckboxChange(
                              checkbox.id,
                              values,
                              setFieldValue
                            )
                          }
                        />
                        {checkbox.label}
                      </label>
                    </div>
                  ))}
                </Box>
                <Box
                  sx={{ gridColumn: "span 4", width: "100%" }}
                  display="block"
                  padding={2}
                  paddingBottom={3}
                  paddingLeft={3}
                  paddingRight={3}
                >
                  <FormLabel
                    sx={{
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Master Data
                  </FormLabel>

                  <FormLabel
                    sx={{
                      color: "black",
                      marginTop: "25px",
                      marginBottom: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Permissions
                  </FormLabel>
                  <Masonry columns={4} spacing={2}>
                    {selectedResources.map((resource, index) => (
                      <Paper key={index}>
                        <StyledAccordion
                          key={index}
                          expanded={expanded === index}
                          onChange={(e, expanded) => toggleAccordion(index)}
                          TransitionProps={{ unmountOnExit: true }}
                          sx={{ minHeight: "15px", width: "auto" }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                              {" "}
                              {resource}
                              <br />
                              {expanded !== index &&
                                values.permissions[index]?.grants.length > 0 &&
                                actionOptions.map(
                                  (actionOption, actionIndex) => (
                                    <span>
                                      {values.permissions[index]?.grants[
                                        actionIndex
                                      ]?.action
                                        ? values.permissions[index]?.grants[
                                            actionIndex
                                          ]?.action
                                        : ""}
                                      <span style={{ fontSize: "10px" }}>
                                        {
                                          values.permissions[index]?.grants[
                                            actionIndex
                                          ]?.possession
                                        }{" "}
                                      </span>
                                    </span>
                                  )
                                )}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box
                              name={`permissions[${index}].grants`}
                              sx={{
                                flex: 1,
                                width: "auto",
                                backgroundColor: blue[50],
                                marginTop: "5px",
                                padding: "15px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                }}
                              >
                                <label>Actions:</label>
                                <label> Possession </label>
                              </div>
                              {actionOptions.map(
                                (actionOption, actionIndex) => (
                                  <div
                                    key={actionIndex}
                                    style={{
                                      display: "block",
                                      width: "100%",
                                    }}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <label>
                                        <Field
                                          type="checkbox"
                                          name={`permissions[${index}].grants[${actionIndex}].action`}
                                          checked={
                                            values.permissions[index]?.grants[
                                              actionIndex
                                            ]?.action === actionOption
                                          }
                                          value={
                                            values.permissions[index]?.grants[
                                              actionIndex
                                            ]?.action
                                          }
                                        />
                                        {actionOption}
                                      </label>
                                      <Switch
                                        name={`permissions[${index}].grants[${actionIndex}].possession`}
                                        value="own"
                                        checked={
                                          values.permissions[index]?.grants[
                                            actionIndex
                                          ]?.possession === "any"
                                        }
                                        onChange={(event, checked) => {
                                          setFieldValue(
                                            `permissions[${index}].grants[${actionIndex}].possession`,
                                            checked ? "any" : "own"
                                          );
                                        }}
                                      />
                                      <Typography>
                                        {
                                          values.permissions[index]?.grants[
                                            actionIndex
                                          ]?.possession
                                        }
                                      </Typography>
                                    </Stack>
                                    <Accordion>
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`permissions[${index}].grants[${actionIndex}].attributes`}
                                        id={`permissions[${index}].grants[${actionIndex}].attributes`}
                                      >
                                        <Typography>
                                          hidden attributes
                                        </Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        {attrOptions[resource] && (
                                          <SelectBox
                                            name={`permissions[${index}].grants[${actionIndex}].attributes`}
                                            onChange={(event) => {
                                              if (
                                                values.permissions[index] &&
                                                values.permissions[index]
                                                  ?.grants[actionIndex]
                                              ) {
                                                event.forEach((options, i) =>
                                                  setFieldValue(
                                                    `permissions[${index}].grants[${actionIndex}].attributes[${i}].attr`,
                                                    options.value
                                                  )
                                                );
                                              }
                                            }}
                                            placeholder="Hide Attributes: "
                                            length={
                                              attrOptions[resource]?.length
                                            }
                                            options={attrOptions[resource]}
                                          />
                                        )}
                                      </AccordionDetails>
                                    </Accordion>
                                  </div>
                                )
                              )}
                            </Box>
                          </AccordionDetails>
                        </StyledAccordion>
                      </Paper>
                    ))}
                  </Masonry>
                </Box>
              </Box>
              <Box display="flex" mt={3} mb={4} justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: grey[700],
                    color: "white",
                    textTransform: "none",
                    fontSize: "16px",
                  }}
                  onClick={() => {
                    onClose("", false);
                  }}
                >
                  Cancel
                </Button>
                <Box mr={1} />
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontSize: "16px",
                  }}
                >
                  Simpan
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoles;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as ConfigApi from "../../../api/configsApi";
import moment from "moment";

const EditConfig = ({ isEditOpen, onClose, dtConfig, }) => {
  const userSchema = yup.object().shape({
    // name: yup.string().required("required"),
  });

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    values.activeStart = moment(values.activeStart).toDate();
    values.activeEnd = moment(values.activeEnd).toDate();

    try {
      await ConfigApi.update(values);
      console.log("Data Berhasil Diperbarui:", values);
      toast.success("Data Berhasil Diperbarui"); // Tampilkan toast sukses
      // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
    } catch (error) {
      console.error("Data Gagal Diperbarui:", error);
      toast.error("Data Gagal Diperbarui: " + error.message); // Tampilkan pesan error spesifik
      // Tangani error atau tampilkan pesan error
    } finally {
      setSubmitting(false);
      resetForm();
      onClose("", false);
    }
  };
  return (
    <Dialog
      open={isEditOpen}
      fullWidth
      maxWidth="md"
      onClose={() => onClose("", false)}
    >
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
        Edit Data Config
        <IconButton
          sx={{
            color: "white",
            position: "absolute",
            right: "10px",
            top: "15px",
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
          onSubmit={handleFormSubmit}
          initialValues={dtConfig}
          validationSchema={userSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                padding={2}
                paddingBottom={3}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Config Name
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Nama...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    id="name-input"
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 2" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Tanggal Mulai
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    placeholder="Masukkan Keur ED...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      values.activeStart
                        ? format(new Date(values.activeStart), "yyyy-MM-dd")
                        : ""
                    }
                    name="activeStart"
                    error={!!touched.activeStart && !!errors.activeStart}
                    helperText={touched.activeStart && errors.activeStart}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 2" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Tanggal Akhir
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    placeholder="Masukkan Keur ED...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      values.activeEnd
                        ? format(new Date(values.activeEnd), "yyyy-MM-dd")
                        : ""
                    }
                    name="activeEnd"
                    error={!!touched.activeEnd && !!errors.activeEnd}
                    helperText={touched.activeEnd && errors.activeEnd}
                  />
                </FormControl>
      
              </Box>
              <Box display="flex" mt={2} ml={3}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: grey[700],
                    color: "white",
                  }}
                  onClick={() => {
                    onClose("", false);
                  }}
                >
                  Cancel
                </Button>
                <Box ml="auto" mr={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                    }}
                  >
                    Simpan
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditConfig;

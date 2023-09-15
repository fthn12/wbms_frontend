import React, { useState, useEffect } from "react";
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
  TextareaAutosize,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { format, addDays, addHours } from "date-fns";
import { Formik } from "formik";
import * as yup from "yup";
import { blue, grey } from "@mui/material/colors";
import * as ConfigApi from "../../../api/configApi";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactRRuleGenerator from "../../../components/ReactRRuleGenerator";

import {
  useFetchRequestsQuery,
} from "../../../slices/requestConfigsSlice";
/*
for createRequest
Set Start using date input
If repeatableTrue, activate Repeat and End input
Set Edited value. Example: manualEntry=true


*/

const CreateRequestConfig = ({ isRequestOpen, onClose, dtConfig }) => {
  const { data: requestList, refetch } = useFetchRequestsQuery();
  const [isCopied, setIsCopied] = useState(false);
  const [rrule, setRrule] = useState(
    "DTSTART:20190301T230000Z\nFREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1"
  );

  const handleChange = (newRRule) => {
    setRrule(newRRule);
    setIsCopied(false);
  };

  const handleCopy = () => {
    setIsCopied(true);
  };
  const userSchema = yup.object().shape({
    // name: yup.string().required("required"),
  });

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    values.start = moment(values.start).toDate();
    values.end = moment(values.end).toDate();

    try {
      await ConfigApi.create(values);
      // dispatch(createRequest(requestData));
      toast.success("Data Berhasil Dibuat");
      refetch()
      // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
    } catch (error) {
      console.error("Data Gagal Dibuat:", error);
      toast.error("Data Gagal Dibuat: " + error.message);
      // Tangani error atau tampilkan pesan error
    } finally {
      setSubmitting(false);
      resetForm();
      onClose("", false);
    }
  };
  useEffect(() => {
    if (isRequestOpen)
      setInitialValue({
        configId: dtConfig.id,
        name: dtConfig.name,
        start: null,
        end: null,
      });
      
  }, [isRequestOpen, dtConfig]);

  const [initialValues, setInitialValue] = useState({});
  return (
    <Dialog
      open={isRequestOpen}
      fullWidth
      maxWidth="md"
      onClose={() => onClose("", false)}>
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}>
        Request Use Config
        <IconButton
          sx={{
            color: "white",
            position: "absolute",
            right: "10px",
            top: "15px",
          }}
          onClick={() => {
            onClose("", false);
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={userSchema}>
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
                gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}>
                    Config Name
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Nama...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={initialValues.name}
                    name="name"
                    inputProps={{ readOnly: true }}
                    sx={{ backgroundColor: "whitesmoke" }}
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
                    }}>
                    Tanggal Mulai
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="datetime-local"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      if (
                        !values.end ||
                        new Date(e.target.value) <= new Date(values.end)
                      ) {
                        setFieldValue("status", "PENDING");
                      }
                    }}
                    value={
                      values.start
                        ? format(new Date(values.start), "yyyy-MM-dd'T'HH:mm")
                        : ""
                    }
                    name="start"
                    error={!!touched.start && !!errors.start}
                    helperText={touched.start && errors.start}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 2" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}>
                    Tanggal Akhir
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="datetime-local"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      values.end
                        ? format(new Date(values.end), "yyyy-MM-dd'T'HH:mm")
                        : ""
                    }
                    name="end"
                    error={!!touched.end && !!errors.end}
                    helperText={touched.end && errors.end}
                    // Nonaktifkan pilihan tanggal yang lebih dari 24 jam dari tanggal mulai
                    inputProps={{
                      max: format(
                        addDays(new Date(values.start), 1),
                        "yyyy-MM-dd'T'HH:mm"
                      ),
                      min: format(
                        addDays(new Date(values.start), 1),
                        "yyyy-MM-dd'T'HH:mm"
                      ),
                    }}
                  />
                </FormControl>
              </Box>
              {/* <div>
                <div className="app container">
                  <ReactRRuleGenerator
                    onChange={handleChange}
                    value={rrule}
                    config={{
                      hideStart: false,
                    }}
                  />
                </div>

                <hr className="mt-5 mb-5" />

                <div className="container">
                  <h5>
                    <strong>Example handling</strong>
                  </h5>

                  <div className="px-3 pt-3 border rounded">
                    <div className="form-group row d-flex align-items-sm-center">
                      <div className="col-sm-2 text-sm-right">
                        <span className="col-form-label">
                          <strong>RRule</strong>
                        </span>
                      </div>

                      <div className="col-sm-8">
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={3}
                          placeholder="Minimum 3 rows"
                          className={`form-control rrule ${
                            isCopied ? "rrule-copied" : "rrule-not-copied"
                          }`}
                          value={rrule}
                          readOnly
                        />
                      </div>

                      <div className="col-sm-2">
                        <CopyToClipboard text={rrule} onCopy={handleCopy}>
                          <button
                            aria-label="Copy generated RRule"
                            className={`btn ${
                              isCopied ? "btn-secondary" : "btn-primary"
                            } float-right`}>
                            {isCopied ? "Copied" : "Copy"}
                          </button>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mt-5 mb-5" />
              </div> */}
              <Box display="flex" mt={2} ml={3}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: grey[700],
                    color: "white",
                  }}
                  onClick={() => {
                    onClose("", false);
                  }}>
                  Cancel
                </Button>
                <Box ml="auto" mr={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                    }}>
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
export default CreateRequestConfig;

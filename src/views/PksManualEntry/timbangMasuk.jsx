import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  FormControl,
  Autocomplete,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../utils/useForm";
import * as TransactionAPI from "../../api/transactionApi";
import PageHeader from "../../components/PageHeader";
import ManualEntryGrid from "../../components/manualEntryGrid";
import { useConfig } from "../../common/hooks";
import TBS from "../PksManualEntry/manualentryTBS/timbangMasuk";
import OTHERS from "../PksManualEntry/manualentryothers/timbangMasuk";
import CpoPko from "../PksManualEntry/manualentryCpoPko/timbangMasuk";
import * as ProductAPI from "../../api/productsApi";
import * as TransportVehicleAPI from "../../api/transportvehicleApi";
import * as CompaniesAPI from "../../api/companiesApi";

const tType = 1;

const TimbangMasuk = () => {
  const [configs] = useConfig();
  const { id } = useParams();
  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [dtTransportVehicle, setDtTransportVehicle] = useState([]);
  const [dtCompany, setDtCompany] = useState([]);
  const [dtProduct, setDtProduct] = useState([]);

  useEffect(() => {
    ProductAPI.getAll().then((res) => {
      setDtProduct(res.data.product.records);
    });
    TransportVehicleAPI.getAll().then((res) => {
      setDtTransportVehicle(res.data.transportVehicle.records);
    });
    CompaniesAPI.getAll().then((res) => {
      setDtCompany(res.data.company.records);
    });
  }, []);

  return (
    <>
      <PageHeader
        title="Transaksi PKS"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={1.7}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <TextField
              variant="outlined"
              inputProps={{
                style: {
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                },
              }}
              size="large"
              label={
                <>
                  <Typography
                    sx={{
                      bgcolor: "white",
                      px: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "30px",
                      },
                    }}
                  >
                    STATUS PROSES
                  </Typography>
                </>
              }
              fullWidth
              multiline
              value={"Timbang Masuk"}
            />
          </Paper>
          <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ my: 1.3 }}
            >
              <InputLabel
                id="select-label"
                shrink
                sx={{ bgcolor: "white", px: 1 }}
              >
                Nomor Polisi
              </InputLabel>

              <Autocomplete
                id="select-label"
                options={dtTransportVehicle}
                getOptionLabel={(option) => option.plateNo}
                value={
                  dtTransportVehicle.find(
                    (item) => item.id === values.transportVehicleId
                  ) || null
                }
                onChange={(event, newValue) => {
                  setValues((prevValues) => ({
                    ...prevValues,
                    transportVehicleId: newValue ? newValue.id : "",
                    transportVehiclePlateNo: newValue ? newValue.plateNo : "",
                    transportVehicleSccModel: newValue ? newValue.sccModel : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="-- Pilih Kendaraan --"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ my: 1.3 }}
            >
              <InputLabel
                id="select-label"
                shrink
                sx={{ bgcolor: "white", px: 1 }}
              >
                Nama Vendor
              </InputLabel>
              <Autocomplete
                id="select-label"
                options={dtCompany}
                getOptionLabel={(option) => option.code}
                value={
                  dtCompany.find((item) => item.id === values.transporterId) ||
                  null
                }
                onChange={(event, newValue) => {
                  setValues((prevValues) => ({
                    ...prevValues,
                    transporterId: newValue ? newValue.id : "",
                    transporterCompanyName: newValue ? newValue.name : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="-- Pilih Vendor --"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ my: 1.3 }}
            >
              <Autocomplete
                id="select-label"
                options={dtProduct}
                getOptionLabel={(option) => option.name}
                value={selectedProduct}
                onChange={(event, newValue) => {
                  setSelectedProduct(newValue);
                  // Determine and set the selectedOption based on some condition.
                  if (newValue) {
                    const productName = newValue.name.toLowerCase();
                    if (
                      productName.includes("cpo") ||
                      productName.includes("pko")
                    ) {
                      setSelectedOption("CpoPko");
                    } else if (productName.includes("tbs")) {
                      setSelectedOption("Tbs");
                    } else {
                      setSelectedOption("Others");
                    }
                  } else {
                    setSelectedOption(""); // Reset the selectedOption if no product is selected.
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="-- Pilih Barang --"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={10.3}>
          {/* CPO & PKO */}

          {/* {selectedOption === "CpoPko" && <CpoPko />} */}

          {/* TBS */}

          {selectedOption === "Tbs" && <TBS />}

          {/* OTHERS */}

          {selectedOption === "Others" && <OTHERS />}
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 1 }}>
            <ManualEntryGrid tType={tType} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default TimbangMasuk;

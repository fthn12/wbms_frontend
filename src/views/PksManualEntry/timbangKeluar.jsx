import { useState, useRef, useEffect, useCallback } from "react";
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
  IconButton,
} from "@mui/material";
import useSWR from "swr";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../utils/useForm";
import * as TransactionAPI from "../../api/transactionApi";
import PageHeader from "../../components/PageHeader";
import ManualEntryGrid from "../../components/TransactionGrid";
import { useConfig } from "../../common/hooks";
import TimbangKeluarTBS from "../PksManualEntry/manualentryTBS/timbangKeluar";
import TimbangKeluarOthers from "../PksManualEntry/manualentryothers/timbangKeluar";
import CpoPko from "../PksManualEntry/manualentryCpoPko/timbangKeluar";
import * as ProductAPI from "../../api/productsApi";
import * as TransportVehicleAPI from "../../api/transportvehicleApi";
import * as CompaniesAPI from "../../api/companiesApi";

const tType = 1;

const TimbangKeluar = () => {
  const [configs] = useConfig();
  const { id } = useParams();
  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataById = await TransactionAPI.getById(id);
        if (dataById) {
          setValues({
            ...dataById.record,
          });
          const productName = dataById.record.productName.toLowerCase();

          if (productName.includes("tbs")) {
            setSelectedOption("Tbs");
          } else {
            setSelectedOption("Others");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [selectedCompany, setSelectedCompany] = useState(null);
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

  const [searchQuery, setSearchQuery] = useState("");

  const fetcher = () =>
    TransactionAPI.searchMany({
      where: {
        tType,
        progressStatus: { notIn: [4, 9, 14] },
      },
      orderBy: { bonTripNo: "desc" },
    }).then((res) => res.records);

  const { data: dtTransactions } = useSWR(
    searchQuery ? `transaction?name_like=${searchQuery}` : "transaction",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const gridRef = useRef();

  const updateGridData = useCallback((transaction) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(transaction);
    }
  }, []);

  useEffect(() => {
    if (dtTransactions) {
      const filteredData = dtTransactions.filter((transaction) => {
        const transactionsData = Object.values(transaction)
          .join(" ")
          .toLowerCase();
        return transactionsData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtTransactions, updateGridData]);

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
              value={"Timbang Keluar"}
            />
          </Paper>
        </Grid>
        <Grid item xs={10.3}>
          <Paper elevation={1} sx={{ p: 3, px: 5 }}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(15, minmax(0, 1fr))"
            >
              {" "}
              <FormControl sx={{ gridColumn: "span 3" }}>
                {/* <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
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
                    transportVehiclePlateNo: newValue
                      ? newValue.plateNo
                      : "",
                    transportVehicleSccModel: newValue
                      ? newValue.sccModel
                      : "",
                  }));
                }}
                freeSolo // Ini memungkinkan pengguna untuk memasukkan teks yang tidak ada dalam opsi.
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="-- Pilih Kendaraan --"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </FormControl> */}
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // placeholder="Masukkan Jumlah Janjang"
                  sx={{
                    mb: 2,
                  }}
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1.5,
                        }}
                      >
                        Nomor Polisi
                      </Typography>
                    </>
                  }
                  name="transportVehiclePlateNo"
                  value={values.transportVehiclePlateNo}
                  onChange={handleChange}
                />
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ my: 2 }}
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
                    getOptionLabel={(option) => option.name}
                    value={
                      dtCompany.find(
                        (item) => item.id === values.transporterId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setValues((prevValues) => ({
                        ...prevValues,
                        transporterId: newValue ? newValue.id : "",
                        transporterCompanyName: newValue ? newValue.name : "",
                      }));
                      setSelectedCompany({
                        id: newValue ? newValue.id : "",
                        name: newValue ? newValue.name : "",
                      });
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
              </FormControl>
              {/* CPO & PKO */}
              {/* {selectedOption === "CpoPko" && <CpoPko />} */}
              {/* TBS */}
              {selectedOption === "Tbs" && (
                <TimbangKeluarTBS
                  selectedCompany={selectedCompany}
                  PlateNo={values.transportVehiclePlateNo}
                />
              )}
              {/* OTHERS */}
              {selectedOption === "Others" && (
                <TimbangKeluarOthers
                  selectedCompany={selectedCompany}
                  PlateNo={values.transportVehiclePlateNo}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex">
            <Box borderRadius="5px" ml="auto" border="solid grey 1px">
              <InputBase
                sx={{ ml: 2, flex: 2, fontSize: "13px" }}
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <IconButton
                type="button"
                sx={{ p: 1 }}
                onClick={() => {
                  const filteredData = dtTransactions.filter((transaction) =>
                    transaction.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  );
                  gridRef.current.api.setRowData(filteredData);
                }}
              >
                <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
              </IconButton>
            </Box>
          </Box>
          <Paper sx={{ p: 2, mt: 1 }}>
            <ManualEntryGrid
              tType={tType}
              gridRef={gridRef}
              fetcher={fetcher}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default TimbangKeluar;

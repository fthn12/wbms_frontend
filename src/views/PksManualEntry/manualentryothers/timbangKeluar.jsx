import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  InputAdornment,
  TextField,
  FormControl,
  Typography,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "../../../utils/useForm";
import WeightWB from "../../../components/weightWB";
import BonTripTBS from "../../../components/BonTripTBS";
import * as TransactionAPI from "../../../api/transactionApi";
import * as ProductAPI from "../../../api/productsApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import * as DriverAPI from "../../../api/driverApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CustomerAPI from "../../../api/customerApi";

import { useWeighbridge, useConfig } from "../../../common/hooks";

const tType = 1;

const PksManualOthersTimbangKeluar = ({ selectedCompany, PlateNo }) => {
  const [configs] = useConfig();
  const [weighbridge] = useWeighbridge();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { id } = useParams();

  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });
  const [originWeightNetto, setOriginWeightNetto] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const {
      id,
      bonTripNo,
      productId,
      productName,
      transporterId,
      transporterCompanyName,
      driverId,
      driverName,
      transportVehicleId,
      transportVehiclePlateNo,
      transportVehicleSccModel,
      customerName,
      customerId,
      originWeighInKg,
      originWeighOutKg,
      deliveryOrderNo,
      progressStatus,
      originWeighInTimestamp,
      originWeighOutTimestamp,
    } = values;

    let updatedProgressStatus = progressStatus;
    let updatedOriginWeighOutTimestamp = originWeighOutTimestamp;
    let updatedOriginWeighOutKg = originWeighOutKg;
    let updatedtransporterId = transporterId;
    let updatedtransporterName = transporterCompanyName;
    let updatedTransportName = transportVehiclePlateNo;

    if (progressStatus === 1) {
      updatedProgressStatus = 4;
      updatedOriginWeighOutKg = weighbridge.getWeight();
      updatedOriginWeighOutTimestamp = moment().toDate();
      updatedtransporterId = selectedCompany ? selectedCompany.id : "";
      updatedtransporterName = selectedCompany ? selectedCompany.name : "";
      updatedTransportName = PlateNo;
    }

    const updatedTransaction = {
      id,
      bonTripNo,
      productId,
      productName,
      transporterId: updatedtransporterId,
      transporterCompanyName: updatedtransporterName,
      driverId,
      driverName,
      transportVehicleId,
      transportVehiclePlateNo: updatedTransportName,
      transportVehicleSccModel,
      customerName,
      customerId,
      originWeighInKg,
      originWeighOutKg: updatedOriginWeighOutKg,
      deliveryOrderNo,
      progressStatus: updatedProgressStatus,
      originWeighInTimestamp,
      originWeighOutTimestamp: updatedOriginWeighOutTimestamp,
    };

    try {
      const results = await TransactionAPI.update({ ...updatedTransaction });

      if (!results?.status) {
        toast.error(`Error: ${results?.message}.`);
        return;
      }

      toast.success(`Transaksi Timbang Keluar Berhasil disimpan.`);
      setValues({ ...updatedTransaction });
    } catch (error) {
      toast.error(`Error: ${error.message}.`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataById = await TransactionAPI.getById(id);
        console.log(dataById);
        if (dataById) {
          setValues({
            ...dataById.record,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // const [canSubmit, setCanSubmit] = useState(false);

  // useEffect(() => {
  //   let cSubmit = false;

  //   if (values.progressStatus === 20) {
  //     if (values.originWeighInKg >= Config.ENV.WBMS_WB_MIN_WEIGHT) {
  //       cSubmit = true;
  //     }
  //   } else if (values.progressStatus === 4) {
  //     if (values.originWeighOutKg >= Config.ENV.WBMS_WB_MIN_WEIGHT)
  //       cSubmit = false;
  //   }

  //   setCanSubmit(cSubmit);
  // }, [values]);

  useEffect(() => {
    if (
      values.originWeighInKg < configs.ENV.WBMS_WB_MIN_WEIGHT ||
      weighbridge.getWeight() < configs.ENV.WBMS_WB_MIN_WEIGHT
    ) {
      setOriginWeightNetto(0);
    } else {
      let total =
        Math.abs(values.originWeighInKg - weighbridge.getWeight()) -
        values.potonganWajib -
        values.potonganLain;
      setOriginWeightNetto(total);
    }
  }, [values, weighbridge]);

  const validateForm = () => {
    // Implementasikan aturan validasi Anda di sini
    // Kembalikan true jika semua kolom yang dibutuhkan terisi, jika tidak, kembalikan false
    return (
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.transportVehicleId &&
      values.driverId &&
      values.transporterId &&
      values.productId &&
      values.customerId
    );
  };

  const handleClose = () => {
    // setProgressStatus("-");
    // setWbPksTransaction(null);

    navigate("/pks-transaction");
  };
  const [dtCompany, setDtCompany] = useState([]);
  const [dtProduct, setDtProduct] = useState([]);
  const [dtDriver, setDtDriver] = useState([]);
  const [dtTransportVehicle, setDtTransportVehicle] = useState([]);
  const [dtCustomer, setDtCustomer] = useState([]);

  useEffect(() => {
    CompaniesAPI.getAll().then((res) => {
      setDtCompany(res.data.company.records);
    });

    ProductAPI.getAll().then((res) => {
      setDtProduct(res.data.product.records);
    });
    DriverAPI.getAll().then((res) => {
      setDtDriver(res.data.driver.records);
    });

    TransportVehicleAPI.getAll().then((res) => {
      setDtTransportVehicle(res.data.transportVehicle.records);
    });

    CustomerAPI.getAll().then((res) => {
      setDtCustomer(res.data.customer.records);
    });
  }, []);

  return (
    <>
      <FormControl sx={{ gridColumn: "span 4" }}>
        <TextField
          variant="outlined" // Variasi TextField dengan style "outlined"
          size="small" // Ukuran TextField kecil
          fullWidth // TextField akan memiliki lebar penuh
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            mb: 2, // Margin bawah dengan jarak 2 unit
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px", // Set radius border untuk bagian input
            },
          }}
          label={
            <>
              <Typography
                sx={{
                  bgcolor: "white", // Background color teks label
                  px: 1, // Padding horizontal teks label 1 unit
                }}
              >
                Nomor BON Trip
              </Typography>
            </>
          }
          name="bonTripNo" // Nama properti/form field untuk data Nomor BON Trip
          value={values?.bonTripNo || ""} // Nilai data Nomor BON Trip yang diambil dari state 'values'
        />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Masukkan No. DO/NPB"
          sx={{
            my: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          label={
            <>
              <Typography
                sx={{
                  bgcolor: "white",
                  px: 1.5,
                }}
              >
                No. DO/NPB
              </Typography>
            </>
          }
          name="deliveryOrderNo"
          value={values.deliveryOrderNo}
          onChange={handleChange}
        />
        {/* <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
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
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="-- Pilih Kendaraan --"
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              />
            )}
          />
        </FormControl> */}
        <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Nama Supir
          </InputLabel>

          <Autocomplete
            id="select-label"
            options={dtDriver}
            getOptionLabel={(option) => option.name}
            value={dtDriver.find((item) => item.id === values.driverId) || null}
            onChange={(event, newValue) => {
              setValues((prevValues) => ({
                ...prevValues,
                driverId: newValue ? newValue.id : "",
                driverName: newValue ? newValue.name : "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                placeholder="-- Pilih Supir --"
                variant="outlined"
                size="small"
              />
            )}
          />
        </FormControl>
        {/* <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Nama Vendor
          </InputLabel>
          <Autocomplete
            id="select-label"
            options={dtCompany}
            getOptionLabel={(option) => option.name}
            value={
              dtCompany.find((item) => item.id === values.transporterId) || null
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                placeholder="-- Pilih Vendor --"
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
          sx={{
            my: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputLabelProps={{
            shrink: true,
            readOnly: true,
          }}
          label={
            <>
              <Typography
                sx={{
                  bgcolor: "white",
                  px: 1,
                }}
              >
                Sertifikasi Tipe Truk
              </Typography>
            </>
          }
          name="transportVehicleSccModel"
          value={values.transportVehicleSccModel}
          onChange={handleChange}
        />

        <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Customer
          </InputLabel>

          <Autocomplete
            id="select-label"
            options={dtCustomer}
            getOptionLabel={(option) => option.name}
            value={
              dtCustomer.find((item) => item.id === values.customerId) || null
            }
            onChange={(event, newValue) => {
              setValues((prevValues) => ({
                ...prevValues,
                customerId: newValue ? newValue.id : "",
                customerName: newValue ? newValue.name : "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                placeholder="-- Pilih Customer --"
                variant="outlined"
                size="small"
              />
            )}
          />
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Jenis Barang
          </InputLabel>

          <Autocomplete
            id="select-label"
            options={dtProduct}
            getOptionLabel={(option) => option.name}
            value={
              dtProduct.find((item) => item.id === values.productId) || null
            }
            onChange={(event, newValue) => {
              setValues((prevValues) => ({
                ...prevValues,
                productId: newValue ? newValue.id : "",
                productName: newValue ? newValue.name : "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                placeholder="-- Pilih Barang --"
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            )}
          />
        </FormControl>
        <TextField
          variant="outlined"
          size="small"
          type="number"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          // placeholder="Masukkan Jumlah Janjang"
          sx={{
            my: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          label={
            <>
              <Typography
                sx={{
                  bgcolor: "white",
                  px: 1.5,
                }}
              >
                SPTBS
              </Typography>
            </>
          }
          name="sptbs"
          value={values.sptbs}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl sx={{ gridColumn: "span 4" }}>
        <WeightWB />

        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          label={
            <Typography
              sx={{
                bgcolor: "white",
                px: 1,
              }}
            >
              Weight IN
            </Typography>
          }
          name="originWeighInKg"
          value={values.originWeighInKg}
        />
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            my: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          label={
            <Typography
              sx={{
                bgcolor: "white",
                px: 1,
              }}
            >
              Weight OUT
            </Typography>
          }
          name="originWeighOutKg"
          value={weighbridge.getWeight()}
        />

        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            my: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          label={
            <Typography
              sx={{
                bgcolor: "white",
                px: 1,
              }}
            >
              Potongan Wajib Vendor
            </Typography>
          }
          name="potonganWajib"
          value={values.potonganWajib || 0}
        />
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            my: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          label={
            <Typography
              sx={{
                bgcolor: "white",
                px: 1,
              }}
            >
              Potongan Lainnya
            </Typography>
          }
          name="potonganLain"
          value={values.potonganLain || 0}
        />
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            my: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          label={
            <Typography
              sx={{
                bgcolor: "white",
                px: 1,
              }}
            >
              TOTAL
            </Typography>
          }
          name="WeightNetto"
          value={originWeightNetto}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          // disabled={
          //   !validateForm() ||
          //   values.progressStatus === 4 ||
          //   !weighbridge.isStable() ||
          //   weighbridge.getWeight() < configs.ENV.WBMS_WB_MIN_WEIGHT
          //     ? true
          //     : false
          // }
        >
          Simpan
        </Button>
        <BonTripTBS
          dtTrans={{ ...values }}
          isDisable={values.progressStatus !== 4}
        />
        <Button
          variant="contained"
          sx={{ my: 1 }}
          fullWidth
          onClick={handleClose}
        >
          Tutup
        </Button>
      </FormControl>
    </>
  );
};

export default PksManualOthersTimbangKeluar;

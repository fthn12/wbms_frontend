import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
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
import TimbangKeluarTBS from "../PksManualEntry/manualentryTBS/timbangKeluar";
import TimbangKeluarOthers from "../PksManualEntry/manualentryothers/timbangKeluar";
import CpoPko from "../PksManualEntry/manualentryCpoPko/timbangKeluar";
import { CPopover } from "@coreui/react";

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

  const [selectedOption, setSelectedOption] = useState("");

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
              {/* CPO & PKO */}

              {/* {selectedOption === "CpoPko" && <CpoPko />} */}

              {/* TBS */}

              {selectedOption === "Tbs" && <TimbangKeluarTBS />}

              {/* OTHERS */}

              {selectedOption === "Others" && <TimbangKeluarOthers />}
            </Box>
          </Paper>
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

export default TimbangKeluar;

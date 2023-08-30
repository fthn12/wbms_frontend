import { createSlice } from "@reduxjs/toolkit";
import { ACCEPT_NAME, REJECT_NAME, BLOCK_NAME, UNDO } from "../constants";

const initialState = {
  configs: localStorage.getItem("configs")
    ? JSON.parse(localStorage.getItem("configs"))
    : null,
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  sidebar: localStorage.getItem("sidebar")
    ? JSON.parse(localStorage.getItem("sidebar"))
    : { show: true, unfoldable: false },
  wb: localStorage.getItem("wb")
    ? JSON.parse(localStorage.getItem("wb"))
    : {
        weight: -1,
        lastChange: 0,
        isStable: false,
        onProcessing: false,
        canStartScalling: false,
      },
  wbTransaction: localStorage.getItem("wbTransaction")
    ? JSON.parse(localStorage.getItem("wbTransaction"))
    : null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setConfigs: (state, action) => {
      state.configs = { ...state.configs, ...action.payload };
      localStorage.setItem("configs", JSON.stringify(state.configs));
    },
    clearConfigs: (state, action) => {
      state.configs = null;
    },
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearCredentials: (state, action) => {
      state.userInfo = null;
    },
    setSidebar: (state, action) => {
      state.sidebar = { ...state.sidebar, ...action.payload };
      localStorage.setItem("sidebar", JSON.stringify(state.sidebar));
    },
    clearSidebar: (state, action) => {
      state.sidebar = null;
    },
    setWb: (state, action) => {
      state.wb = { ...state.wb, ...action.payload };
      localStorage.setItem("wb", JSON.stringify(state.wb));
    },
    clearWb: (state, action) => {
      state.wb = {
        weight: -1,
        lastChange: 0,
        isStable: false,
        onProcessing: false,
        canStartScalling: false,
      };
      localStorage.removeItem("wb");
    },
    setWbTransaction: (state, action) => {
      state.wbTransaction = { ...state.wbTransaction, ...action.payload };
      localStorage.setItem(
        "wbTransaction",
        JSON.stringify(state.wbTransaction)
      );
    },
    clearWbTransaction: (state, action) => {
      state.wbTransaction = null;
      localStorage.removeItem("wbTransaction");
    },
    selectionMode: (state, action) => {
      state.wbTransaction = null;
      localStorage.removeItem("wbTransaction");
    },
  },
});

export const {
  setConfigs,
  clearConfigs,
  setCredentials,
  clearCredentials,
  setSidebar,
  clearSidebar,
  setWb,
  clearWb,
  setWbTransaction,
  clearWbTransaction,
} = appSlice.actions;
export default appSlice.reducer;

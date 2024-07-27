import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "./components/Login";
import Home from "./components/Home";
import { ToastContainer } from "@react-spectrum/toast";
import { defaultTheme, Provider } from "@adobe/react-spectrum";
import RepaymentSchedule from "./components/RepaymentSchedule";
import PrintContract from "./components/PrintContract";
import Receipt from "./components/Receipt";

const App = () => {
  return (
    <Provider theme={defaultTheme}>
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/contract/:contractNumber/graficrambursare"
              element={<RepaymentSchedule />}
            />
            <Route
              path="/contract/:contractNumber/printcontract"
              element={<PrintContract />}
            />
            <Route
              path="/payments/:payment_id/chitanta"
              element={<Receipt />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;

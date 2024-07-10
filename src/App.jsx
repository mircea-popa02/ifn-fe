import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "./components/Login";
import Home from "./components/Home";
import { defaultTheme, Provider } from "@adobe/react-spectrum";
import ContractsList from "./components/ContractsList";
import PaymentsList from "./components/PaymentsList";
import PersonsList from "./components/PersonsList";
import MembersList from "./components/MembersList";

const App = () => {
  return (
    <Provider theme={defaultTheme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/persons" element={<PersonsList />} />
            <Route path="/payments" element={<PaymentsList />} />
            <Route path="/contracts" element={<ContractsList />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;

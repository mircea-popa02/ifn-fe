import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Receipt.css";

const Receipt = () => {
  const { receiptValue } = useParams();
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:5000/payments/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch payments");
      }
      const data = await response.json();
      setPayments(data);

      console.log("chitanta");
      console.log(receiptValue);

      const foundPayment = data.find(
        (payment) => payment.value == receiptValue
      );

      setSelectedPayment(foundPayment);

      console.log("selectedPayment");
      console.log(foundPayment);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token]);

  if (!selectedPayment) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <>
        <div className="split-header">
          <div className="receipt-container">
            <p>Asociatia CAR „SUD-EST” IFN</p>
            <p>Bucureşti, str.Şipcă, nr.20, sector 2, CUI 30501844</p>
            <p>
              Înregistrată la Judecătoria sector 2 Bucureşti nr.89/29.06.2012
            </p>
            <p>Banca Transilvania</p>
            <p>Cont RO42BTRLRONCRT0029936302</p>
            <p>Tel: 0799 958 138 / 0723.598.524 / 0723.598.542</p>
            <p>www.creditsudest.ro</p>
          </div>
          <div>
            <p>Seria: CAR</p>
            <p>CHITANTA Nr.: {selectedPayment.value}</p>
            <p>din data de: {selectedPayment.date}</p>
          </div>
        </div>
        <div className="receipt-middle">
          <p>Am primit de la {selectedPayment.member_name}.</p>
          <p>Adresa </p>
          <p>Suma de {selectedPayment.value} lei.</p>
          <p>
            Reprezentand Rambursare partiala imprumut conform contract nr.{" "}
            {selectedPayment.value} / {selectedPayment.date}.
          </p>
        </div>
      </>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <hr></hr>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <>
        <div className="split-header">
          <div className="receipt-container">
            <p>Asociatia CAR „SUD-EST” IFN</p>
            <p>Bucureşti, str.Şipcă, nr.20, sector 2, CUI 30501844</p>
            <p>
              Înregistrată la Judecătoria sector 2 Bucureşti nr.89/29.06.2012
            </p>
            <p>Banca Transilvania</p>
            <p>Cont RO42BTRLRONCRT0029936302</p>
            <p>Tel: 0799 958 138 / 0723.598.524 / 0723.598.542</p>
            <p>www.creditsudest.ro</p>
          </div>
          <div>
            <p>Seria: CAR</p>
            <p>CHITANTA Nr.: {selectedPayment.value}</p>
            <p>din data de: {selectedPayment.date}</p>
          </div>
        </div>
        <div className="receipt-middle">
          <p>Am primit de la {selectedPayment.member_name}.</p>
          <p>Adresa </p>
          <p>Suma de {selectedPayment.value} lei.</p>
          <p>
            Reprezentand Rambursare partiala imprumut conform contract nr.{" "}
            {selectedPayment.value} / {selectedPayment.date}.
          </p>
        </div>
      </>
    </>
  );
};

export default Receipt;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Receipt.css";

const API_URL = process.env.REACT_APP_API_URL;

const Receipt = () => {
  const { payment_id } = useParams();
  const { token } = useAuth();
  const [payment, setPayment] = useState([]);
  const [member, setMember] = useState([]);
  const [contract, setContract] = useState([]);

  const fetchPayment = async () => {
    try {
      const response = await fetch(`${API_URL}/payments/search/${payment_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch payments");
      }

      const data = await response.json();
      console.log(data);
      setPayment(data);
      fetchClient(data.member_id.$oid);
      fetchContract(data.contract_id.$oid);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchClient = async (member_id) => {
    try {
      const response = await fetch(`${API_URL}/client/id/${member_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch member");
      }

      const data = await response.json();
      console.log(data);
      setMember(data);
    } catch (error) {
      console.error("Error fetching member:", error);
    }
  }

  const fetchContract = async (contract_id) => {
    try {
      const response = await fetch(`${API_URL}/contract/id/${contract_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch contract");
      }

      const data = await response.json();
      console.log(data);
      setContract(data);

    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  }

  useEffect(() => {
    console.log(payment_id);
    if (token) {
      fetchPayment()
    }
  }, [token]);

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
            <p>CHITANTA Nr.: {payment.payment_id}</p>
            <p>din data de: {new Date(payment?.date?.$date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="receipt-middle">
          <p>Am primit de la {payment.member_name}.</p>
          <p>Adresa {member.address}</p>
          <p>Suma de {payment.value} lei.</p>
          <p>
            Reprezentand Rambursare partiala imprumut conform contract nr.{" "}
            {contract.contract_number} / {contract.date}
          </p>
        </div>
      </>
      <hr></hr>
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
            <p>CHITANTA Nr.: {payment.value}</p>
            <p>din data de: {new Date(payment?.date?.$date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="receipt-middle">
          <p>Am primit de la {payment.member_name}.</p>
          <p>Adresa {member.address}</p>
          <p>Suma de {payment.value} lei.</p>
          <p>
            Reprezentand Rambursare partiala imprumut conform contract nr.{" "}
            {contract.contract_number} / {contract.date}
          </p>
        </div>
      </>
    </>
  );
};

export default Receipt;

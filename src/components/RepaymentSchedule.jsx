import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./RepaymentSchedule.css";

const RepaymentSchedule = () => {
  const { contractNumber } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchContracts = async () => {
    try {
      const response = await fetch("http://localhost:5000/contract/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch contracts");
      }
      const data = await response.json();

      console.log("grafic rambursare");
      console.log(data);

      const foundContract = data.find(
        (contract) => contract.contract_number === contractNumber
      );
      if (!foundContract) {
        throw new Error("Contract not found");
      }
      setContract(foundContract);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchContracts();
    }
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!contract) return <p>Contract not found</p>;

  return (
    <div className="repaymentschedule-container">
      <p>Asociatia CAR „SUD-EST” IFN</p>
      <p>Bucureşti, str.Şipcă, nr.20, sector 2, CUI 30501844</p>
      <p>Înregistrată la Judecătoria sector 2 Bucureşti nr.89/29.06.2012</p>
      <p>Banca Transilvania</p>
      <p>Cont RO42BTRLRONCRT0029936302</p>
      <p>Tel: 0799 958 138 / 0723.598.524 / 0723.598.542</p>
      <p>www.creditsudest.ro</p>
      <p>
        <strong>Număr contract:</strong> {contract.contract_number}
      </p>
      <p>
        <strong>Data:</strong> {contract.date}
      </p>
      <p>
        <strong>Model contract:</strong> {contract.contract_model}
      </p>
      <p>
        <strong>Agent:</strong> {contract.agent}
      </p>
      <p>
        <strong>Valoare:</strong> {contract.value}
      </p>
      <p>
        <strong>Luni:</strong> {contract.months}
      </p>
      <p>
        <strong>Dobânda remunerativă:</strong> {contract.remunerative_interest}
      </p>
      <p>
        <strong>EAR:</strong> {contract.ear}
      </p>
      <p>
        <strong>Penalitate zilnică:</strong> {contract.daily_penalty}
      </p>
      <p>
        <strong>Data scadentă:</strong> {contract.due_day}
      </p>
      <p>
        <strong>Statut:</strong> {contract.status}
      </p>
      <p>
        <strong>Execuție:</strong> {contract.execution}
      </p>
      <p>
        <strong>Data execuției:</strong> {contract.execution_date}
      </p>
      <p>
        <strong>Datori:</strong> {contract.debtors.join(", ")}
      </p>
      <button
        className="repaymentschedule-print-button"
        onClick={() => window.print()}
      >
        Print
      </button>
    </div>
  );
};

export default RepaymentSchedule;

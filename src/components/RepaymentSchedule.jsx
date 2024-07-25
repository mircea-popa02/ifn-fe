import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./RepaymentSchedule.css";

import { TableView, View, TableHeader, Column, TableBody, Row, Cell } from "@adobe/react-spectrum";

const RepaymentSchedule = () => {
  const { contractNumber } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const createDatesArray = () => {
    // creates an array of contract.months dates.
    // for example contract.date is 2021-11-04 (YYYY-MM-DD) and contract.months is 3
    // the result will be ["2021-12-15", "2022-01-15", "2022-02-15"]
    // DD will always be contract.due_day
    const dates = [];
    console.log(contract);
    const date = new Date(contract.date);
    for (let i = 0; i < contract.months; i++) {
      date.setMonth(date.getMonth() + 1);
      dates.push(
        `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${contract.due_day}`
      );
    }
    return dates;
  }

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
      createDatesArray();
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



  const calculateSchedule = () => {
    const schedule = [];
    let remainingBalance = contract.value;
    for (let i = 0; i < contract.months; i++) {
      const interest = (contract.remunerative_interest / 100 / 12) * remainingBalance;
      const total = contract.rate + interest;
      remainingBalance -= contract.rate;

      const dueDate = new Date(contract.date);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      const formattedDueDate = `${dueDate.getDate().toString().padStart(2, '0')}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getFullYear()}`;

      schedule.push({
        installmentNumber: i + 1,
        dueDate: formattedDueDate,
        loanInstallment: contract.rate.toFixed(2),
        interest: interest.toFixed(2),
        total: total.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      });
    }
    return schedule;
  };

  const schedule = calculateSchedule();

  return (
    <>
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

      <View className="repaymentschedule-table-container">
        <TableView aria-label="Example table with static contents">
          <TableHeader>
            <Column isRowHeader>Nr. Crt</Column>
            <Column isRowHeader>Data scadenta</Column>
            <Column isRowHeader>Rata imprumut</Column>
            <Column isRowHeader>Dobânda remuneratorie</Column>
            <Column isRowHeader>Total</Column>
            <Column isRowHeader>Sold împrumut</Column>
          </TableHeader>
          <TableBody>
            <Row key={0}>
              <Cell>0</Cell>
              <Cell>{contract.date}</Cell>
              <Cell>0.00</Cell>
              <Cell>0.00</Cell>
              <Cell>0.00</Cell>
              <Cell>{contract.value}</Cell>
            </Row>
            {schedule.map((installment) => (
              <Row key={installment.installmentNumber}>
                <Cell>{installment.installmentNumber}</Cell>
                <Cell>{installment.dueDate}</Cell>
                <Cell>{installment.loanInstallment}</Cell>
                <Cell>{installment.interest}</Cell>
                <Cell>{installment.total}</Cell>
                <Cell>{installment.remainingBalance}</Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
      </View>
    </>
  );
};

export default RepaymentSchedule;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./RepaymentSchedule.css";
import { TableView, View, TableHeader, Column, TableBody, Row, Cell, Heading, TagGroup, Item } from "@adobe/react-spectrum";

const API_URL = process.env.REACT_APP_API_URL;

const RepaymentSchedule = () => {
  const { contractNumber } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interestAndRate, setInterestAndRate] = useState([]);
  const { token } = useAuth();
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (token) {
      fetchContracts();
    }
  }, [token]);

  const createDatesArray = (contract) => {
    // creates an array of contract.months dates.
    // for example contract.date is 2021-11-04 (YYYY-MM-DD) and contract.months is 3
    // the result will be ["2021-12-15", "2022-01-15", "2022-02-15"]
    // DD will always be contract.due_day
    const dates = [];
    const dueDay = parseInt(contract.due_day);
    const date = new Date(contract.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    for (let i = 0; i < contract.months; i++) {
      const newDate = new Date(year, month + i + 1, dueDay + 1);
      dates.push(newDate.toISOString().split("T")[0]);
    }
    console.log(dates);
    return dates;
  }

  const computeInterestAndRate = (contract) => {
    const monthlyRate = contract.remunerative_interest / 12 / 100;
    // first interest = contract.value * monthlyRate, first rate = contract.rate - first interest
    // second interest = (contract.value - (contract.rate - first interest) * monthlyRate, second rate = contract.rate - second interest
    // this must be done for contract.months times and an array of objects must be returned

    const interestRate = [];
    let value = contract.value;
    for (let i = 0; i < contract.months; i++) {
      const interest = value * monthlyRate;
      const rate = contract.rate - interest;
      value -= rate;
      interestRate.push({ interest, rate, value });
      
    }

    // the last tuple will have value 0 and rate will be equal to the last value and interest will be contract.rate - last value
    interestRate[contract.months - 1].rate = interestRate[contract.months - 2].value;
    interestRate[contract.months - 1].interest = contract.rate - interestRate[contract.months - 1].rate
    interestRate[contract.months - 1].value = 0;

    console.log(interestRate);
    return interestRate;
  }


  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_URL}/contract/`, {
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
      setContract(foundContract)
      setDates(createDatesArray(foundContract))
      setInterestAndRate(computeInterestAndRate(foundContract))
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError(error.message)
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!contract) return <p>Contract not found</p>;

  return (
    <div className="wrapper">
      <Heading>
        Grafic de rambursare a creditului nr. {contract.contract_number}
      </Heading>
      <View UNSAFE_className="container">
        <p>Asociatia CAR „SUD-EST” IFN</p>
        <p>Bucureşti, str. Şipcă, nr.20, sector 2, CUI 30501844</p>
        <p>Înregistrată la Judecătoria sector 2 Bucureşti nr.89/29.06.2012</p>
        <p>Banca Transilvania</p>
        <p>Cont RO42BTRLRONCRT0029936302</p>
        <p>Tel: 0799 958 138 / 0723.598.524 / 0723.598.542</p>
        <p>www.creditsudest.ro</p>
        <TagGroup aria-label="Contract Information">
          <Item UNSAFE_className="chip">
            <strong>Număr contract: </strong> {contract.contract_number}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Din data: </strong> {contract.date}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Model contract: </strong> {contract.contract_model}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Agent: </strong> {contract.agent}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Valoare imprumut: </strong> {contract.value.toFixed(2)} lei
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Numarul de rate: </strong> {contract.months}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Dobânda remunerativă: </strong> {contract.remunerative_interest}%
          </Item>
          <Item UNSAFE_className="chip">
            <strong>DAE: </strong> {contract.ear}%
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Penalitate zilnică: </strong> {contract.daily_penalty}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Data scadentă: </strong> maxim {contract.due_day} ale lunii
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Statut: </strong> {contract.status}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Execuție: </strong> {contract.execution}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Data execuției: </strong> {contract.execution_date}
          </Item>
          <Item UNSAFE_className="chip">
            <strong>Datori: </strong> {contract.debtors.join(", ")}
          </Item>
        </TagGroup>
      </View>

      <View UNSAFE_className="table">
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
              <Cell>{contract.value.toFixed(2)}</Cell>
            </Row>
            {dates.map((date, index) => (
              <Row key={index + 1}>
                <Cell>{index + 1}</Cell>
                <Cell>{date}</Cell>
                <Cell>{interestAndRate[index].rate.toFixed(2)}</Cell>
                <Cell>{interestAndRate[index].interest.toFixed(2)}</Cell>
                <Cell>{contract.rate.toFixed(2)}</Cell>
                <Cell>{interestAndRate[index].value.toFixed(2)}</Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
      </View>
    </div>
  );
};

export default RepaymentSchedule;

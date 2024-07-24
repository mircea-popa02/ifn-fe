import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  TableHeader,
  TableView,
  Row,
  ActionMenu,
  Cell,
  Column,
  TableBody,
  Item,
  Header,
  Dialog,
  DialogTrigger,
  Button,
  Heading,
  Content
} from "@adobe/react-spectrum";
import PaymentForm from "./PaymentForm";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { token } = useAuth();

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
      console.log(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token]);

  return (
    <div>
      <Header UNSAFE_className="home-header">
        <h1>Plati</h1>
        <DialogTrigger>
          <Button variant="accent">Adauga</Button>
          {(close) => (
            <Dialog>
              <Heading>Adauga plata</Heading>
              <Content>
                <PaymentForm close={close} onPaymentAdded={fetchPayments} />
              </Content>
            </Dialog>
          )}
        </DialogTrigger>
      </Header>
      <TableView aria-label="Payments table">
        <TableHeader>
          <Column>Id</Column>
          <Column>Nume</Column>
          <Column>Valoare</Column>
          <Column>Data plata</Column>
          <Column>Actiuni</Column>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <Row key={payment._id.$oid}>
              <Cell>{payment._id.$oid}</Cell>
              <Cell>{payment.member_name}</Cell>
              <Cell>{payment.value}</Cell>
              <Cell>{payment.date}</Cell>
              <Cell>
                <ActionMenu
                  onAction={(key) => {
                    setSelectedPayment(payment);
                    if (key === "modifica") setDialog("modifica");
                    if (key === "sterge") setDialog("sterge");
                    if (key === "chitanta") {
                      const url = `/payments/${payment.value}/chitanta`;
                      window.open(url, "_blank");
                    }
                  }}
                >
                  <Item key="modifica">Modifica</Item>
                  <Item key="sterge">Sterge</Item>
                  <Item key="chitanta">Vizualizeaza chitanta</Item>
                </ActionMenu>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </div>
  );
};

export default PaymentsList;

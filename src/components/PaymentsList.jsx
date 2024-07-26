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
  Content,
  Divider,
  DialogContainer,
  ButtonGroup,
} from "@adobe/react-spectrum";
import PaymentForm from "./PaymentForm";
import { ToastQueue } from "@react-spectrum/toast";
import Pagination from "./Pagination"; // Import the custom Pagination component

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const { token } = useAuth();

  const fetchPayments = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `http://localhost:5000/payments/?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch payments");
      }
      const data = await response.json();

      // Convert MongoDB date objects to readable strings
      const formattedPayments = data.payments.map((payment) => ({
        ...payment,
        date: new Date(payment.date.$date).toLocaleDateString(), // Convert date to string
      }));

      setPayments(formattedPayments);
      setCurrentPage(data.page);
      setTotalPages(Math.ceil(data.total_payments / limit));
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleDelete = async (payment_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/payments/${payment_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchPayments(currentPage, limit);
        ToastQueue.positive("Plata a fost ștearsă cu succes!");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete payment:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPayments(currentPage, limit);
    }
  }, [token, currentPage, limit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
                <PaymentForm
                  close={close}
                  onPaymentAdded={() => fetchPayments(currentPage, limit)}
                />
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
                      const url = `/payments/${payment._id.$oid}/chitanta`;
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
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {dialog && (
        <DialogContainer onDismiss={() => setDialog(null)}>
          {dialog === "modifica" && (
            <Dialog>
              <Heading>Modifică plată</Heading>
              <Content>
                <PaymentForm
                  close={() => setDialog(null)}
                  onPaymentAdded={() => fetchPayments(currentPage, limit)}
                  initialValues={selectedPayment}
                  isUpdate={true}
                />
              </Content>
            </Dialog>
          )}
          {dialog === "sterge" && (
            <Dialog>
              <Heading>Șterge plată</Heading>
              <Divider />
              <Content>Ești sigur că vrei să ștergi această plată?</Content>
              <ButtonGroup>
                <Button
                  variant="negative"
                  onPress={() => {
                    handleDelete(selectedPayment._id.$oid);
                    setDialog(null);
                  }}
                >
                  Șterge
                </Button>
                <Button variant="secondary" onPress={() => setDialog(null)}>
                  Anulează
                </Button>
              </ButtonGroup>
            </Dialog>
          )}
        </DialogContainer>
      )}
    </div>
  );
};

export default PaymentsList;

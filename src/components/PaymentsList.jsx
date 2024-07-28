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
  DateRangePicker,
  ProgressCircle
} from "@adobe/react-spectrum";
import PaymentForm from "./PaymentForm";
import { ToastQueue } from "@react-spectrum/toast";
import Pagination from "./Pagination"; // Import the custom Pagination component
import './PaymentsList.css';

const API_URL = process.env.REACT_APP_API_URL;

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  // 30 days prior start_date
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const filterPayments = async (startDate, endDate, page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const start = startDate ? new Date(startDate).toISOString() : "";
      const end = endDate ? new Date(endDate).toISOString() : "";
      const response = await fetch(
        `${API_URL}/payments/search/date?start_date=${start}&end_date=${end}&page=${page}&limit=${limit}`,
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

      const formattedPayments = data.payments.map((payment) => ({
        ...payment,
        date: new Date(payment.date.$date).toLocaleDateString()
      }));

      setPayments(formattedPayments);
      setCurrentPage(data.page);
      setTotalPages(Math.ceil(data.total_payments / limit));
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (payment_id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/payments/${payment_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        filterPayments(startDate, endDate, currentPage, limit);
        ToastQueue.positive("Plata a fost ștearsă cu succes!");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete payment:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      filterPayments(startDate, endDate, currentPage, limit);
    }
  }, [token, currentPage]);

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
                  onPaymentAdded={() => filterPayments(startDate, endDate, currentPage, limit)}
                />
              </Content>
            </Dialog>
          )}
        </DialogTrigger>
      </Header>
      <div className="search-bar">
        <DateRangePicker
          label="Cauta dupa data"
          startName="start_date"
          endName="end_date"
          onChange={(date) => {
            setStartDate(date.start);
            setEndDate(date.end);
          }}
        />
        <br />
        <Button variant="cta" onPress={() => filterPayments(startDate, endDate, currentPage, limit)}>Cauta</Button>
      </div>
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <br />
      <p>Rezultate din <strong>{new Date(startDate).toLocaleDateString('en-GB')}</strong> pana <strong>{new Date(endDate).toLocaleDateString('en-GB')}</strong></p>
      <Divider size="S"/>
      <br />
      {isLoading ? (
        <ProgressCircle
          aria-label="Loading…"
          isIndeterminate
          UNSAFE_style={{ margin: 'auto' }}
        />
      ) : (
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
                <Cell>{payment.payment_id}</Cell>
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
                        const url = `/payments/${payment.payment_id}/chitanta`;
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
      )}

      {dialog && (
        <DialogContainer onDismiss={() => setDialog(null)}>
          {dialog === "modifica" && (
            <Dialog>
              <Heading>Modifică plată</Heading>
              <Content>
                <PaymentForm
                  close={() => setDialog(null)}
                  onPaymentAdded={() => filterPayments(startDate, endDate, currentPage, limit)}
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

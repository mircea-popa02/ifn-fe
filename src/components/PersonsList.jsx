import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ActionMenu,
  TableHeader,
  TableView,
  Column,
  TableBody,
  Row,
  Cell,
  Button,
  Dialog,
  DialogTrigger,
  Content,
  Heading,
  Divider,
  Header,
  Flex,
  Item,
  ActionButton,
  DialogContainer,
  SearchField,
  ButtonGroup,
  ProgressCircle,
} from "@adobe/react-spectrum";
import ClientForm from "./ClientForm";
import SmockInfoIcon from "./SmockInfoIcon";
import { ToastQueue } from "@react-spectrum/toast";
import Pagination from "./Pagination";

const PersonsList = () => {
  const [persons, setPersons] = useState([]);
  const { token } = useAuth();
  const [dialog, setDialog] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [nameSearchText, setNameSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false); // New state for loading

  const fetchPersons = async (page = 1, limit = 10, name = "") => {
    setLoading(true); // Start loading
    const url = `https://ifn-be-hwfo-master-g5ailnlqoq-wm.a.run.app/clients/search?page=${page}&limit=${limit}&name=${name}`;
    console.log("Fetching URL:", url); // Log the URL to ensure correct parameters
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch persons");
      }
      const data = await response.json();
      setPersons(data.clients);
      setTotalPages(Math.ceil(data.total_clients / limit));
    } catch (error) {
      console.error("Error fetching persons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPersons(currentPage, limit, nameSearchText);
    }
  }, [token, currentPage, limit, nameSearchText]);

  const handleDelete = async (member_id) => {
    try {
      const response = await fetch(`https://ifn-be-hwfo-master-g5ailnlqoq-wm.a.run.app/clients/${member_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchPersons(currentPage, limit, nameSearchText);
        ToastQueue.positive("Persoana a fost stearsa!", { timeout: 3000 });
      } else {
        const errorData = await response.json();
        console.error("Failed to delete client:", errorData.message);
        ToastQueue.negative("Eroare la stergerea persoanei", { timeout: 3000 });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      ToastQueue.negative("Eroare la stergerea persoanei", { timeout: 3000 });
    }
  };

  const handlePageChange = (newPage) => {
    console.log("Page change:", newPage); // Log page changes
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Header UNSAFE_className="home-header">
        <h1>Persoane</h1>
        <DialogTrigger>
          <Button variant="accent">Adauga</Button>
          {(close) => (
            <Dialog>
              <Heading>Adauga persoana</Heading>
              <Content>
                <ClientForm close={close} onClientAdded={() => fetchPersons(currentPage, limit, nameSearchText)} />
              </Content>
            </Dialog>
          )}
        </DialogTrigger>
      </Header>

      <SearchField label="Cauta dupa nume" onChange={setNameSearchText} value={nameSearchText} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <br />
      <Divider size="S"/>
      <br />
      <Flex height="size-8000" width="100%" direction="column" gap="size-150">
        {loading ? ( // Show loader if loading
          <ProgressCircle aria-label="Loading…" isIndeterminate />
        ) : (
          <TableView aria-label="Persons table">
            <TableHeader>
              <Column>ID Membru</Column>
              <Column>Nume</Column>
              <Column>Oras</Column>
              <Column>Actiuni</Column>
            </TableHeader>
            <TableBody>
              {persons.map((person) => (
                <Row key={person._id.$oid}>
                  <Cell>{person.member_id}</Cell>
                  <Cell>{person.name}</Cell>
                  <Cell>{person.city}</Cell>
                  <Cell>
                    <ActionButton
                      onPress={() => {
                        setSelectedPerson(person);
                        setDialog("info");
                      }}
                    >
                      <SmockInfoIcon />
                    </ActionButton>
                    <ActionMenu
                      onAction={(key) => {
                        setSelectedPerson(person);
                        if (key === "modifica") setDialog("modifica");
                        if (key === "sterge") setDialog("sterge");
                      }}
                    >
                      <Item key="modifica">Modifica</Item>
                      <Item key="sterge">Sterge</Item>
                    </ActionMenu>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        )}
      </Flex>

      {dialog && (
        <DialogContainer onDismiss={() => setDialog(null)}>
          {dialog === "info" && (
            <Dialog>
              <Heading>Detalii persoana</Heading>
              <Divider />
              <Content UNSAFE_className="modal">
                <p>
                  <strong>Adresa:</strong> {selectedPerson.address}
                </p>
                <p>
                  <strong>Adresa corespondenta:</strong>{" "}
                  {selectedPerson.corespondence_address}
                </p>
                <p>
                  <strong>Oras:</strong> {selectedPerson.city}
                </p>
                <p>
                  <strong>Judet:</strong> {selectedPerson.county}
                </p>
                <p>
                  <strong>Numar CI:</strong>{" "}
                  {selectedPerson.identity_card_number}
                </p>
                <p>
                  <strong>Serie CI:</strong>{" "}
                  {selectedPerson.identity_card_series}
                </p>
                <p>
                  <strong>CI eliberat de:</strong> {selectedPerson.provided_by}
                </p>
                <p>
                  <strong>CI eliberat la data de:</strong>{" "}
                  {selectedPerson.provided_on.$date}
                </p>
                <p>
                  <strong>CI expira la data de:</strong>{" "}
                  {selectedPerson.expires_on.$date}
                </p>
                <p>
                  <strong>CNP:</strong> {selectedPerson.social_security_number}
                </p>
                <p>
                  <strong>Telefon servici:</strong> {selectedPerson.work_phone}
                </p>
                <p>
                  <strong>Telefon personal:</strong>{" "}
                  {selectedPerson.personal_phone}
                </p>
                <p>
                  <strong>Angajator:</strong> {selectedPerson.employer}
                </p>
                <p>
                  <strong>Certificat venit:</strong>{" "}
                  {selectedPerson.revenue_certificate}
                </p>
                <Button onPress={() => setDialog(null)}>Inchide</Button>
              </Content>
            </Dialog>
          )}
          {dialog === "modifica" && (
            <Dialog>
              <Heading>Modifica persoana</Heading>
              <Content>
                <ClientForm
                  close={() => setDialog(null)}
                  onClientAdded={() => fetchPersons(currentPage, limit, nameSearchText)}
                  initialValues={selectedPerson}
                  isUpdate={true}
                />
              </Content>
            </Dialog>
          )}
          {dialog === "sterge" && (
            <Dialog>
              <Heading>Sterge persoana</Heading>
              <Divider />
              <Content>Esti sigur ca vrei sa stergi persoana?</Content>
              <ButtonGroup>
                <Button
                  variant="negative"
                  onPress={() => {
                    handleDelete(selectedPerson.member_id);
                    setDialog(null);
                  }}
                >
                  Sterge
                </Button>
                <Button variant="secondary" onPress={() => setDialog(null)}>
                  Anuleaza
                </Button>
              </ButtonGroup>
            </Dialog>
          )}
        </DialogContainer>
      )}
    </div>
  );
};

export default PersonsList;

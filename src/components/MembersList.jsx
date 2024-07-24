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
} from "@adobe/react-spectrum";
import ClientForm from "./ClientForm";
import SmockInfoIcon from "./SmockInfoIcon";
import { ToastQueue } from "@react-spectrum/toast";

const MembersList = () => {
  const [persons, setPersons] = useState([]);
  const { token } = useAuth();
  const [dialog, setDialog] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [nameSearchText, setNameSearchText] = useState("");

  const fetchPersons = async () => {
    try {
      const response = await fetch("http://localhost:5000/client/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch persons");
      }
      const data = await response.json();
      setPersons(data);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPersons();
    }
  }, [token]);

  const handleDelete = async (member_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/client/${member_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchPersons();
      } else {
        const errorData = await response.json();
        console.error("Failed to delete client:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  let filteredPersons = persons.filter((person) => {
    return (
      person.contract &&
      person.name.toLowerCase().includes(nameSearchText.toLowerCase())
    );
  });

  return (
    <div>
      <Header UNSAFE_className="home-header">
        <h1>Membri</h1>
      </Header>
      <SearchField label="Cauta dupa nume" onChange={setNameSearchText} />
      <Flex height="size-8000" width="100%" direction="column" gap="size-150">
        <TableView aria-label="Members table">
          <TableHeader>
            <Column>ID Membru</Column>
            <Column>Nume</Column>
            <Column>Oras</Column>
            <Column>Actiuni</Column>
          </TableHeader>
          <TableBody>
            {filteredPersons.map((person) => (
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
                  {selectedPerson.provided_on}
                </p>
                <p>
                  <strong>CI expira la data de:</strong>{" "}
                  {selectedPerson.expires_on}
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
                  onClientAdded={fetchPersons}
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
                    ToastQueue.positive("Persoana a fost stearsa!");
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

export default MembersList;

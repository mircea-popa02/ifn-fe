import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
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
  Form,
  TextField,
  ButtonGroup,
  Divider,

} from "@adobe/react-spectrum";
import ClientForm from "./ClientForm";

const PersonsList = () => {
  const [persons, setPersons] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        console.log("Token:", token);
        const response = await fetch("http://localhost:5000/client/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Failed to fetch persons");
        }
        const data = await response.json();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching persons:", error);
      }
    };

    if (token) {
      fetchPersons();
    }
  }, [token]);



  return (
    <div>
      <h1>Persoane</h1>
      <DialogTrigger>
        <Button variant="accent">Adauga</Button>
        {(close) => (
          <Dialog>
            <Heading>Adauga persoana</Heading>
            <Content>
              <ClientForm />
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
      <TableView aria-label="Persons table">
        <TableHeader>
          <Column>ID Membru</Column>
          <Column>Nume</Column>
          <Column>Oras</Column>
          <Column>Modifica</Column>
          <Column>Detalii</Column>
        </TableHeader>
        <TableBody>
          {persons.map((person) => (
            <Row key={person._id.$oid}>
              <Cell>{person.member_id}</Cell>
              <Cell>{person.name}</Cell>
              <Cell>{person.county}</Cell>
              <Cell>
                <DialogTrigger>
                  <Button variant="secondary" style="fill">Modifica</Button>
                  {(close) => {
                    return (
                      <Dialog>
                        <Content UNSAFE_className="modal">
                          <h1>Modifica persoana</h1>
                          <Button onPress={close}>Close</Button>
                        </Content>
                      </Dialog>
                    );
                  }}
                </DialogTrigger>
              </Cell>
              <Cell>
                <DialogTrigger>
                  <Button variant="primary" style="fill">Detalii</Button>
                  {(close) => {
                    return (
                      <Dialog>
                        <Heading>Detalii persoana</Heading>

                        <Divider />
                        <Content UNSAFE_className="modal">
                          <p><strong>Adresa:</strong> {person.address}</p>
                          <p><strong>Adresa corespondenta:</strong> {person.corespondence_address}</p>
                          <p><strong>Oras:</strong> {person.city}</p>
                          <p><strong>Judet:</strong> {person.county}</p>
                          <p><strong>Numar CI:</strong> {person.identity_card_number}</p>
                          <p><strong>Serie CI:</strong> {person.identity_card_series}</p>
                          <p><strong>CI eliberat de:</strong> {person.provided_by}</p>
                          <p><strong>CI eliberat la data de:</strong> {person.provided_on}</p>
                          <p><strong>CI expira la data de:</strong> {person.expires_on}</p>
                          <p><strong>CNP:</strong> {person.social_security_number}</p>
                          <p><strong>Telefon servici:</strong> {person.work_phone}</p>
                          <p><strong>Telefon personal:</strong> {person.personal_phone}</p>
                          <p><strong>Angajator:</strong> {person.employer}</p>
                          <p><strong>Certificat venit:</strong> {person.revenue_certificate}</p>

                          <Button onPress={close}>Close</Button>
                        </Content>
                      </Dialog>
                    );
                  }}
                </DialogTrigger>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </div>
  );
};

export default PersonsList;

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
  Divider,
  Header,
  Flex,
  ActionButton,
  SearchField,
  DialogContainer,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import ContractForm from "./ContractForm";

const ContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const [persons, setPersons] = useState([]);
  const { token } = useAuth();
  const [dialog, setDialog] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [contractNumberSearchText, setContractNumberSearchText] = useState("");
  const [contractNameSearchText, setContractNameSearchText] = useState("");
  const [indebtedNumberSearchText, setIndebtedNumberSearchText] = useState("");
  const [indebtedNameSearchText, setIndebtedNameSearchText] = useState("");

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
      setContracts(data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const fetchPersons = async () => {
    try {
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

  useEffect(() => {
    if (token) {
      fetchContracts();
      fetchPersons();
    }
  }, [token]);

  const getPersonDetails = (personId) => {
    const person = persons.find((p) => p._id.$oid === personId);
    return person ? person : { name: "", member_id: "" };
  };

  const filteredContracts = contracts.filter((contract) => {
    const person = getPersonDetails(contract.member_id.$oid);
    const matchesContractNumber =
      !contractNumberSearchText ||
      contract.contract_number
        .toLowerCase()
        .includes(contractNumberSearchText.toLowerCase());
    const matchesContractName =
      !contractNameSearchText ||
      contract.contract_number
        .toLowerCase()
        .includes(contractNameSearchText.toLowerCase());
    const matchesIndebtedNumber =
      !indebtedNumberSearchText ||
      person.member_id
        .toLowerCase()
        .includes(indebtedNumberSearchText.toLowerCase());
    const matchesIndebtedName =
      !indebtedNameSearchText ||
      person.name.toLowerCase().includes(indebtedNameSearchText.toLowerCase());

    return (
      matchesContractNumber &&
      matchesContractName &&
      matchesIndebtedNumber &&
      matchesIndebtedName
    );
  });

  return (
    <div>
      <Header UNSAFE_className="home-header">
        <h1>Contracte</h1>
        <DialogTrigger>
          <Button variant="accent">Add Contract</Button>
          {(close) => (
            <Dialog>
              <Heading>Add Contract</Heading>
              <Content>
                <ContractForm
                  close={close}
                  onContractAdded={fetchContracts}
                  persons={persons}
                />
              </Content>
            </Dialog>
          )}
        </DialogTrigger>
      </Header>
      <SearchField
        label="Search by Contract Number"
        onChange={setContractNumberSearchText}
      />
      <SearchField
        label="Search by Contract Name"
        onChange={setContractNameSearchText}
      />
      <SearchField
        label="Search by Indebted Number"
        onChange={setIndebtedNumberSearchText}
      />
      <SearchField
        label="Search by Indebted Name"
        onChange={setIndebtedNameSearchText}
      />
      <Flex height="size-8000" width="100%" direction="column" gap="size-150">
        <TableView aria-label="Contracts table">
          <TableHeader>
            <Column>Contract Number</Column>
            <Column>Contract Name</Column>
            <Column>Status</Column>
            <Column>Value</Column>
            <Column>Actions</Column>
          </TableHeader>
          <TableBody>
            {filteredContracts.map((contract) => {
              const person = getPersonDetails(contract.member_id.$oid);
              return (
                <Row key={contract._id.$oid}>
                  <Cell>{contract.contract_number}</Cell>
                  <Cell>{`Contract ${contract.contract_number}`}</Cell>
                  <Cell>{contract.status}</Cell>
                  <Cell>{contract.value}</Cell>
                  <Cell>
                    <ActionButton>Action 1</ActionButton>
                    <ActionButton>Action 2</ActionButton>
                    <ActionButton>Action 3</ActionButton>
                  </Cell>
                </Row>
              );
            })}
          </TableBody>
        </TableView>
      </Flex>
    </div>
  );
};

export default ContractsList;

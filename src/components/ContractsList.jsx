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
  ButtonGroup,
  DialogContainer,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";

const ContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const { token } = useAuth();
  const [dialog, setDialog] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [nameSearchText, setNameSearchText] = useState("");

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

  useEffect(() => {
    if (token) {
      fetchContracts();
    }
  }, [token]);

  let filteredContracts = contracts.filter((contract) => {
    if (nameSearchText === "") {
      return true;
    }
    return contract.contract_number
      .toLowerCase()
      .includes(nameSearchText.toLowerCase());
  });

  return (
    <div>
      <Header UNSAFE_className="home-header">
        <h1>Contracts</h1>
        <DialogTrigger>
          <Button variant="accent">Add Contract</Button>
          {(close) => (
            <Dialog>
              <Heading>Add Contract</Heading>
              <Content>{/* Add your contract form here */}</Content>
            </Dialog>
          )}
        </DialogTrigger>
      </Header>
      <SearchField
        label="Search by Contract Number"
        onChange={setNameSearchText}
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
            {filteredContracts.map((contract) => (
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
            ))}
          </TableBody>
        </TableView>
      </Flex>
    </div>
  );
};

export default ContractsList;

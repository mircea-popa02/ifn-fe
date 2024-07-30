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
  ActionMenu,
  Item,
  DialogContainer,
  ButtonGroup,
} from "@adobe/react-spectrum";
import ContractForm from "./ContractForm";
import SmockInfoIcon from "./SmockInfoIcon";
import { ToastQueue } from "@react-spectrum/toast";
import { API_URL } from "../services/config";

const ContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const [person, setPerson] = useState(null);
  const { token } = useAuth();
  const [dialog, setDialog] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [debtors, setDebtors] = useState([]);

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_URL}/contracts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch contracts");
      }
      const data = await response.json();
      setContracts(data);
      console.log("Contracts:", data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      ToastQueue.negative("Error fetching contracts", { timeout: 3000 });
    }
  };

  const fetchDebtors = async (debtors) => {
    // url: `${API_URL}/clients/list` with post and payload has member_ids array
    // response: array of debtors
    try {
      const response = await fetch(`${API_URL}/clients/list`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_ids: debtors,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch debtors");
      }
      const data = await response.json();
      setDebtors(data);
    } catch (error) {
      console.error("Error fetching debtors:", error);
      ToastQueue.negative("Error fetching debtors", { timeout: 3000 });
    }
  };

  const fetchPersonDetails = async (personId) => {
    try {
      const response = await fetch(`${API_URL}/clients/id/${personId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch person details");
      }
      const data = await response.json();
      setPerson(data);
    } catch (error) {
      console.error("Error fetching person details:", error);
      ToastQueue.negative("Error fetching person details", { timeout: 3000 });
    }
  };

  useEffect(() => {
    if (token) {
      fetchContracts();
    }
  }, [token]);

  const handleDelete = async (contract_number) => {
    try {
      const response = await fetch(`${API_URL}/contracts/${contract_number}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchContracts();
        ToastQueue.positive("Contract a fost șters cu succes!", {
          timeout: 3000,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to delete contract:", errorData.message);
        ToastQueue.negative("Failed to delete contract", { timeout: 3000 });
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
      ToastQueue.negative("Error deleting contract", { timeout: 3000 });
    }
  };

  const openInfoDialog = async (contract) => {
    setSelectedContract(contract);
    await fetchPersonDetails(contract.member_id.$oid);
    await fetchDebtors(contract.debtors);
    setDialog("info");
  };

  return (
    <div>
      <Header UNSAFE_className="home-header">
        <h1>Contracte</h1>
        <DialogTrigger>
          <Button variant="accent">Adauga Contract</Button>
          {(close) => (
            <Dialog>
              <Heading>Adauga Contract</Heading>
              <Content>
                <ContractForm
                  close={close}
                  onContractAdded={fetchContracts}
                  initialValues={null}
                  isUpdate={false}
                />
              </Content>
            </Dialog>
          )}
        </DialogTrigger>
      </Header>
      <Flex height="size-8000" width="100%" direction="column" gap="size-150">
        <TableView aria-label="Contracts table">
          <TableHeader>
            <Column>Numar Contract</Column>
            <Column>Nume Contract</Column>
            <Column>Status</Column>
            <Column>Valoare</Column>
            <Column>Actiuni</Column>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => {
              return (
                <Row key={contract._id.$oid}>
                  <Cell>{contract.contract_number}</Cell>
                  <Cell>{`Contract ${contract.contract_number}`}</Cell>
                  <Cell>{contract.status}</Cell>
                  <Cell>{contract.value}</Cell>
                  <Cell>
                    <ActionButton
                      onPress={() => openInfoDialog(contract)}
                    >
                      <SmockInfoIcon />
                    </ActionButton>
                    <ActionMenu
                      onAction={(key) => {
                        setSelectedContract(contract);
                        if (key === "modifica") setDialog("modifica");
                        if (key === "sterge") setDialog("sterge");
                        if (key === "grafic") {
                          const url = `/contracts/${contract.contract_number}/graficrambursare`;
                          window.open(url, "_blank");
                        }
                        if (key === "print") {
                          const url = `/contracts/${contract.contract_number}/printcontract`;
                          window.open(url, "_blank");
                        }
                      }}
                    >
                      <Item key="modifica">Modifica</Item>
                      <Item key="sterge">Sterge</Item>
                      <Item key="grafic">Grafic de rambursare</Item>
                      <Item key="print">Vizualizare contract</Item>
                    </ActionMenu>
                  </Cell>
                </Row>
              );
            })}
          </TableBody>
        </TableView>
      </Flex>
      {dialog && (
        <DialogContainer onDismiss={() => setDialog(null)}>
          {dialog === "info" && (
            <Dialog>
              <Heading>Detalii contract</Heading>
              <Divider />
              <Content UNSAFE_className="modal">
                <p>
                  <strong>Număr contract:</strong>{" "}
                  {selectedContract.contract_number}
                </p>
                <p>
                  <strong>Data:</strong> {selectedContract.date.$date}
                </p>
                {person && (
                  <p>
                    <strong>Persoana:</strong> {person.name}
                  </p>
                )}
                <p>
                  <strong>Model contract:</strong>{" "}
                  {selectedContract.contract_model}
                </p>
                <p>
                  <strong>Agent:</strong> {selectedContract.agent}
                </p>
                <p>
                  <strong>Valoare:</strong> {selectedContract.value}
                </p>
                <p>
                  <strong>Rata:</strong> {selectedContract.rate}
                </p>
                <p>
                  <strong>Luni:</strong> {selectedContract.months}
                </p>
                <p>
                  <strong>Dobânda remunerativă:</strong>{" "}
                  {selectedContract.remunerative_interest}%
                </p>
                <p>
                  <strong>DAE:</strong> {selectedContract.ear}%
                </p>
                <p>
                  <strong>Penalitate zilnică:</strong>{" "}
                  {selectedContract.daily_penalty}%
                </p>
                <p>
                  <strong>Data scadentă:</strong> {selectedContract.due_day}
                </p>
                <p>
                  <strong>Statut:</strong> {selectedContract.status}
                </p>
                <p>
                  <strong>Execuție:</strong> {selectedContract.execution}
                </p>
                <p>
                  <strong>Data execuției:</strong>{" "}
                  {selectedContract.execution_date.$date}
                </p>
                <p>
                  <strong>Debitori:</strong>{" "}
                  {debtors.map((debtor) => debtor.name).join(", ")}
                </p>
                <Button onPress={() => setDialog(null)}>Inchide</Button>
              </Content>
            </Dialog>
          )}
          {dialog === "modifica" && (
            <Dialog>
              <Heading>Modifica contract</Heading>
              <Content>
                <ContractForm
                  close={() => setDialog(null)}
                  onContractAdded={fetchContracts}
                  initialValues={selectedContract}
                  isUpdate={true}
                />
              </Content>
            </Dialog>
          )}
          {dialog === "sterge" && (
            <Dialog>
              <Heading>Sterge contract</Heading>
              <Divider />
              <Content>Esti sigur ca vrei sa stergi contractul?</Content>
              <ButtonGroup>
                <Button
                  variant="negative"
                  onPress={() => {
                    handleDelete(selectedContract.contract_number);
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

export default ContractsList;

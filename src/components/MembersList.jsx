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
  ProgressCircle
} from "@adobe/react-spectrum";
import ClientForm from "./ClientForm";
import SmockInfoIcon from "./SmockInfoIcon";
import { ToastQueue } from "@react-spectrum/toast";
import Pagination from "./Pagination";

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const { token } = useAuth();
  const [dialog, setDialog] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [nameSearchText, setNameSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async (page = 1, limit = 10, name = "") => {
    setLoading(true);
    const url = `https://ifn-be-hwfo-master-g5ailnlqoq-wm.a.run.app/clients/search?page=${page}&limit=${limit}&name=${name}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch members");
      }
      const data = await response.json();
      const membersWithContract = data.clients.filter(member => member.contract);
      setMembers(membersWithContract);
      setTotalPages(Math.ceil(data.total_clients / limit));
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMembers(currentPage, limit, nameSearchText);
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
        fetchMembers(currentPage, limit, nameSearchText);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete member:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Header UNSAFE_className="home-header">
        <h1>Membri</h1>
      </Header>

      <SearchField label="Cauta dupa nume" onChange={setNameSearchText} value={nameSearchText} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <br />
      <Divider size="S" />
      <br />
      <Flex height="size-8000" width="100%" direction="column" gap="size-150">
        {loading ? (
          <ProgressCircle aria-label="Loading…" isIndeterminate />
        ) : (
          <TableView aria-label="Members table">
            <TableHeader>
              <Column>ID Membru</Column>
              <Column>Nume</Column>
              <Column>Oras</Column>
              <Column>Actiuni</Column>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <Row key={member._id.$oid}>
                  <Cell>{member.member_id}</Cell>
                  <Cell>{member.name}</Cell>
                  <Cell>{member.city}</Cell>
                  <Cell>
                    <ActionButton
                      onPress={() => {
                        setSelectedMember(member);
                        setDialog("info");
                      }}
                    >
                      <SmockInfoIcon />
                    </ActionButton>
                    <ActionMenu
                      onAction={(key) => {
                        setSelectedMember(member);
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
              <Heading>Detalii membru</Heading>
              <Divider />
              <Content UNSAFE_className="modal">
                <p>
                  <strong>Adresa:</strong> {selectedMember.address}
                </p>
                <p>
                  <strong>Adresa corespondenta:</strong>{" "}
                  {selectedMember.corespondence_address}
                </p>
                <p>
                  <strong>Oras:</strong> {selectedMember.city}
                </p>
                <p>
                  <strong>Judet:</strong> {selectedMember.county}
                </p>
                <p>
                  <strong>Numar CI:</strong>{" "}
                  {selectedMember.identity_card_number}
                </p>
                <p>
                  <strong>Serie CI:</strong>{" "}
                  {selectedMember.identity_card_series}
                </p>
                <p>
                  <strong>CI eliberat de:</strong> {selectedMember.provided_by}
                </p>
                <p>
                  <strong>CI eliberat la data de:</strong>{" "}
                  {selectedMember.provided_on}
                </p>
                <p>
                  <strong>CI expira la data de:</strong>{" "}
                  {selectedMember.expires_on}
                </p>
                <p>
                  <strong>CNP:</strong> {selectedMember.social_security_number}
                </p>
                <p>
                  <strong>Telefon servici:</strong> {selectedMember.work_phone}
                </p>
                <p>
                  <strong>Telefon personal:</strong>{" "}
                  {selectedMember.personal_phone}
                </p>
                <p>
                  <strong>Angajator:</strong> {selectedMember.employer}
                </p>
                <p>
                  <strong>Certificat venit:</strong>{" "}
                  {selectedMember.revenue_certificate}
                </p>
                <Button onPress={() => setDialog(null)}>Inchide</Button>
              </Content>
            </Dialog>
          )}
          {dialog === "modifica" && (
            <Dialog>
              <Heading>Modifica membru</Heading>
              <Content>
                <ClientForm
                  close={() => setDialog(null)}
                  onClientAdded={() => fetchMembers(currentPage, limit, nameSearchText)}
                  initialValues={selectedMember}
                  isUpdate={true}
                />
              </Content>
            </Dialog>
          )}
          {dialog === "sterge" && (
            <Dialog>
              <Heading>Sterge membru</Heading>
              <Divider />
              <Content>Esti sigur ca vrei sa stergi membrul?</Content>
              <ButtonGroup>
                <Button
                  variant="negative"
                  onPress={() => {
                    handleDelete(selectedMember.member_id);
                    ToastQueue.positive("Membru a fost sters!");
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

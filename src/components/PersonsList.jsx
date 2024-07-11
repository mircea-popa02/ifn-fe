import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  TableHeader,
  TableView,
  Column,
  TableBody,
  Row,
  Cell,
} from "@adobe/react-spectrum";

const PersonsList = () => {
  const [persons, setPersons] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        console.log("Token:", token); // Debugging log
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
      <TableView aria-label="Persons table">
        <TableHeader>
          <Column>Member ID</Column>
          <Column>Name</Column>
        </TableHeader>
        <TableBody>
          {persons.map((person) => (
            <Row key={person._id.$oid}>
              <Cell>{person.member_id}</Cell>
              <Cell>{person.name}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </div>
  );
};

export default PersonsList;

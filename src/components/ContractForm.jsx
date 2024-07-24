import React, { useState, useEffect } from "react";
import {
  Form,
  TextField,
  Button,
  ButtonGroup,
  ComboBox,
  Item,
} from "@adobe/react-spectrum";
import { useAuth } from "../../context/AuthContext";
import { ToastQueue } from "@react-spectrum/toast";

const ContractForm = ({ close, onContractAdded, persons }) => {
  const [formData, setFormData] = useState({
    contract_number: "",
    date: "",
    contract_model: "",
    agent: "",
    value: "",
    months: "",
    remunerative_interest: "",
    ear: "",
    daily_penalty: "",
    due_day: "",
    status: "",
    execution: "",
    execution_date: "",
    debtors: ["", "", "", ""],
    indebted: "",
  });

  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [debtorFilters, setDebtorFilters] = useState(
    persons.map(() => persons)
  );
  const [debtorInputValues, setDebtorInputValues] = useState(["", "", "", ""]);
  const { token } = useAuth();

  useEffect(() => {
    setFilteredPersons(persons);
    setDebtorFilters(persons.map(() => persons));
  }, [persons]);

  const handleSave = async () => {
    try {
      const indebtedPerson = persons.find(
        (person) => person.name === formData.indebted
      );
      if (!indebtedPerson) {
        console.error("Invalid indebted person selected");
        return;
      }
      const url = `http://localhost:5000/contract/${indebtedPerson.member_id}`;

      const dataToSend = {
        ...formData,
        debtors: formData.debtors.filter((item) => item),
        value: parseInt(formData.value, 10),
        months: parseInt(formData.months, 10),
        remunerative_interest: parseInt(formData.remunerative_interest, 10),
        ear: parseInt(formData.ear, 10),
        daily_penalty: parseInt(formData.daily_penalty, 10),
        due_day: parseInt(formData.due_day, 10),
        execution: parseInt(formData.execution, 10),
      };
      delete dataToSend.indebted;

      console.log("URL:", url);
      console.log("Data to send:", JSON.stringify(dataToSend, null, 2));
      console.log("Token:", token);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const responseBody = await response.text(); // Read response body as text for logging
      console.log("Response status:", response.status);
      console.log("Response body:", responseBody);

      if (response.ok) {
        onContractAdded();
        close();
        ToastQueue.positive("Contract created successfully!");
      } else {
        console.error("Failed to save contract:", responseBody);
      }
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleDebtorChange = (index, key) => {
    setFormData((prevData) => {
      const newDebtors = [...prevData.debtors];
      const debtorPerson = persons.find((person) => person._id.$oid === key);
      if (debtorPerson) {
        newDebtors[index] = debtorPerson.member_id;
      } else {
        newDebtors[index] = "";
      }
      return { ...prevData, debtors: newDebtors };
    });
    setDebtorInputValues((prevValues) => {
      const newValues = [...prevValues];
      const debtorPerson = persons.find((person) => person._id.$oid === key);
      if (debtorPerson) {
        newValues[index] = debtorPerson.name;
      } else {
        newValues[index] = "";
      }
      return newValues;
    });
  };

  const handleFilterChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      indebted: value,
    }));
    setFilteredPersons(
      persons.filter((person) =>
        person.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleDebtorFilterChange = (index, value) => {
    setDebtorFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      newFilters[index] = persons.filter((person) =>
        person.name.toLowerCase().includes(value.toLowerCase())
      );
      return newFilters;
    });
    setDebtorInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };

  return (
    <Form>
      <TextField
        label="Contract Number"
        value={formData.contract_number}
        onChange={(value) => handleInputChange("contract_number", value)}
        isRequired
      />
      <TextField
        label="Date"
        value={formData.date}
        onChange={(value) => handleInputChange("date", value)}
      />
      <TextField
        label="Contract Model"
        value={formData.contract_model}
        onChange={(value) => handleInputChange("contract_model", value)}
      />
      <TextField
        label="Agent"
        value={formData.agent}
        onChange={(value) => handleInputChange("agent", value)}
      />
      <ComboBox
        label="Value"
        defaultItems={[
          { id: "5400", name: "5400" },
          { id: "6480", name: "6480" },
          { id: "8100", name: "8100" },
          { id: "9720", name: "9720" },
          { id: "10800", name: "10800" },
          { id: "13500", name: "13500" },
          { id: "16200", name: "16200" },
          { id: "18900", name: "18900" },
          { id: "21600", name: "21600" },
          { id: "24300", name: "24300" },
          { id: "27000", name: "27000" },
          { id: "32400", name: "32400" },
          { id: "37800", name: "37800" },
          { id: "43200", name: "43200" },
          { id: "45900", name: "45900" },
        ]}
        selectedKey={formData.value}
        onSelectionChange={(key) => handleInputChange("value", key)}
      >
        {(item) => <Item key={item.id}>{item.name}</Item>}
      </ComboBox>
      <TextField
        label="Months"
        value={formData.months}
        onChange={(value) => handleInputChange("months", value)}
      />
      <TextField
        label="Remunerative Interest"
        value={formData.remunerative_interest}
        onChange={(value) => handleInputChange("remunerative_interest", value)}
      />
      <TextField
        label="EAR"
        value={formData.ear}
        onChange={(value) => handleInputChange("ear", value)}
      />
      <TextField
        label="Daily Penalty"
        value={formData.daily_penalty}
        onChange={(value) => handleInputChange("daily_penalty", value)}
      />
      <TextField
        label="Due Day"
        value={formData.due_day}
        onChange={(value) => handleInputChange("due_day", value)}
      />
      <TextField
        label="Status"
        value={formData.status}
        onChange={(value) => handleInputChange("status", value)}
      />
      <TextField
        label="Execution"
        value={formData.execution}
        onChange={(value) => handleInputChange("execution", value)}
      />
      <TextField
        label="Execution Date"
        value={formData.execution_date}
        onChange={(value) => handleInputChange("execution_date", value)}
      />
      <ComboBox
        label="Indebted"
        items={filteredPersons}
        inputValue={formData.indebted}
        onInputChange={handleFilterChange}
        onSelectionChange={(key) => handleInputChange("indebted", key)}
      >
        {(item) => <Item key={item._id.$oid}>{item.name}</Item>}
      </ComboBox>
      {[0, 1, 2, 3].map((index) => (
        <ComboBox
          key={index}
          label={`Debtor ${index + 1}`}
          items={debtorFilters[index]}
          inputValue={debtorInputValues[index]}
          onInputChange={(value) => handleDebtorFilterChange(index, value)}
          onSelectionChange={(key) => handleDebtorChange(index, key)}
        >
          {(item) => <Item key={item._id.$oid}>{item.name}</Item>}
        </ComboBox>
      ))}
      <ButtonGroup>
        <Button variant="cta" onPress={handleSave}>
          Adauga Contract
        </Button>
        <Button variant="secondary" onPress={close}>
          Inchide
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default ContractForm;

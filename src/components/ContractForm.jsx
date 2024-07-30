import React, { useState, useEffect } from "react";
import {
  Form,
  TextField,
  Button,
  ButtonGroup,
  ComboBox,
  Item,
  DateField,
} from "@adobe/react-spectrum";
import { useAuth } from "../../context/AuthContext";
import { ToastQueue } from "@react-spectrum/toast";
import { formatDateISO8601, normalizeDateValue } from "../services/Utils";

import { API_URL } from "../services/config";

const ContractForm = ({
  close,
  onContractAdded,
  initialValues = {},
  isUpdate = false,
}) => {
  const [clients, setClients] = useState([]);
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

  const { token } = useAuth();

  useEffect(() => {
    if (isUpdate && initialValues) {
      console.log("Initial values:", initialValues);
      initialValues.date = normalizeDateValue(initialValues.date?.$date);
      initialValues.execution_date = normalizeDateValue(initialValues.execution_date?.$date);
      setFormData(initialValues);
    }
    fetchPersons();
  }, [initialValues, isUpdate, token]);

  const handleSave = async () => {
    let dataToSend = {
      ...formData,
      date: { $date: formatDateISO8601(formData.date) },
      execution_date: { $date: formatDateISO8601(formData.execution_date) },
      value: parseInt(formData.value),
    };
    let responseBody;
    try {
      const url = isUpdate
        ? `${API_URL}/contracts/${formData.contract_number}`
        : `${API_URL}/contracts/${formData.indebted}`;

      const method = isUpdate ? "PUT" : "POST";

      if (dataToSend._id) {
        delete dataToSend._id;
      }

      console.log("Data to send:", dataToSend);
      dataToSend.debtors = dataToSend.debtors.filter((debtor) => debtor);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      responseBody = await response.text();
      let jsonResponse;

      if (response.ok) {
        onContractAdded();
        close();
        ToastQueue.positive(
          isUpdate
            ? "Contract updated successfully!"
            : "Contract created successfully!",
          { timeout: 3000 }
        );
      } else {
        try {
          jsonResponse = JSON.parse(responseBody);
        } catch (error) {
          jsonResponse = { error: "An unknown error occurred" };
        }
        console.error("Failed to save contract:", jsonResponse.error);
        ToastQueue.negative(jsonResponse.error, {
          timeout: 3000,
        });
      }
    } catch (error) {
      console.error("Error saving contract:", error);
      ToastQueue.negative(error.message || error, {
        timeout: 3000,
      });
    }
  };

  const fetchPersons = async () => {
    if (!token) {
      console.error("Token is not available");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/clients/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch clients");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <Form>
      <TextField
        label="Contract Number"
        value={formData.contract_number}
        onChange={(value) => handleInputChange("contract_number", value)}
        isRequired
        isDisabled={isUpdate}
      />
      <DateField
        label="Date"
        name="date"
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
        inputValue={formData.value.toString()}
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
      <DateField
        label="Execution Date"
        name="execution_date"
        value={formData.execution_date}
        onChange={(value) => handleInputChange("execution_date", value)}
      />
      {formData.debtors.map((debtor, index) => (
        <ComboBox
          key={index}
          label={`Debtor ${index + 1}`}
          defaultItems={clients}
          defaultInputValue={debtor}
          selectedKey={debtor}
          onSelectionChange={(key) => {
            const newDebtors = [...formData.debtors];
            newDebtors[index] = key;
            handleInputChange("debtors", newDebtors);
          }}
        >
          {(item) => <Item key={item.member_id}>{item.name}</Item>}
        </ComboBox>
      ))}

      <ButtonGroup>
        <Button variant="cta" onPress={handleSave}>
          {isUpdate ? "Update Contract" : "Add Contract"}
        </Button>
        <Button variant="secondary" onPress={close}>
          Close
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default ContractForm;

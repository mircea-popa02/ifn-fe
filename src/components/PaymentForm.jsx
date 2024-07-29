import { React, useState, useEffect, useRef } from "react";
import {
  Form,
  TextField,
  Button,
  ButtonGroup,
  DatePicker,
  ComboBox,
  Item
} from "@adobe/react-spectrum";
import { useAuth } from "../../context/AuthContext";
import { ToastQueue } from "@react-spectrum/toast";
import { formatDateISO8601, normalizeDateValue } from "../services/Utils";
import { API_URL } from "../services/config";

const PaymentForm = ({
  close,
  onPaymentAdded,
  initialValues = {},
  isUpdate = false,
}) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    member_id: "",
    value: "",
    date: ""
  });
  const [clients, setClients] = useState([]);
  const clientsFetchedRef = useRef(false); // Ref to track if clients have been fetched

  useEffect(() => {
    if (!clientsFetchedRef.current) {
      fetchPersons();
      clientsFetchedRef.current = true;
    }
    if (isUpdate && initialValues) {
      initialValues.date = normalizeDateValue(initialValues.date.$date);
      setFormData(initialValues);
    }
  }, [initialValues, isUpdate, token]);

  const handleSave = async () => {
    const submissionData = {
      ...formData,
      date: { $date: formatDateISO8601(formData.date) },
    };

    console.log("submissionData", submissionData);

    try {
      const url = isUpdate
        ? `${API_URL}/payments/${formData._id.$oid}`
        : `${API_URL}/payments/`;

      formData.value = parseFloat(formData.value);

      if (submissionData._id) {
        delete submissionData._id;
      }

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        ToastQueue.negative(errorMessage.error || "Failed to save payment", {
          timeout: 3000,
        });
        throw new Error(errorMessage.error || "Failed to save payment");
      }

      const responseMessage = await response.json();
      ToastQueue.positive(
        responseMessage.message || "Payment saved successfully",
        { timeout: 3000 }
      );
      onPaymentAdded();
      close();
    } catch (error) {
      console.error("Error saving payment:", error);
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
        method: "GET",
      });
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
    console.log("key", key, "value", value);
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <Form>
        <ComboBox
        key={clients}
        label="Client"
        defaultItems={clients}
        defaultInputValue={formData.member_id}
        selectedKey={formData.member_id}
        onSelectionChange={(key) => handleInputChange("member_id", key)}
      >
        {(item) => <Item key={item.member_id}>{item.name}</Item>}
      </ComboBox>
      <TextField
        label="Valoare"
        value={formData.value}
        onChange={(value) => handleInputChange("value", value)}
        isRequired
      />
      <DatePicker
        label="Data"
        onChange={(value) => handleInputChange("date", value)}
        isRequired
      />
      <ButtonGroup>
        <Button variant="cta" onPress={handleSave}>
          {isUpdate ? "Modifică" : "Adaugă"}
        </Button>
        <Button variant="secondary" onPress={close}>
          Anulează
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default PaymentForm;

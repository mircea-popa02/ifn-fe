import { React, useState, useEffect } from "react";
import {
  Form,
  TextField,
  Button,
  ButtonGroup,
  DatePicker,
} from "@adobe/react-spectrum";
import { useAuth } from "../../context/AuthContext";
import { ToastQueue } from "@react-spectrum/toast";
import { parseDate } from "@internationalized/date";

const PaymentForm = ({
  close,
  onPaymentAdded,
  initialValues = {},
  isUpdate = false,
}) => {
  const formatDefaultDate = (date) => {
    let month = String(date.getMonth() + 1);
    let year = date.getFullYear();
    let day = date.getDate().toString();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
  };

  const { token } = useAuth();
  const [date, setDate] = useState(parseDate(formatDefaultDate(new Date())));
  const [formData, setFormData] = useState({
    member_id: "",
    value: "",
    date: date,
  });

  const formatDate = (dateObj) => {
    // const year = dateObj.year;
    // const month = String(dateObj.month).padStart(2, "0");
    // const day = String(dateObj.day).padStart(2, "0");

    // return `${year}-${month}-${day}`;
    return new Date(dateObj).toISOString();
  };

  useEffect(() => {
    if (isUpdate && initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues, isUpdate]);

  const handleSave = async () => {
    try {
      const url = isUpdate
        ? `http://localhost:5000/payments/${formData._id.$oid}`
        : "http://127.0.0.1:5000/payments/";
      formData.value = parseInt(formData.value, 10);
      // formData.date = formatDate(formData.date);
      const dataToSend = { ...formData };
      dataToSend.date = formatDate(dataToSend.date);
      console.log(dataToSend);

      if (dataToSend._id) {
        delete dataToSend._id;
      }
      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
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

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <Form>
      <TextField
        label="Member ID"
        value={formData.member_id}
        onChange={(value) => handleInputChange("member_id", value)}
        isRequired
        isDisabled={isUpdate}
      />
      <TextField
        label="Valoare"
        value={formData.value}
        onChange={(value) => handleInputChange("value", value)}
        isRequired
      />
      <DatePicker
        label="Data"
        value={formData.date}
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

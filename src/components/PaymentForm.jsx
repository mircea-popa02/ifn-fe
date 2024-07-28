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
import { formatDateISO8601, normalizeDateValue } from "../services/Utils";

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

  useEffect(() => {
    console.log("Initial values:", initialValues);
    if (isUpdate && initialValues) {
      console.log("Initial values:", initialValues);
      initialValues.date = normalizeDateValue(initialValues.date.$date);
      setFormData(initialValues);
    }
  }, [initialValues, isUpdate]);

  const handleSave = async () => {
    const submissionData = {
      ...formData,
      date: { $date: formatDateISO8601(formData.date) },
    };

    try {
      const url = isUpdate
        ? `https://ifn-be-hwfo-master-g5ailnlqoq-wm.a.run.app/payments/${formData._id.$oid}`
        : "https://ifn-be-hwfo-master-g5ailnlqoq-wm.a.run.app/payments/";

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

import React, { useState } from "react";
import { Form, TextField, Button, ButtonGroup } from "@adobe/react-spectrum";
import { useAuth } from "../../context/AuthContext";

const ClientForm = ({ close, onClientAdded }) => {
  const [formData, setFormData] = useState({
    member_id: "",
    name: "",
    city: "",
    address: "",
    corespondence_address: "",
    county: "",
    identity_card: "",
    identity_card_series: "",
    identity_card_number: "",
    provided_by: "",
    provided_on: "",
    expires_on: "",
    social_security_number: "",
    work_phone: "",
    personal_phone: "",
    employer: "",
    revenue_certificate: "",
  });
  const { token } = useAuth();

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/client/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onClientAdded();
        close();
      } else {
        const errorData = await response.json();
        console.error("Failed to add person:", errorData.message);
      }
    } catch (error) {
      console.error("Error adding person:", error);
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
      />
      <TextField
        label="Name"
        value={formData.name}
        onChange={(value) => handleInputChange("name", value)}
        isRequired
      />
      <TextField
        label="City"
        value={formData.city}
        onChange={(value) => handleInputChange("city", value)}
      />
      <TextField
        label="Address"
        value={formData.address}
        onChange={(value) => handleInputChange("address", value)}
      />
      <TextField
        label="Correspondence Address"
        value={formData.corespondence_address}
        onChange={(value) => handleInputChange("corespondence_address", value)}
      />
      <TextField
        label="County"
        value={formData.county}
        onChange={(value) => handleInputChange("county", value)}
      />
      <TextField
        label="Identity Card"
        value={formData.identity_card}
        onChange={(value) => handleInputChange("identity_card", value)}
      />
      <TextField
        label="Identity Card Series"
        value={formData.identity_card_series}
        onChange={(value) => handleInputChange("identity_card_series", value)}
      />
      <TextField
        label="Identity Card Number"
        value={formData.identity_card_number}
        onChange={(value) => handleInputChange("identity_card_number", value)}
      />
      <TextField
        label="Provided By"
        value={formData.provided_by}
        onChange={(value) => handleInputChange("provided_by", value)}
      />
      <TextField
        label="Provided On"
        value={formData.provided_on}
        onChange={(value) => handleInputChange("provided_on", value)}
      />
      <TextField
        label="Expires On"
        value={formData.expires_on}
        onChange={(value) => handleInputChange("expires_on", value)}
      />
      <TextField
        label="Social Security Number"
        value={formData.social_security_number}
        onChange={(value) => handleInputChange("social_security_number", value)}
      />
      <TextField
        label="Work Phone"
        value={formData.work_phone}
        onChange={(value) => handleInputChange("work_phone", value)}
      />
      <TextField
        label="Personal Phone"
        value={formData.personal_phone}
        onChange={(value) => handleInputChange("personal_phone", value)}
      />
      <TextField
        label="Employer"
        value={formData.employer}
        onChange={(value) => handleInputChange("employer", value)}
      />
      <TextField
        label="Revenue Certificate"
        value={formData.revenue_certificate}
        onChange={(value) => handleInputChange("revenue_certificate", value)}
      />
      <ButtonGroup>
        <Button variant="cta" onPress={handleSave}>
          Adauga
        </Button>
        <Button variant="secondary" onPress={close}>
          Anuleaza
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default ClientForm;

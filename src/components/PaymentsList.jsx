import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const { token } = useAuth();

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:5000/payments/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch payments");
      }
      const data = await response.json();
      setPayments(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token]);  // Removed the extra comma here

  return (
    <div>
      <h1>Plati</h1>
    </div>
  );
};

export default PaymentsList;

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Form,
  TextField,
  View,
} from "@adobe/react-spectrum";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(username, password);
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login({ username }, data.access_token);
        navigate("/");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View
      UNSAFE_style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>Login</h1>
      <Form onSubmit={handleSubmit} maxWidth="size-3600" width="100%">
        <TextField
          label="Username"
          value={username}
          onChange={setUsername}
          isRequired
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          isRequired
        />
        <ButtonGroup>
          <Button type="submit" variant="cta">
            Login
          </Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </ButtonGroup>
      </Form>
    </View>
  );
};

export default Login;

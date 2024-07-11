import React from "react";
import {
  Tabs,
  TabList,
  Item,
  TabPanels,
  Header,
  Button,
  Content,
} from "@adobe/react-spectrum";
import { useLocation, useNavigate } from "react-router-dom";
import MembersList from "./MembersList";
import PersonsList from "./PersonsList";
import PaymentsList from "./PaymentsList";
import ContractsList from "./ContractsList";
import { useAuth } from "../../context/AuthContext";
import "./Home.css"

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { key: "one", title: "Membrii", component: <MembersList /> },
    { key: "two", title: "Persoane", component: <PersonsList /> },
    { key: "three", title: "Plati", component: <PaymentsList /> },
    { key: "four", title: "Contracte", component: <ContractsList /> },
  ];

  return (
    <Content UNSAFE_className="home-wrapper">
      <Header UNSAFE_className="home-header">
        <h1>Credit Sud Est</h1>
        <Button
          onPress={() => {
            logout();
            navigate("/login");
          }}
          variant="negative"
          style="fill"
        >
          Logout
        </Button>
      </Header>
      <Tabs aria-label="ifn tabs" UNSAFE_className="header">
        <TabList>
          {tabs.map((tab) => (
            <Item key={tab.key}>{tab.title}</Item>
          ))}
        </TabList>

        <TabPanels>
          {tabs.map((tab) => (
            <Item key={tab.key}>{tab.component}</Item>
          ))}
        </TabPanels>
      </Tabs>


    </Content>
  );
};

export default Home;

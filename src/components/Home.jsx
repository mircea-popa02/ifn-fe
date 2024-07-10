import React from "react";
import { Tabs, TabList, Item, TabPanels, Text } from "@adobe/react-spectrum";
import { useLocation } from "react-router-dom";
import MembersList from "./MembersList";
import PersonsList from "./PersonsList";
import PaymentsList from "./PaymentsList";
import ContractsList from "./ContractsList";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  const tabs = [
    { key: "one", title: "Membrii", component: <MembersList /> },
    { key: "two", title: "Persoane", component: <PersonsList /> },
    { key: "three", title: "Plati", component: <PaymentsList /> },
    { key: "four", title: "Contracte", component: <ContractsList /> },
  ];

  return (
    <>
      <Tabs aria-label="Dynamic Tabs Example">
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
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default Home;

import "@mantine/core/styles.css";

import {
  AppShell,
  Button,
  Stack,
  // Navbar,
  // Header,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, {
  LazyExoticComponent,
  Suspense,
  useEffect,
  useState,
} from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { loadModuleFederationImport } from "../../loadModuleFederationImport";
export const remoteConfig = {
  remoteApp2: "remoteApp2@http://localhost:3002/remoteEntry.js",
};
const loadRemoteComponent = loadModuleFederationImport(remoteConfig);

const HostApp = () => {
  const [RemoteComponent, setRemoteComponent] =
    useState<React.ComponentType<{}> | null>(null);
  const location = useLocation();
  const [LazyRemoteEntry, setLazyRemoteEntry] =
    useState<LazyExoticComponent<any> | null>(null);
  const resetRemoteComponent = () => {
    setRemoteComponent(null);
    setLazyRemoteEntry(null);
  };
  const loadRemoteComponent1 = async () => {
    const remoteApp1 = await import("remoteApp1/RemoteComponent1");
    setRemoteComponent(() => remoteApp1.default);
  };

  const loadRemoteEntry = async () => {
    try {
      const RemoteComponent2 = loadRemoteComponent(
        "remoteApp2/RemoteComponent2"
      );

      setLazyRemoteEntry(RemoteComponent2);
    } catch (error) {
      console.error("Error loading remote component:", error);
    }
  };

  useEffect(() => {
    const loadComponent = async () => {
      if (location.pathname === "/remote1") {
        await loadRemoteComponent1();
      } else if (location.pathname === "/remote2") {
        await loadRemoteEntry();
      }
    };

    loadComponent();
  }, [location.pathname]);
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 320,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Text ta="center" fz="xl" fw={700} style={{ lineHeight: "60px" }}>
          The Header
        </Text>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          <Text fw={500}>Left Navigation</Text>
          <Button component={Link} to="/" variant="light" fullWidth>
            Home
          </Button>
          <Button component={Link} to="/remote1" variant="light" fullWidth>
            Lazy load remote component
          </Button>
          <Button component={Link} to="/remote2" variant="light" fullWidth>
            Lazy load remote entry & component
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Text>Welcome to the Host App</Text>} />
            <Route
              path="/remote1"
              element={
                RemoteComponent ? (
                  <RemoteComponent />
                ) : (
                  <Text>Loading Remote 1...</Text>
                )
              }
            />
            <Route
              path="/remote2"
              element={
                LazyRemoteEntry ? (
                  <LazyRemoteEntry />
                ) : (
                  <Text>Loading Remote 2...</Text>
                )
              }
            />
          </Routes>
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
};

export default HostApp;

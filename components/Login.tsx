import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useGlobalStoreItem } from "@/hooks/useGlobalStore";
import { login } from "@/services/api";
import React from "react";
import { Button, StyleSheet, Text, TextInput } from "react-native";

export function Login() {
  const [host, setHost] = useGlobalStoreItem("baseUrl");
  const [port, setPort] = useGlobalStoreItem("port");
  const [username, setUsername] = useGlobalStoreItem("username");
  const [password, setPassword] = useGlobalStoreItem("password");

  const onLogin = async () => {
    try {
      await login(username, password);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.h1}>qB Remote</Text>
      <TextInput
        style={styles.input}
        value={host}
        onChangeText={setHost}
        placeholder="base url"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={`${port}`}
        onChangeText={(val) => setPort(Number(val))}
        placeholder="port"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="username"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
      />
      <Button title="Login" onPress={onLogin} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1e272e",
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  h1: { fontSize: 22, fontWeight: "600", color: "#d2dae2" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#d2dae2",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  name: { fontWeight: "600", color: "#d2dae2" },
});

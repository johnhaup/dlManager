import { QBClient } from "@/api/qb";
import { useGlobalStoreItem } from "@/hooks/useGlobalStore";
import * as DocumentPicker from "expo-document-picker";
import React, { useMemo, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenWrapper } from "./ScreenWrapper";

type Torrent = Awaited<ReturnType<QBClient["getTorrentsList"]>>[number];

export default function DownloadManager() {
  const [host] = useGlobalStoreItem("baseUrl");
  const [port] = useGlobalStoreItem("port");
  const url = port ? `${host}:${port}` : `${host}`;
  const client = useMemo(() => new QBClient(url), [url]);

  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [magnet, setMagnet] = useState("");

  const onAddMagnet = async () => {
    if (!magnet.trim()) return;
    try {
      await client.addMagnet(magnet.trim());
      setMagnet("");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onAddTorrentFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (res.canceled || !res.assets?.length) return;

      console.log(res);

      const file = res.assets[0]; // { uri, name?, mimeType? }

      await client.addTorrentFile({
        uri: file.uri,
        name: file.name ?? "file.torrent",
        type: file.mimeType ?? "application/x-bittorrent",
      });
    } catch (e: any) {
      alert(e?.message ?? "Failed to add .torrent");
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.h1}>Torrents</Text>

      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={magnet}
          onChangeText={setMagnet}
          placeholder="Paste magnet or URL"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button title="Add" onPress={onAddMagnet} />
        <Button title=".torrent" onPress={onAddTorrentFile} />
      </View>

      <FlatList
        style={{ marginTop: 12, alignSelf: "stretch" }}
        data={torrents}
        keyExtractor={(t) => t.hash}
        onRefresh={async () => setTorrents(await client.getTorrentsList("all"))}
        refreshing={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text>
              {item.state} • {(item.progress * 100).toFixed(1)}%
            </Text>
            <Text>
              ↓ {(item.dlspeed / 1024).toFixed(0)} KB/s • ↑{" "}
              {(item.upspeed / 1024).toFixed(0)} KB/s
            </Text>
            {item.eta > 0 && <Text>ETA: {formatEta(item.eta)}</Text>}
          </View>
        )}
      />
    </ScreenWrapper>
  );
}

function formatEta(s: number) {
  if (s <= 0 || !isFinite(s)) return "—";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return [h ? `${h}h` : null, m ? `${m}m` : null, `${sec}s`]
    .filter(Boolean)
    .join(" ");
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

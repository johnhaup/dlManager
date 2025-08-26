import { QBClient } from "@/api/qb";
import { useGlobalStoreItem } from "@/hooks/useGlobalStore";
import { addTorrentFile, getTorrentsList, logout } from "@/services/api";
import * as DocumentPicker from "expo-document-picker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Spacer } from "react-native-spacer-view";
import { ScreenWrapper } from "./ScreenWrapper";
import { TorrentItem } from "./TorrentItem";

type Torrent = Awaited<ReturnType<typeof getTorrentsList>>[number];

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

      if (res.canceled || !res.assets?.length) {
        return;
      }

      const file = res.assets[0]; // { uri, name?, mimeType? }

      await addTorrentFile({
        uri: file.uri,
        name: file.name ?? "file.torrent",
        type: file.mimeType ?? "application/x-bittorrent",
      });

      const torrents = await getTorrentsList();
      setTorrents(torrents);
    } catch (e: any) {
      console.error(e);

      alert(e?.message ?? "Failed to add .torrent");
    }
  };

  const fetchTorrents = useCallback(async () => {
    try {
      const newList = await getTorrentsList("all");
      setTorrents(newList);
    } catch (e: any) {
      console.log(e);
      alert(e?.message ?? "Failed to refresh torrents");
    }
  }, []);

  useEffect(() => {
    fetchTorrents();
  }, [fetchTorrents]);

  const keyExtractor = useCallback((item: Torrent) => item.hash, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Torrent>) => <TorrentItem torrent={item} />,
    [],
  );

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

      <Button title="Logout" onPress={logout} />

      <FlatList
        style={{ marginTop: 12 }}
        data={torrents}
        keyExtractor={keyExtractor}
        onRefresh={fetchTorrents}
        refreshing={false}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ItemSeparatorComponent={() => <Spacer height={8} />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  h1: { fontSize: 22, fontWeight: "600", color: "#d2dae2" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#d2dae2",
  },
  contentContainerStyle: {
    paddingHorizontal: 16,
  },
});

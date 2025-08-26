import { Torrent } from "@/services/types";
import { useThemeColors } from "@/styles/useThemeColors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  torrent: Torrent;
};

export function TorrentItem({ torrent }: Props) {
  const [backgroundColor] = useThemeColors(["cardBackground"]);
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.name} numberOfLines={1}>
        {torrent.name}
      </Text>
      <Text>
        {torrent.state} • {(torrent.progress * 100).toFixed(1)}%
      </Text>
      <Text>
        ↓ {(torrent.dlspeed / 1024).toFixed(0)} KB/s • ↑{" "}
        {(torrent.upspeed / 1024).toFixed(0)} KB/s
      </Text>
      {torrent.eta > 0 && <Text>ETA: {formatEta(torrent.eta)}</Text>}
    </View>
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
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  name: { fontWeight: "600", color: "#d2dae2" },
});

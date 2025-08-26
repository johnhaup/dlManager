import { Torrent } from "@/services/types";
import { useThemeColors } from "@/styles/useThemeColors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Spacer } from "react-native-spacer-view";
import { StyledText } from "./StyledText";

type Props = {
  torrent: Torrent;
};

export function TorrentItem({ torrent }: Props) {
  const [backgroundColor] = useThemeColors(["cardBackground"]);
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <StyledText style={styles.name}>{torrent.name}</StyledText>
      <Spacer height={4} />
      <StyledText>
        {torrent.state} • {(torrent.progress * 100).toFixed(1)}%
      </StyledText>
      <StyledText>
        ↓ {(torrent.dlspeed / 1024).toFixed(0)} KB/s • ↑{" "}
        {(torrent.upspeed / 1024).toFixed(0)} KB/s
      </StyledText>
      {torrent.eta > 0 && (
        <StyledText>ETA: {formatEta(torrent.eta)}</StyledText>
      )}
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

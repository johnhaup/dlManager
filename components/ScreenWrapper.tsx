import { useThemeColors } from "@/styles/useThemeColors";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
};

export function ScreenWrapper({ children }: Props) {
  const [backgroundColor] = useThemeColors(["screenBackground"]);
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top, backgroundColor }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { darkThemeColors, lightThemeColors } from "./palette";

type ThemeColor = keyof typeof lightThemeColors;

export function useThemeColors(keys: ThemeColor[]) {
  const colorScheme = useColorScheme();

  const themeColors = useMemo(
    () => (colorScheme === "dark" ? darkThemeColors : lightThemeColors),
    [colorScheme],
  );

  const colors = useMemo(
    () => keys.map((key) => themeColors[key] as string),
    [keys, themeColors],
  );

  return colors;
}

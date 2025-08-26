import { useThemeColors } from "@/styles/useThemeColors";
import { useMemo } from "react";
import { StyleSheet, TextProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

interface Props extends AnimatedProps<TextProps> {
  variant?: keyof typeof styles;
}

export function StyledText({ variant = "regular", style, ...rest }: Props) {
  const [defaultColor, button] = useThemeColors(["textDefault"]);

  const textStyles = useMemo(() => {
    const color = variant === "button" ? button : defaultColor;

    return [styles[variant], { color }, style];
  }, [button, defaultColor, style, variant]);

  return <Animated.Text {...rest} style={textStyles} />;
}

const styles = StyleSheet.create({
  regular: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    lineHeight: 16,
    textTransform: "uppercase",
  },
});

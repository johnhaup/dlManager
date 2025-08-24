import { useThemeColors } from "@/styles/useThemeColors";
import Entypo from "@expo/vector-icons/Entypo";
import { ComponentProps, useEffect } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  name: ComponentProps<typeof Entypo>["name"];
  onPress: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function IconButton({
  name,
  onPress,
  size = 32,
  color,
  style,
  disabled,
}: Props) {
  const [iconColor] = useThemeColors(["textDefault"]);
  const opacity = useSharedValue(disabled ? 0.5 : 1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.5 : 1);
  }, [disabled, opacity]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <Animated.View style={[style, animatedStyle]}>
        <Entypo name={name} size={size} color={color ?? iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
}

import { IconButton } from "@/components/IconButton";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";

export default function Web() {
  const _webviewRef = useRef<WebView>(null);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("https://expo.dev");
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  console.log({ canGoBack, canGoForward });

  const goToUrl = () => {
    setUrl(text);
  };

  const onNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    console.log(navState);
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  }, []);

  const source = useMemo(() => ({ uri: url }), [url]);

  const onBackPress = useCallback(() => {
    if (_webviewRef.current) {
      _webviewRef.current.goBack();
    }
  }, []);

  const onForwardPress = useCallback(() => {
    if (_webviewRef.current) {
      _webviewRef.current.goForward();
    }
  }, []);

  return (
    <ScreenWrapper>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Web Address"
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={goToUrl}
        keyboardType="url"
      />
      <WebView
        ref={_webviewRef}
        style={styles.webview}
        source={source}
        onNavigationStateChange={onNavigationStateChange}
      />
      <View style={{ flexDirection: "row" }}>
        <IconButton
          name="chevron-left"
          onPress={onBackPress}
          style={styles.button}
          disabled={!canGoBack}
        />

        <IconButton
          name="chevron-right"
          onPress={onForwardPress}
          style={styles.button}
          disabled={!canGoForward}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#d2dae2",
    height: 56,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  webview: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    height: 56,
    width: 56,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
});

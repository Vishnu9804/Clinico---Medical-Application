import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";

const ForgotPassword_AccountRecovered = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../../../../assets/BackGround.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Password Has been Updated Successefully!!!!
        </Text>
      </View>
    </ImageBackground>
  );
};

export default ForgotPassword_AccountRecovered;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  background: {
    flex: 1,
  },
  imageStyle: {
    opacity: 0.2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#1E90FF",
  },
});

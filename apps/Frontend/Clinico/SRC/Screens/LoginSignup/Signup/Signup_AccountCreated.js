import {
  ImageBackground,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";

const Signup_AccountCreated = ({ navigation }) => {
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
          Account Has been Created Successefully!!!!
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Signup_AccountCreated;

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

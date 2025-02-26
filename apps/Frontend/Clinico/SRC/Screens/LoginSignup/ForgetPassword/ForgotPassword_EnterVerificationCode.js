import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";

const ForgotPassword_EnterVerificationCode = ({ navigation, route }) => {
  const { useremail, userVerificationCode, role } = route.params;
  console.log(useremail, userVerificationCode);
  const [verificationcode, setVerificationcode] = useState("");
  const handleVerificationcode = () => {
    if (verificationcode == "") {
      alert("Enter Required Information!!!!");
    } else if (verificationcode != userVerificationCode) {
      alert("invalid Credential!!!!");
    } else {
      alert("Verification Code Matched");
      navigation.navigate("ForgotPassword_ChoosePassword", {
        useremail: useremail,
        role: role,
      });
    }
  };
  return (
    <ImageBackground
      source={require("../../../../assets/BackGround.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Enter Verification Code</Text>
        <Text style={styles.subText}>
          We have sent a verification code to your email. Please enter the code
          below.
        </Text>

        <Text style={styles.label}>Verification Code</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            placeholderTextColor="#999"
            keyboardType="numeric"
            onChangeText={(text) => setVerificationcode(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleVerificationcode}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backToLogin}>
          <Text
            style={styles.backToLoginText}
            onPress={() => navigation.navigate("Login")}
          >
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ForgotPassword_EnterVerificationCode;

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
  subText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: "#fff",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#1E90FF",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLogin: {
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 14,
    color: "#1E90FF",
    marginLeft: 4,
    fontWeight: "bold",
  },
});

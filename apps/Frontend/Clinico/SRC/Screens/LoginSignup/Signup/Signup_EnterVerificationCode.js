import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

const Signup_EnterVerificationCode = ({ navigation, route }) => {
  const { useremail, userVerificationCode, role } = route.params;
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerificationCode = () => {
    if (userVerificationCode != verificationCode) {
      alert("Code doesn't Matched!!!!");
    } else if (userVerificationCode == verificationCode) {
      alert("Verification code Matched!!!!");
      console.log(useremail);
      navigation.navigate("Signup_ChoosePassword", {
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
        <Text style={styles.instructionText}>
          We've sent a verification code to your email.
        </Text>

        <Text style={styles.label}>Verification Code</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            placeholderTextColor="#999"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerificationCode}
        >
          <Text style={styles.buttonText}>Verify Code</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={() => {
              /* Handle resend code */
            }}
            accessibilityLabel="Resend code"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Signup_EnterVerificationCode;

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
  instructionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
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
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  linkText: {
    fontSize: 14,
    color: "#1E90FF",
    marginLeft: 4,
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo vector icons
import { ImageBackground } from "react-native";

const Signup_ChoosePassword = ({ navigation, route }) => {
  const { useremail, role } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handlePassword = () => {
    if (password == "" || confirmPassword == "") {
      alert("Please enter password");
    } else if (password != confirmPassword) {
      alert("Password does not match");
    } else {
      if (role === "Doctor") {
        navigation.navigate("Signup_EnterInfo", {
          useremail: useremail,
          password: password,
        });
      } else if (role === "Staff") {
        console.log(useremail);
        navigation.navigate("Signup_StaffEnterInfo", {
          useremail: useremail,
          password: password,
        });
      } else {
        console.log(useremail);
        navigation.navigate("Signup_PatientEnterInfo", {
          useremail: useremail,
          password: password,
        });
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/BackGround.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Choose a Password</Text>
        <Text style={styles.instructionText}>
          Create a password for your account.
        </Text>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
            accessibilityLabel="Toggle password visibility"
            accessibilityRole="button"
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
            style={styles.eyeIcon}
            accessibilityLabel="Toggle confirm password visibility"
            accessibilityRole="button"
          >
            <Ionicons
              name={isConfirmPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePassword}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            accessibilityLabel="Log In"
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Signup_ChoosePassword;

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
    color: "#444",
    fontWeight: "bold",
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
  eyeIcon: {
    marginLeft: 8,
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

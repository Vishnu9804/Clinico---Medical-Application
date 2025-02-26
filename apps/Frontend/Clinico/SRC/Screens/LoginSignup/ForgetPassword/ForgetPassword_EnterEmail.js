import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const ForgetPassword_EnterEmail = ({ navigation, route }) => {
  const { role } = route.params;
  const [doc_email, setEmail] = useState("");

  const handleEmail = () => {
    console.log(role);
    if (role === "Doctor") {
      handleDoctorEmail();
    } else if (role === "Staff") {
      handleStaffEmail();
    } else {
      handlePatientEmail();
    }
  };

  const handleDoctorEmail = () => {
    if (doc_email === "") {
      alert("Enter Required Information!!!!");
    } else {
      fetch("http://192.168.122.149:3000/verifyfp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_email: doc_email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "Invalid Credentials") {
            alert("Invalid Credentials");
          } else if (data.message === "Verification Code Sent to your Email") {
            alert(data.message);
            navigation.navigate("ForgotPassword_EnterVerificationCode", {
              useremail: data.doc_email,
              userVerificationCode: data.VerificationCode,
              role: role,
            });
          }
        });
    }
  };

  const handleStaffEmail = () => {
    if (doc_email === "") {
      alert("Enter Required Information!!!!");
    } else {
      fetch("http://192.168.122.149:3000/sverifyfp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staff_email: doc_email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "Invalid Credentials") {
            alert("Invalid Credentials");
          } else if (data.message === "Verification code sent to your email") {
            alert(data.message);
            navigation.navigate("ForgotPassword_EnterVerificationCode", {
              useremail: data.staff_email,
              userVerificationCode: data.verificationCode,
              role: role,
            });
          }
        });
    }
  };

  const handlePatientEmail = () => {
    if (doc_email === "") {
      alert("Enter Required Information!!!!");
    } else {
      fetch("http://192.168.122.149:3000/pverifyfp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pat_email: doc_email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "Invalid Credentials") {
            alert("Invalid Credentials");
          } else if (data.message === "Verification Code Sent to your Email") {
            alert(data.message);
            navigation.navigate("ForgotPassword_EnterVerificationCode", {
              useremail: data.pat_email,
              userVerificationCode: data.VerificationCode,
              role: role,
            });
          }
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
        <Text style={styles.headerText}>Reset Your Password</Text>
        <Text style={styles.subText}>
          Enter your email address to reset your password
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor="#999"
            value={doc_email}
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleEmail}>
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

export default ForgetPassword_EnterEmail;

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

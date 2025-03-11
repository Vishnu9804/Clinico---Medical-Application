import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo vector icons

const Signup_EnterEmail = ({ navigation, route }) => {
  const { role } = route.params;
  const [doc_email, setEmail] = useState("");
  // const [loading, setLoading] = useState("");

  const handleEmail = () => {
    if (role === "Doctor") {
      handleDoctorEmail();
    } else if (role === "Staff") {
      handleStaffEmail();
    } else {
      handlePatientEmail();
    }
  };

  const handleDoctorEmail = () => {
    if (doc_email == "") {
      alert("Please enter email");
    } else {
      // setLoading(true);
      fetch("http://192.168.128.149:3000/verify", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "Please add all fields") {
            alert("Please add all fields");
            // setLoading(false);
          } else if (data.error === "Invalid Email") {
            alert("Please Enter Unique Email");
            // setLoading(false);
          } else if (data.message === "Verification code sent to your Email") {
            // setLoading(false);
            alert("Verification Code Send to Your Email");
            navigation.navigate("Signup_EnterVerificationCode", {
              useremail: data.doc_email,
              userVerificationCode: data.verificationCode,
              role: role,
            });
          }
        });
    }
  };

  const handlePatientEmail = () => {
    if (doc_email == "") {
      alert("Please enter email");
    } else {
      // setLoading(true);
      console.log(doc_email);
      fetch("http://192.168.128.149:3000/pverify", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pat_email: doc_email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "Please add all fields") {
            alert("Please add all fields");
            // setLoading(false);
          } else if (data.error === "Invalid Email") {
            alert("Please Enter Unique Email");
            // setLoading(false);
          } else if (data.message === "Verification code sent to your Email") {
            // setLoading(false);
            alert("Verification Code Send to Your Email");
            navigation.navigate("Signup_EnterVerificationCode", {
              useremail: data.pat_email,
              userVerificationCode: data.verificationCode,
              role: role,
            });
          }
        });
    }
  };

  const handleStaffEmail = () => {
    if (doc_email == "") {
      alert("Please enter email");
    } else {
      // setLoading(true);
      fetch("http://192.168.128.149:3000/sverify", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staff_email: doc_email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "Please add all fields") {
            alert("Please add all fields");
            // setLoading(false);
          } else if (data.error === "Invalid Email") {
            alert("Please Enter Unique Email");
            // setLoading(false);
          } else if (data.message === "Verification code sent to your Email") {
            // setLoading(false);
            alert("Verification Code Send to Your Email");
            navigation.navigate("Signup_EnterVerificationCode", {
              useremail: data.staff_email,
              userVerificationCode: data.verificationCode,
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
        <Text style={styles.welcomeText}>Sign Up</Text>
        <Text style={styles.signInText}>Create an account to get started</Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Email Address"
            placeholderTextColor="#999"
            value={doc_email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleEmail}>
          <Text style={styles.signInButtonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={handleEmail}
            accessibilityLabel="Log In"
            accessibilityRole="button"
          >
            <Text style={styles.signUpText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Signup_EnterEmail;

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
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  signInText: {
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
  signInButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  signInButtonText: {
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
  signUpText: {
    fontSize: 14,
    color: "#1E90FF",
    marginLeft: 4,
    fontWeight: "bold",
  },
});

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";

const ForgotPassword_ChoosePassword = ({ navigation, route }) => {
  const { useremail, role } = route.params;
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  // const [loading, setLoading] = useState(false);
  const handlePassword = () => {
    if (role === "Doctor") {
      handleDoctorPassword();
    } else if (role === "Staff") {
      handleStaffPassword();
    } else {
      handlePatientPassword();
    }
  };

  const handleDoctorPassword = () => {
    if (password == "" || confirmpass == "") {
      alert("Please Enter Required Information!!!!");
    } else if (password != confirmpass) {
      alert("Password does not match!!!!");
    } else {
      // setLoading(true);
      fetch("http://192.168.122.149:3000/resetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_email: useremail, password: password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Password Updated Succefully!!!!") {
            // setLoading(false);
            // alert(data.message);
            navigation.navigate("ForgotPassword_AccountRecovered");
          } else {
            // setLoading(false);
            alert("Something went wrong");
          }
        })
        .catch((err) => {
          // setLoading(false);
          alert(err);
        });
    }
  };

  const handlePatientPassword = () => {
    if (password == "" || confirmpass == "") {
      alert("Please Enter Required Information!!!!");
    } else if (password != confirmpass) {
      alert("Password does not match!!!!");
    } else {
      // setLoading(true);
      fetch("http://192.168.122.149:3000/presetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pat_email: useremail, pat_pass: password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Password Updated Successfully!!!!") {
            navigation.navigate("ForgotPassword_AccountRecovered");
          } else {
            alert("Something went wrong");
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const handleStaffPassword = () => {
    if (password == "" || confirmpass == "") {
      alert("Please Enter Required Information!!!!");
    } else if (password != confirmpass) {
      alert("Password does not match!!!!");
    } else {
      // setLoading(true);
      fetch("http://192.168.122.149:3000/sresetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staff_email: useremail, password: password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Password Updated Successfully!!!!") {
            navigation.navigate("ForgotPassword_AccountRecovered");
          } else {
            alert("Something went wrong");
          }
        })
        .catch((err) => {
          alert(err);
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
        <Text style={styles.headerText}>Choose a New Password</Text>
        <Text style={styles.subText}>
          Enter and confirm your new password below to reset your password.
        </Text>

        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter New Password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={(text) => setConfirmpass(text)}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handlePassword}>
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

export default ForgotPassword_ChoosePassword;

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

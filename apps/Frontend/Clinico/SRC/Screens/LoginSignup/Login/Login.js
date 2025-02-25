import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [doc_email, setDocEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Doctor");

  const handleLogin = () => {
    if (selectedRole === "Doctor") {
      handleDoctorLogin();
    } else if (selectedRole === "Staff") {
      handleStaffLogin();
    } else {
      handlePatientLogin();
    }
  };

  const handleDoctorLogin = () => {
    if (!doc_email || !password) {
      alert("Please fill out all fields");
    } else {
      fetch("http://192.168.160.149:3000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_email, password }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.message === "Successfully Signed In") {
            await AsyncStorage.setItem("user", JSON.stringify(data));
            navigation.navigate("Mainpage", { data });
          } else {
            alert(data.error);
          }
        })
        .catch((err) => {
          console.error("Network error:", err);
          alert("Something went wrong. Please try again.");
        });
    }
  };

  const handleStaffLogin = () => {
    if (!doc_email || !password) {
      alert("Please fill out all fields");
      return;
    }

    fetch("http://192.168.160.149:3000/ssignin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        staff_email: doc_email,
        password: password, // Fixed key name
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log("Response:", data); // Debugging log

        if (data.message === "Successfully Signed In") {
          await AsyncStorage.setItem("user", JSON.stringify(data));
          console.log(data.user.designation);
          if (data.user.designation === "Admin") {
            console.log("Yess he is admin");
            navigation.navigate("AdminMainpage", { data });
          }
        } else {
          alert(data.error);
        }
      })
      .catch((err) => {
        console.error("Network error:", err);
        alert("Something went wrong. Please try again.");
      });
  };

  const handlePatientLogin = () => {
    if (!doc_email || !password) {
      alert("Please fill out all fields");
      return;
    }

    fetch("http://192.168.160.149:3000/psignin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pat_email: doc_email,
        pat_pass: password,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.message === "Successfully Signed In") {
          await AsyncStorage.setItem("user", JSON.stringify(data));
          navigation.navigate("PatientMainpage", { data });
        } else {
          alert(data.error);
        }
      })
      .catch((err) => {
        console.error("Network error:", err);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <ImageBackground
      source={require("../../../../assets/BackGround.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Clinico</Text>

        <Text style={styles.label}>Role</Text>
        <View style={styles.radioContainer}>
          {[
            {
              role: "Doctor",
              image: require("../../../../assets/DoctorPic.png"),
            },
            {
              role: "Staff",
              image: require("../../../../assets/StaffPic.png"),
            },
            {
              role: "Patient",
              image: require("../../../../assets/PatientPic.png"),
            },
          ].map(({ role, image }) => (
            <TouchableOpacity key={role} onPress={() => setSelectedRole(role)}>
              <Image
                source={image}
                style={{
                  width: 100,
                  height: 100,
                  borderWidth: selectedRole === role ? 2 : 0,
                  borderColor: "#1E90FF",
                  borderRadius: 10,
                  alignSelf: "center",
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#36454F",
                  marginTop: 4,
                }}
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Username or Email"
            placeholderTextColor="#999"
            value={doc_email}
            onChangeText={(text) => setDocEmail(text)}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#999"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ForgotPassword_EnterEmail", {
                role: selectedRole,
              })
            }
          >
            <Text style={styles.forgotPasswordText}>Forget Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Signup_EnterEmail", { role: selectedRole })
            }
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;

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
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    marginHorizontal: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1E90FF",
  },
  radioText: {
    fontSize: 16,
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1E90FF",
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

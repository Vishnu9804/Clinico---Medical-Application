import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import PhoneInput from "react-native-phone-number-input";
import DatePicker from "react-native-modern-datepicker";

const Signup_PatientEnterInfo = ({ navigation, route }) => {
  const { useremail, password } = route.params;
  const phoneInput = useRef(null);

  const [fullName, setFullName] = useState("");
  const [personalPhoneNumber, setPersonalPhoneNumber] = useState("");
  const [patGender, setPatGender] = useState("");
  const [patDob, setPatDob] = useState("");

  const handleSignUp = () => {
    if (
      !password ||
      !useremail ||
      !fullName ||
      !personalPhoneNumber ||
      !patDob ||
      !patGender
    ) {
      alert("Please fill out all fields");
      console.log("fullname :- " + fullName);
      console.log("fullname :- " + patDob);
    } else {
      fetch("http://192.168.122.149:3000/psignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pat_pass: password,
          pat_email: useremail,
          pat_name: fullName,
          pat_phone: personalPhoneNumber,
          pat_dob: patDob,
          pat_gender: patGender,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "User Registered Successfully") {
            navigation.navigate("Signup_AccountCreated");
          } else {
            alert(data.error || "Please try again");
          }
        })
        .catch((err) => {
          console.error("Network error:", err);
          alert("Something went wrong. Please try again.");
        });
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/BackGround.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text style={styles.title}>Patient Information</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>

        {/* Name Field */}
        <View style={styles.formGroup}>
          <Icon name="person" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter First and Last Name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Phone Number Field with Country Flag */}
        <View style={styles.phoneInputContainer}>
          <PhoneInput
            ref={phoneInput}
            defaultValue={personalPhoneNumber}
            defaultCode="IN"
            layout="first"
            placeholder="Enter Mobile Number"
            onChangeText={setPersonalPhoneNumber}
            containerStyle={styles.phoneInputInnerContainer}
            textContainerStyle={styles.phoneTextInput}
          />
        </View>

        {/* Gender Field with Radio Buttons */}
        <View style={styles.formGroup}>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                patGender === "Male" && styles.selectedRadio,
              ]}
              onPress={() => setPatGender("Male")}
            >
              <Text style={styles.radioText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                patGender === "Female" && styles.selectedRadio,
              ]}
              onPress={() => setPatGender("Female")}
            >
              <Text style={styles.radioText}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DOB Field */}
        <View style={styles.calender}>
          <Icon name="cake" size={20} style={styles.icon} />
          <DatePicker
            mode="calendar"
            onDateChange={setPatDob}
            selected={patDob}
            style={styles.datePicker}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Signup_PatientEnterInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  background: {
    flex: 1,
  },
  imageStyle: {
    opacity: 0.2,
  },
  title: {
    marginTop: 210,
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
  },
  formGroup: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1E90FF",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  calender: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#1E90FF",
    borderRadius: 20,
    padding: 8,
    paddingBottom: 20,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
  },
  datePicker: {
    width: "100%",
    maxWidth: 300,
    alignSelf: "center",
  },
  phoneInputContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  phoneInputInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#1E90FF",
    borderRadius: 20,
    overflow: "hidden",
  },
  phoneTextInput: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
    color: "#000000",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  radioButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#1E90FF",
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  selectedRadio: {
    backgroundColor: "#1E90FF",
  },
  radioText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  registerButton: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    margin: 15,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 100,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  loginLink: {
    fontSize: 14,
    color: "#1E90FF",
    marginLeft: 4,
    fontWeight: "bold",
  },
});

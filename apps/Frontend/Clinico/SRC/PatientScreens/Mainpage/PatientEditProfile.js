import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import PhoneInput from "react-native-phone-number-input";
import DatePicker from "react-native-modern-datepicker";
import { format } from "date-fns";

const PatientEditProfile = ({ navigation, route }) => {
  const {
    pat_email,
    pat_name,
    pat_phone,
    pat_dob,
    pat_gender,
    pat_profilepic,
    pat_add,
  } = route.params;

  console.log(pat_dob);
  const phoneInput = useRef(null);

  const [fullName, setFullName] = useState(pat_name || "");
  const [personalPhoneNumber, setPersonalPhoneNumber] = useState(
    pat_phone || ""
  );
  const [docDob, setDocDob] = useState(pat_dob || "");
  const [docGender, setDocGender] = useState(pat_gender || "");

  const handleUpdateProfile = () => {
    if (
      !pat_email ||
      !fullName ||
      !personalPhoneNumber ||
      !docDob ||
      !docGender
    ) {
      alert("Please fill out all fields");
    } else {
      fetch("http://192.168.125.149:3000/updatepatient", {
        method: "POST", // or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pat_email: pat_email, // Required to identify the doctor
          pat_name: fullName,
          pat_phone: personalPhoneNumber,
          pat_dob: docDob,
          pat_gender: docGender,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Profile updated successfully") {
            alert("Profile updated successfully You Have To LogIn Once Again");
            navigation.navigate("Login"); // Adjust the screen to navigate to after success
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

  useEffect(() => {
    if (pat_dob) {
      // Format the date if necessary
      const formattedDob = format(new Date(pat_dob), "yyyy-MM-dd");
      setDocDob(formattedDob);
    }
  }, [pat_dob]);

  return (
    <ImageBackground
      source={require("../../../assets/BackGround.png")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text style={styles.title}>Update Profile</Text>
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

        <View style={styles.formGroup}>
          <View style={styles.radioContainer}>
            {/* Male Button */}
            <TouchableOpacity
              style={[
                styles.radioButton,
                docGender === "Male" && styles.selectedRadio, // Apply selected style if "Male"
              ]}
              onPress={() => setDocGender("Male")}
            >
              <Text
                style={[
                  styles.radioText,
                  docGender === "Male" && { color: "#fff" }, // Change text color for selected state
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            {/* Female Button */}
            <TouchableOpacity
              style={[
                styles.radioButton,
                docGender === "Female" && styles.selectedRadio, // Apply selected style if "Female"
              ]}
              onPress={() => setDocGender("Female")}
            >
              <Text
                style={[
                  styles.radioText,
                  docGender === "Female" && { color: "#fff" }, // Change text color for selected state
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DOB Field */}
        <View style={styles.calender}>
          <Icon name="cake" size={20} style={styles.icon} />
          <DatePicker
            mode="calendar"
            current={docDob}
            selected={docDob}
            onDateChange={setDocDob}
            style={styles.datePicker}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.registerText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default PatientEditProfile;

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

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

const EditProfile = ({ navigation, route }) => {
  const {
    doc_email,
    doc_name,
    doc_phone,
    doc_exp,
    doc_spec,
    doc_dob,
    doc_degree,
    doc_gender,
    clinic_phone,
    clinic_name,
    clinic_add,
    clinic_time,
  } = route.params;

  console.log(doc_dob, clinic_phone);
  const phoneInput = useRef(null);

  const [fullName, setFullName] = useState(doc_name || "");
  const [clinicName, setClinicName] = useState(clinic_name || "");
  const [clinicAddress, setClinicAddress] = useState(clinic_add || "");
  const [personalPhoneNumber, setPersonalPhoneNumber] = useState(
    doc_phone || ""
  );
  const [clinicPhoneNumber, setClinicPhoneNumber] = useState(
    clinic_phone || ""
  );
  const [docDob, setDocDob] = useState(doc_dob || "");
  const [docGender, setDocGender] = useState(doc_gender || "");
  const [docSpec, setDocSpec] = useState(doc_spec || "");
  const [docDegree, setDocDegree] = useState(doc_degree || "");
  const [docExp, setDocExp] = useState(doc_exp?.toString() || "");
  const [clinicTime, setClinicTime] = useState(clinic_time || "");

  const handleUpdateProfile = () => {
    if (
      !doc_email ||
      !fullName ||
      !personalPhoneNumber ||
      !clinicName ||
      !clinicPhoneNumber ||
      !clinicAddress ||
      !docDob ||
      !docGender ||
      !docSpec ||
      !docDegree ||
      !docExp ||
      !clinicTime
    ) {
      alert("Please fill out all fields");
    } else {
      fetch("http://192.168.128.149:3000/updateprofile", {
        method: "POST", // or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_email: doc_email, // Required to identify the doctor
          doc_name: fullName,
          doc_phone: personalPhoneNumber,
          doc_dob: docDob,
          doc_spec: docSpec,
          doc_gender: docGender,
          doc_degree: docDegree,
          doc_exp: docExp,
          clinic_time: clinicTime,
          clinic_name: clinicName,
          clinic_phone: clinicPhoneNumber,
          clinic_add: clinicAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Profile updated successfully") {
            alert("Profile updated successfully");
            navigation.navigate("Mainpage"); // Adjust the screen to navigate to after success
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
    if (doc_dob) {
      // Format the date if necessary
      const formattedDob = format(new Date(doc_dob), "yyyy-MM-dd");
      setDocDob(formattedDob);
    }
  }, [doc_dob]);

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

        {/* Clinic Name Field */}
        <View style={styles.formGroup}>
          <Icon name="business" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Clinic Name"
            value={clinicName}
            onChangeText={setClinicName}
          />
        </View>

        {/* Clinic Phone Field */}
        <View style={styles.phoneInputContainer}>
          <PhoneInput
            ref={phoneInput}
            defaultValue={clinicPhoneNumber}
            defaultCode="IN"
            layout="first"
            placeholder="Enter Clinic Contact Number"
            onChangeText={setClinicPhoneNumber}
            containerStyle={styles.phoneInputInnerContainer}
            textContainerStyle={styles.phoneTextInput}
          />
        </View>

        {/* Clinic Address Field */}
        <View style={styles.formGroup}>
          <Icon name="location-on" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Clinic Address"
            value={clinicAddress}
            onChangeText={setClinicAddress}
          />
        </View>

        {/* Specialization Field */}
        <View style={styles.formGroup}>
          <Icon name="school" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Specialization"
            value={docSpec}
            onChangeText={setDocSpec}
          />
        </View>

        {/* Degree Field */}
        <View style={styles.formGroup}>
          <Icon name="school" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Degree"
            value={docDegree}
            onChangeText={setDocDegree}
          />
        </View>

        {/* Experience Field */}
        <View style={styles.formGroup}>
          <Icon name="work" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Years of Experience"
            value={docExp.toString()}
            onChangeText={setDocExp}
            keyboardType="numeric"
          />
        </View>

        {/* Clinic Time Field */}
        <View style={styles.formGroup}>
          <Icon name="access-time" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Clinic Hours"
            value={clinicTime}
            onChangeText={setClinicTime}
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

export default EditProfile;

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

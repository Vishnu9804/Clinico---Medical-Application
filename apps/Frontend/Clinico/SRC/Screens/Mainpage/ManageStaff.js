import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SectionList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Bottomnavbar from "../../Components/Bottomnavbar";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import StaffProfile from "../../StaffScreens/Mainpage/StaffProfile";

const ManageStaff = ({ navigation }) => {
  const [staff, setStaff] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [staffEmail, setStaffEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [categories, setCategories] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editStaffEmail, setEditStaffEmail] = useState("");

  const sectionListRef = useRef(null);

  useEffect(() => {
    loadStaff();
    loadCategories();
  }, []);

  const addStaff = async (staffEmail, designation) => {
    try {
      const value = await AsyncStorage.getItem("user");
      const doc_email = JSON.parse(value).user.doc_email;

      fetch("http://192.168.128.149:3000/add-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_email,
          staff_email: staffEmail,
          designation,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
            loadStaff();
            setAddModalVisible(false);
            setEditModalVisible(false);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Something went wrong! Please try again.");
        });
    } catch (error) {
      console.error("AsyncStorage Error:", error);
      alert("Failed to retrieve user data.");
    }
  };

  const removeStaff = async (staffEmail) => {
    try {
      const value = await AsyncStorage.getItem("user");
      const doc_email = JSON.parse(value).user.doc_email;

      fetch("http://192.168.128.149:3000/remove-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_email,
          staff_email: staffEmail,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
            loadStaff();
            setEditModalVisible(false);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Something went wrong! Please try again.");
        });
    } catch (error) {
      console.error("AsyncStorage Error:", error);
      alert("Failed to retrieve user data.");
    }
  };

  const loadCategories = () => {
    AsyncStorage.getItem("user").then((value) => {
      if (value) {
        const userData = JSON.parse(value);
        const doc_email = userData.user.doc_email;

        fetch("http://192.168.128.149:3000/showstaffcategories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doc_email }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.categories) {
              setCategories(data.categories);
            } else {
              console.error("Error fetching categories: ", data.error);
            }
          })
          .catch((error) => console.error("Fetch error: ", error));
      } else {
        console.error("No user data found in AsyncStorage");
      }
    });
  };

  const loadStaff = () => {
    AsyncStorage.getItem("user").then((value) => {
      const doc_email = JSON.parse(value).user.doc_email;
      fetch("http://192.168.128.149:3000/showstaff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_email }),
      })
        .then((response) => response.json())
        .then((data) => {
          setStaff(data.staff || []);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Error", "Error fetching staff");
        });
    });
  };

  const getSections = () => {
    return categories
      .map((category) => ({
        title: category,
        data: staff.filter((item) => item.designation === category),
      }))
      .filter((section) => section.data.length > 0);
  };

  const scrollToCategory = (category) => {
    const index = getSections().findIndex(
      (section) => section.title === category
    );
    if (index !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => {
        navigation.navigate("StaffProfile", {
          staff_email: item.staff_email,
        });
      }}
      onLongPress={() => {
        setEditStaffEmail(item.staff_email);
        setEditModalVisible(true);
      }}
    >
      <Image
        source={require("../../../assets/MaleProfile.jpg")}
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{item.staff_email}</Text>
        <Text style={styles.subtitleText}>{item.designation}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Horizontal Category Buttons */}
      <View style={styles.scrollContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => scrollToCategory(item)}
            >
              <Text style={styles.categoryButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* SectionList for Staff */}
      <SectionList
        ref={sectionListRef}
        sections={getSections()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.categoryTitle}>{title}</Text>
        )}
      />

      <Bottomnavbar navigation={navigation} page={"ManageStaff"} />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Staff Modal */}
      <Modal animationType="slide" transparent={true} visible={addModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Staff</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Staff Email"
              value={staffEmail}
              onChangeText={setStaffEmail}
            />
            <View style={styles.picker}>
              <Picker
                selectedValue={designation}
                onValueChange={(itemValue) => setDesignation(itemValue)}
              >
                <Picker.Item label="Select Designation" value="" />
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => addStaff(staffEmail, designation)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Edit Staff Model */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Staff</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Staff Email"
              value={editStaffEmail}
              editable={false}
            />
            <View style={styles.picker}>
              <Picker
                selectedValue={designation}
                onValueChange={(itemValue) => setDesignation(itemValue)}
              >
                <Picker.Item label="Select Designation" value="" />
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => addStaff(editStaffEmail, designation)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => removeStaff(editStaffEmail)}
            >
              <Text style={styles.modalCancelButtonText}>Remove Staff</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageStaff;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scrollContainer: { paddingBottom: 10 },
  categoryButton: {
    height: "auto",
    backgroundColor: "#00A9FF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#00A9FF",
    borderRadius: 45,
    padding: 12,
    marginBottom: 10,
  },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  textContainer: { flex: 1 },
  nameText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  subtitleText: { fontSize: 14, color: "#666" },
  floatingButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#00A9FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonText: { fontSize: 30, color: "#fff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#00A9FF",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },

  closeButton: {
    padding: 5,
  },

  closeButtonText: {
    fontSize: 20,
    color: "grey",
    fontWeight: "bold",
  },
  modalCancelButton: {
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalCancelButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  picker: {
    width: "100%",
    height: "auto",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
});

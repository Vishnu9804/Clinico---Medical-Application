import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import Bottomnavbar from "../../Components/Bottomnavbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";

const Search = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchedPatient, setSearchedPatient] = useState(null);

  // Load the patient list from the backend
  const loadPatient = () => {
    AsyncStorage.getItem("user")
      .then((value) => {
        const doc_email = JSON.parse(value).user.doc_email;

        // Fetch patients from the backend
        fetch("http://192.168.128.149:3000/searchpatient", {
          method: "POST", // Changed to POST to send doc_email
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doc_email }), // Send doctor email in the body
        })
          .then((response) => response.json())
          .then((data) => {
            setPatients(data.patients || []); // Update patients state
          })
          .catch((error) => {
            console.error(error);
            Alert.alert("Error", "Error fetching patients");
          });
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Error fetching user data");
      });
  };

  useEffect(() => {
    loadPatient();
  });

  const patientSearch = () => {
    if (!searchInput.trim()) {
      Alert.alert("Error", "Please enter a patient email.");
      return;
    }

    console.log(searchInput);
    fetch("http://192.168.128.149:3000/find-patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pat_email: searchInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          Alert.alert("Error", data.error);
          setSearchedPatient(null);
        } else {
          setSearchedPatient(data.patient); // Store patient data in state
        }
      })
      .catch((error) => {
        console.error("Search error:", error);
        Alert.alert("Error", "Failed to search for patient.");
      });
  };

  const patientAdd = async (pat_email) => {
    try {
      const value = await AsyncStorage.getItem("user");
      const doc_email = JSON.parse(value).user.doc_email;

      fetch("http://192.168.128.149:3000/add-visiting-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_email, pat_email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            console.log(data.message);
            loadPatient;
          } else {
            console.log("Error:", data);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } catch (error) {
      console.error("AsyncStorage error:", error);
    }
  };

  const patientRemove = async (pat_email) => {
    try {
      const value = await AsyncStorage.getItem("user");
      const doc_email = JSON.parse(value).user.doc_email;

      // Call backend API to remove the patient
      fetch("http://192.168.128.149:3000/remove-visiting-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_email, pat_email }), // Send doctor and patient email
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            console.log(data.message);
            // Optionally, update UI or refresh patient list
            loadPatient(); // Reload patient list after removal
          } else {
            Alert.alert("Error", "Failed to remove patient");
          }
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Error", "Error removing patient");
        });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error fetching user data");
    }
  };

  const handleAdd = () => {
    setSearchedPatient(null); // Clear patient data
    setSearchInput(""); // Clear input field
  };

  const resetModal = () => {
    setModalVisible(false);
    setSearchInput(""); // Reset input field
    setSearchedPatient(null); // Clear patient data
  };

  // Handle the sending of the request
  const handleSentRequest = (patientEmail) => {
    AsyncStorage.getItem("user")
      .then((value) => {
        const doc_email = JSON.parse(value).user.doc_email;

        // Make the API call to send the permission request
        fetch("http://192.168.128.149:3000/request-permission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doc_email, pat_email: patientEmail }), // Pass doc_email and patientEmail in the body
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              Alert.alert("Success", data.message); // Show success message
            } else {
              Alert.alert("Error", "Something went wrong");
            }
          })
          .catch((error) => {
            console.error(error);
            Alert.alert("Error", "Error sending request");
          });
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Error fetching user data");
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Patient Search</Text>
        <View style={styles.cardContainer}>
          {patients.map((patient, index) => (
            <TouchableOpacity
              style={styles.profileCard}
              onPress={() =>
                navigation.navigate("PatientProfile", {
                  pat_email: patient.email,
                })
              }
            >
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{patient.name}</Text>
                <Text style={styles.subtitleText}>Email: {patient.email}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  patient.status === "pending"
                    ? { backgroundColor: "#808080" } // Grey for pending
                    : patient.status === "granted"
                    ? { backgroundColor: "#4CAF50" } // Green for granted
                    : { backgroundColor: "#2196F3" }, // Blue for not yet requested
                ]}
                onPress={() => {
                  if (patient.status === "not") {
                    handleSentRequest(patient.email); // Call handleSentRequest only for 'not' status
                  } else {
                    Alert.alert("Info", "No action needed"); // Show info for granted/pending
                  }
                }}
                disabled={patient.status !== "not"} // Disable button if not "not" status
              >
                <Text
                  style={[
                    styles.buttonText,
                    patient.status === "pending"
                      ? { color: "#FFF" }
                      : patient.status === "granted"
                      ? { color: "#FFF" }
                      : { color: "#FFF" },
                  ]}
                >
                  {patient.status === "pending"
                    ? "Pending"
                    : patient.status === "granted"
                    ? "View Reports"
                    : "Send Request"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => patientRemove(patient.email)}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => resetModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Patient</Text>
              <TouchableOpacity style={styles.closeButton} onPress={resetModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter patient name or email"
              value={searchInput}
              onChangeText={(text) => {
                setSearchInput(text);
                setSearchedPatient(null); // Clear previous patient data when text changes
              }}
            />

            {/* Show "Search" button if input exists and no patient data */}
            {searchInput.length > 0 && searchedPatient === null && (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={patientSearch}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            )}

            {/* Show Patient Details and Add button if found */}
            {searchedPatient && (
              <View>
                <Text style={styles.resultText}>
                  Name: {searchedPatient.pat_name}
                </Text>
                <Text style={styles.resultText}>
                  Email: {searchedPatient.pat_email}
                </Text>

                <TouchableOpacity
                  style={styles.modelAddButton}
                  onPress={() => {
                    handleAdd();
                    patientAdd(searchedPatient.pat_email);
                  }}
                >
                  <Text style={styles.modelAddButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Show "Patient not found" if search returns no results */}
            {searchedPatient === false && (
              <Text style={styles.errorText}>Patient not found</Text>
            )}
          </View>
        </View>
      </Modal>

      <Bottomnavbar navigation={navigation} page={"Search"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  scrollContainer: {
    marginVertical: 20,
  },
  patientCard: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  cardContainer: {
    marginBottom: 120,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#00A9FF",
    borderRadius: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 50,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 10,
    marginHorizontal: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitleText: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    width: "auto",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  removeButton: {
    width: "auto",
    height: "auto",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Makes it perfectly round
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10, // Spacing between the buttons
  },
  removeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  addButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#00A9FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
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
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#00A9FF",
    fontSize: 16,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    width: "auto",
    backgroundColor: "#00A9FF",
    padding: 11,
    borderRadius: 20,
    marginBottom: 10,
  },
  searchButtonText: { color: "white", fontWeight: "bold" },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "left",
  },
  modelAddButton: {
    width: "50%",
    backgroundColor: "#00A9FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modelAddButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Search;

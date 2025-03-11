import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Modal,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Bottomnavbar from "../../Components/Bottomnavbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManagePatient = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pending", title: "Pending Requests" },
    { key: "accepted", title: "Accepted Requests" },
  ]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [grantedRequest, setGrantedRequest] = useState([]);
  const [grantedPatient, setGrantedPatient] = useState([]);
  const [pendingPatient, setPendingPatient] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [patientMail, setPatientMail] = useState([]);
  const reportTypes = [
    "Blood Report",
    "Diabetes Report",
    "UrineTest Report",
    "Vaccine Reports",
    "Medical Prescriptions",
    "Allergy Test Report",
    "ECG Report",
    "Cholesterol Report",
    "Blood Pressure Report",
  ];

  useEffect(() => {
    handleRequest();
  }, []);

  useEffect(() => {
    setGrantedPatient((prevDoctors) =>
      prevDoctors.filter((doctor) => grantedRequest.includes(doctor.doc_email))
    );
  }, [grantedRequest]);

  useEffect(() => {
    setPendingPatient((prevDoctors) =>
      prevDoctors.filter((doctor) => pendingRequest.includes(doctor.doc_email))
    );
  }, [pendingRequest]);

  useEffect(() => {
    if (grantedPatient.length > 0) {
      console.log("Updated Granted Doctors:", grantedPatient);
    }
  }, [grantedPatient]);

  useEffect(() => {
    if (pendingPatient.length > 0) {
      console.log("Updated Pending Doctors:", pendingPatient);
    }
  }, [pendingPatient]);

  const handleRequest = async () => {
    const value = await AsyncStorage.getItem("user");
    const doc_email = JSON.parse(value).user.doc_email;
    try {
      const response = await fetch(
        "http://192.168.128.149:3000/get-doctor-permission-lists",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doc_email }),
        }
      );

      const data = await response.json();
      if (data.permission_granted && data.permission_pending) {
        setGrantedRequest(data.permission_granted);
        setPendingRequest(data.permission_pending);

        // Immediately fetch and update doctor details
        getGrantedPatient(data.permission_granted);
        getPendingPatient(data.permission_pending);
      } else {
        console.error("Invalid response data", data);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const getGrantedPatient = (grantedRequest) => {
    if (grantedRequest.length > 0) {
      fetch("http://192.168.128.149:3000/getpatients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pat_emails: grantedRequest }), // Send the granted email list
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            console.log("Data :- ", data);
            setGrantedPatient(data); // Set the granted doctors info
            console.log("Granted Patients:", grantedPatient);
          } else {
            console.error("Invalid data for granted patients", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching granted patients:", error);
        });
    }
    console.log("Granted :- ", grantedPatient);
  };

  const getPendingPatient = (pendingRequest) => {
    if (pendingRequest.length > 0) {
      fetch("http://192.168.128.149:3000/getpatients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pat_emails: pendingRequest }), // Send the pending email list
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            console.log("Data :- ", data);
            setPendingPatient(data); // Set the pending doctors info
            console.log("Pending Patients:", pendingPatient);
          } else {
            console.error("Invalid data for pending patients", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching pending patients:", error);
        });
    }
    console.log("Pending :- ", pendingPatient);
  };

  const toggleSelection = (report) => {
    setSelectedReports(
      (prevSelected) =>
        prevSelected.includes(report)
          ? prevSelected.filter((item) => item !== report) // Remove if already selected
          : [...prevSelected, report] // Add if not selected
    );
  };

  const loadRequestedReports = async (pat_email) => {
    setSelectedReports([]); // Clear previous selection before loading

    try {
      const value = await AsyncStorage.getItem("user");
      const doc_email = JSON.parse(value).user.doc_email;

      const response = await fetch(
        "http://192.168.128.149:3000/get-patient-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doc_email, pat_email }),
        }
      );

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to fetch reports");
      // }

      const data = await response.json();

      if (data.reports && data.reports.length > 0) {
        setSelectedReports(data.reports);
        console.log("Reports loaded:", data.reports);
      } else {
        console.log("No reports found.");
        setSelectedReports([]); // Ensure it's set to an empty array
      }

      setModalVisible(true);
    } catch (error) {
      console.error("Error loading reports:", error.message);
      alert("Error: " + error.message);
    }
  };

  const sendReportRequest = async (pat_email, selectedReports) => {
    console.log(selectedReports);
    const value = await AsyncStorage.getItem("user");
    const doc_email = JSON.parse(value).user.doc_email;
    console.log("here....");
    fetch("http://192.168.128.149:3000/request-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pat_email: pat_email,
        doc_email: doc_email, // Replace with the actual doctor email
        requested_reports: selectedReports,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Report request sent successfully!");
          setModalVisible(false);
        } else {
          alert("Error: " + data.error);
        }
      })
      .catch((error) => {
        alert("Failed to send request: " + error.message);
      });
  };

  const clearSelection = () => {
    setSelectedReports([]); // Clears the selected reports
  };

  const PendingRequests = () => (
    <View style={styles.page}>
      <Text style={styles.title}>Granted Requests</Text>
      {pendingPatient.map((patient) => (
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() =>
            navigation.navigate("PatientProfile", {
              pat_email: patient.pat_email,
            })
          }
        >
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{patient.name}</Text>
            <Text style={styles.subtitleText}>Email: {patient.pat_email}</Text>
          </View>

          <TouchableOpacity style={styles.pendingButton}>
            <Text style={styles.pendingButtonText}>Pending</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const AcceptedRequests = () => (
    <View style={styles.page}>
      <Text style={styles.title}>Granted Requests</Text>
      {grantedPatient.map((patient) => (
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() =>
            navigation.navigate("PatientProfile", {
              pat_email: patient.pat_email,
            })
          }
          onLongPress={async () => {
            setPatientMail(patient.pat_email);
            console.log(patientMail);
            await loadRequestedReports(patient.pat_email);
            console.log(selectedReports);
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{patient.name}</Text>
            <Text style={styles.subtitleText}>Email: {patient.pat_email}</Text>
          </View>

          <TouchableOpacity
            style={styles.reportsButton}
            onPress={() => {
              console.log(patient.pat_email);
              navigation.navigate("PatientReport", {
                pat_email: patient.pat_email,
              });
            }}
          >
            <Text style={styles.pendingButtonText}>View Reports</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderScene = SceneMap({
    pending: PendingRequests,
    accepted: AcceptedRequests,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: 400 }}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select or Upload File</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable List */}
            <View style={styles.listContainer}>
              <FlatList
                data={reportTypes}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = selectedReports.includes(item);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.reportItem,
                        isSelected && styles.selectedReport,
                      ]}
                      onPress={() => toggleSelection(item)}
                    >
                      <Text
                        style={
                          isSelected ? styles.selectedText : styles.reportText
                        }
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* Selected Reports */}
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedTitle}>Selected Reports:</Text>
              <Text style={styles.selectedList}>
                {selectedReports.length > 0
                  ? selectedReports.join(", ")
                  : "None"}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSelection}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => {
                  console.log(selectedReports);
                  sendReportRequest(patientMail, selectedReports);
                }}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Bottomnavbar navigation={navigation} page={"ManagePatient"} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  page: {
    flex: 1,
    padding: 10,
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
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 50,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 10,
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  requestCard: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    flexDirection: "row", // Align text and button in a row
    justifyContent: "space-between", // Space between text and button
    alignItems: "center", // Align vertically
  },
  requestText: {
    fontSize: 16,
    color: "#333",
    flex: 1, // Ensure text takes up available space
  },
  pendingButton: {
    backgroundColor: "#B0B0B0", // Grey color
    padding: 10,
    borderRadius: 5,
  },
  pendingButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  reportsButton: {
    backgroundColor: "#00A9FF",
    padding: 10,
    borderRadius: 5,
  },
  reportsButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    height: 350,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 18,
    color: "grey",
    fontWeight: "bold",
  },
  closeButtonText: {
    fontSize: 20,
    color: "grey",
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    width: "100%",
    maxHeight: 350, // Ensures scrolling works inside the modal
  },
  reportItem: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  selectedReport: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  reportText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  selectedContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  selectedTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  selectedList: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "75%",
    justifyContent: "space-between",
    marginTop: 15,
    alignSelf: "center",
  },
  clearButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 20,
    padding: 10,
    borderRadius: 20,
    alignSelf: "center",
  },
  doneButton: {
    backgroundColor: "#00A9FF",
    paddingHorizontal: 20,
    padding: 10,
    borderRadius: 20,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});

export default ManagePatient;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import PatientBottomnavbar from "../../Components/PatientBottomnavbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManageRequest = ({ navigation }) => {
  const [pendingRequest, setPendingRequest] = useState([]);
  const [grantedRequest, setGrantedRequest] = useState([]);
  const [grantedDoctor, setGrantedDoctor] = useState([]);
  const [pendingDoctor, setPendingDoctor] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportTypes, setReportTypes] = useState([]);
  const [doctorMail, setDoctorMail] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);

  const handleAccept = (doc_email) => {
    AsyncStorage.getItem("user").then((value) => {
      const pat_email = JSON.parse(value).user.pat_email; // Get the patient's email
      console.log(pat_email);
      console.log(doc_email);
      fetch("http://192.168.125.149:3000/grant-permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pat_email, doc_email }), // Send both emails
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Permission granted successfully") {
            // Handle success (remove from pending, add to granted)
            console.log("Permission granted successfully");
            handleRequest();
          } else {
            console.error("Error granting permission:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error calling grant-permission route:", error);
        });
    });
  };

  const handleReject = (doc_email) => {
    AsyncStorage.getItem("user").then((value) => {
      const pat_email = JSON.parse(value).user.pat_email; // Get the patient's email
      console.log(pat_email);
      console.log(doc_email);
      fetch("http://192.168.125.149:3000/reject-permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pat_email, doc_email }), // Send both emails
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Permission request rejected successfully") {
            // Handle success (remove from pending list)
            console.log("Permission request rejected successfully");
            handleRequest(); // Update UI or state after rejection
          } else {
            console.error("Error rejecting permission:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error calling reject-permission route:", error);
        });
    });
  };

  const handleRemove = (doc_email) => {
    AsyncStorage.getItem("user").then((value) => {
      const pat_email = JSON.parse(value).user.pat_email; // Get the patient's email

      fetch("http://192.168.125.149:3000/remove-permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pat_email, doc_email }), // Send both emails
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Permission removed successfully") {
            // Handle success (remove from granted list)
            console.log("Permission removed successfully");
            handleRequest();
          } else {
            console.error("Error removing permission:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error calling remove-permission route:", error);
        });
    });
  };

  const handleRequest = async () => {
    const value = await AsyncStorage.getItem("user");
    const pat_email = JSON.parse(value).user.pat_email;

    try {
      const response = await fetch(
        "http://192.168.125.149:3000/get-patient-permission-lists",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pat_email }),
        }
      );

      const data = await response.json();
      if (data.permission_granted && data.permission_pending) {
        setGrantedRequest(data.permission_granted);
        setPendingRequest(data.permission_pending);

        // Immediately fetch and update doctor details
        getGrantedDoctor(data.permission_granted);
        getPendingDoctor(data.permission_pending);
      } else {
        console.error("Invalid response data", data);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const getGrantedDoctor = (grantedRequest) => {
    if (grantedRequest.length > 0) {
      fetch("http://192.168.125.149:3000/getdoctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_emails: grantedRequest }), // Send the granted email list
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            console.log("Data :- ", data);
            setGrantedDoctor(data); // Set the granted doctors info
            console.log("Granted Doctors:", grantedDoctor);
          } else {
            console.error("Invalid data for granted doctors", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching granted doctors:", error);
        });
    }
    console.log("Granted :- ", grantedDoctor);
  };

  const getPendingDoctor = (pendingRequest) => {
    if (pendingRequest.length > 0) {
      fetch("http://192.168.125.149:3000/getdoctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_emails: pendingRequest }), // Send the pending email list
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setPendingDoctor(data); // Set the pending doctors info
            console.log("Pending Doctors:", data);
          } else {
            console.error("Invalid data for pending doctors", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching pending doctors:", error);
        });
    }
    console.log("Pending :- ", pendingDoctor);
  };

  const loadRequestedReports = async (doc_email) => {
    const value = await AsyncStorage.getItem("user");
    const pat_email = JSON.parse(value).user.pat_email;
    fetch("http://192.168.125.149:3000/get-patient-reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doc_email: doc_email,
        pat_email: pat_email, // Replace with the actual patient's email
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.reports) {
          setReportTypes(data.reports); // Store reports in state
        } else {
          console.log("No reports found:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching reports:", error));
  };

  const loadAcceptedReports = async (doc_email) => {
    console.log("here....");
    setSelectedReports([]);
    try {
      const value = await AsyncStorage.getItem("user");
      const pat_email = JSON.parse(value).user.pat_email;

      await fetch("http://192.168.125.149:3000/get-accepted-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pat_email: pat_email,
          doc_email: doc_email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.reports) {
            setSelectedReports(data.reports);
            console.log(selectedReports); // Store reports in state
          } else {
            console.log("No accepted reports found:", data.message);
          }
          setModalVisible(true);
        })
        .catch((error) =>
          console.error("Error fetching accepted reports:", error)
        );
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  const acceptReportRequest = async (doc_email, selectedReports) => {
    try {
      const value = await AsyncStorage.getItem("user");
      const pat_email = JSON.parse(value).user.pat_email;

      fetch("http://192.168.125.149:3000/accept-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pat_email,
          doc_email,
          accepted_reports: selectedReports,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            console.log("Success:", data.message);
            alert("Reports accepted successfully!");
            setModalVisible(false);
          } else {
            console.log("Error:", data);
            alert("Error: " + (data.message || "Something went wrong"));
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to accept reports. Please try again.");
        });
    } catch (error) {
      console.error("AsyncStorage Error:", error);
      alert("Failed to retrieve user data.");
    }
  };

  useEffect(() => {
    handleRequest();
  }, []);

  // useEffect(() => {
  //   if (grantedRequest && pendingRequest) {
  //     console.log("grantedRequest updated:", grantedRequest);
  //     console.log("pendingRequest updated:", pendingRequest);

  //     // Call your functions with the updated state
  //     getGrantedDoctor(grantedRequest);
  //     getPendingDoctor(pendingRequest);
  //   }
  // }, [grantedRequest, pendingRequest]);

  useEffect(() => {
    setGrantedDoctor((prevDoctors) =>
      prevDoctors.filter((doctor) => grantedRequest.includes(doctor.doc_email))
    );
  }, [grantedRequest]);

  useEffect(() => {
    setPendingDoctor((prevDoctors) =>
      prevDoctors.filter((doctor) => pendingRequest.includes(doctor.doc_email))
    );
  }, [pendingRequest]);

  useEffect(() => {
    if (grantedDoctor.length > 0) {
      console.log("Updated Granted Doctors:", grantedDoctor);
    }
  }, [grantedDoctor]);

  useEffect(() => {
    if (pendingDoctor.length > 0) {
      console.log("Updated Pending Doctors:", pendingDoctor);
    }
  }, [pendingDoctor]);

  const clearSelection = () => {
    setSelectedReports([]); // Clears the selected reports
  };

  const toggleSelection = (report) => {
    setSelectedReports(
      (prevSelected) =>
        prevSelected.includes(report)
          ? prevSelected.filter((item) => item !== report) // Remove if already selected
          : [...prevSelected, report] // Add if not selected
    );
  };

  const renderPendingRequests = () => (
    <View style={styles.page}>
      <Text style={styles.title}>Granted Requests</Text>
      {pendingDoctor.map((doctor) => (
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => {
            navigation.navigate("DoctorProfile", {
              doc_email: doctor.doc_email,
            });
            console.log(doctor.doc_email);
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{doctor.name}</Text>
            <Text style={styles.subtitleText}>
              Specialization: {doctor.spec}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(doctor.doc_email)} // Pass the doctor's email
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleReject(doctor.doc_email)} // Pass the doctor's email
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGrantedRequests = () => (
    <View style={styles.page}>
      <Text style={styles.title}>Granted Requests</Text>
      {grantedDoctor.map((doctor) => (
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => {
            navigation.navigate("DoctorProfile", {
              doc_email: doctor.doc_email,
            });
            console.log(doctor.doc_email);
          }}
          onLongPress={async () => {
            setDoctorMail(doctor.doc_email);
            console.log(doctorMail);
            await loadRequestedReports(doctor.doc_email);
            console.log("t", reportTypes);
            await loadAcceptedReports(doctor.doc_email);
            console.log("s", selectedReports);
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{doctor.name}</Text>
            <Text style={styles.subtitleText}>
              Specialization: {doctor.spec}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(doctor.doc_email)} // Pass the doctor's email
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const [index, setIndex] = useState(0);
  const routes = [
    { key: "pending", title: "Pending" },
    { key: "granted", title: "Granted" },
  ];

  const renderScene = SceneMap({
    pending: renderPendingRequests,
    granted: renderGrantedRequests,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: 300 }}
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
                  acceptReportRequest(doctorMail, selectedReports);
                }}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <PatientBottomnavbar
        navigation={navigation}
        page={"ManageRequest"}
      ></PatientBottomnavbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  page: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  requestText: {
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: "#00A9FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 12,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  rejectButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 10,
  },
  rejectButtonText: {
    color: "white",
    fontWeight: "bold",
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

export default ManageRequest;

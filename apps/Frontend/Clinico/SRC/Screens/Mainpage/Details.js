import React, { useEffect, useState } from "react";
import { Modal, TextInput } from "react-native";
import { Button } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Details = ({ navigation, route }) => {
  const { date, doc_email } = route.params;
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [newReminder, setNewReminder] = useState(""); // New reminder text

  const loadReminders = () => {
    try {
      fetch("http://192.168.128.149:3000/showreminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_email: doc_email, // Assuming doc_email is required
          date: date, // Date passed as parameter
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Check if 'reminders' exists and is not
          if (data.reminders && data.reminders.length > 0) {
            setReminders(data.reminders); // Update state with fetched reminders
          } else {
            // If no reminders found, show a message or empty list
            setReminders([]); // This will trigger the list to be empty
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Error fetching reminders");
        });
    } catch (error) {
      console.log(error);
      alert("Error fetching reminders");
    }
  };

  const deleteReminder = (index) => {
    try {
      console.log(index);
      fetch("http://192.168.128.149:3000/deletereminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_email: doc_email,
          date: date,
          index: index, // Send the index to identify the reminder to delete
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Reminder deleted successfully") {
            // Update the reminders state to reflect the deletion
            const updatedReminders = reminders.filter((_, i) => i !== index);
            setReminders(updatedReminders);
            alert("Reminder deleted successfully!");
          } else {
            alert(data.error || "Failed to delete reminder");
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Error deleting reminder");
        });
    } catch (error) {
      console.log(error);
      alert("Error deleting reminder");
    }
  };

  const addReminder = () => {
    try {
      fetch("http://192.168.128.149:3000/addreminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_email: doc_email, // Doctor's email
          date: date, // Selected date
          reminder: newReminder.trim(), // Clean input
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Reminder added successfully") {
            setModalVisible(false); // Close the modal
            setNewReminder(""); // Clear the input field
            loadReminders();
          } else {
            alert(data.error || "Failed to add reminder");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Error adding reminder");
        });
    } catch (error) {
      console.error(error);
      alert("Error adding reminder");
    }
  };

  useEffect(() => {
    loadReminders();
  }, [date, doc_email]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reminders}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <Text style={styles.dateText}>Reminders for {date}</Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.reminderCard}>
            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteReminder(index)} // Call deleteReminder with the index
            >
              <MaterialIcons name="delete" size={24} color="#ff0000" />
            </TouchableOpacity>
            {/* Reminder Text */}
            <Text style={styles.reminderText}>{item}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header Section */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Reminder</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            {/* Input Section */}
            <TextInput
              style={styles.input}
              placeholder="Enter your reminder"
              value={newReminder}
              onChangeText={setNewReminder}
            />

            {/* Done Button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                if (!newReminder.trim()) {
                  alert("Please enter something into the reminder!");
                } else {
                  console.log("Added Reminder:", newReminder.trim());
                  addReminder();
                }
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafc",
    padding: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 80,
  },
  reminderCard: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#00A9FF",
    elevation: 2,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 10,
  },
  reminderText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
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
    borderWidth: 2,
    borderColor: "#00A9FF",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  doneButton: {
    width: "50%",
    backgroundColor: "#00A9FF", // Vibrant blue button color
    paddingVertical: 10,
    alignSelf: "center",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    elevation: 2, // Adds shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  doneButtonText: {
    color: "#fff", // White text color
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

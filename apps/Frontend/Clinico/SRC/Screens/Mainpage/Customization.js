import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import Bottomnavbar from "../../Components/Bottomnavbar";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Customization = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryModalVisible, setEditCategoryModalVisible] =
    useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState("");
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const loadCategories = () => {
    AsyncStorage.getItem("user")
      .then((value) => {
        if (value) {
          const userData = JSON.parse(value);
          const doc_email = userData.user.doc_email;

          fetch("http://192.168.128.149:3000/showstaffcategories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
      })
      .catch((error) => console.error("Error reading AsyncStorage: ", error));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addStaffCategory = () => {
    if (!newCategoryName.trim()) return;

    AsyncStorage.getItem("user")
      .then((value) => {
        if (value) {
          const userData = JSON.parse(value);
          const doc_email = userData.user.doc_email;

          fetch("http://192.168.128.149:3000/addstaffcategory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ doc_email, category: newCategoryName }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                setNewCategoryName("");
                setAddCategoryModalVisible(false);
                loadCategories();
              } else {
                console.error("Error adding category: ", data.error);
              }
            })
            .catch((error) => console.error("Fetch error: ", error));
        } else {
          console.error("No user data found in AsyncStorage");
        }
      })
      .catch((error) => console.error("Error reading AsyncStorage: ", error));
  };

  const handleCategoryLongPress = (category) => {
    setCategoryToEdit(category);
    setEditedCategoryName(category);
    setEditCategoryModalVisible(true);
  };

  const editCategory = () => {
    if (!editedCategoryName.trim()) return;

    AsyncStorage.getItem("user")
      .then((value) => {
        if (value) {
          const userData = JSON.parse(value);
          const doc_email = userData.user.doc_email;

          fetch("http://192.168.128.149:3000/editstaffcategory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              doc_email,
              oldCategory: categoryToEdit,
              newCategory: editedCategoryName,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                loadCategories(); // Reload categories after edit
                setEditCategoryModalVisible(false); // Close edit modal
              } else {
                console.error("Error editing category: ", data.error);
              }
            })
            .catch((error) => console.error("Fetch error: ", error));
        } else {
          console.error("No user data found in AsyncStorage");
        }
      })
      .catch((error) => console.error("Error reading AsyncStorage: ", error));
  };

  const deleteCategory = () => {
    if (!categoryToEdit) return;

    // Fetch user data to get doc_email
    AsyncStorage.getItem("user")
      .then((value) => {
        if (value) {
          const userData = JSON.parse(value);
          const doc_email = userData.user.doc_email;

          // Send a request to delete the category
          fetch("http://192.168.128.149:3000/removestaffcategory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ doc_email, category: categoryToEdit }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message) {
                console.log("Category removed successfully");

                // Reload categories after deletion
                loadCategories();

                // Close the modal
                setEditCategoryModalVisible(false);
              } else {
                console.error("Error removing category: ", data.error);
              }
            })
            .catch((error) => console.error("Fetch error: ", error));
        } else {
          console.error("No user data found in AsyncStorage");
        }
      })
      .catch((error) => console.error("Error reading AsyncStorage: ", error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Staff Categories</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onLongPress={() => handleCategoryLongPress(item)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.categoryName}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setAddCategoryModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Edit Category Modal */}
      <Modal
        visible={editCategoryModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Category</Text>
            <TextInput
              style={styles.input}
              value={editedCategoryName}
              onChangeText={setEditedCategoryName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={editCategory}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#FF4D4D" }]}
              onPress={deleteCategory}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addCategoryModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add new Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAddCategoryModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={addStaffCategory}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Bottomnavbar navigation={navigation} page={"Customization"} />
    </SafeAreaView>
  );
};

export default Customization;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#00A9FF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
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
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
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
});

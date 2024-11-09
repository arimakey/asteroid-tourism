import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";
import { User } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

const Step1 = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<{ visible: boolean; mode: "start" | "end" }>({
    visible: false,
    mode: "start",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      const citiesCollection = collection(firestoreDB, "cities");
      const citySnapshot = await getDocs(citiesCollection);
      const cityList = citySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCities(cityList);
    };

    fetchCities();
  }, []);

  const handleSaveUser = async () => {
    if (user && selectedCity && startDate && endDate) {
      try {
        const selectionRef = doc(firestoreDB, "selections", "arTZLoguyAkWmjrfEsrMA");

        await setDoc(
          selectionRef,
          {
            user: `/users/${user.uid}`,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            city: `/cities/${selectedCity}`,
            step: 1,
          },
          { merge: true }
        );

        alert("Data saved successfully in selections!");
      } catch (error) {
        console.error("Error saving data in selections: ", error);
        alert("Error saving data in selections.");
      }
    } else {
      alert("Please select a city and both dates.");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || (showPicker.mode === "start" ? startDate : endDate);
    
    if (Platform.OS === 'android') {
      setShowPicker({ ...showPicker, visible: false });
    }
    
    if (currentDate) {
      if (showPicker.mode === "start") {
        setStartDate(currentDate);
      } else {
        setEndDate(currentDate);
      }
    }
  };

  const CustomButton = ({ onPress, title, style = {} }: any) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {user ? (
          <>
            <Text style={styles.text}>Selecciona tu ciudad:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCity}
                onValueChange={(itemValue) => setSelectedCity(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona" value="" />
                {cities.map((city) => (
                  <Picker.Item key={city.id} label={city.name} value={city.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.dateContainer}>
              <CustomButton 
                title="Seleccionar fecha de inicio" 
                onPress={() => setShowPicker({ visible: true, mode: "start" })}
              />
              {startDate && (
                <Text style={styles.dateText}>
                  Fecha de inicio: {startDate.toLocaleDateString()}
                </Text>
              )}
            </View>

            <View style={styles.dateContainer}>
              <CustomButton 
                title="Seleccionar fecha de fin" 
                onPress={() => setShowPicker({ visible: true, mode: "end" })}
              />
              {endDate && (
                <Text style={styles.dateText}>
                  Fecha de fin: {endDate.toLocaleDateString()}
                </Text>
              )}
            </View>

            {(showPicker.visible || Platform.OS === 'ios') && (
              <DateTimePicker
                value={showPicker.mode === "start" ? startDate || new Date() : endDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            <CustomButton 
              title="Guardar"
              onPress={handleSaveUser}
              style={styles.saveButton}
            />
          </>
        ) : (
          <Text style={styles.text}>Usuario no logueado</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  dateContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#34C759',
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
});

export default Step1;
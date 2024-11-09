import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";
import { User } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

const Step1 = ({goToNextStep}: {goToNextStep: () => void}) => {
  const [user, setUser] = useState<User | null>(null);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
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


  const handleSaveUserWithReferences = async () => {
    if (user && selectedCity && startDate && endDate) {
      try {
        const userRef = doc(firestoreDB, "users", user.uid);
        const selectionRef = collection(firestoreDB, "selections");
        const cityRef = doc(firestoreDB, "cities", selectedCity);

        const q = query(selectionRef, where("user", "==", userRef));

        const snapshot = await getDocs(q);
        
        const selections: any = [];
        snapshot.forEach((doc) => {
          selections.push({ id: doc.id, ...doc.data() });
        })

        const documentId = selections[0]?.id

        if (documentId) {
          const selectionRef = doc(firestoreDB, "selections", documentId);

          const selectionData = {
            user: userRef,
            start_date: startDate,
            end_date: endDate,
            city: cityRef,
            step: 1,
          };

          await setDoc(selectionRef, selectionData, { merge: true });
          alert("Datos actualizados exitosamente en selections!");
        } else {

          const newSelectionRef = doc(collection(firestoreDB, "selections"));
          const selectionData = {
            user: userRef,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            city: cityRef,
            step: 1,
          };

          await setDoc(newSelectionRef, selectionData);
          alert("Datos guardados exitosamente en selections!");
        }



        alert("Datos guardados exitosamente en selections!");
        goToNextStep();
      } catch (error) {
        console.error("Error al guardar los datos en selections:", error);
        alert("Error al guardar los datos en selections.");
      }
    } else {
      alert("Por favor, selecciona una ciudad y ambas fechas.");
    }
  }
  const handleSaveUser = async () => {
    if (user && selectedCity && startDate && endDate) {
      try {
        // Buscar si ya existe un documento en la colección `selections` para el usuario actual
        const selectionsQuery = await getDocs(collection(firestoreDB, "selections"));
        let documentId = null;
  
        selectionsQuery.forEach((doc) => {
          if (doc.data().user === `/users/${user.uid}`) {
            documentId = doc.id; // Guardar el ID del documento encontrado
          }
        });
  
        console.log("Usuario actual:", user.uid);
        console.log("ID del documento encontrado:", documentId);
  
        const selectionData = {
          user: `/users/${user.uid}`,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          city: `/cities/${selectedCity}`,
          step: 1,
        };
  
        if (documentId) {
          // Si existe el documento, solo actualizamos los campos necesarios
          const selectionRef = doc(firestoreDB, "selections", documentId);
          await setDoc(selectionRef, selectionData, { merge: true });
          alert("Datos actualizados exitosamente en selections!");
        } else {
          // Si no existe, creamos un nuevo documento con un ID generado automáticamente
          const newSelectionRef = doc(collection(firestoreDB, "selections"));
          await setDoc(newSelectionRef, selectionData);
          alert("Datos guardados exitosamente en selections!");
        }
  
        goToNextStep();
      } catch (error) {
        console.error("Error al guardar los datos en selections:", error);
        alert("Error al guardar los datos en selections.");
      }
    } else {
      alert("Por favor, selecciona una ciudad y ambas fechas.");
    }
  };
  

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || (showPicker.mode === "start" ? startDate : endDate);
    
    if (Platform.OS === 'android') {
      setShowPicker({ ...showPicker, visible: false });
    }
    
    if (currentDate) {
      // Ajustar la fecha restando un día
      const adjustedDate = new Date(currentDate);
      adjustedDate.setUTCHours(12, 0, 0, 0);

      if (showPicker.mode === "start") {
        setStartDate(adjustedDate);
      } else {
        setEndDate(adjustedDate);
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
              onPress={handleSaveUserWithReferences}
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
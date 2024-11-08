import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";
import { User } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

const Step1 = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]); // Para almacenar las ciudades
  const [selectedCity, setSelectedCity] = useState(""); // Ciudad seleccionada

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

  // Cargar ciudades desde Firebase
  useEffect(() => {
    const fetchCities = async () => {
      const citiesCollection = collection(firestoreDB, "cities");
      const citySnapshot = await getDocs(citiesCollection);
      const cityList = citySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCities(cityList);
    };

    fetchCities();
  }, []);

  const handleSaveUser = async () => {
    if (user && selectedCity) {
      try {
        // Fechas de prueba para start_date y end_date
        const startDate = new Date("2024-01-01T00:00:00Z");
        const endDate = new Date("2024-12-31T23:59:58Z");

        const selectionRef = doc(firestoreDB, "selections", "arTZLoguyAkWmjrfEsrMA");
        
        await setDoc(
          selectionRef,
          {
            user: `/users/${user.uid}`,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            city: `/cities/${selectedCity}`, // Guarda la ciudad seleccionada como referencia
            step: 1, // Agregar el valor de step
          },
          { merge: true }
        );
        
        alert("Data saved successfully in selections!");
      } catch (error) {
        console.error("Error saving data in selections: ", error);
        alert("Error saving data in selections.");
      }
    } else {
      alert("Please select a city.");
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>
            Welcome, {(user.displayName || user.email || "")}
          </Text>

          <Text style={styles.text}>Select a City:</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => setSelectedCity(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a city" value="" />
            {cities.map((city) => (
              <Picker.Item key={city.id} label={city.name} value={city.id} />
            ))}
          </Picker>

          <Button title="Guardar" onPress={handleSaveUser} />
        </>
      ) : (
        <Text style={styles.text}>Usuario no logueado</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  picker: {
    width: 200,
    height: 50,
    marginBottom: 16,
  },
});

export default Step1;

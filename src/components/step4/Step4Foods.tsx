import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList, Alert } from 'react-native';
import { firestoreDB } from '@/firebaseConfig'; // Ajusta la ruta de acuerdo a tu estructura
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useAuth } from '@/src/context/authContext';

type Food = {
  id: string;
  name: string;
};

const Step4Foods = ({ goToNextStep }: { goToNextStep: () => void }) => {
  const { user } = useAuth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  useEffect(() => {
    // Función para obtener alimentos desde Firebase
    const fetchFoods = async () => {
      const querySnapshot = await getDocs(collection(firestoreDB, "food_categories"));
      const foodsArray: Food[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Food, 'id'>), // Esto asegura que `name` se tipifique correctamente
      }));
      console.log(foodsArray);
      setFoods(foodsArray);
    };

    fetchFoods();
  }, []);

  const handleSelectFood = (foodId: string) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter(id => id !== foodId));
    } else {
      setSelectedFoods([...selectedFoods, foodId]);
    }
  };

  const handleEnviarWithReferences = async () => {
    if (!user) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    try {
      // Crear la referencia al usuario
      const userRef = doc(firestoreDB, "users", user.uid);
      const selectionRef = collection(firestoreDB, "selections");

      // Crear la consulta para verificar si existe un documento en selections para este usuario
      const q = query(selectionRef, where("user", "==", userRef));
      const snapshot = await getDocs(q);

      // Verificar si ya existe un documento y obtener su ID
      const selections: any = [];
      snapshot.forEach((doc) => {
        selections.push({ id: doc.id, ...doc.data() });
      });
      const documentId = selections[0]?.id;

      if (documentId) {
        // Si encontramos el documento, actualizamos `categories_foods` y `step`
        const selectionRef = doc(firestoreDB, "selections", documentId);
        
        await updateDoc(
          selectionRef,
          {
            step: 2,
            categories_foods: selectedFoods.map(id => doc(firestoreDB, "food_categories", id)),
          }
        );

        Alert.alert("Éxito", "Alimentos guardados exitosamente en selections!");
        goToNextStep();
      } else {
        // Si no existe el documento, mostramos un mensaje de error
        Alert.alert("Error", "No se encontró el documento de selección para este usuario.");
      }

    } catch (error) {
      console.error("Error al guardar alimentos en selections:", error);
      Alert.alert("Error", "No se pudo guardar en Firebase.");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Selecciona tus alimentos favoritos:</Text>

      {/* Lista de alimentos con opciones seleccionables */}
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectFood(item.id)}
            style={{
              padding: 10,
              marginVertical: 5,
              backgroundColor: selectedFoods.includes(item.id) ? '#d3d3d3' : '#f9f9f9',
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón para enviar los alimentos seleccionados */}
      <Button title="Enviar" onPress={handleEnviarWithReferences} />
    </View>
  );
};

export default Step4Foods;

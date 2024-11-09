import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList } from 'react-native';
import { firestoreDB } from '@/firebaseConfig'; // Ajusta la ruta de acuerdo a tu estructura
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useAuth } from '@/src/context/authContext';

type Categoria = {
  id: string;
  name: string;
};

const Step2Categorias = ({goToNextStep}: {goToNextStep: () => void}) => {
  const {user} = useAuth()
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);

  useEffect(() => {
    // Función para obtener categorías desde Firebase
    const fetchCategorias = async () => {
      const querySnapshot = await getDocs(collection(firestoreDB, "categories"));
      const categoriasArray: Categoria[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Categoria, 'id'>), // Esto asegura que `name` se tipifique correctamente
      }));
      console.log(categoriasArray);
      setCategorias(categoriasArray);
    };

    fetchCategorias();
  }, []);

  const handleSelectCategoria = (categoriaName: string) => {
    if (selectedCategorias.includes(categoriaName)) {
      setSelectedCategorias(selectedCategorias.filter(name => name !== categoriaName));
    } else {
      setSelectedCategorias([...selectedCategorias, categoriaName]);
    }
  };

  const handleEnviar = async () => {
    if (!user) {
      alert("Usuario no autenticado");
      return;
    }

    try {

      // Buscar el documento en Firestore que tenga el `user` referenciado con el ID del usuario actual
      const selectionsQuery = await getDocs(collection(firestoreDB, "selections"));
      let documentId = null;

      selectionsQuery.forEach((doc) => {
        if (doc.data().user === `/users/${user.uid}`) {
          documentId = doc.id; // Guardar el ID del documento encontrado
        }
      });
      console.log("Usuario actual ", user.uid)
      console.log(documentId)

      // Definir la referencia del documento en Firestore
      const selectionRef = doc(firestoreDB, "selections", user.uid);

      if (documentId) {
        // Si encontramos el documento, actualizamos los campos `categories` y `step`
      const selectionRef = doc(firestoreDB, "selections", documentId);
  
      await setDoc(
        selectionRef,
        {
          step: 2,
          categories: selectedCategorias.map(name => `/categories/${name}`),
        },
        { merge: true } // Usar merge para actualizar sin sobrescribir todo el documento
      );
  
      alert("Categorías guardadas exitosamente en selections!");
      goToNextStep();
      } else {
        alert("No se encontró el documento de selección para este usuario.");
      }

    } catch (error) {
      console.error("Error al guardar categorías en selections: ", error);
      alert("Error al guardar categorías en selections.");
    }
  };
  

  return (
    <View style={{ padding: 16 }}>
      <Text>Selecciona tus categorías favoritas:</Text>

      {/* Lista de categorías con opciones seleccionables */}
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectCategoria(item.name)}
            style={{
              padding: 10,
              marginVertical: 5,
              backgroundColor: selectedCategorias.includes(item.name) ? '#d3d3d3' : '#f9f9f9',
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón para enviar las categorías seleccionadas */}
      <Button title="Enviar" onPress={handleEnviar} />
    </View>
  );
};

export default Step2Categorias;

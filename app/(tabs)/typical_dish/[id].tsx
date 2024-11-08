import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router"; // Cambia a `useLocalSearchParams`
import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";

interface TypicalDish {
  nombre: string;
  lugar: string;
}

const TypicalDishDetail = () => {
  const { id } = useLocalSearchParams(); 
  const [typicalDish, setTypicalDish] = useState<TypicalDish | null>(null);

  useEffect(() => {
    const fetchTypicalDish = async () => {
      if (id) { // Solo intenta buscar cuando `id` esté definido
        const docRef = doc(firestoreDB, "comidas", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTypicalDish(docSnap.data() as TypicalDish);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchTypicalDish();
  }, [id]);

  if (!typicalDish) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{typicalDish.nombre}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  location: {
    fontSize: 18,
    color: "#4b5563",
  },
});

export default TypicalDishDetail;

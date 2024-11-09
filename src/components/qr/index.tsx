import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Camera } from "expo-camera/legacy";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { firestoreDB } from "../../../firebaseConfig";

export default function QrScanner() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [matchedText, setMatchedText] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const isPermissionGranted = Boolean(permission?.granted);

  // Configurar autenticación y obtener el usuario actual
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
    });
    return unsubscribe;
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    try {
      console.log("Código escaneado:", data);

      setScanned(true);
      setIsScannerActive(false);

      if (!data) {
        throw new Error("Código QR vacío");
      }

      // Consulta Firestore para verificar si el logro existe
      const achievementsRef = collection(firestoreDB, "achievements");
      const q = query(achievementsRef, where("code", "==", data.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setMatchedText(data);
        setDocumentId(doc.id);

        Alert.alert("Éxito", `Código "${data}" encontrado en Firestore`);

        // Agrega el ID del logro al array achievements del usuario actual
        await addAchievementToUser(doc.id);
      } else {
        setMatchedText(null);
        setDocumentId(null);

        Alert.alert("No encontrado", "Código no encontrado en Firestore");
      }
    } catch (error) {
      console.error("Error completo:", error);

      let errorMessage = "Error desconocido al procesar el código";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMatchedText(null);
      setDocumentId(null);

      Alert.alert("Error", `Error al verificar el código: ${errorMessage}`);
    }
  };

  // Función para agregar el ID del logro al array achievements del usuario autenticado
  const addAchievementToUser = async (achievementId: string) => {
    if (!currentUser) {
      Alert.alert("Error", "No hay un usuario autenticado");
      return;
    }

    try {
      const userRef = doc(firestoreDB, "users", currentUser.uid);
      await updateDoc(userRef, {
        achievements: arrayUnion(achievementId), // Agrega el ID al array
      });

      Alert.alert("Logro añadido", "El logro se ha añadido a tu cuenta");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      Alert.alert("Error", "Hubo un problema al añadir el logro a tu cuenta");
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-black justify-center py-20">
      <Text className="text-white text-2xl mb-5">QR Code Scanner</Text>
      <View className="space-y-5">
        {!isPermissionGranted ? (
          <Pressable onPress={requestPermission} className="bg-blue-600 py-2 px-5 rounded-lg my-2">
            <Text className="text-white text-lg text-center">Solicitar Permisos</Text>
          </Pressable>
        ) : (
          <>
            {!isScannerActive ? (
              <Pressable onPress={() => setIsScannerActive(true)} className="bg-blue-600 py-2 px-5 rounded-lg my-2">
                <Text className="text-white text-lg text-center">Escanear Código QR</Text>
              </Pressable>
            ) : (
              <Camera
                className="w-full h-72"
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                ratio="16:9"
              >
                <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
                  <Text className="text-lg text-white text-center">Escanea el código QR</Text>
                </View>
              </Camera>
            )}
          </>
        )}
        {scanned && (
          <Pressable 
            onPress={() => { 
              setScanned(false); 
              setIsScannerActive(true); 
            }} 
            className="text-white text-lg text-center"
          >
            <Text className="text-white text-lg text-center">Escanear nuevamente</Text>
          </Pressable>
        )}
        {matchedText && (
          <Text className="text-lg text-white text-center mt-5">Texto escaneado: {matchedText}</Text>
        )}
        {documentId && (
          <Text className="text-lg text-white text-center mt-5">ID del documento: {documentId}</Text>
        )}
        {!currentUser && (
          <Text className="text-lg text-white text-center mt-5">Usuario no autenticado</Text>
        )}
      </View>
    </SafeAreaView>
  );
}



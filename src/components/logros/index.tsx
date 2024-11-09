import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";

interface Achievement {
  title: string;
  image: string;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribeUserAchievements: () => void;

    if (currentUser) {
      const userRef = doc(firestoreDB, "users", currentUser.uid);
      
      // Escucha en tiempo real los cambios en el documento del usuario
      unsubscribeUserAchievements = onSnapshot(userRef, async (userSnap) => {
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const achievementIds = userData.achievements || [];

          const achievementsList: Achievement[] = [];
          for (const id of achievementIds) {
            const achievementRef = doc(firestoreDB, "achievements", id);
            const achievementSnap = await getDoc(achievementRef);
            if (achievementSnap.exists()) {
              achievementsList.push(achievementSnap.data() as Achievement);
            }
          }
          setAchievements(achievementsList);
        }
      });
    }

    // Desuscribirse cuando se desmonta el componente o cambia el usuario
    return () => {
      if (unsubscribeUserAchievements) unsubscribeUserAchievements();
    };
  }, [currentUser]);

  const renderItem = ({ item }: { item: Achievement }) => (
    <View style={styles.achievement}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Logros</Text>
      <FlatList
        data={achievements}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  achievement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  title: {
    fontSize: 18,
  },
});

export default Achievements;

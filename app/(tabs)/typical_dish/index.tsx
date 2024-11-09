import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";
import { useRouter } from "expo-router";

const TypicalDish = () => {
  interface TypicalDish {
    id: string;
    nombre: string;
  }

  const [TypicalDish, setTypicalDish] = useState<TypicalDish[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTypicalDish = async () => {
      const querySnapshot = await getDocs(
        collection(firestoreDB, "foods")
      );
      const typicalDishData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            nombre: doc.data().nombre,
            image: doc.data().image,
          } as TypicalDish)
      );
      setTypicalDish(typicalDishData);
    };

    fetchTypicalDish();
  }, []);

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <Text className="text-3xl font-bold mb-6 text-gray-800">
        Plato típicos
      </Text>
      <FlatList
        data={TypicalDish}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/typical_dish/${item.id}`)}
            style={({ pressed }) => ({
              marginBottom: 16,
              backgroundColor: pressed ? "#f3f4f6" : "white",
              borderRadius: 24,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 16,
            })}
          >
            <View>
              <Image
                
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: 8,
                }}
              >
                {item.nombre}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                
              </View>
            </View>
          </Pressable>
        )}
        contentContainerClassName="pb-4"
      />
    </View>
  );
};

export default TypicalDish;

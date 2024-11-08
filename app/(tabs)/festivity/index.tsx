import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";
import { useRouter } from "expo-router";

const Festivity = () => {
  interface Festividad {
    id: string;
    name: string;
    city: string;
    image: string;
  }

  const [festividades, setFestividades] = useState<Festividad[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFestividades = async () => {
      const querySnapshot = await getDocs(
        collection(firestoreDB, "festivities")
      );
      const festividadesData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            name: doc.data().name,
            city: doc.data().city,
            image: doc.data().image,
          } as Festividad)
      );
      setFestividades(festividadesData);
    };

    fetchFestividades();
  }, []);

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <Text className="text-3xl font-bold mb-6 text-gray-800">
        Festividades
      </Text>
      <FlatList
        data={festividades}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/festivity/${item.id}`)}
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
              {/* <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 16,
                  marginBottom: 12,
                }}
              /> */}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: 8,
                }}
              >
                {item.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    marginLeft: 4,
                    color: "#4b5563",
                    fontSize: 14,
                  }}
                >
                  {item.city}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerClassName="pb-4"
      />
    </View>
  );
};

export default Festivity;

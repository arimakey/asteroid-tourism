import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";
import { useRouter } from "expo-router";
import ImageCuatro from "@/src/components/ImageCuatro";

const Places = () => {
  interface Places {
    id: string;
    name: string;
    image:string;
  }

  const [places, setPlaces] = useState<Places[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaces = async () => {
      const querySnapshot = await getDocs(collection(firestoreDB, "places"));
      console.log
      const placesData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            name: doc.data().name,
            image:doc.data().image,
          } as Places)
      );
      setPlaces(placesData);
      console.log(placesData);
    };

    fetchPlaces();
  }, []);

  return (
    <View className="flex-1 p-5 bg-gray-50">
      <Text className="text-3xl font-bold mb-6 text-gray-800">
        Lugares para visitar
      </Text>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/places/${item.id}`)}
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
                source={{uri:item.image}}
                style={{width:100,height:100}}
              ></Image>
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
                ></Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerClassName="pb-4"
      />
      <ImageCuatro 
        image1="https://www.chullostravelperu.com/wp-content/uploads/2023/08/Ciudad-del-Cusco-lugares-turisticos.jpg"
        image2="https://www.chullostravelperu.com/wp-content/uploads/2023/08/Ciudad-del-Cusco-lugares-turisticos.jpg"
        image3="https://www.chullostravelperu.com/wp-content/uploads/2023/08/Ciudad-del-Cusco-lugares-turisticos.jpg"
        image4="https://www.chullostravelperu.com/wp-content/uploads/2023/08/Ciudad-del-Cusco-lugares-turisticos.jpg"
      />
    </View>
  );
};

export default Places;

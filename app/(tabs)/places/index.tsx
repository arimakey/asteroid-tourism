import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "../../../firebaseConfig";
import { useRouter } from "expo-router";
import ImageCuatro from "@/src/components/ImageCuatro";
import { hp, wp } from "@/src/helpers/common";

const Places = () => {
  interface Places {
    id: string;
    name: string;
    image: string;
    city: string;
  }

  const [places, setPlaces] = useState<Places[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaces = async () => {
      const querySnapshot = await getDocs(collection(firestoreDB, "places"));
      
      const placesData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            name: doc.data().name,
            image: doc.data().image,
            city: doc.data().city,
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
              borderRadius: 10,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: hp(2),
              marginRight: hp(2),
            })}
          >
            <View className="flex-1">
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: 8,
                }}
              >
                {item.name}
              </Text>
              <View style={{ alignItems: "center" }}>
                <Image
                source={{ uri: item.image }}
                style={{
                  width: wp(30),
                  height: hp(20),
                  borderRadius: 16,
                  marginBottom: 12,
                  resizeMode: "cover",
                }}
              />
              </View>
            </View>
          </Pressable>
        )}
        contentContainerClassName="pb-4"
      />
      <ImageCuatro 
        image1="https://www.chullostravelperu.com/wp-content/uploads/2023/08/Ciudad-del-Cusco-lugares-turisticos.jpg"
        image2="https://i.pinimg.com/736x/af/50/4e/af504e92e10f4701198e4ff7cf6178d5.jpg"
        image3="https://i.pinimg.com/736x/51/4e/8e/514e8eed129e35e41e7dbd95e0872e7e.jpg"
        image4="https://i.pinimg.com/736x/d0/97/81/d0978120eba010db3a40b842fbcef99d.jpg"
      />
    </View>
  );
};

export default Places;

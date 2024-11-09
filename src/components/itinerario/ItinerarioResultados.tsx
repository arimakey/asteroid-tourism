
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestoreDB } from '@/firebaseConfig'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { useAuth } from '@/src/context/authContext'
import { hp, wp } from '@/src/helpers/common'

type Schedule = {
    end_time: string;
    start_time: string;
    type: string;
    id: string;
    image: string;
    name: string;
}

type Days = Schedule[][]


const ItinerarioResultados = ({goToFinal}: {goToFinal: () => void}) => {
  const {user} = useAuth();
  const [results, setResults] = useState<Schedule[][]>([]);
  useEffect(() => {
    if (user?.uid) {
      getItinerario(user.uid);
    }
  }, [])


  const getItinerario = async (userId: string) => {
    try {
        const response = await fetch('https://generatemultidayitinerary-glxwkatvia-uc.a.run.app', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        const result = await response.json();
        setResults(result);
        console.log(results[0][0])
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
  };


  return (
    <View className='pr-5'
      style={{paddingRight: 5}}
    >
      <View>
        <Text style={{fontSize: hp(3), fontWeight: 700}}>My Itinerary</Text>
      </View>
      <View>
        {results.map((day, key)=> (
          <View key={key}
            style={{
              backgroundColor: "#F3F3F3",
              borderRadius: 10,
              marginBottom: 25,
            }}
          >
            <Text style={{fontSize: hp(3), color: "#0B7B74"}}>Day {key + 1}</Text>
            {day.map((schedule, key) => (

              <View key={key} className=''>
                <Text style={{fontSize: hp(2)}}>{schedule.name}</Text>
                <Image source={{uri: schedule.image}} style={{width: wp(100), objectFit: "cover", height: hp(15)}} />
              </View>
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity style={{backgroundColor: "#1f2937", padding:4}} onPress={()=>{goToFinal()}}>
                <Text style={{color: "white", textAlign: "center"}}>Guardar y continuar</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ItinerarioResultados
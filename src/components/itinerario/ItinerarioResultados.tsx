
import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestoreDB } from '@/firebaseConfig'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

type Schedule = {
    end_time: string;
    start_time: string;
    place: Place;
}

type Place = {
    id: string;
}

type Day = {
    schedule: Schedule[];
}


const ItinerarioResultados = () => {
  
  const [days, setDays] = useState<Day[]>([])

  useEffect(() => {
    const fetchResultados = async () => {
        const querySnapshot = await getDocs(collection(firestoreDB, "results"));
        const resultadosArray:any = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<any, 'id'>), // Esto asegura que `name` se tipifique correctamente
        }));
        //setDays(resultadosArray[0].days)
        //console.log(days[0].schedule[0].place.id)
    }
    fetchResultados()
  }, [])
  return (
    <View>
      <Text>Itinerario</Text>
    </View>
  )
}

export default ItinerarioResultados
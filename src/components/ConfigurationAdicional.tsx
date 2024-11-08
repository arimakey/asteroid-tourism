import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import ComboBox from 'react-native-combobox';
import RNPickerSelect from 'react-native-picker-select';
import { hp } from '../helpers/common';
import { IdiomasEnum, paisesArray } from '../utils/enums';
import "@/global.css";
import { UserRegister, UserRegisterWithConfig } from '../utils/types';
import { useAuth } from '../context/authContext';
import { useRouter } from 'expo-router';

const ConfigurationAdicional = ({user}: {user: UserRegister | null}) => {
  const [paisSelected, setPaisSelected] = useState<string>(paisesArray[0])
  const [idiomaSelected, setIdiomaSelected] = useState<string | null>(null)

  const {register} = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const handleEnviar = async () => {
    if (paisSelected === "" || idiomaSelected === null || user === null) {
      alert("Por favor selecciona un pais e idioma")
      return
    }

    let userWithConfig: UserRegisterWithConfig = {
      ...user,
      pais: paisSelected,
      idioma: idiomaSelected
    }

    setLoading(true)
    await register(userWithConfig)
    setLoading(false)

  }
  console.log(user)

  useEffect(() => {

    console.log("pais: ", {paisSelected, idiomaSelected})
  }, [paisSelected, idiomaSelected])

  /* const values =[
    { label: "Peru", value: "Peru"},
  ] */

    const values = paisesArray.map((data) => ({ label: data, value: data })); 

  return (
    <View className='flex-1 p-6'>
      <Text>Configuracion Adicional</Text>
      <View>
        <RNPickerSelect 
          items={values}
          onValueChange={(value) => setPaisSelected(value)}
          style={{inputWeb: {borderRadius: 4}}}
          value={paisesArray[0]}
        />
        <Text>Valor seleccionadao {paisSelected}</Text>
      </View>
      <View className='flex-row gap-4'
        style = {{height: hp(10)}}
      >
        <View className='flex-1'>
          <TouchableOpacity
            onPress={()=>setIdiomaSelected(IdiomasEnum.Español) }
            className='flex-1 justify-center items-center'
          >
            <Text className='text-center'>Español</Text>
          </TouchableOpacity>
        </View>

        <View className='flex-1'>
          <TouchableOpacity
            className='flex-1 justify-center items-center'
            onPress={()=>setIdiomaSelected(IdiomasEnum.Ingles)}
          >
            <Text className='text-center'>Ingles</Text>
          </TouchableOpacity>
        </View>

      </View>

      <View className='gap-4' style={{marginTop: hp(2)}}>
          {
            loading ? (
              <View className='flex-row justify-center'>
                <Text style={{fontSize: hp(2.7)}} className='text-neutral-600 font-semibold tracking-wider'>Loading...</Text>
              </View>
            ): (
              <TouchableOpacity
                onPress={handleEnviar}
                style={{height: hp(6)}}
                className='bg-neutral-700 rounded-md justify-center items-center'
              >
                <Text style={{fontSize: hp(2.7)}} className='text-white font-semibold tracking-wider'>Sign Up</Text>
              </TouchableOpacity>
            )
          }
        </View>
    </View>
  )
}

const style = StyleSheet.create({

})

export default ConfigurationAdicional
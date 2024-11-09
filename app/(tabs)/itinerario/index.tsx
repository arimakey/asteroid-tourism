
import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Step1Index from '@/src/components/step1/index'
import Step2Categorias from '@/src/components/step2/Step2Categorias'
import Ste3Preguntas from "@/src/components/step3/Step3Preguntas"
import Step4Foods from '@/src/components/step4/Step4Foods'
import Step5FoodsPreguntas from '@/src/components/step5/Step5FoodsPreguntas'
import ItinerarioResultados from '@/src/components/itinerario/ItinerarioResultados'
const IndexItinerario = () => {

  const [currentStep, setCurrentStep] = useState(1)

  const goToNextStep = () => {
    setCurrentStep((prevStep)=> prevStep + 1)
  }

  useEffect(() => {
    console.log(currentStep)
  }, [currentStep])

  const goToPreviousStep = () => {
    setCurrentStep((prevStep)=> prevStep - 1)
  }

  const goTiFinal = () => {
    setCurrentStep(1)
  }

  return (
    <View className='p-10 flex-1'>
      {
        currentStep === 1 && (
          <Step1Index goToNextStep={goToNextStep}/>
        )
      }

      {
        currentStep === 2 && (
          <Step2Categorias goToNextStep={goToNextStep}/>
        )
      }

      {
        currentStep === 3 && (
          <Ste3Preguntas goToNextStep={goToNextStep} />
        )
      }
      {
        currentStep === 4 && (
          <Step4Foods goToNextStep={goToNextStep} />
        )
      }

      {
        currentStep === 5 && (
          <Step5FoodsPreguntas goToNextStep={goToNextStep} />
        )
      }

      {
        currentStep === 6 && (
          <View className='flex-1 justify-center items-center'>
            <ItinerarioResultados goToFinal ={goTiFinal}/>
          </View>
        )
      }
    </View>
  )
}

export default IndexItinerario
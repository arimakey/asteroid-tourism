
import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Step1Index from '@/src/components/step1/index'
import Step2Categorias from '@/src/components/step2/Step2Categorias'
const IndexItinerario = () => {

  const [currentStep, setCurrentStep] = useState(1)

  const goToNextStep = () => {
    setCurrentStep((prevStep)=> prevStep + 1)
  }

  const goToPreviousStep = () => {
    setCurrentStep((prevStep)=> prevStep - 1)
  }

  return (
    <View className='p-10'>
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
          <Text>Step 3</Text>
        )
      }
    </View>
  )
}

export default IndexItinerario
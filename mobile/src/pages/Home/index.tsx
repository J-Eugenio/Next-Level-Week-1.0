import React, { useState, useEffect, ChangeEvent } from 'react'
import axios from 'axios'
import { Feather as Icon } from '@expo/vector-icons'
import RNPickerSelect from 'react-native-picker-select'
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}
const Home = () => {

  //Pega todas as cidades e UF selecionada
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  //Pega a cidade e a UF selecionada
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  //Navegar entre telas
  const navigation = useNavigation()


  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla)
      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    //Carrega as cidades sempre que a UF mudar
    if (selectedUf === '0') {
      return
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome)
      setCities(cityNames)
    })
  }, [selectedUf])

  function handleNavigateToPoints() {
    //Navega para points e manda a cidade e a UF pra tela points
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
  }

  function handleSelectUf(value: string) {
    ///função do select do UF
    const uf = value
    setSelectedUf(uf)
  }
  function handleSelectCity(value: string) {
    //Função do select City
    const city = value
    setSelectedCity(city)
  }
  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          placeholder={{
            label: 'Selecione o estado',
            value: null,
          }}
          style={pickerSelectStyles}
          onValueChange={(value) => handleSelectUf(value)}
          items={ufs.map(uf => ({ label: uf, value: uf }))}
        />
        <RNPickerSelect
          placeholder={{
            label: 'Selecione cidade',
            value: null,
          }}
          style={pickerSelectStyles}
          onValueChange={(value) => handleSelectCity(value)}
          items={cities.map(city => ({ label: city, value: city }))}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,

  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    marginBottom: 5
  },
});
export default Home
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterStoreScreen = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [cep, setCep] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [openingHours, setOpeningHours] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedUserId = await AsyncStorage.getItem('userId');
        if (savedToken) setToken(savedToken);
        if (savedUserId) setUserId(savedUserId);
      } catch (e) {
        console.log('Erro ao carregar token/userId:', e);
      }
    };
    loadData();
  }, []);

  const handleRegister = async () => {
    if (!token) {
      Alert.alert('Erro', 'Token não carregado. Tente novamente.');
      return;
    }

    try {
      const bodyData = new URLSearchParams();
      bodyData.append('IdOwner', userId);
      bodyData.append('Name', name);
      bodyData.append('Description', description);
      bodyData.append('Category', category);
      bodyData.append('Email', email);
      bodyData.append('NumberPhone', numberPhone);
      bodyData.append('Address', address);
      bodyData.append('City', city);
      bodyData.append('State', stateField);
      bodyData.append('Cep', cep);
      bodyData.append('AdressNumber', addressNumber);
      bodyData.append('OpeningHours', openingHours);

      const response = await fetch('https://apipego.vercel.app/StoreRegister', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Id': userId.toString(),
        },
        body: bodyData.toString(),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Loja cadastrada com sucesso!');
        navigation.goBack();
      } else {
        const errorText = await response.text();
        Alert.alert('Erro', `Falha ao cadastrar loja: ${errorText}`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro na comunicação com o servidor.');
    }
  };

  const renderInput = (label, value, setValue, keyboardType = 'default') => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
        placeholder={label}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastrar Loja</Text>

        {renderInput('Nome', name, setName)}
        {renderInput('Descrição', description, setDescription)}
        {renderInput('Categoria', category, setCategory)}
        {renderInput('Email', email, setEmail, 'email-address')}
        {renderInput('Telefone', numberPhone, setNumberPhone, 'phone-pad')}
        {renderInput('Endereço', address, setAddress)}
        {renderInput('Cidade', city, setCity)}
        {renderInput('Estado', stateField, setStateField)}
        {renderInput('CEP', cep, setCep, 'numeric')}
        {renderInput('Número', addressNumber, setAddressNumber, 'numeric')}
        {renderInput('Horário de Funcionamento', openingHours, setOpeningHours)}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar Loja</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff4d4d',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    height: 48,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RegisterStoreScreen;

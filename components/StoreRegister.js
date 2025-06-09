import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
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
      if (savedToken) {
        setToken(savedToken);
        console.log('Token carregado:', savedToken);
      } else {
        console.log('Token não encontrado no AsyncStorage');
      }
      if (savedUserId) setUserId(savedUserId);
    } catch (e) {
      console.log('Erro ao carregar token e userId:', e);
    }
  };
  loadData();
}, []);

const handleRegister = async () => {
  if (!token) {
    Alert.alert('Erro', 'Token não carregado. Tente novamente.');
    return;
  }

  // Validação dos campos (opcional aqui, seu código atual já tem)

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

    console.log('Enviando requisição com token:', token);

    const response = await fetch('https://apipego.vercel.app/StoreRegister', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Categoria</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={numberPhone} onChangeText={setNumberPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Endereço</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <Text style={styles.label}>Cidade</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <Text style={styles.label}>Estado</Text>
      <TextInput style={styles.input} value={stateField} onChangeText={setStateField} />

      <Text style={styles.label}>CEP</Text>
      <TextInput style={styles.input} value={cep} onChangeText={setCep} keyboardType="numeric" />

      <Text style={styles.label}>Número</Text>
      <TextInput style={styles.input} value={addressNumber} onChangeText={setAddressNumber} keyboardType="numeric" />

      <Text style={styles.label}>Horário de Funcionamento</Text>
      <TextInput style={styles.input} value={openingHours} onChangeText={setOpeningHours} keyboardType="numeric" />

      <View style={{ marginVertical: 20 }}>
        <Button title="Cadastrar Loja" onPress={handleRegister} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 5,
  },
});

export default RegisterStoreScreen;

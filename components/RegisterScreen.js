import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!name || !email || !password || !cpfCnpj || !numberPhone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    const formBody = `Name=${encodeURIComponent(name)}&Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}&Cpf_Cnpj=${encodeURIComponent(cpfCnpj)}&NumberPhone=${encodeURIComponent(numberPhone)}`;

    try {
      const response = await fetch('https://apipego.vercel.app/UserRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ReactNativeApp'
        },
        body: formBody
      });

      const contentType = response.headers.get('Content-Type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('Resposta:', data);

      if (response.ok) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        navigation.navigate('LoginScreen'); // Ajuste conforme o nome da sua tela de login
      } else {
        Alert.alert('Erro', typeof data === 'string' ? data : (data.message || 'Falha ao cadastrar usuário'));
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF/CNPJ"
        value={cpfCnpj}
        onChangeText={setCpfCnpj}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={numberPhone}
        onChangeText={setNumberPhone}
      />
      <Button
        title={isLoading ? 'Cadastrando...' : 'Cadastrar'}
        onPress={handleRegister}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4
  }
});

export default RegisterScreen;

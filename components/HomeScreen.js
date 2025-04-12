import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = () => {
  const [userInfo, setUserInfo] = useState({ id: '', token: '' });
  const [storeId, setStoreId] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserInfo = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const userToken = await AsyncStorage.getItem('userToken');
      if (userId && userToken) {
        setUserInfo({ id: userId, token: userToken });
      } else {
        navigation.replace('LoginScreen');
      }
    };
    getUserInfo();
  }, []);

  const pickImage = async () => {
    Keyboard.dismiss();
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Você precisa permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 5,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Você precisa permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!storeId || !productName || !productPrice || !imageUri) {
      Alert.alert('Erro', 'Preencha todos os campos e selecione uma imagem.');
      return;
    }

    const formData = new FormData();
    formData.append('StoreID', storeId);
    formData.append('ProductName', productName);
    formData.append('ProductPrice', productPrice);
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${storeId}_${productName}.jpg`, // Adiciona extensão correta
    });

    console.log('Enviando FormData:', {
      StoreID: storeId,
      ProductName: productName,
      ProductPrice: productPrice,
      fileUri: imageUri,
    });

    try {
      const response = await fetch('https://apipego.vercel.app/ProductRegister', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'User-Id': userInfo.id,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso');
        setStoreId('');
        setProductName('');
        setProductPrice('');
        setImageUri(null);
      } else {
        Alert.alert('Erro', data.message || 'Falha ao cadastrar o produto');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userToken');
    navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo, usuário {userInfo.id}!</Text>
      <Button title="Logout" onPress={handleLogout} />

      <TextInput
        style={styles.input}
        placeholder="StoreID"
        keyboardType="numeric"
        value={storeId}
        onChangeText={setStoreId}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        keyboardType="decimal-pad"
        value={productPrice}
        onChangeText={setProductPrice}
      />

      <Button title="Escolher Imagem da Galeria" onPress={pickImage} />
      <Button title="Tirar Foto" onPress={takePhoto} />

      {imageUri && <Text style={styles.imageText}>Imagem selecionada!</Text>}

      <Button title="Cadastrar Produto" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  imageText: {
    fontSize: 14,
    color: 'green',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default HomeScreen;

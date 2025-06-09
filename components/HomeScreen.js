import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = () => {
  const [userInfo, setUserInfo] = useState({ id: '', token: '' });
  const [storeId, setStoreId] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userToken = await AsyncStorage.getItem('userToken');
        const storeIdRaw = await AsyncStorage.getItem('haveStore');

        // 'haveStore' pode ser string JSON, então fazemos parse
        const parsedStore = storeIdRaw ? JSON.parse(storeIdRaw) : null;

        if (userId && userToken) {
          setUserInfo({ id: userId, token: userToken });
          // Se 'haveStore' tem id, pegamos o id
          setStoreId(parsedStore?.id ? parsedStore.id.toString() : '');
        } else {
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        navigation.replace('LoginScreen');
      }
    };
    getUserInfo();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!storeId || !productName || !productPrice || !imageUri) {
      Alert.alert('Erro', 'Preencha todos os campos e selecione uma imagem.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('StoreID', storeId);
    formData.append('ProductName', productName);
    formData.append('ProductPrice', productPrice);

    const fileName = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(fileName);
    const ext = match ? match[1].toLowerCase() : 'jpg';
    const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

    formData.append('file', {
      uri: imageUri,
      name: `${productName}_${Date.now()}.${ext}`,
      type: mimeType,
    });

    try {
      const response = await fetch('https://apipego.vercel.app/ProductRegister', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'User-Id': userInfo.id,
          'Store-Id': storeId,
          // NÃO coloque Content-Type, o fetch define automaticamente para multipart/form-data
        },
        body: formData,
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }

      if (response.ok) {
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
        setProductName('');
        setProductPrice('');
        setImageUri(null);
      } else {
        Alert.alert('Erro', data.message || 'Erro ao cadastrar o produto.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Erro de rede. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('haveStore');
    navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo, usuário {userInfo.id}!</Text>
      <Text style={{ textAlign: 'center', marginBottom: 12 }}>
        Store ID: {storeId || 'Não disponível'}
      </Text>

      <Button title="Logout" onPress={handleLogout} />

      {/* Caso queira bloquear a edição do StoreID, substitua TextInput por Text */}
      

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

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Cadastrar Produto" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  text: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 8,
  },
});

export default HomeScreen;

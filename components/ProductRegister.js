import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const RegisterProductScreen = () => {
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
        const parsedStore = storeIdRaw ? JSON.parse(storeIdRaw) : null;
        if (userId && userToken) {
          setUserInfo({ id: userId, token: userToken });
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
    if ( !productName || !productPrice || !imageUri) {
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
        },
        body: formData,
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cadastrar Produto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={productName}
        onChangeText={setProductName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Preço (ex: 12.99)"
        keyboardType="decimal-pad"
        value={productPrice}
        onChangeText={setProductPrice}
        placeholderTextColor="#888"
      />

      <View style={styles.imageButtons}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Text style={styles.imageButtonText}>Câmera</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      {isLoading ? (
        <ActivityIndicator size="large" color="#ff4d4d" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Cadastrar Produto</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff4d4d',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  imageButton: {
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default RegisterProductScreen;

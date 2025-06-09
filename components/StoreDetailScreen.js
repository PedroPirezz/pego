import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, Button, Alert, ScrollView 
} from 'react-native';

const StoreDetailScreen = ({ route, navigation }) => {
  const { storeId } = route.params;

  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingStore, setLoadingStore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modal para mostrar foto em tela cheia
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchStoreData();
    fetchStoreProducts();
  }, []);

  const fetchStoreData = async () => {
    try {
      const response = await fetch(`https://apipego.vercel.app/StoreData/${storeId}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (!response.ok) throw new Error('Erro ao carregar dados da loja');
      const data = await response.json();
      setStoreData(data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoadingStore(false);
    }
  };

  const fetchStoreProducts = async () => {
    try {
      const response = await fetch(`https://apipego.vercel.app/Store/${storeId}/Products`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (!response.ok) throw new Error('Erro ao carregar produtos');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  if (loadingStore) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      {storeData && (
        <ScrollView style={styles.storeInfo}>
          <Text style={styles.storeName}>{storeData.StoreName}</Text>
          <Text>{storeData.StoreDescription}</Text>
          <Text>Categoria: {storeData.StoreCategory}</Text>
          <Text>Email: {storeData.StoreEmail}</Text>
          <Text>Telefone: {storeData.StoreNumberPhone}</Text>
          <Text>Endereço: {storeData.StoreAddress}, {storeData.StoreAdressNumber}</Text>
          <Text>{storeData.StoreCity} - {storeData.StoreState}</Text>
          <Text>CEP: {storeData.StoreCEP}</Text>
          <Text>Horário de abertura: {storeData.StoreOpeningHours}h</Text>
        </ScrollView>
      )}

      <Text style={styles.productsTitle}>Produtos:</Text>

      {loadingProducts ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
         <TouchableOpacity onPress={() => openImageModal(item.ImageUrl)} style={styles.productCard}>
  <Image
    source={{ uri: item.ImageUrl }}
    style={styles.productImage}
    resizeMode="cover"
  />
  <Text style={styles.productName}>{item.Name}</Text>
  <Text style={styles.productPrice}>
    R$ {(Number(item.Price) || 0).toFixed(2)}
  </Text>
</TouchableOpacity>

          )}
        />
      )}

      {/* Modal para imagem tela cheia */}
      <Modal visible={modalVisible} transparent={false} animationType="slide">
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          <Button title="Fechar" onPress={closeImageModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  storeInfo: { marginBottom: 20 },
  storeName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  productsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  productCard: {
    width: 150,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  productName: {
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    color: '#007bff',
    marginTop: 3,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  fullImage: {
    width: '100%',
    height: '85%',
  },
});

export default StoreDetailScreen;

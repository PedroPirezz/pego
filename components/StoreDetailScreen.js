import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Button,
  Alert,
  ScrollView,
  
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoreDetailScreen = ({ route, navigation }) => {
  const { storeId } = route.params;
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('pix');

  useEffect(() => {
    const initialize = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      await Promise.all([fetchStoreData(), fetchStoreProducts()]);
      setLoading(false);
    };
    initialize();

    return () => setCart([]);
  }, []);

  const fetchStoreData = async () => {
    try {
      const response = await fetch(`https://apipego.vercel.app/StoreData/${storeId}`);
      const data = await response.json();
      setStoreData(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados da loja');
    }
  };

  const fetchStoreProducts = async () => {
    try {
      const response = await fetch(`https://apipego.vercel.app/Store/${storeId}/Products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar produtos');
    }
  };

  const markAsOutOfStock = async (productId) => {
    try {
      const token = 'Bearer $2a$10$phI/t7ZEeBNYAwCieYsGkOaRwlgG72LK97MDQhFIGxkp22VKxAJVu';
      await fetch('https://apipego.vercel.app/AlterProductDisponibility', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Disponibility': '0',
          'Product-Id': String(productId),
          'Store-Id': String(storeId),
          'User-Id': String(userId),
        },
      });
      await fetchStoreProducts();
      Alert.alert('Sucesso', 'Produto marcado como esgotado.');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao marcar como esgotado');
    }
  };

  const openImageModal = (url) => {
    setSelectedImage(url);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            productName: product.Name,
            quantity: 1,
            unitPrice: Number(product.Price),
          },
        ];
      }
    });
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.productId !== productId));
  };

const finalizeOrder = async () => {
  if (cart.length === 0) {
    Alert.alert('Carrinho vazio', 'Adicione pelo menos um produto antes de finalizar o pedido.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('userToken');
    const id = await AsyncStorage.getItem('userId');

    if (!token || !id) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    const orderData = {
      userId: id,
      storeId: String(storeId),
      items: cart.map(item => ({
        productId: String(item.productId),
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Math.round(item.unitPrice * 100)
,
      })),
      paymentMethod: "pix" ,
    };

    const response = await fetch('https://apipego.vercel.app/NewOrder', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Id': String(id),
      },
      body: JSON.stringify(orderData),
    });

if (response.ok) {
  Alert.alert('Sucesso', 'Pedido enviado com sucesso!', [
    {
      text: 'Ok',
      onPress: () => {
        setCart([]);
        navigation.navigate('OrdersListing');
      },
    },
  ]);
} else {
  const errorText = await response.text();
  Alert.alert('Erro ao enviar pedido', errorText);
}

  } catch (error) {
    console.error('Erro ao finalizar pedido:', error);
    Alert.alert('Erro', 'Erro de conexão ao enviar pedido.');
  }
};


  if (loading) return <ActivityIndicator size="large" color="#ff4d4d" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      {/* Loja */}
      <View style={styles.headerBox}>
        <Text style={styles.storeName}>{storeData.StoreName}</Text>
        <Text style={styles.storeDesc}>{storeData.StoreDescription}</Text>
        <Text style={styles.infoText}>📍 {storeData.StoreAddress}, {storeData.StoreCity} - {storeData.StoreState}</Text>
        <Text style={styles.infoText}>📞 {storeData.StoreNumberPhone}</Text>
        <Text style={styles.infoText}>🕒 Aberto às {storeData.StoreOpeningHours}h</Text>
        {userId === String(storeData.StoreIdOwner) && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('ProductRegister', { storeId })}>
            <Text style={styles.addButtonText}>+ Cadastrar Produto</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Produtos */}
      <Text style={styles.sectionTitle}>🍔 Produtos Disponíveis</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openImageModal(item.ImageUrl)} style={styles.productCard}>
            <Image source={{ uri: item.ImageUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{item.Name}</Text>
            <Text style={styles.productPrice}>R$ {(Number(item.Price) || 0).toFixed(2)}</Text>
            {item.Disponibility === 0 && <Text style={styles.outOfStockLabel}>Esgotado</Text>}
            {userId === String(storeData.StoreIdOwner) && (
              <TouchableOpacity
                style={styles.outOfStockButton}
                onPress={() => markAsOutOfStock(item.id)}>
                <Text style={styles.outOfStockButtonText}>Marcar como Esgotado</Text>
              </TouchableOpacity>
            )}
            {item.Disponibility !== 0 && (
              <TouchableOpacity
                style={{ marginTop: 8, backgroundColor: '#ff4d4d', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 }}
                onPress={() => addToCart(item)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Carrinho */}
      {cart.length > 0 && (
        <View style={{ padding: 16, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>🛒 Carrinho</Text>
          {cart.map((item) => (
            <View key={item.productId} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.productName}</Text>
                <Text>R$ {(item.unitPrice * item.quantity).toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.cartButton} onPress={() => decreaseQuantity(item.productId)}>
                  <Text style={styles.cartButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 8 }}>{item.quantity}</Text>
                <TouchableOpacity style={styles.cartButton} onPress={() => increaseQuantity(item.productId)}>
                  <Text style={styles.cartButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cartButton, { backgroundColor: '#999', marginLeft: 8 }]} onPress={() => removeFromCart(item.productId)}>
                  <Text style={styles.cartButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Método de pagamento */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>💳 Forma de Pagamento</Text>
            <TouchableOpacity
              style={[styles.paymentMethod, paymentMethod === 'pix' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('pix')}
            >
              <Image
                source={{ uri: 'https://img.icons8.com/color/512/pix.png' }}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <Text style={{ fontWeight: 'bold' }}>Pix</Text>
            </TouchableOpacity>
          </View>

          {/* Total */}
          <Text style={{ marginTop: 8, fontWeight: 'bold' }}>
            Total: R$ {cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0).toFixed(2)}
          </Text>

          {/* Finalizar */}
          <TouchableOpacity
            style={{ marginTop: 10, backgroundColor: '#ff4d4d', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
            onPress={finalizeOrder}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Finalizar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Imagem */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          <Button title="Fechar" onPress={closeImageModal} color="#ff4d4d" />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBox: {
    backgroundColor: '#ffe5e5',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  storeName: { fontSize: 28, fontWeight: 'bold', color: '#ff4d4d', textAlign: 'center' },
  storeDesc: { fontSize: 16, color: '#555', textAlign: 'center', marginVertical: 8 },
  infoText: { fontSize: 14, color: '#333', textAlign: 'center', marginVertical: 2 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#ff4d4d', paddingLeft: 16, marginBottom: 10 },
  productList: { paddingLeft: 16 },
  productCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productImage: { width: 130, height: 130, borderRadius: 10 },
  productName: { marginTop: 8, fontWeight: 'bold', fontSize: 14, color: '#333', textAlign: 'center' },
  productPrice: { fontSize: 16, color: '#ff4d4d', fontWeight: 'bold', marginTop: 4 },
  addButton: {
    marginTop: 16,
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  outOfStockLabel: { marginTop: 6, color: '#ff4d4d', fontWeight: 'bold', fontSize: 12 },
  outOfStockButton: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
  },
  outOfStockButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: { width: '100%', height: '80%' },
  cartButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cartButtonText: { color: '#fff', fontWeight: 'bold' },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  selectedPayment: {
    borderColor: '#ff4d4d',
    backgroundColor: '#ffe5e5',
  },
});

export default StoreDetailScreen;

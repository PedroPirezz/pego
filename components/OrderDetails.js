import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderDetailsScreen = ({ route }) => {
  const { orderId } = route.params;
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [qrCodeUri, setQrCodeUri] = useState(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');
        setUserId(id);
        setUserToken(token);

        const response = await fetch('https://apipego.vercel.app/OrderInfo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Order-Id': String(orderId),
            'User-Id': String(id),
          },
        });

        if (!response.ok) throw new Error('Erro ao carregar detalhes do pedido');

        const data = await response.json();
        setOrderData(data);

        // Converter o Buffer binário do QRCode em Base64 para exibir a imagem
        if (data.OrderInfo.PixQrCode?.data) {
          const base64 = Buffer.from(data.OrderInfo.PixQrCode.data).toString('base64');
          setQrCodeUri(`data:image/png;base64,${base64}`);
        }

      } catch (error) {
        Alert.alert('Erro', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  if (loading) return <ActivityIndicator size="large" color="#ff4d4d" style={{ flex: 1 }} />;

  if (!orderData) return <Text>Não foi possível carregar os detalhes do pedido.</Text>;

  const { OrderInfo, OrderItems } = orderData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>Detalhes do Pedido</Text>
        <Text style={styles.infoText}>Status: {OrderInfo.Status}</Text>
        <Text style={styles.infoText}>Forma de pagamento: {OrderInfo.PaymentMethod.toUpperCase()}</Text>
        <Text style={styles.infoText}>Total: R$ {(OrderInfo.TotalPrice / 100).toFixed(2)}</Text>
        <Text style={styles.infoText}>Realizado em: {new Date(OrderInfo.createdAt).toLocaleString()}</Text>
      </View>

      <Text style={styles.sectionTitle}>📋 Itens do Pedido</Text>
      {OrderItems.map(item => (
        <View key={item.id} style={styles.itemBox}>
          <Text style={styles.itemName}>{item.ProductName}</Text>
          <Text style={styles.itemDetails}>Quantidade: {item.Quantity}</Text>
          <Text style={styles.itemDetails}>Preço unitário: R$ {(item.UnitPrice / 100).toFixed(2)}</Text>
          <Text style={styles.itemDetails}>Subtotal: R$ {(item.SubTotal / 100).toFixed(2)}</Text>
        </View>
      ))}

      {qrCodeUri && (
        <>
          <Text style={styles.sectionTitle}>💳 Pagamento via Pix</Text>
          <View style={styles.qrContainer}>
            <Image source={{ uri: qrCodeUri }} style={styles.qrImage} />
            <Text style={styles.pixKeyLabel}>Chave Pix:</Text>
            <Text selectable style={styles.pixKey}>{OrderInfo.PixKey}</Text>
          </View>
        </>
      )}
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
  title: { fontSize: 26, fontWeight: 'bold', color: '#ff4d4d', textAlign: 'center' },
  infoText: { fontSize: 16, color: '#333', marginVertical: 4 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#ff4d4d', marginLeft: 16, marginTop: 20 },
  itemBox: {
    backgroundColor: '#f9f9f9',
    margin: 10,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemDetails: { fontSize: 14, color: '#555', marginTop: 2 },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  qrImage: { width: 220, height: 220, marginBottom: 12 },
  pixKeyLabel: { fontWeight: 'bold', color: '#333', marginTop: 10 },
  pixKey: { color: '#555', textAlign: 'center', fontSize: 12, marginTop: 4 },
});

export default OrderDetailsScreen;

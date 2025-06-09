import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const StoresListScreen = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [haveStore, setHaveStore] = useState(null);

  const navigation = useNavigation();

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://apipego.vercel.app/StoresListing', {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setStores(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar lojas');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const value = await AsyncStorage.getItem('haveStore');
        if (value) {
          setHaveStore(JSON.parse(value));
        } else {
          setHaveStore(null);
        }
        fetchStores();
      };
      loadData();
    }, [])
  );
    const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('haveStore');
    navigation.replace('LoginScreen');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              if (haveStore) {
                navigation.navigate('StoreDetail', { storeId: haveStore.id });
              } else {
                navigation.navigate('StoreRegister');
              }
            }}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>
              {haveStore ? 'Minha Loja' : 'Cadastrar Loja'}
            </Text>
          </TouchableOpacity>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )
    });
  }, [haveStore, navigation]);

  const renderStore = ({ item }) => (
    <TouchableOpacity
      style={styles.storeItem}
      onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })}
    >
      <Text style={styles.storeName}>{item.StoreName}</Text>
      <Text>{item.StoreCity}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStore}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhuma loja encontrada.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  storeItem: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  storeName: {
    fontWeight: 'bold',
    fontSize: 18
  },
  headerButton: {
  
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#007bff',
    borderRadius: 5
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default StoresListScreen;

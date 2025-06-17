import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
} from 'react-native';
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
        headers: { 'Content-Type': 'application/json' },
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
        setHaveStore(value ? JSON.parse(value) : null);
        fetchStores();
      };
      loadData();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userId', 'userToken', 'haveStore']);
    navigation.replace('LoginScreen');
  };

  useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: 'Pegô!',
    headerTitleStyle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ff4d4d',
    },
    headerRight: () => (
      <View style={styles.headerRightContainer}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            const screen = haveStore ? 'StoreDetail' : 'StoreRegister';
            navigation.navigate(screen, {
              storeId: haveStore?.id,
            });
          }}
        >
          <Text style={styles.headerButtonText}>
            {haveStore ? 'Minha Loja' : 'Criar Loja'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            navigation.navigate('OrdersListing');
          }}
        >
          <Text style={styles.headerButtonText}>Ver Pedidos</Text>
        </TouchableOpacity>
        

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    ),
  });
}, [haveStore, navigation]);


  const renderStore = ({ item }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => navigation.navigate('StoreDetail', { storeId: item.id })}
    >
      <Text style={styles.storeTitle}>{item.StoreName}</Text>
      <Text style={styles.storeSubtitle}>{item.StoreCity}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4d4d" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Saudação e localização */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, bem-vindo ao Pegô!</Text>
        <Text style={styles.location}>📍 Encontre o Restaurante mais perto de Você</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        {['Promoções', 'Mais Pedidos', 'Mais próximos'].map((item, index) => (
          <TouchableOpacity key={index} style={styles.filterChip}>
            <Text style={styles.filterText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categorias */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['Pizza', 'Hambúrguer', 'Sushi', 'Açaí', 'Marmita']}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.categoriesList}
      />

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>🍽️ Pegô! Praticidade é coisa nossa</Text>
      </View>

      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStore}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhuma loja encontrada.</Text>}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { marginBottom: 16 },
  greeting: { fontSize: 18, fontWeight: 'bold' },
  location: { fontSize: 14, color: '#888' },

  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#fce4ec',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: { fontSize: 13, color: '#d81b60' },

  categoriesList: { marginBottom: 16 },
  categoryButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginRight: 10,
  },
  categoryText: { fontSize: 14, color: '#333' },

  banner: {
    backgroundColor: '#ff4d4d',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },

  storeCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  storeTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  storeSubtitle: { fontSize: 14, color: '#777' },

  headerButton: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerRightContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginRight: 10,
},

headerButton: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  backgroundColor: '#ff4d4d',
  borderRadius: 8,
},

headerButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

logoutButton: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  backgroundColor: '#ddd',
  borderRadius: 8,
},

logoutButtonText: {
  color: '#333',
  fontWeight: 'bold',
  fontSize: 14,
},

});

export default StoresListScreen;

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { api, getImageUrl, loadAuthToken } from '../../lib/api';
import { global } from '../../styles/global';
import { Contato } from '../../types/Contato';

export default function Contatos() {
  const router = useRouter();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarContatos = useCallback(async () => {
    setCarregando(true);
    await loadAuthToken();
    try {
      const { data } = await api.get<Contato[]>('/contatos');
      setContatos(data);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregarContatos(); }, [carregarContatos]));

  async function excluir(id: string) {
    await api.delete(`/contatos/${id}`);
    carregarContatos();
  }

  if (carregando) return <ActivityIndicator />;

  return (
    <View style={global.container}>
      <Text style={global.title}>Seus contatos</Text>
      <Button title="Novo contato" onPress={() => router.push('/contatos/novo')} />
      <FlatList data={contatos} keyExtractor={(item) => item._id} renderItem={({ item }) => (
        <View>
          <TouchableOpacity onPress={() => router.push(`/contatos/${item._id}`)}>
            {item.fotoId ? <Image source={{ uri: getImageUrl(item.fotoId) }} style={{ width: 60, height: 60 }} /> : null}
            <Text>{item.nome}</Text>
            <Text>{item.email}</Text>
          </TouchableOpacity>
          <Button title="Excluir" onPress={() => excluir(item._id)} />
        </View>
      )} />
    </View>
  );
}
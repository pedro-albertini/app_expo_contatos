import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import FormContato from '../../components/FormContato';
import { api, loadAuthToken } from '../../lib/api';
import { global } from '../../styles/global';
import { Contato } from '../../types/Contato';

export default function EditarContato() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [contato, setContato] = useState<Contato>();

  useEffect(() => {
    async function carregar() {
      await loadAuthToken();
      const { data } = await api.get<Contato>(`/contatos/${id}`);
      setContato(data);
    }
    carregar();
  }, [id]);

  async function salvar(dados: Omit<Contato, '_id'>) {
    await api.put(`/contatos/${id}`, dados);
    router.back();
  }

  if (!contato) return <ActivityIndicator />;
  return <View style={global.container}><FormContato contato={contato} onSubmit={salvar} /></View>;
}
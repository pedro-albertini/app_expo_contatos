import { useRouter } from 'expo-router';
import { View } from 'react-native';
import FormContato from '../../components/FormContato';
import { api, loadAuthToken } from '../../lib/api';
import { global } from '../../styles/global';

export default function NovoContato() {
  const router = useRouter();

  async function salvar(dados: Parameters<React.ComponentProps<typeof FormContato>['onSubmit']>[0]) {
    await loadAuthToken();
    await api.post('/contatos', dados);
    router.back();
  }

  return <View style={global.container}><FormContato onSubmit={salvar} /></View>;
}
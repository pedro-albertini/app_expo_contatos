import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api, getImageUrl } from '../lib/api';
import { global } from '../styles/global';
import { Contato } from '../types/Contato';

type DadosContato = Omit<Contato, '_id'>;

interface FormContatoProps {
  contato?: Partial<Contato>;
  onSubmit: (dados: DadosContato) => Promise<void>;
}

export default function FormContato({ contato, onSubmit }: FormContatoProps) {
  const [nome, setNome] = useState(contato?.nome ?? '');
  const [email, setEmail] = useState(contato?.email ?? '');
  const [telefone, setTelefone] = useState(contato?.telefone ?? '');
  const [endereco, setEndereco] = useState(contato?.endereco ?? '');
  const [fotoId, setFotoId] = useState(contato?.fotoId);
  const [fotoUri, setFotoUri] = useState<string>();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function selecionarImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setErro('Permissão para acessar a galeria negada.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (resultado.canceled || !resultado.assets[0]) return;

    const imagem = resultado.assets[0];
    setFotoUri(imagem.uri);
    setCarregando(true);
    setErro('');
    try {
      const formData = new FormData();
      formData.append('foto', {
        uri: imagem.uri,
        name: imagem.fileName ?? 'foto.jpg',
        type: imagem.mimeType ?? 'image/jpeg'
      } as unknown as Blob);
      const { data } = await api.post<{ fileId: string }>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFotoId(data.fileId);
    } catch {
      setErro('Erro ao enviar imagem.');
    } finally {
      setCarregando(false);
    }
  }

  async function salvar() {
    if (!nome.trim()) {
      setErro('Nome é obrigatório.');
      return;
    }
    setErro('');
    await onSubmit({ nome, email, telefone, endereco, fotoId });
  }

  const imagem = fotoUri ?? getImageUrl(fotoId);

  return (
    <View>
      <TextInput style={global.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={global.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={global.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} />
      <TextInput style={global.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      {imagem ? <Image source={{ uri: imagem }} style={{ width: 100, height: 100 }} /> : null}
      {erro ? <Text>{erro}</Text> : null}
      <TouchableOpacity style={global.button} onPress={selecionarImagem} disabled={carregando}>
        <Text style={global.buttonText}>Selecionar imagem</Text>
      </TouchableOpacity>
      {carregando ? <ActivityIndicator /> : null}
      <TouchableOpacity style={global.button} onPress={salvar}>
        <Text style={global.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
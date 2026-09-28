import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../lib/api';
import { global } from '../styles/global';

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar() {
    if (!nome || !email || !senha) {
      setErro('Nome, email e senha são obrigatórios.');
      return;
    }
    try {
      await api.post('/usuarios/registrar', { nome, email, senha });
      Alert.alert('Sucesso', 'Usuário cadastrado!');
      router.replace('/');
    } catch {
      setErro('Erro ao cadastrar usuário.');
    }
  }

  return (
    <View style={global.container}>
      <Text style={global.title}>Cadastro</Text>
      <TextInput style={global.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={global.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={global.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      {erro ? <Text>{erro}</Text> : null}
      <TouchableOpacity style={global.button} onPress={cadastrar}><Text style={global.buttonText}>Cadastrar</Text></TouchableOpacity>
    </View>
  );
}
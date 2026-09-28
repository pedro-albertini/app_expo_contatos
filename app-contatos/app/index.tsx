import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api, setAuthToken } from '../lib/api';
import { global } from '../styles/global';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function entrar() {
    if (!email || !senha) {
      setErro('Email e senha são obrigatórios.');
      return;
    }
    try {
      const { data } = await api.post<{ token: string }>('/usuarios/login', { email, senha });
      await setAuthToken(data.token);
      router.push('/contatos');
    } catch {
      setErro('Email ou senha inválidos.');
    }
  }

  return (
    <View style={global.container}>
      <Text style={global.title}>Login</Text>
      <TextInput style={global.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={global.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      {erro ? <Text>{erro}</Text> : null}
      <TouchableOpacity style={global.button} onPress={entrar}><Text style={global.buttonText}>Entrar</Text></TouchableOpacity>
      <Link href="/cadastro" asChild><TouchableOpacity style={global.button}><Text style={global.buttonText}>Cadastrar</Text></TouchableOpacity></Link>
    </View>
  );
}
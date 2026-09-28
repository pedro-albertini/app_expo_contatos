import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { loadAuthToken } from '../lib/api';

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function verificarAutenticacao() {
      const token = await loadAuthToken();
      const paginaPublica = pathname === '/' || pathname === '/cadastro';
      if (ativo && !token && !paginaPublica) router.replace('/');
      if (ativo) setVerificando(false);
    }
    verificarAutenticacao();
    return () => { ativo = false; };
  }, [pathname, router]);

  if (verificando) {
    return <View><ActivityIndicator /></View>;
  }
  return <Slot />;
}
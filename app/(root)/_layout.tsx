import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="beli-token" options={{ headerShown: false }} />
      <Stack.Screen name="detail-tagihan" options={{headerShown: false}}/>
      <Stack.Screen name="tagihan-page" options={{headerShown: false}}/>
      <Stack.Screen name="detail-transaksi" options={{headerShown: false}}/>
      <Stack.Screen name="notifikasi" options={{headerShown: false}}/>
      <Stack.Screen name="berita" options={{headerShown: false}}/>
    </Stack>
  );
};

export default Layout;

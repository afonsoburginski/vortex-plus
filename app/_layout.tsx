// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';

import '../tamagui-web.css'

import { config } from '../tamagui.config'
import { useFonts } from 'expo-font'
import { useEffect, useState } from 'react'

export {
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
  
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  function handleAuthStateChanged(user: User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync()
    }
  
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber;
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null
  }

  if (initializing) return null;

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  )
}
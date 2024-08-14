import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from '@react-navigation/native';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" hidden={true} />
      <AppNavigator />
    </ThemeProvider>
  );
}
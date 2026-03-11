import  { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from './src/store';
import { fetchMe } from './src/store/slices/authSlice';
import { AppNavigator } from './src/navigation/AppNavigator';
import { getToken } from './src/services/api';

function AppInner() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Attempt to restore session from stored token
    getToken().then((token) => {
      if (token) dispatch(fetchMe());
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
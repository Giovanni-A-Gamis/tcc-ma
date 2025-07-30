import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainContainer from '../src/navigation/MainContainer';

export default function App() {
  return (
    <PaperProvider>
      <MainContainer />
    </PaperProvider>
  );
}

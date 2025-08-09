import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';
import {DarkModeProvider} from "./DarkModeContextProvider";
import { useDarkMode} from './DarkModeContextProvider';
// Create a QueryClient instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider></DarkModeProvider>
  </React.StrictMode>
);
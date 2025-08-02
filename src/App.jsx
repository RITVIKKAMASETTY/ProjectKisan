import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignupForm from './features/auth/Signupform'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
function App() {
  return (<QueryClientProvider client={new QueryClient()}><ReactQueryDevtools initialIsOpen={false}/><SignupForm/></QueryClientProvider>
  )
}

export default App

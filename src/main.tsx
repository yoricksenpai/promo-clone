import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
          <ChakraProvider>

        <App />
            </ChakraProvider>

      </BrowserRouter>
  </React.StrictMode>
)
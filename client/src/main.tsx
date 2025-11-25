// client/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // <--- Импорт

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <CartProvider>  {/* <--- Оборачиваем AuthProvider или внутри него, главное чтобы App был внутри */}
                <App />
            </CartProvider>
        </AuthProvider>
    </React.StrictMode>,
)
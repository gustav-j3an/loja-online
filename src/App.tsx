import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AccountPage } from './pages/AccountPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="loja" element={<ShopPage />} />
              <Route path="produto/:slug" element={<ProductDetailPage />} />
              <Route path="carrinho" element={<CartPage />} />
              
              {/* Auth Routes */}
              <Route path="entrar" element={<LoginPage />} />
              <Route path="cadastro" element={<RegisterPage />} />
              <Route path="recuperar-senha" element={<ForgotPasswordPage />} />
              <Route path="redefinir-senha" element={<ResetPasswordPage />} />
              <Route
                path="minha-conta"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

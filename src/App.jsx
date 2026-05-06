import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { AddProduct } from "./pages/AddProduct";
import { ManageLists } from "./pages/ManageLists";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Settings } from "./pages/Settings"; // <-- Nome corrigido!
import { ManageCategories } from "./pages/ManageCategories"; // <-- Nome corrigido!
import { ManageProducts } from "./pages/ManageProducts";
import { Profile } from "./pages/Profile";
import { About } from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Protegidas dentro do layout Mobile-First */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/lists" element={<ManageLists />} />

          {/* Novas Rotas de Configuração */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<ManageCategories />} />
          <Route path="/products" element={<ManageProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

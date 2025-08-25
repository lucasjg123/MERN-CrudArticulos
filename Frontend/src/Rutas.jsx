// Rutas.jsx
import { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";
import { Articulos } from "./pages/Articulos";
import { ProveedorContexto, AuthContext } from "./context/ProveedorContexto";

export const Rutas = () => {
  return (
    <BrowserRouter>
      <ProveedorContexto>
        <AppRoutes />
      </ProveedorContexto>
    </BrowserRouter>
  );
};

// Este componente sí está dentro de ProveedorContexto
const AppRoutes = () => {
  const [usuarioAuth] = useContext(AuthContext); // ahora sí funciona

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Ruta protegida */}
      <Route
        path="/articulos"
        element={usuarioAuth ? <Articulos /> : <Navigate to="/login" />}
      />

      {/* Error 404 */}
      <Route path="*" element={<h1>Error no existe la pagina, 404</h1>} />
    </Routes>
  );
};

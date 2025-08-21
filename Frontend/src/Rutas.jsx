import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Registro } from "./Registro";
import { ProveedorContexto } from "./ProveedorContexto";
import { Articulos } from "./Articulos";

export const Rutas = () => {
  return (
    <BrowserRouter>
      <ProveedorContexto>
        {/* todas las rutas van a tener acceso al conexto (token del user) */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/articulos" element={<Articulos />} />
          {/* todas las demas rutas */}
          <Route path="*" element={<h1>Error no existe la pagina, 404</h1>} />
        </Routes>
      </ProveedorContexto>
    </BrowserRouter>
  );
};

import { useContext } from "react";
import { AuthContext } from "./ProveedorContexto";
import { Login } from "./Login";
import { ResultadoArticulos } from "./ResultadoArticulos";
import "./Articulos.css";

export const Articulos = () => {
  const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext);
  // si el token es invalido mandar a login sino a la pagina articulos
  return (
    <>
      <div id="elementos">
        {usuarioAuth == null ? <Login /> : <ResultadoArticulos />}
      </div>
    </>
  );
};

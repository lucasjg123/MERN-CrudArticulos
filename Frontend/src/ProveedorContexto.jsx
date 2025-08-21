// Importamos los hooks de React necesarios para manejar el contexto y el estado
import { createContext, useState, useEffect } from "react";

// Creamos un contexto de autenticación, que nos permitirá compartir la información
// del usuario autenticado entre los componentes que lo necesiten.
export const AuthContext = createContext();

// Este es el componente 'Proveedor', que va a envolver a todos los componentes hijos
// y proporcionarles acceso al token del usuario.
export const ProveedorContexto = (props) => {
  // Declaramos el estado 'usuarioAuth' para almacenar los datos del usuario autenticado
  const [usuarioAuth, setUsuarioAuth] = useState(null);

  // Aquí lo usamos para verificar si el usuario está autenticado y cargamos sus datos
  // desde el almacenamiento local (localStorage).
  const userStorage = () => {
    // Tratamos de obtener el objeto 'usuario' desde localStorage.
    const usuario = localStorage.getItem("usuario");

    // Si no existe el usuario en el almacenamiento, no hacemos nada
    if (!usuario) return false;

    // Si existe, lo parseamos (lo convertimos de JSON a un objeto) y actualizamos el estado
    setUsuarioAuth(JSON.parse(usuario));
  };

  // useEffect se ejecuta una vez cuando el componente 'Proveedor' se monta en el DOM.
  useEffect(() => {
    userStorage();
  }, []); // El array vacío [] hace que este efecto se ejecute solo una vez al montar el componente

  // Aquí devolvemos el 'AuthContext.Provider', que es el componente que provee
  // el valor del contexto a todos los componentes hijos que estén dentro de él.
  // Los hijos podrán acceder al estado 'usuarioAuth' y la función 'setUsuarioAuth'
  // utilizando el hook useContext en sus componentes.
  return (
    <AuthContext.Provider value={[usuarioAuth, userStorage]}>
      {/* 'props.children' es una propiedad especial de React que contiene los 
          componentes hijos que se pasan a 'Proveedor' cuando lo usamos en otro lugar. */}
      {props.children}
    </AuthContext.Provider>
  );
};

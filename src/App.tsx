import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import Empresa from "./empresa/Empresa";
import Menu from "./home/Menu";
import Gestion from "./gestion/Gestion";
import Periodos from "./periodos/Periodos";
import Cuentas from "./cuentas/Cuentas";
import Monedas from "./configuracion/monedas";
import Comprobantes from "./comprobantes/comprobantes";
import Reportes from "./reportes/Reportes";
import CrearComprobante from "./comprobantes/crear_comprobante";
import DetalleComprobante from "./comprobantes/detalle_comprobante";
import Categorias from "./categorias/categorias";
import Articulos from "./articulos/articulos";
import NotaCompra from "./notas/compra";
import NotaVenta from "./notas/venta";
import CrearCompra from "./notas/crear_compra";
import Integracion from "./configuracion/integracion";
import DetallesCompra from "./notas/detalles_compra";
import CrearVenta from "./notas/crear_venta";
import Detalles_venta from "./notas/detalles_venta";
import DetallesVenta from "./notas/detalles_venta";
//Check if user is logged in
export const isAuth = () => {
  const token = localStorage.getItem("token");
  const expiration = localStorage.getItem("expiration");
  if (!token || !expiration) {
    return false;
  }
  return new Date(expiration) > new Date();
};
export default function App() {
  if (!isAuth()) {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";

      return <h2>Redireccionando a Login</h2>;
    } else {
      return (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      );
    }

  }
  return (
    <>
      <Router>
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route element={<Menu />} >
            <Route path="/empresa/:id/configuracion/monedas" element={<Monedas />} />
            <Route path="/empresa/:id/configuracion/integracion" element={<Integracion />} />
            <Route path="/empresa/:id/plan_cuentas" element={<Cuentas />} />
            <Route path="/empresa/:id/nota_compra" element={<NotaCompra />} />
            <Route path="/empresa/:id/nota_compra/crear" element={<CrearCompra />} />
            <Route path="/empresa/:id/nota_compra/detalles/:id_nota_compra" element={<DetallesCompra />} />
            <Route path="/empresa/:id/nota_venta" element={<NotaVenta />} />
            <Route path="/empresa/:id/nota_venta/crear" element={<CrearVenta />} />
            <Route path="/empresa/:id/nota_venta/detalles/:id_nota_venta" element={<DetallesVenta />} />
            <Route path="/empresa/:id/reportes" element={<Reportes />} />
            <Route path="/empresa/:id/articulos" element={<Articulos />} />
            <Route path="/empresa/:id/categorias" element={<Categorias />} />
            <Route path="/empresa/:id/comprobantes" element={<Comprobantes />} />
            <Route path="/empresa/:id/comprobantes/crear" element={<CrearComprobante />} />
            <Route path="/empresa/:id/comprobantes/detalle/:id_comprobante" element={<DetalleComprobante />} />
            <Route path="/empresa/:id" element={<Empresa />} />
            <Route path="/empresa/:id/gestiones" element={<Gestion />} />
            <Route path="/empresa/:id/gestiones/:gestion_id/periodos" element={<Periodos />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
function Test() {
  return <h2>test</h2>;
}

function Logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  window.location.href = "/";
  return <h2>Logging Out</h2>;
}

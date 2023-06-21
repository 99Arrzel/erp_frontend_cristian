import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import { useEffect, useState } from "react";
import { SplitButton } from 'primereact/splitbutton';
import { baseUrl } from "../main";
export function UserProfile() {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
export function GetEmpresa({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/empresas/listar/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}


export default function Menu() {
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    console.log("xd");
    window.location.href = "/";
    return <h2>Redireccionando a Home</h2>;
  }
  const [empresa, setEmpresa] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    Promise.all([GetEmpresa({ id: parseInt(id) }), UserProfile()])
      .then((res) => {
        setEmpresa(res[0]);
        setUser(res[1]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const items = [

    {
      label: 'Contabilidad',
      /* Plan de cuentas, comprobantes y  reportes acá */
      items: [
        {

          label: 'Plan de cuentas',
          command: () => {
            navigate(`/empresa/${id}/plan_cuentas`);
          }
        },
        {
          label: 'Comprobantes',
          command: () => {
            navigate(`/empresa/${id}/comprobantes`);
          }
        },
        {
          label: 'Reportes',
          command: () => {
            navigate(`/empresa/${id}/reportes`);
          }
        }
      ]
    },
    {
      label: "Inventario",
      items: [{
        label: 'Categorias',
        command: () => {
          navigate(`/empresa/${id}/categorias`);
        }
      }, {
        label: 'Articulos',
        command: () => {
          navigate(`/empresa/${id}/articulos`);
        }
      },
      {
        label: 'Nota de compra',
        command: () => {
          navigate(`/empresa/${id}/nota_compra`);
        }
      }, {
        label: 'Nota de venta',
        command: () => {
          navigate(`/empresa/${id}/nota_venta`);
        }
      }
      ]
    },
    {
      label: 'Configuración',
      items: [{
        label: 'Monedas',
        command: () => {
          navigate(`/empresa/${id}/configuracion/monedas`);
        }
      },
      {
        label: 'Integración',
        command: () => {
          navigate(`/empresa/${id}/configuracion/integracion`);
        }
      }, {
        label: 'Gestiones',
        command: () => {
          navigate(`/empresa/${id}/gestiones`);
        }
      },]
    }

  ];
  const items2 = [
    {
      label: 'Cambiar empresa',
      command: () => {
        navigate(`/`);
      }
    },
    {
      label: 'Cerrar sesión',
      command: () => {
        localStorage.removeItem('token');
        navigate(`/logout`);
      }
    }
  ];
  return (
    <>
      <Menubar model={items}
        start={<p className="text-2xl">{empresa?.nombre}</p>}
        end={<SplitButton className="p-button-secondary" label={user?.nombre} model={items2} />}
      />
      <Outlet />
    </>
  );
}

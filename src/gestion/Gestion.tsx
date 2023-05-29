import { useNavigate, useParams } from "react-router";

import { DataTable } from 'primereact/datatable';
import { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import { baseUrl, baseUrlReports } from "../main";
import { Toast } from 'primereact/toast';
import { getId } from "../login/Login";
import { urlReporte } from "../home/Home";

export function deleteGestion({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/gestiones/eliminar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id
      })
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function cerrarGestion({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/gestiones/cerrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id
      })
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function fetchGestionPorEmpresa({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/gestiones/por_empresa/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        let error = await (res.text().then((res) => JSON.parse(res)));
        if (error.message) {
          throw new Error(error.message);
        }
        if (error.errors) {
          for (let key in error.errors) {
            console.log(error.errors[key].message);
          }
        }
        throw new Error("Error al crear la gestion");
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
export function upsertGestion({ nombre, fecha_inicio, fecha_fin, empresa_id, id }: {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  empresa_id: number;
  id: number | null;
}) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/gestiones/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre,
        fecha_inicio,
        fecha_fin,
        empresa_id,
        id
      })
    })
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        let error = await (res.text().then((res) => JSON.parse(res)));
        if (error.message) {
          throw new Error(error.message);
        }
        if (error.errors) {
          for (let key in error.errors) {
            console.log(error.errors[key].message);
          }
        }
        throw new Error("Error al crear la gestion");
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });
}



export default function () {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [gestiones, setGestiones] = useState<any>([]);
  const { id } = useParams();
  if (!id) {
    window.location.href = "/";
    return (<h2>Redireccionando a home</h2>);
  };
  useEffect(() => {
    fetchGestionPorEmpresa({ id: parseInt(id) }).then((res) => {
      setGestiones(res ?? []);
    });
  }, []);

  const [vDialogHeader, setvDialogHeader] = useState<any>("Crear Gestion");
  const [vDialogVisible, setvDialogVisible] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
      empresa_id: parseInt(id),
      id: null
    },
    onSubmit: async (values) => {
      if (!values.nombre.trim()) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "El nombre es requerido", life: 3000 });
        return;
      }
      if (!values.fecha_inicio.trim()) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "La fecha de inicio es requerida", life: 3000 });
        return;
      }
      if (!values.fecha_fin.trim()) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "La fecha de fin es requerida", life: 3000 });
        return;
      }
      if (new Date(values.fecha_inicio) > new Date(values.fecha_fin)) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "La fecha de inicio no puede ser mayor a la fecha de fin", life: 3000 });
        return;
      }
      let gestion: any = await upsertGestion(values)
        .then((res) => {
          formik.resetForm();
          setvDialogVisible(false);
          toast.current?.show({ severity: "success", summary: "Exito", detail: "Gestion guardad con exito", life: 3000 });
          fetchGestionPorEmpresa({ id: parseInt(id) }).then((res) => {
            setGestiones(res ?? []);
          });
        }).catch((err) => {
          toast.current?.show({ severity: "error", summary: "Error", detail: err.message, life: 3000 });
        });

    },
  });
  const [selectedGestion, setSelectedGestion] = useState<any>(null);
  const [vDialogCerrar, setvDialogCerrar] = useState<boolean>(false);
  const [vDialogEliminar, setvDialogEliminar] = useState<boolean>(false);
  return (
    <>
      <Toast ref={toast} />
      <Dialog onHide={() => {
        setvDialogEliminar(false);
      }} visible={vDialogEliminar} >
        <div className="flex flex-col gap-2">
          <h2>¿Estas seguro de ELIMINAR la gestion?</h2>
          <div className="flex ">
            <button className="mx-auto bg-red-500 text-white p-2 rounded" onClick={() => {
              deleteGestion({ id: selectedGestion.id }).then((res) => {
                fetchGestionPorEmpresa({ id: parseInt(id) }).then((res) => {
                  setGestiones(res ?? []);
                });
              });
              setSelectedGestion(null);
              setvDialogEliminar(false);
            }}>ELIMINAR</button>
          </div>
        </div>
      </Dialog>
      <Dialog onHide={() => {
        setvDialogCerrar(false);
      }} visible={vDialogCerrar}>
        <div className="flex flex-col gap-2">
          <h2>¿Estas seguro de cerrar la gestion?</h2>
          <div className="flex ">
            <button className="mx-auto bg-red-500 text-white p-2 rounded" onClick={() => {
              cerrarGestion({ id: selectedGestion.id }).then((res) => {
                fetchGestionPorEmpresa({ id: parseInt(id) }).then((res) => {
                  setGestiones(res ?? []);
                });
              });
              setSelectedGestion(null);
              setvDialogCerrar(false);
            }}>Si</button>
          </div>
        </div>
      </Dialog>
      <Dialog
        style={{ width: "50vw" }}
        header={vDialogHeader} visible={vDialogVisible} onHide={() => {
          setvDialogVisible(false);
        }} >
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                onChange={formik.handleChange}
                className="border-2 border-gray-300 rounded-lg p-2"
                value={formik.values.nombre}
              />
              <label htmlFor="fecha_inicio">Fecha de inicio</label>
              <input
                id="fecha_inicio"
                name="fecha_inicio"
                max={formik.values.fecha_fin}
                type="date"
                required pattern="\d{4}-\d{2}-\d{2}"
                onChange={formik.handleChange}
                className="border-2 border-gray-300 rounded-lg p-2"
                value={formik.values.fecha_inicio}
              />
              <label htmlFor="fecha_fin">Fecha de fin</label>
              <input
                id="fecha_fin"
                name="fecha_fin"
                min={formik.values.fecha_inicio}
                type="date"
                required pattern="\d{4}-\d{2}-\d{2}"
                onChange={formik.handleChange}
                className="border-2 border-gray-300 rounded-lg p-2"
                value={formik.values.fecha_fin}
              />
              <button className="bg-green-500 p-2 rounded-lg text-white" type="submit" disabled={formik.isSubmitting}>Guardar</button>
            </div>
          </form>
        </div>
      </Dialog>
      <div className="m-2">
        <p className="text-2xl text-center">Administración de gestiones</p>
        <div className="flex m-2 text-white gap-2" >
          <button className="bg-green-500 p-2 rounded-lg disabled:bg-green-800"
            onClick={() => {
              setvDialogHeader("Crear Gestion");
              setvDialogVisible(true);
              formik.resetForm();
            }}
          >
            Crear
          </button>
          <button className="bg-yellow-500 p-2 rounded-lg disabled:bg-yellow-800"
            disabled={selectedGestion && selectedGestion.estado ? false : true}
            onClick={() => {
              setvDialogHeader("Editar Gestion");
              setvDialogVisible(true);
              console.log(selectedGestion);
              formik.setValues(selectedGestion);
              /* handling of dates */
              let fecha_inicio = new Date(selectedGestion.fecha_inicio);
              let fecha_fin = new Date(selectedGestion.fecha_fin);
              formik.setFieldValue("fecha_inicio", fecha_inicio.toISOString().split("T")[0]);
              formik.setFieldValue("fecha_fin", fecha_fin.toISOString().split("T")[0]);
            }}>
            Editar
          </button>
          <button className="bg-red-500 p-2 rounded-lg disabled:bg-red-800"
            disabled={selectedGestion && selectedGestion.estado ? false : true}
            onClick={() => {
              setvDialogEliminar(true);
            }}
          >
            Eliminar
          </button>
          <button className="bg-purple-500 p-2 rounded-lg disabled:bg-purple-800" disabled={selectedGestion && selectedGestion.estado ? false : true}
            onClick={() => {
              setvDialogCerrar(true);
            }}
          >
            Cerrar
          </button>
          <button className='bg-orange-500 p-2 disabled:bg-orange-800 rounded-lg'
            onClick={
              async () => {
                const idU = await getId();
                /* Abrir nueva ventana */
                window.open(urlReporte({
                  valores: {
                    sessionDecorator: "no",
                    chrome: "false",
                    decorate: "no",
                    toolbar: "false",
                    j_username: 'jasperadmin', j_password: 'bitnami',
                    idEmpresa: id, idUsuario: idU
                  }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2Fgestion_report&standAlone=true`
                }), '_blank');
              }
            }
          >Reporte Gestiones</button>
          <button className="bg-blue-500 p-2 rounded-lg disabled:bg-blue-800 ml-auto" disabled={selectedGestion ? false : true}
            onClick={() => {
              ///empresa/:id/gestiones/:gestion_id/periodos
              navigate(`/empresa/${id}/gestiones/${selectedGestion.id}/periodos`);
            }}
          >
            Periodos
          </button>
        </div>
        <DataTable value={gestiones} selectionMode="single"
          selection={selectedGestion} onSelectionChange={e => setSelectedGestion(e.value)}
          metaKeySelection={false}
        >
          <Column field="nombre" header="Nombre" />
          <Column field="fecha_inicio" body={set_fecha_inicio} header="Fecha de inicio" />
          <Column field="fecha_fin" body={set_fecha_fin} header="Fecha de fin" />
          <Column field="estado" body={set_estado} header="Estado" />
        </DataTable>
      </div>
    </>
  );
};
export function set_estado({ estado }: { estado: boolean; }) {
  return (
    <span className={estado ? "text-green-500" : "text-red-500"}>{estado ? "Activo" : "Inactivo"}</span>
  );
}

export function set_fecha_inicio({ fecha_inicio, estado }: { fecha_inicio: string; estado: boolean; }) {
  return (
    /* To dd/mm/yyyy */

    <span className={estado ? "text-green-500" : "text-red-500"}>{new Date(fecha_inicio).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</span>
  );
}
export function set_fecha_fin({ fecha_fin, estado }: { fecha_fin: string; estado: boolean; }) {
  return (
    <span className={estado ? "text-green-500" : "text-red-500"}>{new Date(fecha_fin).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</span>
  );
}
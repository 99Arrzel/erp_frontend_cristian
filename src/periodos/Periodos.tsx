import { useFormik } from "formik";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { set_estado, set_fecha_fin, set_fecha_inicio } from "../gestion/Gestion";
import { urlReporte } from "../home/Home";
import { getId } from "../login/Login";
import { baseUrl } from "../main";
export function cerrarPeriodo(id: number) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/periodos/cerrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id }),
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
        throw new Error("Error cerrando periodo");
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
export function deletePeriod(id: number) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/periodos/eliminar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id }),
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
        throw new Error("Error eliminando periodo");
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
export function getPeriodsInGestion(gestion_id: number) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/gestiones/por_id_con_periodos/${gestion_id}`, {
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
        throw new Error("Error obteniendo periodos de la gestion");
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
export function upsertPeriodsInGestion({ id, nombre, fecha_inicio, fecha_fin, gestion_id }:
  { id: number | null, nombre: string, fecha_inicio: string, fecha_fin: string, gestion_id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/periodos/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre,
        fecha_inicio,
        fecha_fin,
        gestion_id,
        id
      }),
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
        throw new Error("Error upsert periodo");
      })
      .then((res) => {
        resolve(res);
      }
      )
      .catch((err) => reject(err));
  });
}
export default function () {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { gestion_id, id } = useParams();
  const [gestion, setGestion] = useState<any>(null);
  useEffect(() => {
    getPeriodsInGestion(Number(gestion_id)).then((res) => {
      setGestion(res);
      console.log(res);
    });
  }, [gestion_id]);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
      gestion_id: Number(gestion_id),
      id: null as number | null
    },
    onSubmit: (values) => {
      const errors: any = {};
      if (!values.nombre) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "El nombre es requerido",
          life: 3000,
        });
        return;
      }
      if (!values.fecha_inicio) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "El fecha de inicio es requerida",
          life: 3000,
        });
        return;
      }
      if (!values.fecha_fin) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "El fecha de fin es requerida",
          life: 3000,
        });
        return;
      }
      /* If fecha inicio = o menor que fecha fin */
      if (new Date(values.fecha_inicio) >= new Date(values.fecha_fin)) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "El fecha de fin debe ser mayor a la fecha de fin por lo menos 1 dia",
          life: 3000,
        });
        return;
      }
      upsertPeriodsInGestion(values).then((res) => {
        setDisplayDialog(false);
        toast.current?.show({
          severity: "success",
          summary: "Exito",
          detail: "Periodo creado exitosamente",
          life: 3000,
        });
        getPeriodsInGestion(Number(gestion_id)).then((res) => {
          setGestion(res);
          console.log(res);
        });
      }).catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: err.message ?? "Error creando periodo",
          life: 3000,
        });

      });
    }
  });
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [dialogHeader, setDialogHeader] = useState<string>("Crear periodo");
  const [eliminarDialogVisibility, setEliminarDialogVisibility] = useState<boolean>(false);
  const [cerrarDialogVisibility, setCerrarDialogVisibility] = useState<boolean>(false);
  return (
    <>
      <Toast ref={toast} />
      <Dialog onHide={() => {
        setEliminarDialogVisibility(false);
      }} visible={eliminarDialogVisibility} header="Eliminar periodo">
        <div className="flex flex-col gap-2">
          <p>¿Desea eliminar el periodo {selectedPeriod?.nombre}?</p>
          <div className="flex gap-2">
            <button className="mx-auto bg-red-500 p-2 rounded-lg text-white" onClick={() => {
              deletePeriod(selectedPeriod?.id).then((res) => {
                getPeriodsInGestion(Number(gestion_id)).then((res) => {
                  setGestion(res);
                  console.log(res);
                });
              });
              setSelectedPeriod(null);
              setEliminarDialogVisibility(false);
            }}>Eliminar</button>
          </div>
        </div>
      </Dialog>
      <Dialog onHide={() => {
        setCerrarDialogVisibility(false);
      }} visible={cerrarDialogVisibility} header="Cerrar periodo">
        <div className="flex flex-col gap-2">
          <p>¿Desea cerrar el periodo {selectedPeriod?.nombre}?</p>
          <div className="flex gap-2">
            <button className="mx-auto bg-red-500 p-2 rounded-lg text-white" onClick={() => {
              cerrarPeriodo(selectedPeriod?.id).then((res) => {
                getPeriodsInGestion(Number(gestion_id)).then((res) => {
                  setGestion(res);
                  console.log(res);
                });
              });
              setSelectedPeriod(null);
              setCerrarDialogVisibility(false);
            }}>Cerrar</button>
          </div>
        </div>
      </Dialog>
      <Dialog
        style={{ width: "50vw" }}
        header={dialogHeader}
        visible={displayDialog}
        onHide={() => {
          setDisplayDialog(false);
        }}>
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre">Nombre<a className="text-red-500">{formik.errors.nombre}</a></label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                className="border-2 border-gray-300 rounded-lg p-2"
                onChange={formik.handleChange}
                value={formik.values.nombre}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="fecha_inicio">Fecha inicio <a className="text-red-500">{formik.errors.fecha_inicio}</a></label>
              <input
                type="date"
                name="fecha_inicio"
                min={gestion && new Date(gestion.fecha_inicio).toISOString().split("T")[0]}
                max={gestion && new Date(gestion.fecha_fin).toISOString().split("T")[0]}
                id="fecha_inicio"
                required pattern="\d{4}-\d{2}-\d{2}"
                className="border-2 border-gray-300 rounded-lg p-2"
                onChange={formik.handleChange}
                value={formik.values.fecha_inicio}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="fecha_fin">Fecha fin <a className="text-red-500">{formik.errors.fecha_fin}</a></label>
              <input
                type="date"
                name="fecha_fin"
                required pattern="\d{4}-\d{2}-\d{2}"
                min={gestion && new Date(gestion.fecha_inicio).toISOString().split("T")[0]}
                max={gestion && new Date(gestion.fecha_fin).toISOString().split("T")[0]}
                id="fecha_fin"
                className="border-2 border-gray-300 rounded-lg p-2"
                onChange={formik.handleChange}
                value={formik.values.fecha_fin}
              />
            </div>
            <button type="submit" className="text-white mt-2 w-full bg-green-500 p-2 rounded-lg disabled:bg-gray-500">
              Guardar
            </button>
          </form>
        </div>
      </Dialog>
      <div className="m-2">
        <p className="text-2xl text-center">Administración de Periodo {gestion && `${gestion?.nombre ?? ""} => ${new Date(gestion?.fecha_inicio).toLocaleDateString()} - ${new Date(gestion?.fecha_fin).toLocaleDateString()}`}</p>
        <div className="flex m-2 text-white gap-2" >
          <button className="bg-green-500 p-2 rounded-lg disabled:bg-gray-500"
            onClick={() => {
              setDialogHeader("Crear periodo");
              formik.resetForm();
              setDisplayDialog(true);
            }}
            disabled={gestion?.estado ? false : true}
          >
            Crear
          </button>
          <button className="bg-yellow-500 p-2 rounded-lg disabled:bg-gray-500"
            disabled={selectedPeriod && selectedPeriod.estado ? false : true}
            onClick={() => {
              setDialogHeader("Editar periodo");
              formik.setValues({
                nombre: selectedPeriod.nombre,
                fecha_inicio: new Date(selectedPeriod.fecha_inicio).toISOString().split("T")[0],
                fecha_fin: new Date(selectedPeriod.fecha_fin).toISOString().split("T")[0],
                gestion_id: selectedPeriod.gestion_id,
                id: selectedPeriod.id
              });
              setDisplayDialog(true);
            }}
          >
            Editar
          </button>
          <button className="bg-red-500 p-2 rounded-lg disabled:bg-gray-500"
            disabled={selectedPeriod && selectedPeriod.estado ? false : true}
            onClick={() => {
              setEliminarDialogVisibility(true);
            }}
          >
            Eliminar
          </button>
          <button className="bg-purple-500 p-2 rounded-lg disabled:bg-gray-500"
            disabled={selectedPeriod && selectedPeriod.estado ? false : true}
            onClick={() => {
              setCerrarDialogVisibility(true);
            }}
          >
            Cerrar
          </button>
          <button className='bg-gray-800 p-2 disabled:bg-gray-500 rounded-lg'
            onClick={
              async () => {
                const idU = await getId();
                /* Abrir nueva ventana */
                window.open(urlReporte({ valores: { IdEmpresa: id as string, IdGestion: gestion_id as string, IdUsuario: idU }, urlBase: "http://localhost:8089/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2Fperiodo_report&standAlone=true" }), '_blank');
              }
            }
          >Reporte Periodos</button>
          <button className=" bg-blue-500 p-2 rounded-lg disabled:bg-gray-500 ml-auto"
            onClick={
              () => {
                navigate(`/empresa/${id}/gestiones`);
              }
            }
          >
            Volver a gestiones
          </button>
        </div>
        <DataTable value={gestion?.periodos} emptyMessage="Sin periodos"
          metaKeySelection={false}
          selection={selectedPeriod}
          onSelectionChange={(e) => setSelectedPeriod(e.value)}
          selectionMode="single"
        >
          <Column field="nombre" header="Nombre" />
          <Column field="fecha_inicio" body={set_fecha_inicio} header="Fecha de inicio" />
          <Column field="fecha_fin" body={set_fecha_fin} header="Fecha de fin" />
          <Column field="estado" body={set_estado} header="Estado" />
        </DataTable>
      </div>
    </>
  );
}
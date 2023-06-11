import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { Link, Router } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { useFormik } from "formik";
import { baseUrl, baseUrlReports } from '../main';
import { Toast } from 'primereact/toast';
import { getId } from '../login/Login';



export const SvgIngresar = () => {
  return <svg
    data-pr-tooltip="Ingresar"
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-door-open tooltip" viewBox="0 0 16 16">
    <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
    <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z" />
  </svg>;

};
export const SvgNuevo = ({ mensaje = "Nuevo" }: { mensaje?: string; }) => {
  return <svg
    data-pr-tooltip={mensaje}
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-node-plus-fill" viewBox="0 0 16 16">
    <path d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 1 0z" />
  </svg >;
};
export const SvgEditar = ({ mensaje = "Editar" }: { mensaje?: string; }) => {
  return <svg
    data-pr-tooltip={mensaje}
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-pen-fill" viewBox="0 0 16 16">
    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
  </svg>;
};

export const SvgEliminar = ({ mensaje = "Eliminar" }: { mensaje?: string; }) => {
  return <svg
    data-pr-tooltip={mensaje}
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-trash3-fill" viewBox="0 0 16 16">
    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
  </svg>;
};

export const SvgReporte = ({ mensaje = "Reporte" }: { mensaje?: string; }) => {
  return <svg
    data-pr-tooltip={mensaje}
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-journal-bookmark-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8V1z" />
    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
  </svg>;
};

export const SvgCerrar = ({ mensaje = "Cerrar" }: { mensaje?: string; }) => {
  return <svg
    data-pr-tooltip={mensaje}
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-x-octagon-fill" viewBox="0 0 16 16">
    <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
  </svg>;
};
export const SvgPeriodos = ({ mensaje = "Periodos" }: { mensaje?: string; }) => {
  return <svg
    data-pr-tooltip={mensaje}
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-calendar-range" viewBox="0 0 16 16">
    <path d="M9 7a1 1 0 0 1 1-1h5v2h-5a1 1 0 0 1-1-1zM1 9h4a1 1 0 0 1 0 2H1V9z" />
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
  </svg>;

};

export const SvgVolverAtras = ({ mensaje = "Volver atrás" }: { mensaje?: string; }) => {
  return <svg
    data-pr-tooltip={mensaje}
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-backspace-fill" viewBox="0 0 16 16">
    <path d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z" />
  </svg>;
};

export const SvgLotes = ({ mensaje = "Lotes" }: { mensaje?: string; }) => {
  return <svg

    data-pr-tooltip={mensaje}
    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-stack" viewBox="0 0 16 16">
    <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.598.598 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.598.598 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.598.598 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535L7.733.063z" />
    <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.598.598 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.659z" />
  </svg>;
};

export const SvgDetalles = ({ mensaje = "Detalles" }: { mensaje?: string; }) => {
  return <svg
    data-pr-tooltip={mensaje}

    xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="tooltip bi bi-eyeglasses" viewBox="0 0 16 16">
    <path d="M4 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm2.625.547a3 3 0 0 0-5.584.953H.5a.5.5 0 0 0 0 1h.541A3 3 0 0 0 7 8a1 1 0 0 1 2 0 3 3 0 0 0 5.959.5h.541a.5.5 0 0 0 0-1h-.541a3 3 0 0 0-5.584-.953A1.993 1.993 0 0 0 8 6c-.532 0-1.016.208-1.375.547zM14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
  </svg>;
};

export async function fetchMonedas() {

  let data = await fetch(`${baseUrl}/api/monedas/todas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => {
    if (res.status === 401) {
      console.log(res, "Unauthorized, redirect");
      localStorage.removeItem('token');
      window.location.href = '/logout';
    }
    return res.json();
  });
  return data;
}
export async function fetchEmpresas() {
  let data = await fetch(`${baseUrl}/api/empresas/listar`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => {
    if (res.status === 401) {
      console.log(res, "Unauthorized, redirect");
      localStorage.removeItem('token');
      window.location.href = '/logout';
    }
    return res.json();
  });
  return data;
}
/* Valores como un array de keys string y valores string */
interface Valores {
  [key: string]: string;
}
export function urlReporte({ valores, urlBase }: { valores: Valores; urlBase: string; }) {
  let params = new URLSearchParams();
  for (let key in valores) {
    params.append(key, valores[key]);
  }
  return `${urlBase}&${params.toString()}`;
}



export default function Home() {
  const toast = useRef<Toast>(null);
  /* Fetch  */
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<any>(null);
  const onEmpresaChange = (e: any) => {
    console.log(e.value);
    setSelectedEmpresa(e.value);
  };
  const [monedas, setMonedas] = useState([]);
  useEffect(() => {
    try {
      fetchEmpresas().then((data) => {
        console.log(data, "Empresas");
        setEmpresas(data);
        /* si data type es diferente de un array, error, logear denuevo */
      });
    } catch (error) {
      console.log(error, "Maybe a fix is needed");
      localStorage.removeItem('token');
      window.location.href = '/logout';
    }
    fetchMonedas().then((data) => {
      console.log(data, "Monedas");
      setMonedas(data);
    });
  }, []);
  const [displayHeader, setDisplayHeader] = useState("Crear Empresa");
  const [visDialog, setVisDialog] = useState(false);
  /* Modal formik */
  let formik = useFormik({
    initialValues: {
      id: null as number | null,
      nombre: "",
      nit: "",
      sigla: "",
      telefono: "",
      correo: "",
      direccion: "",
      niveles: 3,
      moneda_id: "" as number | string
    },
    onSubmit: async (values) => {
      console.log("valores", values);
      let errors: { [key: string]: string; } = {};
      if (values.correo.trim().length > 0 && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.correo)) {
        errors.correo = "Correo requerido";
      }
      if (values.moneda_id == "" || values.moneda_id == null) {

        errors.moneda = "Moneda requerida";
      }
      if (!values.nombre.trim()) {
        errors.nombre = "Nombre requerido";
      }
      if (!values.nit.trim()) {
        errors.nit = "NIT requerido";
      }
      if (!values.sigla.trim()) {
        errors.sigla = "Sigla requerida";
      }
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        Object.keys(errors).forEach((key) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: errors[key],
            life: 3000,
          });
        });
        return;
      }
      /* ======= */
      let createOrUpdate = await fetch(`${baseUrl}/api/empresas/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      });
      if (createOrUpdate.status === 200) {
        fetchEmpresas().then(async (data) => {
          setEmpresas(data);
          const empresa = await createOrUpdate.text().then((t) => JSON.parse(t));
          let val = data.find((e: any) => e.id === empresa.id) as any;
          console.log(val);
          setSelectedEmpresa(val);
        });
        setVisDialog(false);

      } else {
        console.log(createOrUpdate.text().then((t) => toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: JSON.parse(t).message,
          life: 3000,
        })));
      }
    }
  });
  const [visDialogDelete, setVisDialogDelete] = useState(false);
  return (
    <>
      <Toast ref={toast} />
      <Dialog header="¿Estas seguro de querer eliminar esta empresa?" visible={visDialogDelete} onHide={() => {
        setVisDialogDelete(false);
      }}>
        <div className="flex justify-end">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              const id = (selectedEmpresa as unknown as { id: number; })?.id; //TODO: Fix this, unsafe
              fetch(`${baseUrl}/api/empresas/delete`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ id: id }),
              }).then((res) => {
                if (res.status === 200) {
                  fetchEmpresas().then((data) => {
                    setEmpresas(data);
                    setSelectedEmpresa(null);
                    setVisDialogDelete(false);
                  });
                } else {
                  console.log(res.text().then((t) => console.log(JSON.parse(t).message)));
                }
              });
            }}
          >
            Eliminar
          </button>
        </div>
      </Dialog>

      <Dialog header={displayHeader} visible={visDialog} modal onHide={
        () => {
          setVisDialog(false);
          if (formik.values.id) {
            formik.resetForm();
          }
        }
      }
        style={{ width: '50vw' }}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className='grid grid-cols-2 w-full gap-2'>
            <div >
              <label htmlFor="nombre">Nombre<a className='text-red-500'>{formik.errors.nombre}</a></label>
              <input type="text" name="nombre" id="nombre" className="w-full p-2 border border-gray-300 rounded-md" onChange={formik.handleChange} value={formik.values.nombre} />
            </div>
            <div className='flex gap-2'>
              <div className='w-full'>
                <label htmlFor="niveles">Niveles</label>
                <select name="niveles" id="niveles" className="w-full p-2 border border-gray-300 rounded-md" onChange={formik.handleChange} value={formik.values.niveles}>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  < option value="6">6</option>
                  <option value="7">7</option>
                </select>
              </div>
              <div className='w-full'>
                <label htmlFor="niveles">Moneda</label>
                <select name="moneda_id" id="moneda_id"
                  disabled={(selectedEmpresa?.empresa_monedas && selectedEmpresa?.empresa_monedas.length > 1)}
                  className="w-full p-2 border border-gray-300 rounded-md" onChange={formik.handleChange} value={formik.values.moneda_id}>
                  <option value="" >Selecciona</option>
                  {monedas.map(({ id, nombre }, index) => <option key={index} value={id} >{nombre}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="nit">NIT<a className='text-red-500'>{formik.errors.nit}</a></label>
              <input type="text" name="nit" id="nit" className="w-full p-2 border border-gray-300 rounded-md" onChange={formik.handleChange} value={formik.values.nit} />
            </div>
            <div>
              <label htmlFor="sigla">Sigla<a className='text-red-500'>{formik.errors.sigla}</a></label>
              <input type="text" name="sigla" id="sigla" className="w-full p-2 border border-gray-300 rounded-md" onChange={formik.handleChange} value={formik.values.sigla} />
            </div>
            <div>
              <label htmlFor="telefono">Teléfono<a className='text-red-500'>{formik.errors.telefono}</a></label>
              <input type="text" name="telefono" id="telefono" className="w-full p-2 border border-gray-300 rounded-md" onChange={formik.handleChange} value={formik.values.telefono} />
            </div>
            <div>
              <label htmlFor="correo">Correo<a className='text-red-500'>{formik.errors.correo}</a></label>
              <input type="text" name="correo" id="correo" className="w-full p-2 border border-gray-300 rounded-md" onChange={formik.handleChange} value={formik.values.correo} />
            </div>
            <div className='col-span-2'>
              <label htmlFor="direccion">Dirección<a className='text-red-500'>{formik.errors.direccion}</a></label>
              <textarea name="direccion" id="direccion" className="w-full p-2 border border-gray-300 rounded-md" onChange={formik.handleChange} value={formik.values.direccion} />
            </div>
            <div className='col-span-2'>
              <button className='bg-green-500 w-full p-2 rounded-md text-white disabled:bg-green-800' disabled={formik.isSubmitting} type='submit'>Guardar</button>
            </div>
          </div>
        </form>
      </Dialog>
      <div className="bg-green-400 w-screen h-screen">
        <div className="flex">
          <div className="ml-auto m-2 text-xl text-white">
            <Link to={"/logout"}>Cerrar sesión</Link>
          </div>
        </div>
        {/* Selección de empresa */}
        <div className="flex flex-col items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg p-10">
            <div>
              <Dropdown value={selectedEmpresa}
                className="w-full my-2"
                emptyFilterMessage="No hay empresas"
                emptyMessage="No hay empresas"
                options={empresas} onChange={onEmpresaChange} optionLabel="nombre" filter showClear filterBy="nombre" placeholder="Selecciona una empresa"
              />
            </div>
            <div className='flex gap-1 text-white gap-2 disabled:bg-gray-500'>
              <button className='bg-blue-500 p-2 disabled:bg-blue-800' disabled={selectedEmpresa ? false : true}
                onClick={
                  () => {
                    const id = (selectedEmpresa as any).id;
                    window.location.href = `/empresa/${id}`;
                  }
                }
              >
                <SvgIngresar />
              </button>
              <button className='bg-purple-500 p-2'
                onClick={
                  () => {
                    setVisDialog(true);
                    setDisplayHeader("Crear Empresa");
                    formik.resetForm();
                  }
                }
              ><SvgNuevo />


              </button>
              <button className='bg-yellow-500 p-2 disabled:bg-yellow-800' disabled={selectedEmpresa ? false : true}
                onClick={
                  () => {
                    setVisDialog(true);
                    setDisplayHeader("Editar Empresa");
                    formik.setValues(selectedEmpresa as any);
                    formik.setFieldValue('moneda_id', (selectedEmpresa as any).empresa_monedas[0]?.moneda_principal_id);
                  }
                }
              >
                <SvgEditar />

              </button>
              <button className='bg-red-500 p-2 disabled:bg-red-800' disabled={selectedEmpresa ? false : true}
                onClick={
                  () => {
                    setVisDialogDelete(true);
                  }
                }
              >
                <SvgEliminar />
              </button>
              <button className='bg-orange-500 p-2 disabled:bg-orange-800'
                onClick={
                  async () => {
                    const id = await getId();
                    /* Abrir nueva ventana */
                    window.open(urlReporte({
                      valores: {
                        sessionDecorator: "no",
                        chrome: "false",
                        decorate: "no",
                        toolbar: "false",
                        j_username: 'jasperadmin', j_password: 'bitnami',
                        idUsuario: id
                      }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2Fempresa_report&standAlone=true`
                    }), '_blank');
                  }
                }
              >
                <SvgReporte />

              </button>
            </div>
          </div>
        </div>
      </div></>);
};
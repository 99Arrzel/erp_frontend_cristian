import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { Link, Router } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { useFormik } from "formik";
import { baseUrl, baseUrlReports } from '../main';
import { Toast } from 'primereact/toast';
import { getId } from '../login/Login';


export async function fetchMonedas() {
  let data = await fetch(`${baseUrl}/api/monedas/todas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
  return data;
}

export async function fetchEmpresas() {
  let data = await fetch(`${baseUrl}/api/empresas/listar`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
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
    fetchEmpresas().then((data) => {
      console.log(data, "Empresas");
      setEmpresas(data);
    });
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
              <button className='bg-green-400 w-full p-2 rounded-md text-white disabled:bg-gray-500' disabled={formik.isSubmitting} type='submit'>Guardar</button>
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
            <div className='grid grid-cols-5 text-white gap-2 disabled:bg-gray-500'>
              <button className='bg-blue-500 p-2 disabled:bg-gray-500' disabled={selectedEmpresa ? false : true}
                onClick={
                  () => {
                    const id = (selectedEmpresa as any).id;
                    window.location.href = `/empresa/${id}`;
                  }
                }
              >Ingresar</button>
              <button className='bg-purple-500 p-2'
                onClick={
                  () => {
                    setVisDialog(true);
                    setDisplayHeader("Crear Empresa");
                    formik.resetForm();
                  }
                }
              >Nueva Empresa</button>
              <button className='bg-yellow-500 p-2 disabled:bg-gray-500' disabled={selectedEmpresa ? false : true}
                onClick={
                  () => {
                    setVisDialog(true);
                    setDisplayHeader("Editar Empresa");
                    formik.setValues(selectedEmpresa as any);
                    formik.setFieldValue('moneda_id', (selectedEmpresa as any).empresa_monedas[0]?.moneda_principal_id);
                  }
                }
              >Editar</button>
              <button className='bg-red-500 p-2 disabled:bg-gray-500' disabled={selectedEmpresa ? false : true}
                onClick={
                  () => {
                    setVisDialogDelete(true);
                  }
                }
              >Eliminar</button>
              <button className='bg-gray-800 p-2 disabled:bg-gray-500'
                onClick={
                  async () => {
                    const id = await getId();
                    /* Abrir nueva ventana */
                    window.open(urlReporte({ valores: { idUsuario: id }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2Fempresa_report&standAlone=true` }), '_blank');
                  }
                }
              >Reporte Empresas</button>
            </div>
          </div>
        </div>
      </div></>);
}
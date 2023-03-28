import { useFormik } from 'formik';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { TreeTable } from 'primereact/treetable';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { urlReporte } from '../home/Home';
import { getId } from '../login/Login';
import { baseUrl, baseUrlReports } from '../main';
import TreeMaker from './TreeMaker';

export function deleteCuenta(id: number) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    if (!token) {
      reject('No token');
    }
    fetch(`${baseUrl}/api/cuentas/eliminar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      });
  });
}

export function fetchCuentasPorEmpresa(id: number) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    if (!token) {
      reject('No token');
    }
    fetch(`${baseUrl}/api/cuentas/listar_por_empresa/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
        throw new Error("Error cerrando periodo");
      })
      .then((res) => {
        resolve(res);
      });
  });
}

export function upsertNode({ nombre, padre_id, id, empresa_id }: { nombre: string; padre_id: number | null; id: number | null; empresa_id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    if (!token) {
      reject('No token');
    }
    fetch(`${baseUrl}/api/cuentas/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre, padre_id: padre_id == 0 ? null : padre_id, id, empresa_id }),
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
      });
  });

}


export default function () {
  const { id } = useParams();
  const [cuentas, setCuentas] = useState<any>([]);
  const [tree, setTree] = useState<any>([]);
  useEffect(() => {
    fetchCuentasPorEmpresa(Number(id)).then((res: any) => {
      console.log(res, "res");
      setCuentas(res);
      setTree([{ key: '0', data: { nombre: 'Plan de Cuentas', codigo: '-', tipo: '-', nivel: '-' }, children: TreeMaker(res) }] as any[]);
      console.log("treemaker", TreeMaker(res));
    });
  }, []);
  const [selectedKeys, setselectedKeys] = useState<any>(null);
  const [selectedNode, setselectedNode] = useState<any>(null);
  const [vDialogVisible, setvDialogVisible] = useState<boolean>(false);
  const [vDialogHeader, setvDialogHeader] = useState<string>('Crear cuenta');
  const formik = useFormik({
    initialValues: {
      nombre: '',
      padre_id: null as number | null,
      id: null as number | null,
      empresa_id: Number(id),
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.nombre) {
        errors.nombre = 'Requerido';
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
      upsertNode({ nombre: values.nombre, padre_id: values.padre_id, id: values.id, empresa_id: values.empresa_id }).then((res: any) => {
        console.log(res);
        fetchCuentasPorEmpresa(Number(id)).then((res: any) => {
          setCuentas(res);
          setTree([{ key: '0', data: { nombre: 'Plan de Cuentas', codigo: '-', tipo: '-', nivel: '-' }, children: TreeMaker(res) }] as any[]);
        });
      });
      setvDialogVisible(false);
      formik.resetForm();
    },
  });
  const [expandedKeys, setExpandedKeys] = useState<any>({ 0: true });
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);

  return (
    <>
      <Dialog
        visible={deleteDialogVisible}
        header="Eliminar cuenta"
        onHide={() => {
          setDeleteDialogVisible(false);
        }}
      >
        <div className='text-center'>
          <p>¿Está seguro que desea eliminar la cuenta {selectedNode?.data?.nombre}?</p>
          <button className='bg-red-500 p-2 rounded-lg text-white' onClick={() => {
            deleteCuenta(selectedNode?.data?.id).then((res: any) => {
              console.log(res);
              fetchCuentasPorEmpresa(Number(id)).then((res: any) => {
                setCuentas(res);
                setTree([{ key: '0', data: { nombre: 'Plan de Cuentas', codigo: '-', tipo: '-', nivel: '-' }, children: TreeMaker(res) }] as any[]);

              });
            });
            setDeleteDialogVisible(false);
            formik.resetForm();
            setselectedNode(null);
          }}>Eliminar</button>
        </div>

      </Dialog>
      <Dialog
        visible={vDialogVisible}
        header={vDialogHeader} onHide={() => {
          setvDialogVisible(false);
        }}>
        {/* Input de nombre y nada más */}
        <div>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="nombre">Nombre <a className='text-red-500'>{formik.errors.nombre}</a></label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              className="w-full p-2 rounded-lg border border-gray-300"
              onChange={formik.handleChange}
              value={formik.values.nombre}
            />
            <button type="submit" className="w-full bg-green-500 p-2 mt-2 rounded-lg text-white">Guardar</button>
          </form>
        </div>
      </Dialog>
      <h1 className='text-2xl text-center'>Plan de cuentas</h1>
      <div className='m-2'>
        <div className='flex gap-2 m-2'>
          <button className="bg-green-500 p-2 rounded-lg text-white"
            onClick={() => {
              setvDialogVisible(true);
              setvDialogHeader(`Crear cuenta en ${selectedNode?.data?.id && selectedNode?.data?.nombre ? selectedNode.data.nombre : ' Raíz'}`);
              formik.setValues({ ...formik.values, nombre: '', padre_id: selectedNode?.data?.id ? selectedNode.data.id : null, id: null, empresa_id: Number(id) });
            }}
          >
            Crear
          </button>
          <button className="bg-yellow-500 p-2 rounded-lg text-white disabled:bg-gray-500"
            disabled={selectedNode && selectedNode.data.id ? false : true}
            onClick={() => {
              setvDialogVisible(true);
              setvDialogHeader(`Editar cuenta ${selectedNode?.data?.nombre}`);
              formik.setValues({ ...formik.values, nombre: selectedNode?.data?.nombre, padre_id: selectedNode?.data?.padre_id, id: selectedNode?.data?.id, empresa_id: selectedNode?.data?.empresa_id });
            }}
          >
            Editar
          </button>
          <button className="bg-red-500 p-2 rounded-lg text-white disabled:bg-gray-500"
            disabled={selectedNode && selectedNode.data.id ? false : true}
            onClick={() => {
              setDeleteDialogVisible(true);
            }}

          >
            Eliminar
          </button>
          <button className='bg-gray-800 p-2 disabled:bg-gray-500 rounded-lg text-white'
            onClick={
              async () => {
                const idU = await getId();
                /* Abrir nueva ventana */
                window.open(urlReporte({ valores: { idEmpresa: id as string, idUsuario: idU }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2Fcuenta_report&standAlone=true` }), '_blank');
              }
            }
          >Reporte Cuentas</button>

        </div>
        <TreeTable value={tree} emptyMessage="Sin cuentas"


          selectionMode="single"
          selectionKeys={selectedKeys}
          onSelectionChange={(e) => {
            console.log(e);
            setselectedKeys(e.value);
            console.log(selectedKeys);
          }}
          onSelect={(e) => {
            console.log(e.node, "data de nodo");
            setselectedNode(e.node);
          }}
          onUnselect={(e) => {
            setselectedNode(null);
          }}
          metaKeySelection={false}
          title='Plan de cuentas'
          expandedKeys={expandedKeys}
          onToggle={e => { console.log(e), setExpandedKeys(e.value); }}

        >

          <Column expander field="nombre" header="Nombre"
            body={codigo_nombre} />
        </TreeTable>
      </div>
    </>
  );
}

function codigo_nombre(data: any) {
  return (
    <>
      {data.data.codigo != '-' && <span className='text-blue-400'>{data.data.codigo}</span>}
      <span className='text-black'>{" - " + data.data.nombre}</span>
    </>
  );
}
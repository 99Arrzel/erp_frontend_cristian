import { useEffect, useRef, useState } from "react";
import { baseUrl } from "../main";
import { useParams } from "react-router";
import { useFormik } from "formik";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';
import { GetCategorias } from "../categorias/categorias";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { SvgEditar, SvgEliminar, SvgLotes, SvgNuevo } from "../home/Home";
export function GetArticulos({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/articulos/listar`, {
      method: "POST",
      body: JSON.stringify({ id: id }),
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


export default function () {
  const { id } = useParams();
  const [articulos, setArticulos] = useState<any[]>([]);
  const [articuloLotes, setArticuloLotes] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  useEffect(() => {
    if (id) {
      GetArticulos({ id: Number(id) }).then((data: any) => {
        console.log(data);
        setArticulos(data);
      });
      GetCategorias({ id: Number(id) }).then((data: any) => {
        console.log(data);
        setCategorias(data);
      }
      );
    }
  }, []);
  //Formik para crear articulos, nombre, empresa_id, descripción, precio_venta y un array de categorias
  const formik = useFormik({
    initialValues: {
      id: null,
      nombre: "",
      descripcion: "",
      precio_venta: 0,
      empresa_id: id,
      categorias: [] as any[],
    },
    onSubmit: (values) => {

      /* Validar */
      values.categorias = values.categorias.map((categoria: any) => categoria.id);
      if (values.categorias.length == 0) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar al menos una categoria", life: 3000 });
        return;
      }
      if (values.precio_venta <= 0) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "El precio de venta debe ser mayor a 0", life: 3000 });
        return;
      }
      if (values.nombre == "") {
        toast.current?.show({ severity: "error", summary: "Error", detail: "El nombre no puede estar vacío", life: 3000 });
        return;
      }
      if (values.descripcion == "") {
        toast.current?.show({ severity: "error", summary: "Error", detail: "La descripción no puede estar vacía", life: 3000 });
        return;
      }
      console.log(values);
      fetch(`${baseUrl}/api/articulos/${values.id ? 'actualizar' : 'crear'}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((res) => {
          GetArticulos({ id: Number(id) }).then((data: any) => {
            console.log(data);
            setArticulos(data);
          });

          setDialogArticulo(false);

          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Articulo creado",
            life: 3000,
          });

          formik.resetForm();
        }).catch((err) => {
          err.text().then((errorMessage: any) => {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: (JSON.parse(errorMessage).message as string ?? "Error"),
              life: 3000,
            });
          });
        });
    },
  });
  const toast = useRef<Toast>(null);
  const [selected, setSelected] = useState<any>(null);




  function eliminar_articulo(articulo: any) {
    fetch(`${baseUrl}/api/articulos/eliminar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }, body: JSON.stringify({ id: articulo.id, empresa_id: id })
    }).then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    }).then((res) => {
      console.log(res);
      setArticulos(articulos.filter((art: any) => art.id != articulo.id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Articulo eliminado",
        life: 3000,
      });
    }).catch((err) => {
      err.text().then((errorMessage: any) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: (JSON.parse(errorMessage).message as string ?? "Error"),
          life: 3000,
        });
      });
    });
  };



  const [dialogArticulo, setDialogArticulo] = useState<boolean>(false);
  return (
    <>
      <Dialog header="Lotes" visible={articuloLotes != null} style={{ width: '80vw' }} onHide={() => setArticuloLotes(null)}>
        {selected != null ? lotes_render(selected) : null}
      </Dialog>

      <Dialog header="Articulos" visible={dialogArticulo} style={{ width: '80vw' }} onHide={() => setDialogArticulo(false)}>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <label htmlFor="nombre">Nombre</label>
              <InputText type="text"

                value={formik.values.nombre}
                name="nombre" id="nombre" onChange={formik.handleChange} />
              < label htmlFor="descripcion">Descripción</label>
              <InputText
                value={formik.values.descripcion}
                type="text" name="descripcion" id="descripcion" onChange={formik.handleChange} />
              <label htmlFor="precio_venta">Precio de venta</label>
              <InputNumber
                value={formik.values.precio_venta ?? 0}
                name="precio_venta" id="precio_venta" onChange={
                  (e) => {
                    formik.setFieldValue("precio_venta", e.value);
                  }
                } />
              <label htmlFor="categorias">Categorias</label>
              <MultiSelect value={formik.values.categorias}
                optionLabel="nombre"
                options={categorias}
                name="categorias" id="categorias"
                onChange={(e) => {
                  formik.setFieldValue("categorias", e.value);
                }}
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className={`bg-${formik.values.id ? 'yellow' : 'green'}-500 p-2 text-white rounded-lg`}>{formik.values.id ? <SvgEditar mensaje="Editar articulo" /> : <SvgNuevo mensaje="Crear articulo" />}</button>
            </div>
          </div>
        </form>
      </Dialog>
      <Toast ref={toast} />
      <div className="m-10">
        <div>
          <h1 className="text-2xl text-center font-bold">Articulos</h1>
          <div className="flex gap-2">
            <button
              className="bg-green-500 rounded-lg text-white p-2 disabled:bg-green-800"

              onClick={() => {
                formik.resetForm();
                setDialogArticulo(true);
              }}
            >
              <SvgNuevo />
            </button>

            <button
              className="bg-yellow-500 rounded-lg text-white p-2 disabled:bg-yellow-800"
              disabled={selected == null}
              onClick={() => {

                formik.setValues({
                  id: selected.id,
                  nombre: selected?.nombre,
                  descripcion: selected.descripcion,
                  precio_venta: selected.precio_venta,
                  empresa_id: id,
                  categorias: selected.categorias,
                });
                setDialogArticulo(true);
              }}
            >
              <SvgEditar />
            </button>
            <button
              className="bg-red-500 rounded-lg text-white p-2 disabled:bg-red-800"
              disabled={selected == null}
              onClick={() => {
                eliminar_articulo(selected);
              }}
            >
              <SvgEliminar />
            </button>
            <button
              className="bg-purple-500 rounded-lg text-white p-2 disabled:bg-purple-800"
              disabled={selected == null}
              onClick={() => {
                setArticuloLotes(selected);
              }}
            >
              <SvgLotes />
            </button>
          </div>
        </div>
        <DataTable value={articulos} emptyMessage="Vacio"
          selection={selected}
          onSelectionChange={(e) => {
            setSelected(e.value);
            console.log(e.value);

          }}
          //Deselect
          metaKeySelection={false}
          selectionMode="single"
          dataKey="id"
        >
          <Column field="nombre" header="Nombre"></Column>
          <Column field="descripcion" header="Descripción"></Column>
          <Column field="precio_venta" header="Precio de venta"></Column>
          <Column field="stock"

            body={(e: any) => {
              return e.lotes.reduce((a: any, b: any) => a + b.stock, 0);
            }}
            header="Stock"></Column>
          <Column body={categorias_articulo} header="Categorias"></Column>

        </DataTable>
      </div>
    </>
  );
}

export function lotes_render(articulo: any) {
  return <>
    <DataTable value={articulo.lotes} emptyMessage="Vacio">
      <Column field="nro_lote" header="Lote"></Column>
      <Column field="fecha_ingreso"
        body={(e: any) => {
          return new Date(e.fecha_ingreso).toLocaleDateString('es-ES', { timeZone: 'UTC' });
        }}
        header="Fecha Ingreso"></Column>
      <Column field="fecha_vencimiento"
        body={(e: any) => {
          if (e.fecha_vencimiento == null) {
            return "No vence";
          }
          return new Date(e.fecha_vencimiento).toLocaleDateString('es-ES', { timeZone: 'UTC' });
        }}
        header="Fecha Vencimiento"></Column>
      <Column field="cantidad" header="Cantidad"></Column>
      <Column field="stock" header="Stock"></Column>
      <Column field="estado"
        body={(e: any) => {
          if (e.estado == "activo") {
            return <div className="bg-green-500 p-1 rounded-lg text-white w-fit">
              {e.estado}
            </div>;
          }
          return <div className="bg-red-500 p-1 rounded-lg text-white w-fit">
            {e.estado}
          </div>;
        }}
        header="Estado"></Column>
    </DataTable>
  </>;
}


export function categorias_articulo(articulo: any) {
  return <>
    <div className="flex flex-wrap gap-1">
      {articulo?.categorias?.map((art: any) => {
        return <div key={art.id} className="bg-gray-500 text-xs  text-white p-1 rounded-lg">{art.nombre}</div>;
      })
      }
    </div>
  </>;
}
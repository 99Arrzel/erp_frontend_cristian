import { useFormik } from "formik";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { GetArticulos } from "../articulos/articulos";
import { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { baseUrl } from "../main";
import { useParams } from "react-router";

type Lotes = {
  articulo_id: number,
  cantidad: number,
  precio: number,
  fecha_vencimiento: string | null,
};

type NotaCompra = {
  fecha: Date,
  descripcion: string,
  lotes: Lotes[],
  empresa_id: number,
};
export function GetUltimoNumero({ id, tipo }: { id: number, tipo: 'compra' | 'venta'; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/notas/ultimo_numero`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, tipo })
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}


export default function CrearCompra() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const { id } = useParams();
  let todosArticulos = [];
  useEffect(() => {
    GetArticulos({ id: Number(id) }).then((data: any) => {
      console.log(data);
      setArticulos(data);
      todosArticulos = data;
    });
    GetUltimoNumero({ id: Number(id), tipo: 'compra' }).then((data: any) => {
      console.log(data, "Ultimo numero");
      formik.setFieldValue("num_nota", data.ultimo);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      num_nota: null,
      fecha: new Date().toISOString().split("T")[0],
      descripcion: "",
      productos: [] as any[]
    },
    onSubmit: (values) => {
      /* Validar al menos un producto */
      if (values.productos.length == 0) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe agregar al menos un articulo", life: 3000 });
        return;
      }
      /* Descripcion */
      if (values.descripcion.trim() == "") {
        toast.current?.show({ severity: "error", summary: "Error", detail: "La descripción no puede estar vacía", life: 3000 });
        return;
      }
      /* Fecha */
      if (values.fecha == null || values.fecha == "") {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una fecha", life: 3000 });
        return;
      }
      console.log(values);
      const lotes = values.productos.map((producto) => {
        return {
          articulo_id: producto.articulo.id,
          fecha_vencimiento: producto.fecha_vencimiento,
          cantidad: producto.cantidad,
          precio: producto.precio,
        };
      });
      console.log(lotes);
      fetch(`${baseUrl}/api/notas/crear_compra`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          fecha: new Date(values.fecha),
          descripcion: values.descripcion,
          lotes,
          empresa_id: Number(id),
        } as NotaCompra),
      }).then((res) => {
        if (res.ok) {
          toast.current?.show({ severity: "success", summary: "Exito", detail: "Nota de compra creada correctamente", life: 3000 });
          formik.resetForm();
        } else {
          throw res;
        }
      }).catch((err) => {
        err.json().then((data: any) => {
          toast.current?.show({ severity: "error", summary: "Error", detail: data.message, life: 3000 });
        });
      });

    },
  });
  const acciones = (data: any) => {
    /* Boton de eliminar con data.articulo.id */
    return (
      <>
        <button
          className="bg-red-500 p-2 rounded-lg text-white"

          onClick={() => {
            setArticulos([...articulos, data.articulo]);
            formik.setFieldValue("productos", formik.values.productos.filter((producto) => producto.articulo.id != data.articulo.id));
          }}
        >Eliminar</button>

        {/* Eeditar */}
        <button
          className="bg-purple-500 p-2 rounded-lg text-white ml-2"
          onClick={() => {
            formikDetalles.setFieldValue("articulo", data.articulo);
            formikDetalles.setFieldValue("fecha_vencimiento", data.fecha_vencimiento);
            formikDetalles.setFieldValue("cantidad", data.cantidad);
            formikDetalles.setFieldValue("precio", data.precio);
            formikDetalles.setFieldValue("subtotal", data.subtotal);
            setArticulos([...articulos, data.articulo]);
            setIsEditing(true);
          }}
        >Editar</button>
      </>
    );
  };
  const [isEditing, setIsEditing] = useState(false);
  const formikDetalles = useFormik({
    initialValues: {
      internal_id: Math.random(),
      articulo: null as any,
      fecha_vencimiento: new Date().toISOString().split("T")[0],
      cantidad: 0,
      precio: 0,
      subtotal: 0,
    },
    onSubmit: (values) => {
      //validar que articulo no sea null
      if (values.articulo == null) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar un articulo", life: 3000 });
        return;
      }
      if (values.fecha_vencimiento == null || values.fecha_vencimiento == "") {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una fecha de vencimiento", life: 3000 });
        return;
      }
      if (values.cantidad <= 0) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "La cantidad debe ser mayor a 0", life: 3000 });
        return;
      }
      if (values.precio <= 0) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "El precio debe ser mayor a 0", life: 3000 });
        return;
      }


      if (isEditing) {
        //buscamos el articulo en articulos y lo reemplazamos, lo buscamos por su internal_id
        formik.setFieldValue("productos", formik.values.productos.map((producto) => {
          if (producto.internal_id == values.internal_id) {
            return values;
          }
          return producto;
        }));


        //borramos el articulo de articulos
        setArticulos(articulos.filter((articulo) => articulo.id != values.articulo?.id));
        setIsEditing(false);
      } else {
        formik.setFieldValue("productos", [...formik.values.productos, values]);
        //borramos el articulo de articulos
        setArticulos(articulos.filter((articulo) => articulo.id != values.articulo?.id));

      }
      formikDetalles.resetForm();



    },
  });

  const toast = useRef<Toast>(null);
  return (
    <>
      <Toast ref={toast} />
      <div className="m-5">
        <p className="text-2xl text-center">Crear nota de compra</p>
        <form className="flex gap-2" onSubmit={formik.handleSubmit}>
          <div>
            <p>Nro:</p>
            <InputNumber value={formik.values.num_nota} readOnly />
          </div>
          <div>
            <p>Fecha:</p>
            <input type="date" value={formik.values.fecha} name="fecha" className="border-2 border-gray-200 p-2.5 rounded-lg" onChange={formik.handleChange} />
          </div>
          <div>
            <p>Descripcion</p>
            <InputText value={formik.values.descripcion}
              name="descripcion"
              onChange={formik.handleChange} />
          </div>
          <div>
            <button
              className="bg-green-500 p-2 text-white rounded-lg mt-6"
              type="submit"
            >Crear Nota de Compra</button>
          </div>
        </form>
        <div className="bg-gray-100 p-2 mt-1">
          <p className="text-center font-bold">Productos</p>
          <form className="flex gap-2 flex-wrap" onSubmit={formikDetalles.handleSubmit}>
            <div>
              <p>Articulo</p>
              <Dropdown
                value={formikDetalles.values.articulo}
                options={articulos} name="articulo" onChange={formikDetalles.handleChange} optionLabel="nombre" />
            </div>
            <div>
              <p>Fecha Vencimiento</p>
              <input
                value={formikDetalles.values.fecha_vencimiento}
                type="date" className="border-2 border-gray-200 p-2.5 rounded-lg" onChange={formikDetalles.handleChange} name="fecha_vencimiento" />
            </div>
            <div>
              <p>Cantidad</p>
              <InputNumber value={formikDetalles.values.cantidad} onValueChange={(e) => {
                formikDetalles.setFieldValue("cantidad", e.value);
                formikDetalles.setFieldValue("subtotal", (e.value ?? 0) * formikDetalles.values.cantidad);
              }} />
            </div>
            <div>
              <p>Precio</p>
              <InputNumber value={formikDetalles.values.precio} onValueChange={(e) => {
                formikDetalles.setFieldValue("precio", e.value);
                formikDetalles.setFieldValue("subtotal", (e.value ?? 0) * formikDetalles.values.cantidad);
              }} />
            </div>
            <div>
              <p>Subtotal</p>
              <InputNumber value={formikDetalles.values.subtotal} readOnly />
            </div>
            <div>
              <button className={`mt-6 bg-${isEditing ? 'yellow' : 'green'}-500 p-2 rounded-lg text-white`}
                type="submit"

              >{isEditing ? 'Editar' : 'Agregar'}</button>
            </div>
          </form>
          <DataTable value={formik.values.productos} emptyMessage="Agrega un detalle">
            <Column field="articulo.nombre" header="Articulo"></Column>
            <Column field="fecha_vencimiento" header="Fecha Vencimiento"
              body={(e: any) => {
                return <p>{new Date(e.fecha_vencimiento).toLocaleDateString(
                  "es-BO",
                  {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  }
                )}</p>;
              }}
            ></Column>
            <Column field="cantidad" header="Cantidad"></Column>
            <Column field="precio" header="Precio"></Column>
            <Column field="subtotal" header="Subtotal"></Column>
            <Column body={acciones} header="Acciones"></Column>
          </DataTable>
        </div>
      </div >
    </>
  );
};;
import { useEffect, useRef, useState } from "react";
import { GetArticulosConLote } from "./venta";
import { Toast } from "primereact/toast";
import { useParams } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useFormik } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { GetUltimoNumero } from "./crear_compra";
import { baseUrl } from "../main";



export default function CrearVenta() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [ultimoNumero, setUltimoNumero] = useState(0);
  const { id } = useParams();
  useEffect(() => {
    GetArticulosConLote({ id: Number(id) }).then((data: any) => {
      console.log(data);
      setArticulos(data);
    });
    GetUltimoNumero({ id: Number(id), tipo: 'venta' }).then((data: any) => {
      setUltimoNumero(data.ultimo);
    }
    );

  }, []);
  const formik = useFormik({
    initialValues: {
      num_nota: null,
      fecha: (new Date()).toISOString().split("T")[0],
      descripcion: "",
      productos: []
    },
    onSubmit: (values) => {
      if (values.productos.length == 0) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Agregue al menos un producto' });
        return;
      }
      if (values.fecha == "") {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Seleccione una fecha' });
        return;
      }
      if (values.descripcion.trim() == "") {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Ingrese una descripción' });
        return;
      }

      fetch(`${baseUrl}/api/notas/crear_venta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          empresa_id: id, fecha: values.fecha, descripcion: values.descripcion, lotes: values.productos.map(
            (producto: any) => {
              return {
                lote_id: producto.lote.id,
                cantidad: producto.cantidad,
                precio: producto.precio
              };
            }
          )
        })
      })
        .then((res) => {
          if (res.ok) {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Nota de venta creada' });
            formik.resetForm();
            return res.json();
          }
          else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al crear nota de venta' });
            throw res;
          }
        })
        .catch((err) => {
          //await res
          err.json().then((data: any) => {

            toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message });
          }
          );
        });



      console.log(values);

    }

  });
  const formikDetalles = useFormik({
    initialValues: {
      internal_id: Math.random(),
      articulo: null as any,
      lote: null as any,
      cantidad: 0,
      precio: 0,
      subtotal: 0
    },
    onSubmit: (values) => {
      values.subtotal = values.cantidad * values.precio;

      if (!values.articulo) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Seleccione un articulo' });
        return;
      }
      if (!values.lote) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Seleccione un lote' });
        return;
      }
      if (values.cantidad <= 0) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'La cantidad debe ser mayor a 0' });
        return;
      }
      if (values.precio <= 0) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'El precio debe ser mayor a 0' });
        return;
      }
      if (values.cantidad > values.lote.stock) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'La cantidad no puede ser mayor al stock' });
        return;
      }



      if (isEditing) {
        formik.setFieldValue("productos", formik.values.productos.map((producto: any) => {
          if (producto.internal_id == values.internal_id) {
            console.log(values, "new vals");
            return values;
          }
          return producto;
        }));
        setIsEditing(false);
      }
      else {
        values.internal_id = Math.random();
        formik.setFieldValue("productos", [...formik.values.productos, values]);
      }

      formikDetalles.resetForm();
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const acciones = (data: any) => {
    /* Boton de eliminar con data.articulo.id */
    return (
      <>
        <button
          className="bg-red-500 p-2 rounded-lg text-white"

          onClick={() => {
            formik.setFieldValue("productos", formik.values.productos.filter((producto: any) => producto.internal_id != data.internal_id));

          }}
        >Eliminar</button>

        {/* Eeditar */}
        <button
          className="bg-purple-500 p-2 rounded-lg text-white ml-2"
          onClick={() => {
            formikDetalles.setFieldValue("articulo", data.articulo);
            formikDetalles.setFieldValue("lote", data.lote);
            formikDetalles.setFieldValue("cantidad", data.cantidad);
            formikDetalles.setFieldValue("precio", data.precio);
            formikDetalles.setFieldValue("subtotal", data.subtotal);
            formikDetalles.setFieldValue("internal_id", data.internal_id);
            setIsEditing(true);



          }}
        >Editar</button>
      </>
    );
  };
  const articulos_filtrados = () => {


    if (isEditing) {
      return [...articulos.filter((articulo) => {
        //si tiene lotes que no esten en productos
        return articulo.lotes?.some((lote: any) => {
          return !formik.values.productos.some((producto: any) => {
            return producto.lote.id == lote.id;
          });
        });
      }), formikDetalles.values.articulo];
    }

    return articulos.filter((articulo) => {
      //si tiene lotes que no esten en productos
      return articulo.lotes?.some((lote: any) => {
        return !formik.values.productos.some((producto: any) => {
          return producto.lote.id == lote.id;
        });
      });
    });
  };
  const lotes_filtrados = () => {
    if (isEditing) {
      return [...formikDetalles.values.articulo?.lotes.filter((lote: any) => {
        return !formik.values.productos.some((producto: any) => {
          return producto.lote.id == lote.id;
        });
      }), formikDetalles.values.lote];
    }
    return formikDetalles.values.articulo?.lotes.filter((lote: any) => {
      return !formik.values.productos.some((producto: any) => {
        return producto.lote.id == lote.id;
      });
    });
  };

  const toast = useRef<Toast>(null);
  return (
    <>
      <Toast ref={toast} />
      <div className="m-5">
        <p className="text-2xl text-center">Crear nota de venta</p>
        <form className="flex gap-2" onSubmit={formik.handleSubmit}>
          <div>
            <p>Nro:</p>
            <InputNumber value={ultimoNumero} readOnly />
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
            >Crear Nota de Venta</button>
          </div>
        </form>
        <div className="bg-gray-100 p-2 mt-1">
          <p className="text-center font-bold">Productos</p>
          <form className="flex gap-2 flex-wrap" onSubmit={formikDetalles.handleSubmit}>
            <div>
              <p>Articulo</p>
              <Dropdown
                value={formikDetalles.values.articulo}
                showClear
                options={articulos_filtrados()} name="articulo" onChange={
                  (e) => {
                    formikDetalles.setFieldValue("articulo", e.value);
                    formikDetalles.setFieldValue("lote", null);
                    if (e.value.lotes?.length == 1) {
                      formikDetalles.setFieldValue("lote", e.value.lotes[0]);
                      formikDetalles.setFieldValue("precio", e.value.lotes[0].precio_compra);
                    }

                  }} optionLabel="nombre" />
            </div>
            <div>
              <p>Lote</p>
              <Dropdown
                emptyMessage="Seleccione un articulo"
                itemTemplate={(option: any) => {
                  return (
                    <div className="flex gap-1">
                      <p>Lote:{option?.nro_lote} - Stock:{option?.stock}</p>
                      <p>- Vence: {(new Date(option?.fecha_vencimiento)).toLocaleDateString('es-ES')}</p>
                      <p>- Precio: {option?.precio_compra}</p>
                    </div>
                  );
                }}
                valueTemplate={(option: any) => {
                  return (
                    <div className="flex gap-1 ">
                      <p>Lote:{option?.nro_lote} - Stock:{option?.stock}</p>
                      <p>- Vence: {(new Date(option?.fecha_vencimiento)).toLocaleDateString('es-ES')}</p>
                      <p>- Precio: {option?.precio_compra}</p>
                    </div>
                  );
                }}
                disabled={!formikDetalles.values.articulo}
                value={formikDetalles.values.lote}
                className="w-80"
                options={lotes_filtrados()} name="lote" onChange={
                  (e) => {
                    formikDetalles.setFieldValue("lote", e.value);
                    formikDetalles.setFieldValue("precio", e.value?.precio_compra);
                  }
                } optionLabel="nro_lote" />
            </div>

            <div>
              <p>Cantidad</p>
              <InputNumber
                disabled={!formikDetalles.values.lote}
                max={formikDetalles.values.lote?.stock ?? 1}
                min={1}
                value={formikDetalles.values.cantidad} onValueChange={(e) => {
                  formikDetalles.setFieldValue("cantidad", e.value);
                  formikDetalles.setFieldValue("subtotal", (e.value ?? 0) * formikDetalles.values.precio);
                }} />
            </div>
            <div>
              <p>Precio</p>
              <InputNumber
                readOnly
                value={formikDetalles.values.precio} onValueChange={(e) => {
                  formikDetalles.setFieldValue("precio", e.value);
                  formikDetalles.setFieldValue("subtotal", (e.value ?? 0) * formikDetalles.values.cantidad);
                }} />
            </div>
            <div>
              <p>Subtotal</p>
              <InputNumber value={formikDetalles.values.precio * formikDetalles.values.cantidad} readOnly />
            </div>
            <div>
              <button className={`mt-6 bg-${isEditing ? 'yellow' : 'green'}-500 p-2 rounded-lg text-white`}
                type="submit"

              >{isEditing ? 'Editar' : 'Agregar'}</button>
            </div>
          </form>
          <DataTable value={formik.values.productos} emptyMessage="Agrega un detalle">
            <Column field="articulo.nombre" header="Articulo"></Column>
            <Column field="lote.nro_lote" header="Lote"></Column>
            <Column field="cantidad" header="Cantidad"></Column>
            <Column field="precio" header="Precio"></Column>
            <Column field="subtotal" header="Subtotal"></Column>
            <Column body={acciones} header="Acciones"></Column>
          </DataTable>
        </div>
      </div >
    </>
  );
}
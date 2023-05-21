import { useFormik } from "formik";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { GetArticulos } from "../articulos/articulos";
import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";



export default function DetallesCompra() {
  const [articulos, setArticulos] = useState<any[]>([]);

  useEffect(() => {
    GetArticulos({ id: 1 }).then((data: any) => {
      console.log(data);
      setArticulos(data);
    });
  }, []);


  const eliminar = (data: any) => {
    console.log(data);
  };
  const formik = useFormik({
    initialValues: {
      num_nota: null,
      fecha: new Date(),
      descripcion: "",
      productos: [] as any[]
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const formikDetalles = useFormik({
    initialValues: {
      articulo: null,
      fecha_vencimiento: null,
      cantidad: 0,
      precio: 0,
      subtotal: 0,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <>
      <div className="m-5">
        <p className="text-2xl text-center">Crear nota de compra</p>
        <div className="flex gap-2">
          <div>
            <p>Nro:</p>
            <InputText value="1" readOnly />
          </div>
          <div>
            <p>Fecha:</p>
            <input type="date" className="border-2 border-gray-200 p-2.5 rounded-lg  " />
          </div>
          <div>
            <p>Descripcion</p>
            <InputText value="Compra de productos" readOnly />
          </div>
        </div>
        <div className="bg-gray-100 p-2 mt-1">
          <p className="text-center font-bold">Productos</p>
          <div className="flex gap-2">
            <div>
              <p>Articulo</p>
              <Dropdown options={articulos} name="articulo" onChange={formikDetalles.handleChange} optionLabel="nombre" />
            </div>
            <div>
              <p>Fecha Vencimiento</p>
              <input type="date" className="border-2 border-gray-200 p-2.5 rounded-lg" onChange={formikDetalles.handleChange} name="fecha_vencimiento" />
            </div>
            <div>
              <p>Cantidad</p>
              <InputNumber value={formikDetalles.values.cantidad} onValueChange={(e) => {
                formikDetalles.setFieldValue("cantidad", e.value);
              }} />
            </div>
            <div>
              <p>Precio</p>
              <InputNumber value={formikDetalles.values.precio} onValueChange={(e) => {
                formikDetalles.setFieldValue("precio", e.value);
              }} />
            </div>
            <div>
              <p>Subtotal</p>
              <InputNumber value={formikDetalles.values.precio * formikDetalles.values.cantidad} readOnly />
            </div>
            <div>
              <button className="mt-6 bg-green-500 p-2 rounded-lg text-white">Agregar</button>
            </div>
          </div>
          <DataTable value={[]} emptyMessage="Agrega un detalle">
            <Column field="articulo" header="Articulo"></Column>
            <Column field="fecha_vencimiento" header="Fecha Vencimiento"></Column>
            <Column field="cantidad" header="Cantidad"></Column>
            <Column field="precio" header="Precio"></Column>
            <Column field="subtotal" header="Subtotal"></Column>
            <Column header="Acciones"></Column>
          </DataTable>
        </div>
      </div>
    </>
  );
};;
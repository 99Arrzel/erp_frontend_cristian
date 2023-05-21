import { useFormik } from "formik";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useNavigate, useParams } from "react-router";

export default function NotaCompra() {

  const eliminar = (data: any) => {
    console.log(data);
  };
  const formik = useFormik({
    initialValues: {
      num_nota: null,
      fecha: new Date(),
      descripcion: "",
      proveedor: "",

    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <div className="m-5">
        <div>
          <p className="text-2xl text-center">Notas de compra</p>
          <div>
            <div className="flex gap-2 text-white">
              <button className="bg-green-500 p-2 rounded-lg"
                onClick={() => {
                  navigate(`/empresa/${id}/nota_compra/crear`);
                }}
              >
                Crear
              </button>
              <button className="bg-red-500 p-2 rounded-lg">
                Anular
              </button>
              <button className="bg-purple-500 p-2 rounded-lg">
                Detalles
              </button>
            </div>
          </div>
          <DataTable value={[]} emptyMessage="Agrega un detalle">
            <Column field="numero" header="Nro."></Column>
            <Column field="fecha" header="Fecha"></Column>
            <Column field="descripcion" header="Descripción"></Column>
            <Column field="estado" header="Estado"></Column>
          </DataTable>
        </div>
      </div >
    </>
  );
};;;;
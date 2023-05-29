import { useFormik } from "formik";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useNavigate, useParams } from "react-router";
import { baseUrl } from "../main";
import { useEffect, useState } from "react";
export function GetLista({ id, tipo }: { id: number, tipo: 'compra' | 'venta'; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/notas/listar`, {
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

export default function NotaCompra() {
  const [notas, setNotas] = useState<any[]>([]);
  const { id } = useParams();
  useEffect(() => {
    GetLista({ id: Number(id), tipo: 'compra' }).then((data: any) => {
      console.log(data);
      setNotas(data);
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
      proveedor: "",

    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const [selected, setSelected] = useState<any>(null);
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

              <button className="bg-purple-500 p-2 rounded-lg disabled:bg-purple-800"
                onClick={() => {
                  //Vamos a nota_compra/detalles/:id
                  navigate(`/empresa/${id}/nota_compra/detalles/${selected?.id}`);
                }
                }
                disabled={!selected}>
                Detalles
              </button>
            </div>
          </div>
          <DataTable
            selectionMode="single"
            selection={selected}
            onSelectionChange={(e) => {
              setSelected(e.value);
            }
            }
            value={notas} emptyMessage="Agrega un detalle"
            paginator rows={10} className="p-5"
            //tiny slim
            size="small"
          >
            <Column field="nro_nota"
              style={{ width: '100px' }}
              body={(rowData: any) => {
                return (
                  <p className="text-center" >
                    {rowData.nro_nota}
                  </p>
                );
              }}
              alignHeader={"center"}
              header="Nro"></Column>
            <Column
              style={{ width: '100px' }}
              alignHeader={"center"}

              field="fecha" header="Fecha"
              body={(rowData: any) => {
                return <p className="text-center">{new Date(rowData.fecha).toLocaleDateString("es-BO", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }
                )}</p>;
              }}
            ></Column>
            <Column

              field="descripcion" header="Descripción"></Column>
            <Column field="estado"
              style={{ width: '150px' }}
              body={(rowData: any) => {

                if (rowData.estado === 'activo') return (<div className=" fond-bold p-1 rounded-lg bg-green-500 w-fit text-white">Activo</div>);
                if (rowData.estado === 'anulado') return (<div className=" fond-bold p-1 rounded-lg bg-red-500 w-fit text-white">Anulado</div>);
              }}
              header="Estado"></Column>
          </DataTable>
        </div>
      </div >
    </>
  );
};;;;
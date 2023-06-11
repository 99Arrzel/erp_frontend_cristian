import { useEffect, useState } from "react";
import { baseUrl } from "../main";
import { useNavigate, useParams } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { GetLista } from "./compra";
import { SvgDetalles, SvgNuevo } from "../home/Home";



export function GetArticulosConLote({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/articulos/listar_con_lotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_empresa: id })
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export default function NotaVenta() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [notasVenta, setNotasVenta] = useState<any[]>([]);
  const { id } = useParams();
  useEffect(() => {
    GetArticulosConLote({ id: Number(id) }).then((data: any) => {
      console.log(data);
      setArticulos(data);
    });
    GetLista({ id: Number(id), tipo: 'venta' }).then((data: any) => {
      console.log(data);
      setNotasVenta(data);
    }
    );
  }, []);
  const navigate = useNavigate();

  const [selected, setSelected] = useState<any>(null);
  return (
    <>
      <div className="m-5">
        <div>
          <p className="text-2xl text-center">Notas de Venta</p>
          <div>
            <div className="flex gap-2 text-white">
              <button className="bg-green-500 p-2 rounded-lg"
                onClick={() => {
                  navigate(`/empresa/${id}/nota_venta/crear`);
                }}
              >
                <SvgNuevo />
              </button>

              <button className="bg-purple-500 p-2 rounded-lg disabled:bg-purple-800"
                onClick={() => {
                  //Vamos a nota_compra/detalles/:id
                  navigate(`/empresa/${id}/nota_venta/detalles/${selected?.id}`);
                }
                }
                disabled={!selected}>
                <SvgDetalles />
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
            value={notasVenta} emptyMessage="Agrega un detalle"
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
}
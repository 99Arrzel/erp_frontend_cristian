import { useEffect, useRef, useState } from "react";
import { baseUrl } from "../main";
import { useNavigate, useParams } from "react-router";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export function GetNotaVenta({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/notas/una_nota_venta`, {
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
export default function DetallesVenta() {
  const [notaVenta, setNotaVenta] = useState<any>(null);
  const { id, id_nota_venta } = useParams();
  useEffect(() => {
    GetNotaVenta({ id: Number(id_nota_venta) }).then((data: any) => {
      console.log(data);
      setNotaVenta(data);
    });
  }, []);

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  return (
    <>
      <Toast ref={toast} />
      <div className="m-5">
        <p className="text-2xl text-center">Detalle nota de venta</p>
        <div className="flex gap-2">
          <div>
            <p>Nro:</p>
            <InputText value={notaVenta?.nro_nota ?? ""} readOnly disabled />
          </div>
          <div>
            <p>Fecha:</p>
            <input value={notaVenta?.fecha ? (new Date(notaVenta.fecha)).toISOString().split("T")[0] : ""} type="date" disabled className="border-2 border-gray-200 p-2.5 rounded-lg  " />
          </div>
          <div>
            <p>Descripcion</p>
            <InputText value={notaVenta?.descripcion ?? ""} disabled readOnly />
          </div>
          <div>
            <button className="mt-6 bg-red-500 p-2 rounded-lg text-white disabled:bg-red-800"
              disabled={notaVenta?.estado != "activo"}

              onClick={() => {
                fetch(`${baseUrl}/api/notas/anular_venta`, {
                  method: "POST",
                  body: JSON.stringify({ id: notaVenta?.id, empresa_id: id }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }).then((res) => {
                  if (res.ok) {
                    toast.current?.show({ severity: "success", summary: "Anulado", detail: "Se anulo la nota de venta" });
                    GetNotaVenta({ id: Number(id_nota_venta) }).then((data: any) => {
                      setNotaVenta(data);
                    });
                    return res.json();
                  } else {
                    throw res;
                  }
                }).catch((err) => {
                  err.json().then((body: any) => {
                    toast.current?.show({ severity: "error", summary: "Error", detail: body.message });
                  });
                });

              }}

            >Anular</button>
          </div>
          <div>
            <button className="mt-6 bg-purple-500 p-2 rounded-lg text-white"

              onClick={() => {
                navigate(`/empresa/${id}/nota_venta/`);
              }}
            >Volver</button>
          </div>
        </div>
        <div className="bg-gray-100 p-2 mt-1">
          <p className="text-center font-bold">Detalles</p>
          <DataTable value={notaVenta?.detalles} emptyMessage="Agrega un detalle">
            <Column field="lote.articulo.nombre" header="Articulo"></Column>
            <Column field="lote.nro_lote" header="Lote"></Column>

            <Column field="cantidad" header="Cantidad"></Column>
            {/* Footer con total */}
            <Column field="lote.precio_compra"
              alignHeader={"right"}
              bodyStyle={{ textAlign: "right" }}
              footer="Total"
              footerStyle={{ textAlign: "right" }}
              header="Precio">
            </Column>
            <Column
              body={(rowData: any) => {
                return (rowData.precio_venta * rowData.cantidad);
              }}
              alignHeader={"right"}

              bodyStyle={{ textAlign: "right" }}
              header={"Subtotal"}
              footerStyle={{ textAlign: "right" }}
              footer={notaVenta?.total}
            ></Column>
          </DataTable>
        </div>
      </div >
    </>
  );
}
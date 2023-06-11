import { useFormik } from "formik";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { GetArticulos } from "../articulos/articulos";
import { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useNavigate, useParams } from "react-router";
import { baseUrl, baseUrlReports } from "../main";
import { Toast } from "primereact/toast";
import { SvgCerrar, SvgReporte, SvgVolverAtras, urlReporte } from "../home/Home";

export function GetNotaCompra({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/notas/una_nota`, {
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

export default function DetallesCompra() {
  const [articulos, setArticulos] = useState<any[]>([]);
  const { id, id_nota_compra } = useParams();

  useEffect(() => {
    GetArticulos({ id: 1 }).then((data: any) => {
      console.log(data);
      setArticulos(data);
    });
    GetNotaCompra({ id: Number(id_nota_compra) }).then((data: any) => {
      console.log(data);
      formik.setFieldValue("num_nota", data.nro_nota);
      formik.setFieldValue("fecha", new Date(data.fecha).toISOString().split("T")[0]);

      formik.setFieldValue("descripcion", data.descripcion);
      formik.setFieldValue("lotes", data.lotes);
      formik.setFieldValue("estado", data.estado);
    });

  }, []);


  const eliminar = (data: any) => {
    console.log(data);
  };
  const formik = useFormik({
    initialValues: {
      num_nota: null as any,
      fecha: null as any,
      descripcion: "",
      lotes: [] as any[],
      estado: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  return (

    <>
      <Toast ref={toast} />
      <div className="m-5">
        <p className="text-2xl text-center">Detalle nota de compra</p>
        <div className="flex gap-2">
          <div>
            <p>Nro:</p>
            <InputText value={formik.values.num_nota ?? ""} readOnly disabled />
          </div>
          <div>
            <p>Fecha:</p>
            <input value={formik.values.fecha ?? ""} type="date" disabled className="border-2 border-gray-200 p-2.5 rounded-lg  " />
          </div>
          <div>
            <p>Descripcion</p>
            <InputText value={formik.values.descripcion ?? ""} disabled readOnly />
          </div>
          <div>
            <button className="mt-6 bg-red-500 p-2 rounded-lg text-white disabled:bg-red-800"
              disabled={formik.values.estado != "activo"}

              onClick={() => {
                fetch(`${baseUrl}/api/notas/anular_compra`, {
                  method: "POST",
                  body: JSON.stringify({ id: id_nota_compra, empresa_id: id }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }).then((res) => {
                  if (res.ok) {
                    toast.current?.show({ severity: "success", summary: "Anulado", detail: "Se anulo la nota de compra" });
                    formik.setFieldValue("estado", "anulado");
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

            >
              <SvgCerrar
                mensaje="Anular nota de compra"
              />
            </button>

          </div>
          <div>
            <button className="mt-6 bg-purple-500 p-2 rounded-lg text-white"

              onClick={() => {
                navigate(`/empresa/${id}/nota_compra/`);
              }}
            >
              <SvgVolverAtras />

            </button>
          </div>
          <div>
            <button className="bg-blue-500 p-2 text-white rounded-lg mt-6"
              onClick={() => {
                window.open(urlReporte({
                  valores: {
                    sessionDecorator: "no",
                    chrome: "false",
                    decorate: "no",
                    toolbar: "false",
                    j_username: 'jasperadmin', j_password: 'bitnami',
                    id_nota: id ?? "",
                    token: "Bearer " + localStorage.getItem("token") ?? ""
                  }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2FNotaCompraReport&standAlone=true`
                }), '_blank');
              }
              }
            >
              <SvgReporte />
            </button>
          </div>
        </div>
        <div className="bg-gray-100 p-2 mt-1">
          <p className="text-center font-bold">Productos</p>

          <DataTable value={formik.values.lotes} emptyMessage="Agrega un detalle">
            <Column field="articulo.nombre" header="Articulo"></Column>
            <Column field="fecha_vencimiento"
              body={(rowData: any) => {
                return new Date(rowData.fecha_vencimiento).toLocaleDateString('es-ES');
              }}
              header="Fecha Vencimiento"></Column>
            <Column field="cantidad" header="Cantidad"></Column>
            {/* Footer con total */}
            <Column field="precio_compra"
              alignHeader={"right"}
              bodyStyle={{ textAlign: "right" }}
              footer="Total"
              footerStyle={{ textAlign: "right" }}
              header="Precio">
            </Column>
            <Column
              body={(rowData: any) => {
                return (rowData.precio_compra * rowData.cantidad);
              }}
              alignHeader={"right"}

              bodyStyle={{ textAlign: "right" }}
              header={"Subtotal"}
              footerStyle={{ textAlign: "right" }}
              footer={formik.values.lotes.reduce((a, b) => a + Number(b.precio_compra * b.cantidad), 0)}
            ></Column>
          </DataTable>
        </div>
      </div >
    </>
  );
};;;
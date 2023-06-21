import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GetEmpresa } from "../home/Menu";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { SvgCerrar, SvgReporte, SvgVolverAtras, urlReporte } from "../home/Home";
import { anularComprobante, cerrarComprobante } from "./comprobantes";
import { Toast } from "primereact/toast";
import { baseUrlReports } from "../main";

export function DetalleComprobante() {
  const navigate = useNavigate();
  const { id_comprobante } = useParams();
  const { id } = useParams();
  const [empresa, setEmpresa] = useState<any>(null);
  const [comprobante, setComprobante] = useState<any>(null);

  const cerrar = (id_comprobante: number) => {
    cerrarComprobante(id_comprobante).then(async (res) => {
      let error = await (res.text().then((res) => JSON.parse(res)));
      if (error.message) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000
        });
        return;
      }
      if (res.ok) {
        GetEmpresa({ id: Number(id) }).then((data: any) => {
          console.log("xd", data);
          setEmpresa(data);
        });
        toast.current?.show({
          severity: res.ok ? 'success' : 'error',
          summary: res.ok ? 'Exito' : 'Error',
          detail: res.ok ? 'Comprobante cerrado' : 'Error al cerrar comprobante',
          life: 3000
        });
        //go back
        navigate(`/empresa/${id}/comprobantes`);
        //setSelectedComprobante(null);
      }
    }
    );
  };
  let anular = (id_comprobante: number) => {
    anularComprobante(id_comprobante).then(async (res) => {
      let error = await (res.text().then((res) => JSON.parse(res)));
      if (error.message) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000
        });
        return;
      }
      if (res.ok) {
        GetEmpresa({ id: Number(id) }).then((data: any) => {
          setEmpresa(data);
        });
        toast.current?.show({
          severity: res.ok ? 'success' : 'error',
          summary: res.ok ? 'Exito' : 'Error',
          detail: res.ok ? 'Comprobante anulado' : 'Error al anular comprobante',
          life: 3000
        });
        navigate(`/empresa/${id}/comprobantes`);
      }
      //setSelectedComprobante(null);
    }
    );
  };
  useEffect(() => {
    if (id != null) {
      GetEmpresa({ id: Number(id) }).then((data: any) => {
        setEmpresa(data);
        if (data.comprobantes.find((comprobante: any) => comprobante.id == id_comprobante) == null) {
          window.location.href = `/empresa/${id}/comprobantes`;
          return;
        }
        setComprobante(data.comprobantes.find((comprobante: any) => comprobante.id == id_comprobante));
        console.log(data.comprobantes.find((comprobante: any) => comprobante.id == id_comprobante));
      });
    }
  }, []);
  const verComprobante = (id: string) => {
    window.open(urlReporte({
      valores: {
        sessionDecorator: "no",
        chrome: "false",
        decorate: "no",
        toolbar: "false",
        j_username: 'jasperadmin', j_password: 'bitnami',
        ID_COMPROBANTE: id
      }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2FComp_rep&standAlone=true`
    }), '_blank');
  };

  const toast = useRef<Toast>(null);
  return (
    <>
      <Toast ref={toast} />
      <div className="m-4">

        <div className="flex gap-2" >
          <h1
            className="text-2xl font-bold"
          >Detalle del comprobante </h1>
          <button className="bg-purple-500 p-2 text-white rounded-lg ml-auto"
            onClick={() => {
              navigate(`/empresa/${id}/comprobantes`);
            }}
          ><SvgVolverAtras /></button>
          <button className="bg-yellow-500 p-2 rounded-lg text-white disabled:bg-yellow-800"
            disabled={comprobante == null || comprobante?.estado == "Anulado" || comprobante?.estado == "Cerrado"}
            onClick={() => {
              anular(comprobante.id);
            }}
          ><SvgCerrar mensaje="Anular" /></button>
          <button className="bg-red-500 p-2 rounded-lg text-white disabled:bg-red-800"
            disabled={comprobante == null || comprobante?.estado == "Anulado" || comprobante?.estado == "Cerrado"}
            onClick={() => {
              cerrar(comprobante.id);
            }}
          ><SvgCerrar /></button>
          <button className="bg-purple-500 p-2 rounded-lg text-white disabled:bg-purple-800"
            disabled={comprobante == null}
            onClick={() => {
              verComprobante(comprobante.id);
            }}
          ><SvgReporte /></button>
        </div>

        <div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex flex-col">
              <label htmlFor="serie">Serie</label>
              <InputText value={comprobante?.serie} readOnly />
            </div>
            <div className="flex flex-col">
              <label htmlFor="glosa">Glosa</label>
              <InputText name="glosa"
                readOnly
                value={comprobante?.glosa} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="tc">Tipo de cambio</label>
              <InputNumber
                value={comprobante?.tc} readOnly />
            </div>
            <div className="flex flex-col">
              <label htmlFor="moneda">Moneda</label>
              <InputText value={comprobante?.moneda.nombre} readOnly />
            </div>
            <div className="flex flex-col">
              <label htmlFor="tipo">Tipo</label>
              <InputText value={comprobante?.tipo} readOnly />
            </div>
            <div className="flex flex-col">
              <label htmlFor="fecha">Fecha</label>
              <InputText
                value={(new Date(comprobante?.fecha || "").toLocaleDateString('es-BO', { timeZone: 'UTC' }))}
                readOnly
              />
            </div>
          </div>
        </div>
        <DataTable
          value={comprobante?.comprobante_detalles}
          emptyMessage="Añade detalles">

          <Column field="glosa" header="Glosa" />
          <Column field="cuenta.nombre" header="Cuenta"
            footer="Total"
          />
          <Column field="monto_debe" header="Debe"
            footer={comprobante?.comprobante_detalles.reduce((a: any, b: any) => a + (b.monto_debe || 0), 0)}
          />

          <Column field="monto_haber" header="Haber"
            footer={comprobante?.comprobante_detalles.reduce((a: any, b: any) => a + (b.monto_haber || 0), 0)}
          />
        </DataTable>
      </div>
    </>
  );
}

export default DetalleComprobante;;;
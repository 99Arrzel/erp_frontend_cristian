import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GetEmpresa } from "../home/Menu";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export function DetalleComprobante() {
  const navigate = useNavigate();
  const { id_comprobante } = useParams();
  const { id } = useParams();
  const [empresa, setEmpresa] = useState<any>(null);
  const [comprobante, setComprobante] = useState<any>(null);
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

  return (
    <>
      <div className="m-4">

        <div className="flex">
          <h1
            className="text-2xl font-bold"
          >Detalle del comprobante </h1>
          <button className="bg-purple-500 p-2 text-white rounded-lg ml-auto"
            onClick={() => {
              navigate(`/empresa/${id}/comprobantes`);
            }}
          >Volver atrás</button>
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
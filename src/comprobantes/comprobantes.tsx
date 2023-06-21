import { useNavigate, useParams } from "react-router";
import { GetEmpresa } from "../home/Menu";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { baseUrl, baseUrlReports } from "../main";
import { SvgCerrar, SvgDetalles, SvgNuevo, SvgReporte, urlReporte } from "../home/Home";

export function crearComprobante(v: any) {
  return fetch(baseUrl + '/api/comprobante/crear', {
    body: JSON.stringify(v),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    method: 'POST'
  });
}
export function anularComprobante(id: number) {
  return fetch(baseUrl + '/api/comprobante/anular/' + id, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    method: 'GET',

  });
}
export function cerrarComprobante(id: number) {
  return fetch(baseUrl + '/api/comprobante/cerrar/' + id, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    method: 'GET',
  });
}


export default function () {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empresa, setEmpresa] = useState<any>(null);
  useEffect(() => {
    if (id != null) {
      GetEmpresa({ id: Number(id) }).then((data: any) => {
        setEmpresa(data);
        console.log(data);
      });
    }
  }, []);



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
        setSelectedComprobante(null);
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
      }
      setSelectedComprobante(null);
    }
    );
  };
  const [selectedComprobante, setSelectedComprobante] = useState<any>(null);
  const toast = useRef<Toast>(null);
  const [verDetalles, setverDetalles] = useState(false);
  const sumarTotalDebe = () => {
    return `T:${selectedComprobante?.comprobante_detalles.reduce((a: any, b: any) => a + b.monto_debe, 0)}`;
  };
  const sumarTotalDebeAlt = () => {
    return `T:${selectedComprobante?.comprobante_detalles.reduce((a: any, b: any) => a + b.monto_debe_alt, 0)}`;
  };
  const sumarTotalHaber = () => {
    return `T:${selectedComprobante?.comprobante_detalles.reduce((a: any, b: any) => a + b.monto_haber, 0)}`;
  };
  const sumarTotalHaberAlt = () => {
    return `T:${selectedComprobante?.comprobante_detalles.reduce((a: any, b: any) => a + b.monto_haber_alt, 0)}`;
  };
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

  return (<>
    <Dialog draggable={false}
      header={`Detalles del comprobante ${selectedComprobante?.serie} : ${selectedComprobante?.glosa}`}
      visible={verDetalles}
      onHide={() => {
        setverDetalles(false);
      }}
    >
      <DataTable value={selectedComprobante?.comprobante_detalles}
      >
        <Column field="numero" header="Nº" />
        <Column field="glosa" header="Glosa" />
        <Column field="monto_debe" footer={sumarTotalDebe} header="Debe" />
        <Column field="monto_haber" footer={sumarTotalHaber} header="Haber" />
        <Column field="monto_debe_alt" header="Debe Alt." footer={sumarTotalDebeAlt} />
        <Column field="monto_haber_alt" header="Haber Alt." footer={sumarTotalHaberAlt} />
        <Column body={formatCodigo} header="Cuenta" />
      </DataTable>

    </Dialog>
    <Toast ref={toast} />
    <div className="m-4">
      <div className="flex gap-4">
        <button className="bg-green-500 p-2 rounded-lg text-white"
          onClick={() => {
            if (empresa?.empresa_monedas.length > 1) {
              //Redireccionar de donde estamos a crear
              navigate(`/empresa/${id}/comprobantes/crear`);
            }
            else {
              toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se puede crear comprobantes porque no hay un tipo de cambio establecido',
                life: 3000
              });
            }

          }
          }
        ><SvgNuevo /></button>
        <button className="bg-blue-500 p-2 rounded-lg text-white disabled:bg-blue-800"
          disabled={selectedComprobante == null}
          onClick={() => {
            //navigat to ="/empresa/:id/comprobantes/detalle/:id_comprobante
            navigate(`/empresa/${id}/comprobantes/detalle/${selectedComprobante?.id}`);
          }}
        ><SvgDetalles /></button>
        {/* <button className="bg-yellow-500 p-2 rounded-lg text-white disabled:bg-yellow-800"
          disabled={selectedComprobante == null || selectedComprobante?.estado == "Anulado" || selectedComprobante?.estado == "Cerrado"}
          onClick={() => {
            anular(selectedComprobante.id);
          }}
        ><SvgCerrar mensaje="Anular" /></button>
        <button className="bg-red-500 p-2 rounded-lg text-white disabled:bg-red-800"
          disabled={selectedComprobante == null || selectedComprobante?.estado == "Anulado" || selectedComprobante?.estado == "Cerrado"}
          onClick={() => {
            cerrar(selectedComprobante.id);
          }}
        ><SvgCerrar /></button>
        <button className="bg-purple-500 p-2 rounded-lg text-white disabled:bg-purple-800"
          disabled={selectedComprobante == null}
          onClick={() => {
            verComprobante(selectedComprobante.id);
          }}
        ><SvgReporte /></button> */}
      </div>
      <DataTable value={empresa?.comprobantes} loading={empresa == null} emptyMessage="Sin comprobantes" selectionMode="single"
        metaKeySelection={false}
        selection={selectedComprobante}
        onSelectionChange={(e) => {
          console.log(e.value);
          setSelectedComprobante(e.value as any);
        }}
        dataKey="id"
      >
        <Column field="serie" header="Serie" />
        <Column field="glosa" header="Glosa" />
        <Column field="tipo" header="Tipo" />
        <Column
          body={(rowData) => {
            return <>{new Date(rowData.fecha).toLocaleDateString()}</>;
          }}
          field="fecha" header="Fecha" />
        <Column field="tc" header="Tipo de cambio" />
        <Column field="estado" header="Estado" />
      </DataTable>
    </div>
  </>);
};
export function formatCodigo(rowData: any) {
  return <>{rowData?.cuenta?.codigo + " - " + rowData?.cuenta?.nombre}</>;
}
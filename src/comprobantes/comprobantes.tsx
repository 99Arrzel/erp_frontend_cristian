import { useParams } from "react-router";
import { GetEmpresa } from "../home/Menu";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { baseUrl, baseUrlReports } from "../main";
import { urlReporte } from "../home/Home";

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
  const { id } = useParams();
  const [empresa, setEmpresa] = useState<any>(null);
  useEffect(() => {
    if (id != null) {
      GetEmpresa({ id: Number(id) }).then((data: any) => {
        setEmpresa(data);
        let moneda_activa = data?.empresa_monedas.find((x: any) => x.activo);
        console.log(moneda_activa);
        formik.setFieldValue('moneda', moneda_activa);
        formik.setFieldValue('tc', moneda_activa?.cambio);
        console.log(data);
      });
    }
  }, []);
  const [crearDialog, setCrearDialog] = useState(false);
  const [detallesDialog, setDetallesDialog] = useState(false);
  const formik = useFormik({
    initialValues: {
      glosa: '',
      fecha: new Date(),
      tc: 0 as number,
      moneda: null as any,
      tipo: 'Ingreso' as 'Ingreso' | 'Egreso' | 'Traspaso' | 'Ajuste' | 'Apertura',
      detalles: [] as any[],
      moneda_id: null,
      empresa_id: Number(id)
    },
    onSubmit: async (values) => {
      if (values.glosa.trim() == '') {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Glosa no puede estar vacia',
          life: 3000
        });
        return;
      }
      /* Check that haber = debe */
      let debe = values.detalles.reduce((a, b) => a + (b.debe || 0), 0);
      let haber = values.detalles.reduce((a, b) => a + (b.haber || 0), 0);
      if (debe != haber) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Debe y haber no coinciden',
          life: 3000
        });
        return;
      }
      if (values.detalles.length < 2) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Al menos 2 detalles por comprobante',
          life: 3000
        });
        return;
      }
      console.log(values, "Valores en form");
      console.log(values.moneda, "Moneda en form");
      values.moneda_id = values.moneda.moneda_alternativa_id;
      crearComprobante(values).then(async (res) => {
        let error = await (res.text().then((res) => JSON.parse(res)));

        console.log(error);
        if (res.ok) {
          GetEmpresa({ id: Number(id) }).then((data: any) => {
            setEmpresa(data);
          });
          toast.current?.show({
            severity: 'success',
            summary: 'Exito',
            detail: 'Comprobante creado',
            life: 3000
          });

          formik.resetForm();
          setCrearDialog(false);
        } else {
          if (error.message) {
            toast.current?.show({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
              life: 3000
            });
            return;
          }
          console.log(res);
          console.log(res.body, "body");
        }


      });
    }
  });
  const [lastGlosa, setLastGlosa] = useState('');
  const [editar, setEditar] = useState(false);
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
  const formikDetalle = useFormik({
    initialValues: {
      glosa: '',
      cuenta: null as any,
      debe: null as null | number,
      haber: null as null | number,
      numero: 0,
      cuenta_id: null
    },
    onSubmit: (v) => {
      console.log(v);

      if (v.glosa.trim() == '') {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Glosa no puede estar vacia',
          life: 3000
        });
        return;
      }
      if (!v.cuenta) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Debes seleccionar una cuenta',
          life: 3000
        });
        return;
      }
      if (v.debe && v.haber) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'O debe o haber, no ambos',
          life: 3000
        });
        return;
      }
      v.cuenta_id = v.cuenta.id;
      if (editar) {
        formik.setFieldValue('detalles', formik.values.detalles.map((x: any) => {
          if (x.numero == v.numero) {
            return v;
          }
          return x;
        }));
        setEditar(false);
      } else {
        v.numero = formik.values.detalles.length + 1;
        formik.setFieldValue('detalles', [...formik.values.detalles, { ...v }]);
      }
      formikDetalle.resetForm();
      setLastGlosa(v.glosa);
      setDetallesDialog(false);

    }

  });
  const debeAlt = (rowData: any) => {
    const res = rowData.debe * (formik.values.tc);

    return res ? res.toFixed(2) : "";
  };
  const haberAlt = (rowData: any) => {

    const res = rowData.haber * (formik.values.tc);

    return res ? res.toFixed(2) : "";
  };
  const eliminarDetalle = (numero: number) => {
    formik.setFieldValue('detalles', formik.values.detalles.filter((x: any) => x.numero != numero).map((x: any, i: number) => {
      x.numero = i + 1;
      return x;
    }));
  };

  const opcionesDetalles = (rowData: any) => {
    return (
      <>
        <div className="flex gap-2">
          <button className="bg-yellow-500 p-1 text-white rounded-lg"

            onClick={() => {
              setEditar(true);
              formikDetalle.setFieldValue('glosa', rowData.glosa);
              formikDetalle.setFieldValue('cuenta', rowData.cuenta);
              formikDetalle.setFieldValue('debe', rowData.debe);
              formikDetalle.setFieldValue('haber', rowData.haber);
              formikDetalle.setFieldValue('numero', rowData.numero);
              setDetallesDialog(true);
            }}
          >
            Editar
          </button>
          <button
            className="bg-red-500 p-1 text-white rounded-lg"
            onClick={() => eliminarDetalle(rowData.numero)}>
            Eliminar
          </button>
        </div >
      </>
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
    <Dialog
      draggable={false}
      header="Detalles para comprobante"
      visible={detallesDialog}
      onHide={() => {
        setDetallesDialog(false);
      }}
    >
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col">
          <label htmlFor="glosa">Glosa</label>
          <InputText name="glosa" onChange={formikDetalle.handleChange} value={formikDetalle.values.glosa} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="glosa">Cuenta</label>
          <Dropdown
            className="w-80"
            itemTemplate={(option: any) => {
              return (
                <div className="">
                  <div >{option?.codigo} - {option?.nombre}</div>
                </div>
              );
            }}
            valueTemplate={(option: any) => {
              return (
                <div className="">
                  <div >{option?.codigo} - {option?.nombre}</div>
                </div>
              );
            }}
            filter
            optionLabel="nombre"
            name="cuenta" onChange={formikDetalle.handleChange} value={formikDetalle.values.cuenta} options={empresa?.cuentas.filter((cuenta: any) => cuenta.tipo == "DETALLE" || formik.values.detalles.find((v) => v.cuenta.id == cuenta.id))} />
        </div>
        <div className="flex flex-col ">
          <label htmlFor="debe">Debe</label>
          <InputNumber
            disabled={formikDetalle.values.haber != null && formikDetalle.values.haber > 0}
            name="debe" onChange={
              (e) => {
                formikDetalle.setFieldValue('debe', e.value);
              }
            } value={formikDetalle.values.debe} />
        </div>
        <div className="flex flex-col ">
          <label htmlFor="haber">Haber</label>
          <InputNumber
            disabled={formikDetalle.values.debe != null && formikDetalle.values.debe > 0}
            name="haber"
            onChange={
              (e) => {
                formikDetalle.setFieldValue('haber', e.value);
              }
            }
            value={formikDetalle.values.haber as number} />
        </div>

      </div>
      <div className="flex mt-2">
        <button
          type="button"
          className="bg-green-500 text-white rounded-lg p-2 ml-auto"
          onClick={() => {
            formikDetalle.handleSubmit();
          }}
        >
          Guardar
        </button>
      </div>

    </Dialog>
    <Toast ref={toast} />
    <Dialog
      draggable={false}
      header="Crear comprobante"
      className="w-full h-full m-10"
      visible={crearDialog}
      onHide={() => {
        setCrearDialog(false);
      }}
    >

      <div className="flex justify-center gap-2 flex-wrap">
        <div className="flex flex-col">
          <label htmlFor="serie">Serie</label>
          <InputText value={empresa?.comprobantes?.length + 1} readOnly />
        </div>
        <div className="flex flex-col">
          <label htmlFor="glosa">Glosa</label>
          <InputText name="glosa" onChange={formik.handleChange} value={formik.values.glosa} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="tc">Tipo de cambio</label>
          <InputNumber
            max={Math.trunc(formik.values.moneda?.cambio) + 0.99}
            min={Math.trunc(formik.values.moneda?.cambio)}
            maxFractionDigits={2}
            minFractionDigits={2}
            mode="decimal"
            name="tc" onChange={(e) => {
              if (e.value && e.value > 0) {
                formik.setFieldValue('tc', e.value);
              }
            }} value={formik.values.tc} disabled={formik.values.moneda == null} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="moneda">Moneda</label>
          <InputText value={`${formik.values.moneda?.moneda_principal?.nombre} : ${formik.values.moneda?.moneda_alternativa?.nombre} - ${formik.values.moneda?.cambio}`} readOnly />
        </div>
        <div className="flex flex-col">
          <label htmlFor="tipo">Tipo</label>
          <Dropdown name="tipo" onChange={formik.handleChange} value={formik.values.tipo} options={['Ingreso', 'Egreso', 'Traspaso', 'Ajuste', 'Apertura']} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fecha">Fecha</label>
          <input
            className="p-3 border-2 rounded-lg"
            type="date" name="fecha" onChange={
              (e) => {
                formik.setFieldValue('fecha', new Date(e.target.value));
              }
            } value={
              new Date(formik.values.fecha).toISOString().split('T')[0]
            } />
        </div>
      </div>
      <div className="mt-2">
        <button className="p-2 bg-green-500 text-white rounded-lg"
          onClick={() => {
            setDetallesDialog(true);

            if (lastGlosa == "") {
              formikDetalle.setFieldValue('glosa', formik.values.glosa);
              setLastGlosa(formik.values.glosa);
              console.log("last glosa setted");
            } else {
              formikDetalle.setFieldValue('glosa', lastGlosa);
            }
          }}
        >Añadir detalles</button>
        <DataTable
          value={formik.values.detalles}
          emptyMessage="Añade detalles">
          <Column field="numero" header="Nº" />
          <Column field="glosa" header="Glosa" />
          <Column field="cuenta.nombre" header="Cuenta" />
          <Column field="debe" header="Debe"
            footer={formik.values.detalles.reduce((a, b) => a + (b.debe || 0), 0)}
          />
          <Column body={debeAlt} header="Debe Alt"
            footer={formik.values.detalles.reduce((a, b) => a + (b.debe || 0), 0) * formik.values.tc}
          />
          <Column field="haber" header="Haber"
            footer={formik.values.detalles.reduce((a, b) => a + (b.haber || 0), 0)}
          />
          <Column body={haberAlt} header="Haber Alt"
            footer={formik.values.detalles.reduce((a, b) => a + (b.haber || 0), 0) * formik.values.tc}
          />
          <Column body={opcionesDetalles} header="Opciones" />
        </DataTable>
      </div>
      <div className="flex mt-2">
        <button
          type="button"
          className="bg-green-500 text-white rounded-lg p-2 ml-auto"
          onClick={() => {
            formik.handleSubmit();
          }}
        >
          Guardar
        </button>
      </div>
    </Dialog>
    <div className="m-4">
      <div className="flex gap-4">
        <button className="bg-green-500 p-2 rounded-lg text-white"
          onClick={() => {
            if (empresa?.empresa_monedas.length > 1) {
              setCrearDialog(true);
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
        >Crear</button>
        <button className="bg-blue-500 p-2 rounded-lg text-white disabled:bg-gray-500"
          disabled={selectedComprobante == null}
          onClick={() => {
            setverDetalles(true);
          }}
        >Ver detalles</button>
        <button className="bg-yellow-500 p-2 rounded-lg text-white disabled:bg-gray-500"
          disabled={selectedComprobante == null || selectedComprobante?.estado == "Anulado" || selectedComprobante?.estado == "Cerrado"}
          onClick={() => {
            anular(selectedComprobante.id);
          }}
        >Anular</button>
        <button className="bg-red-500 p-2 rounded-lg text-white disabled:bg-gray-500"
          disabled={selectedComprobante == null || selectedComprobante?.estado == "Anulado" || selectedComprobante?.estado == "Cerrado"}
          onClick={() => {
            cerrar(selectedComprobante.id);
          }}
        >Cerrar</button>
        <button className="bg-purple-500 p-2 rounded-lg text-white disabled:bg-gray-500"
          disabled={selectedComprobante == null}
          onClick={() => {
            verComprobante(selectedComprobante.id);
          }}
        >Ver comprobante</button>
      </div>
      <DataTable value={empresa?.comprobantes} loading={empresa == null} emptyMessage="Sin comprobantes" selectionMode="single"
        metaKeySelection={false}
        selection={selectedComprobante}
        onSelectionChange={(e) => {
          console.log(e.value);
          setSelectedComprobante(e.value as any);
        }
        }
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
        <Column field="moneda.nombre" header="Moneda" />
        <Column field="tc" header="Tipo de cambio" />
        <Column field="estado" header="Estado" />
      </DataTable>
    </div>
  </>);
};
export function formatCodigo(rowData: any) {
  return <>{rowData?.cuenta?.codigo + " - " + rowData?.cuenta?.nombre}</>;
}
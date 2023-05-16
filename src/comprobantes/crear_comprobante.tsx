import { useFormik } from "formik";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { GetEmpresa } from "../home/Menu";
import { useNavigate, useParams } from "react-router";
import { crearComprobante } from "./comprobantes";
function CrearComprobante() {
  const navigate = useNavigate();
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
        setCuentasFiltradas(data?.cuentas.filter((cuenta: any) => cuenta.tipo == "DETALLE"));
      });
    }
  }, []);
  const toast = useRef<Toast>(null);
  const eliminarDetalle = (numero: number) => {
    formik.setFieldValue('detalles', formik.values.detalles.filter((x: any) => x.numero != numero).map((x: any, i: number) => {
      x.numero = i + 1;
      return x;
    }));
  };
  const formik = useFormik({
    initialValues: {
      id: null as number | null,
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
          //navigate a la pestaña de comprobantes
          navigate(`/empresa/${id}/comprobantes`);
          formik.resetForm();
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

  const [editar, setEditar] = useState(false);
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
      let ultimaGlosa = v.glosa;
      formikDetalle.resetForm();
      formikDetalle.setFieldValue('glosa', ultimaGlosa);
      console.log(formik.values, "Actualizado");
    }
  });
  const [glosaHasBeenInteracted, setGlosaHasBeenInteracted] = useState(false);

  useEffect(() => {
    setCuentasFiltradas(empresa?.cuentas.filter((cuenta: any) => cuenta.tipo == "DETALLE" && !formik.values.detalles.find((x: any) => x.cuenta.id == cuenta.id)));
  }, [formik.values.detalles]);

  const [cuentasFiltras, setCuentasFiltradas] = useState<any>([]);

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
  return (
    <>
      <Toast ref={toast} />
      <div className="m-4">
        <div className="flex">
          <h1
            className="text-2xl font-bold"
          >Crear Comprobante</h1>
          <button className="bg-purple-500 p-2 text-white rounded-lg ml-auto"
            onClick={() => {
              navigate(`/empresa/${id}/comprobantes`);
            }}
          >Volver atrás</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="serie">Serie</label>
            <InputText value={isNaN(empresa?.comprobantes?.length + 1) ? 0 : empresa?.comprobantes?.length + 1} readOnly />
          </div>
          <div className="flex flex-col">
            <label htmlFor="glosa">Glosa</label>
            <InputText name="glosa" onChange={
              (e) => {
                formik.setFieldValue('glosa', e.target.value);
                if (!glosaHasBeenInteracted) {
                  formikDetalle.setFieldValue('glosa', e.target.value);
                }
              }

            } value={formik.values.glosa} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="tc">Tipo de cambio</label>
            <InputNumber
              max={(isNaN(Math.trunc(formik.values.moneda?.cambio)) ? 0 : Math.trunc(formik.values.moneda?.cambio)) + 0.99}
              min={Math.trunc(formik.values.moneda?.cambio ?? 0)}
              maxFractionDigits={2}
              minFractionDigits={2}
              mode="decimal"
              name="tc" onChange={(e) => {
                if (e.value && e.value > 0) {
                  formik.setFieldValue('tc', e.value);
                }
              }} value={isNaN(formik.values.tc) ? 0 : formik.values.tc} disabled={formik.values.moneda == null} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="moneda">Moneda</label>
            <InputText value={`${formik.values.moneda?.moneda_principal?.nombre} : ${formik.values.moneda?.moneda_alternativa?.nombre} `} readOnly />
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
          <h1 className="text-2xl font-bold">Añadir un detalle</h1>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col">
              <label htmlFor="glosa">Glosa</label>
              <InputText name="glosa" onChange={
                (e) => {
                  formikDetalle.setFieldValue('glosa', e.target.value);
                  setGlosaHasBeenInteracted(true);
                }
              } value={formikDetalle.values.glosa} />
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
                name="cuenta" onChange={formikDetalle.handleChange} value={formikDetalle.values.cuenta}
                options={cuentasFiltras} />
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
            <div className="flex items-center pt-4">
              <button
                type="button"
                className={`${editar ? 'bg-yellow-500' : 'bg-blue-500'} text-white rounded-lg p-2`}
                onClick={() => {
                  formikDetalle.handleSubmit();
                }}
              >
                {editar ? 'Editar Detalle' : 'Añadir Detalle'}
              </button>
            </div>
          </div>
          <DataTable
            value={formik.values.detalles}
            emptyMessage="Añade detalles">
            <Column field="numero" header="Nº" />
            <Column field="glosa" header="Glosa" />
            <Column field="cuenta.nombre" header="Cuenta" />
            <Column field="debe" header="Debe"
              footer={formik.values.detalles.reduce((a, b) => a + (b.debe || 0), 0)}
            />

            <Column field="haber" header="Haber"
              footer={formik.values.detalles.reduce((a, b) => a + (b.haber || 0), 0)}
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
            Guardar Comprobante
          </button>
        </div>
      </div>
    </>
  );
}
export default CrearComprobante;
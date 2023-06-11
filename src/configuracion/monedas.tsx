import { useEffect, useRef, useState } from "react";
import { SvgNuevo, fetchMonedas } from "../home/Home";
import { Dropdown } from 'primereact/dropdown';
import { useFormik } from "formik";
import { InputNumber } from 'primereact/inputnumber';
import { GetEmpresa } from "../home/Menu";
import { useNavigate, useParams } from "react-router";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { baseUrl } from "../main";
import { Toast } from "primereact/toast";
import { set_estado } from "../gestion/Gestion";

export function sendEmpresaMonedaData({ moneda_alternativa_id, moneda_principal_id, empresa_id, cambio }: { moneda_alternativa_id: number, moneda_principal_id: number, empresa_id: number, cambio: number; }) {
  return fetch(`${baseUrl}/api/empresa_moneda/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      moneda_alternativa_id,
      moneda_principal_id,
      empresa_id,
      cambio,
    }),
  });
}


export default function Monedas() {
  const toast = useRef<Toast>(null);
  const [monedas, setMonedas] = useState<any>([]);
  const [empresa, setEmpresa] = useState<any>(null);
  const { id } = useParams();
  const formik = useFormik({
    initialValues: {
      moneda_principal: null as any,
      moneda_alternativa: null as any,
      cambio: 0,
      empresa_id: id,
    },
    onSubmit: (values) => {

      if (values.moneda_alternativa == null) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una moneda alternativa", life: 3000 });
        return;
      }

      //De empresa empresa_monedas, verificamos el último que es un activo, tenemos que validar que no sea
      //la misma moneda principal con el mismo cambio, siempre será el primero, no el último
      const ultimo = empresa.empresa_monedas.find((moneda: any) => {
        if (moneda.moneda_principal.id == values.moneda_principal.id && moneda.activo) {
          if (moneda.cambio == values.cambio) {
            return true;
          }
        }
      });
      if (ultimo) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "No puede ser igual al último con el mismo cambio y la misma alternativa", life: 3000 });
        return;
      }
      if (values.cambio <= 0) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "El cambio debe ser mayor a 0", life: 3000 });
        return;
      }
      sendEmpresaMonedaData(
        { cambio: values.cambio, empresa_id: Number(values.empresa_id), moneda_alternativa_id: values.moneda_alternativa.id, moneda_principal_id: values.moneda_principal.id }
      ).then((res) => {
        if (res.status == 200) {
          toast.current?.show({ severity: "success", summary: "Éxito", detail: "Se ha guardado correctamente", life: 3000 });
          //formik.resetForm();
          if (id) {
            GetEmpresa({ id: parseInt(id) }).then((res: any) => {
              console.log("La empresa:", res);
              const val = res.empresa_monedas.pop().moneda_principal;
              if (res.empresa_monedas.length > 0) {
                console.log("La empresa:", res);
                const ultima_update = res.empresa_monedas[0];
                formik.setFieldValue("moneda_alternativa", ultima_update.moneda_alternativa);
                formik.setFieldValue("cambio", ultima_update.cambio);
              }
              formik.setFieldValue("empresa_id", res.id);
              setEmpresa(res);
              formik.setFieldValue("moneda_principal", val);
              fetchMonedas().then((resul) => {
                console.log("Las monedas:", resul);
                const monfetch = resul.filter((moneda: any) => moneda.id != val.id);

                setMonedas(monfetch);
              });
            });
          }

        }
      });
    },
  });
  useEffect(() => {
    if (id) {
      GetEmpresa({ id: parseInt(id) }).then((res: any) => {
        const val = res.empresa_monedas.pop().moneda_principal;
        formik.setFieldValue("empresa_id", res.id);
        setEmpresa(res);
        formik.setFieldValue("moneda_principal", val);
        console.log(res, "empresa");
        if (res.empresa_monedas.length > 0) {
          console.log("La empresa:", res);
          const ultima_update = res.empresa_monedas[0];
          formik.setFieldValue("moneda_alternativa", ultima_update.moneda_alternativa);
          formik.setFieldValue("cambio", ultima_update.cambio);
          setMonedas([ultima_update.moneda_alternativa]);
        } else {
          console.log("No hay monedas");
          fetchMonedas().then((resul) => {
            const monfetch = resul.filter((moneda: any) => moneda.id != val.id);
            setMonedas(monfetch);
          });
        }
      });
    }
  }, []);
  return (<>
    <Toast ref={toast} />
    <div>
      <h1 className="text-center">Monedas</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex justify-center w-full">
          <div className="flex justify-between  gap-4 w-full px-10">
            <div>
              <p>M. Principal</p>

              {formik.values.moneda_principal &&
                <InputText value={formik.values.moneda_principal.nombre} readOnly />}
            </div>
            <div>
              <p>M. Alternativa</p>
              <Dropdown options={monedas} optionLabel="nombre" value={formik.values.moneda_alternativa}
                onChange={(e) => {
                  formik.setFieldValue("moneda_alternativa", e.value);
                }}
              />
            </div>
            <div>
              <p>Cambio</p>
              <InputNumber
                mode="decimal" minFractionDigits={2}
                value={formik.values.cambio} onValueChange={(e) => {
                  formik.setFieldValue("cambio", e.value);
                }} />
              <button type="submit" className="bg-green-500  p-2.5 rounded-lg text-white"><SvgNuevo /></button>
            </div>

          </div>
        </div >

      </form >
      <DataTable value={empresa?.empresa_monedas} emptyMessage="Sin registros">
        <Column header="Fecha de registro" body={formatFechaCreatedAt} />
        <Column header="Cambio" field="cambio" />
        <Column header="M. Principal" field="moneda_principal.nombre" />
        <Column header="M. Alternativa" field="moneda_alternativa.nombre" />
        <Column header="Estado" body={activoFormat} />
      </DataTable>
    </div >
  </>);
};
export function activoFormat(cualquierObjeto: any) {
  return cualquierObjeto.activo ? "Activo" : "Inactivo";
}

export function formatFechaCreatedAt(cualquierObjeto: any) {

  //return new Date(cualquierObjeto.created_at).toLocaleDateString(); con horas
  return new Date(cualquierObjeto.created_at).toLocaleDateString() + " " + new Date(cualquierObjeto.created_at).toLocaleTimeString();

}
export function formatFecha(cualquierObjeto: any, keyOb: string) {
  return new Date(cualquierObjeto[keyOb]).toLocaleDateString();
}
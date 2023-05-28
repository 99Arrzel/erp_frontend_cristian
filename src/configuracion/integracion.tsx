import { useParams } from "react-router";
import { baseUrl } from "../main";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { fetchCuentasPorEmpresa } from "../cuentas/Cuentas";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

export function GetIntegracion({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/integracion/listar`, {
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



export default function () {
  const { id } = useParams();
  const [integracion, setIntegracion] = useState<any>(null);
  const [cuentasTodas, setCuentasTodas] = useState<any>([]);
  const [cuentas, setCuentas] = useState<any>([]);
  useEffect(() => {
    fetchCuentasPorEmpresa(Number(id))
      .then((res: any) => {
        setCuentas(res?.filter((cuenta: any) => cuenta.tipo === "DETALLE"));
        setCuentasTodas(res?.filter((cuenta: any) => cuenta.tipo === "DETALLE"));
        formik.setFieldValue("empresa_id", Number(id));
      })
      .catch((err) => {
        console.log(err);
      });

    GetIntegracion({ id: Number(id) })
      .then((res: any) => {
        setIntegracion(res);
        formik.setValues({
          empresa_id: res?.empresa_id as number,
          caja_id: res?.caja_id,
          caja: res?.caja,
          credito_fiscal_id: res?.credito_fiscal_id,
          credito_fiscal: res?.credito_fiscal,
          debito_fiscal_id: res?.debito_fiscal_id,
          debito_fiscal: res?.debito_fiscal,
          compras_id: res?.compras_id,
          compras: res?.compras,
          ventas_id: res?.ventas_id,
          ventas: res?.ventas,
          it_id: res?.it_id,
          it: res?.it,
          it_por_pagar_id: res?.it_por_pagar_id,
          it_por_pagar: res?.it_por_pagar,
          estado: res?.estado ?? false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const formik = useFormik({
    initialValues: {
      empresa_id: Number(id),
      caja_id: integracion?.caja_id,
      caja: integracion?.caja,
      credito_fiscal_id: integracion?.credito_fiscal_id,
      credito_fiscal: integracion?.credito_fiscal,
      debito_fiscal_id: integracion?.debito_fiscal_id,
      debito_fiscal: integracion?.debito_fiscal,
      compras_id: integracion?.compras_id,
      compras: integracion?.compras,
      ventas_id: integracion?.ventas_id,
      ventas: integracion?.ventas,
      it_id: integracion?.it_id,
      it: integracion?.it,
      it_por_pagar_id: integracion?.it_por_pagar_id,
      it_por_pagar: integracion?.it_por_pagar,
      estado: integracion?.estado ?? false as boolean,
    },
    onSubmit: (values) => {
      //validar()
      if (values.caja_id == null) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una cuenta de caja", life: 3000 });
        return;
      }
      if (values.credito_fiscal_id == null) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una cuenta de credito fiscal", life: 3000 });
        return;
      }
      if (values.debito_fiscal_id == null) {

        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una cuenta de debito fiscal", life: 3000 });
        return;
      }
      if (values.compras_id == null) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una cuenta de compras", life: 3000 });
        return;
      }
      if (values.ventas_id == null) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una cuenta de ventas", life: 3000 });
        return;
      }
      if (values.it_id == null) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una cuenta de IT", life: 3000 });
        return;
      }
      if (values.it_por_pagar_id == null) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "Debe seleccionar una cuenta de IT por pagar", life: 3000 });
        return;
      }



      console.log(values);
      fetch(`${baseUrl}/api/integracion/integrar`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Error");
          }

        })
        .then((res) => {
          console.log(res);
          toast.current?.show({ severity: "success", summary: "Exito", detail: "Se guardó correctamente", life: 3000 });
        }
        )
        .catch((err) => {
          toast.current?.show({ severity: "error", summary: "Error", detail: "Ocurrió un error", life: 3000 });
          console.log(err);
        }
        );


    },

  });

  function validarId(idValidar: number) {

    for (let key in formik.values) {
      if (key.includes("_id") && key != "empresa_id") {
        if (formik.values[key as keyof typeof formik.values] === idValidar) {
          formik.setFieldValue(key, null);
          formik.setFieldValue(key.replace("_id", ""), null);

          console.log("xd");
        }
      }
    }
    formik.setFieldValue("empresa_id", id);
  }
  const toast = useRef<Toast>(null);
  return <>
    <Toast ref={toast} />
    <div>
      <form onSubmit={formik.handleSubmit} className="flex justify-center">
        <div >
          <div>
            <p className="text-center text-2xl font-bold">Cuentas de integración</p>
            <div>
              <p>Activo</p>
              <InputSwitch checked={formik.values.estado}

                onChange={() => { formik.setFieldValue('estado', !formik.values.estado); }} />
            </div>
            <div>
              <p>Caja</p>
              <Dropdown
                className="w-80"
                valueTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                itemTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}

                options={cuentas}
                filter

                optionLabel="nombre" value={formik.values.caja} onChange={
                  (e) => {
                    console.log(e);
                    formik.setFieldValue("caja_id", e.value?.id);
                    formik.setFieldValue("caja", e.value);
                    validarId(e.value?.id as number);
                  }
                }
                emptyMessage="No hay cuentas de último nivel"
              />
            </div>
            <div>
              <p>Credito Fiscal</p>
              <Dropdown options={cuentas}
                className="w-80"
                valueTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                itemTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                filter optionLabel="nombre" value={formik.values.credito_fiscal} onChange={
                  (e) => {
                    formik.setFieldValue("credito_fiscal_id", e.value?.id);
                    formik.setFieldValue("credito_fiscal", e.value);
                    validarId(e.value?.id as number);

                  }
                } emptyMessage="No hay cuentas de último nivel" />
            </div>
            <div>
              <p>Debito Fiscal</p>
              <Dropdown options={cuentas}
                className="w-80"
                valueTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                itemTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                filter optionLabel="nombre" value={formik.values.debito_fiscal} onChange={
                  (e) => {
                    formik.setFieldValue("debito_fiscal_id", e.value?.id);
                    formik.setFieldValue("debito_fiscal", e.value);
                    validarId(e.value?.id as number);
                  }
                } emptyMessage="No hay cuentas de último nivel" />
            </div>
            <div>
              <p>Compras</p>
              <Dropdown options={cuentas}
                className="w-80"
                valueTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                itemTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                filter optionLabel="nombre" value={formik.values.compras} onChange={
                  (e) => {
                    formik.setFieldValue("compras_id", e.value?.id);
                    formik.setFieldValue("compras", e.value);
                    validarId(e.value?.id as number);
                  }
                } emptyMessage="No hay cuentas de último nivel" />
            </div>
            <div>
              <p>Ventas</p>
              <Dropdown options={cuentas}
                className="w-80"
                valueTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                itemTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                filter optionLabel="nombre" value={formik.values.ventas} onChange={
                  (e) => {
                    formik.setFieldValue("ventas_id", e.value?.id);
                    formik.setFieldValue("ventas", e.value);
                    validarId(e.value?.id as number);
                  }
                } emptyMessage="No hay cuentas de último nivel" />
            </div>
            <div>
              <p>IT</p>
              <Dropdown options={cuentas}
                className="w-80"
                valueTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                itemTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                filter optionLabel="nombre" value={formik.values.it} onChange={
                  (e) => {
                    formik.setFieldValue("it_id", e.value?.id);
                    formik.setFieldValue("it", e.value);
                    validarId(e.value?.id as number);
                  }
                } emptyMessage="No hay cuentas de último nivel" />
            </div>
            <div>
              <p>IT por pagar</p>
              <Dropdown options={cuentas}
                className="w-80"
                valueTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                itemTemplate={(option) => {
                  return (option?.nombre + " - " + option?.codigo);
                }}
                filter optionLabel="nombre" value={formik.values.it_por_pagar} onChange={
                  (e) => {
                    formik.setFieldValue("it_por_pagar_id", e.value?.id);
                    formik.setFieldValue("it_por_pagar", e.value);
                    validarId(e.value?.id as number);
                  }
                } emptyMessage="No hay cuentas de último nivel" />
            </div>
          </div>
          <button className="bg-green-500 p-2 rounded-lg text-white mt-2" type="submit">Guardar</button>
        </div>
      </form >
    </div >
  </>;

};
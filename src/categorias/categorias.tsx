import { useEffect, useRef, useState } from "react";
import { baseUrl } from "../main";
import { useParams } from "react-router";
import { TreeTable } from "primereact/treetable";
import TreeMaker, { TreeMakerGeneric } from "../cuentas/TreeMaker";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useFormik } from "formik";
import { SvgEditar, SvgEliminar, SvgNuevo } from "../home/Home";

export function GetCategorias({ id }: { id: number; }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      reject("No token");
    }
    fetch(`${baseUrl}/api/categorias/listar`, {
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
  const [categorias, setCategorias] = useState<any>([]);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      GetCategorias({ id: Number(id) }).then((data: any) => {
        setCategorias(data);
        console.log(data);
        setTree(TreeMakerGeneric(data, null, "categoria_id"));
        console.log(TreeMakerGeneric(data, null, "categoria_id"));
      });
    }
  }, []);

  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [selectedKeys, setselectedKeys] = useState<any>([]);
  const [selectedNode, setselectedNode] = useState<any>(null);
  const [tree, setTree] = useState<any>([]);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      padre_id: null,
      empresa_id: id,
    },
    onSubmit: (values) => {
      console.log(values);
      fetch(`${baseUrl}/api/categorias/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          console.log(res, "First then");
          if (!res.ok) {
            //Throw error y body del error, su body es un json con un atributo message
            throw res;
          }
          return res.json();
        })
        .then((res) => {
          console.log(res, "second then");
          //setTree(TreeMakerGeneric(data, null, "categoria_id"));
          setTree(TreeMakerGeneric([...categorias, res], null, "categoria_id"));
          console.log(TreeMakerGeneric([...categorias, res]));
          setCategorias([...categorias, res]);
          toast.current?.show({
            severity: "success",
            summary: "Categoría creada",
            detail: "Se ha creado la categoría",
            life: 3000,
          });
        })
        .catch((err) => {
          err.text().then((errorMessage: any) => {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: (JSON.parse(errorMessage).message as string ?? "Error"),
              life: 3000,
            });
          });

        });
    },
  });
  const toast = useRef<Toast>(null);
  return <>
    <Toast ref={toast} />
    <div>
      <div className=" flex gap-2 items-end m-4">
        <div className="flex flex-col">
          <p>Nombre</p>
          <InputText
            value={formik.values.nombre}
            onChange={formik.handleChange}
            name="nombre"
          ></InputText>
        </div>
        <div className="flex flex-col ">
          <p>Descripción</p>
          <InputText
            className="w-96"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            name="descripcion"
          ></InputText>
        </div>
        <button
          className="bg-green-500 my-2 p-2 text-white rounded-lg "
          onClick={() => {
            formik.submitForm();
          }}
          type="submit"
        >
          <SvgNuevo mensaje={`${selectedNode?.data.id ? `Crear subcategoría de ${selectedNode?.data.nombre}` : "Crear categoría"}`} />
        </button>
        <button
          className="bg-yellow-500 my-2 p-2 text-white rounded-lg disabled:bg-yellow-800"
          disabled={selectedNode == null}

          onClick={() => {
            fetch(`${baseUrl}/api/categorias/actualizar`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                id: selectedNode?.data.id,
                nombre: formik.values.nombre,
                descripcion: formik.values.descripcion,
                padre_id: selectedNode?.data.padre_id,
                empresa_id: id,
              }),
            }).then((res) => {
              console.log(res, "First then");
              if (!res.ok) {
                //Throw error y body del error, su body es un json con un atributo message
                throw res;
              }
              return res.json();
            })
              .then((res) => {
                console.log(res, "second then");
                //setTree(TreeMakerGeneric(data, null, "categoria_id"));
                const newCats = categorias.filter((val: any) => val.id != selectedNode.data.id);
                setTree(TreeMakerGeneric([...newCats, res], null, "categoria_id"));
                setCategorias([...newCats, res]);
                toast.current?.show({
                  severity: "success",
                  summary: "Categoría editada",
                  detail: "Se ha editado la categoría",
                  life: 3000,
                });
                setselectedNode(null);
              })
              .catch((err) => {
                err.text().then((errorMessage: any) => {
                  toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: (JSON.parse(errorMessage).message as string ?? "Error"),
                    life: 3000,
                  });
                });
              });

          }}
          type="button"
        >
          <SvgEditar />
        </button>
        <button
          className="bg-red-500 my-2 p-2 text-white rounded-lg disabled:bg-red-800"
          disabled={selectedNode == null || selectedNode.children != null}
          onClick={() => {
            fetch(`${baseUrl}/api/categorias/eliminar`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                id: selectedNode?.data.id,
                empresa_id: id,
              }),
            })
              .then((res) => {
                console.log(res, "First then");
                if (!res.ok) {
                  //Throw error y body del error, su body es un json con un atributo message
                  throw res;
                }
                return res.json();
              })
              .then((res) => {
                console.log(res, "second then");
                //setTree(TreeMakerGeneric(data, null, "categoria_id"));
                const newCats = categorias.filter((val: any) => val.id != selectedNode.data.id);
                setTree(TreeMakerGeneric([...newCats], null, "categoria_id"));
                setCategorias([...newCats]);
                toast.current?.show({
                  severity: "success",
                  summary: "Categoría eliminada",
                  detail: "Se ha eliminado la categoría",
                  life: 3000,
                });
                setselectedNode(null);
              })
              .catch((err) => {
                err.text().then((errorMessage: any) => {
                  toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: (JSON.parse(errorMessage).message as string ?? "Error"),
                    life: 3000,
                  });
                });
              });
          }}
          type="button"
        >
          <SvgEliminar />
        </button>
      </div>
      <TreeTable value={tree} emptyMessage="Sin categorias"
        selectionMode="single"
        selectionKeys={selectedKeys}
        onSelectionChange={(e) => {
          console.log(e);
          setselectedKeys(e.value);
          console.log(selectedKeys);
        }}
        onSelect={(e) => {
          console.log(e.node, "data de nodo");
          setselectedNode(e.node);
          formik.setFieldValue("padre_id", e.node.data.id);
          formik.setFieldValue("nombre", e.node.data.nombre);
          formik.setFieldValue("descripcion", e.node.data.descripcion);

        }}
        onUnselect={(e) => {
          setselectedNode(null);
          formik.setFieldValue("padre_id", null);
        }}
        metaKeySelection={false}
        title='Plan de cuentas'
        expandedKeys={expandedKeys}
        onToggle={e => { console.log(e), setExpandedKeys(e.value); }}

      >
        <Column expander field="nombre" header="Nombre" />
        <Column field="descripcion" header="Descripción" />
      </TreeTable>
    </div >
  </>;
}
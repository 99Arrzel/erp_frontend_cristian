
import { useEffect, useState } from "react";
import { GetEmpresa } from "../home/Menu";
import { useParams } from "react-router";
import { fetchGestionPorEmpresa } from "../gestion/Gestion";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { fetchMonedas, urlReporte } from "../home/Home";
import { baseUrlReports } from "../main";

export default function Reportes() {
  const [empresa, setEmpresa] = useState<any>([]);
  const [monedas, setMonedas] = useState<any>([]);
  const [gestiones, setGestiones] = useState<any>([]);
  const [periodos, setPeriodos] = useState<any>([]); //Para la gestion seleccionada siempre
  const useparams = useParams();
  const id_param = useparams.id;
  useEffect(() => {
    GetEmpresa({ id: Number(id_param) }).then((res) => {
      console.log(res, "Empresa");
      setEmpresa(res);
    });
    fetchGestionPorEmpresa({ id: Number(id_param) }).then((res) => {
      console.log(res, "Gestiones");
      setGestiones(res);
    });
    fetchMonedas().then((res) => {
      console.log(res, "Monedas");
      setMonedas(res);
    });
  }, []);
  const [selectedGestion, setSelectedGestion] = useState<any>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<any>(null); //Para la gestion seleccionada siempre
  const [todos_periodos, setTodosPeriodos] = useState<boolean>(false); //Para la gestion seleccionada siempre
  const [selectedMoneda, setSelectedMoneda] = useState<any>(null); //Para la gestion seleccionada siempre
  return (
    <>
      <div className="m-4">
        <div className="bg-gray-200 rounded-lg p-2 flex gap-4 justify-evenly">
          <div>
            <h2 className="text-center text-2xl ">Reportes de balance inicial</h2>
            <div>
              <p>Gestion</p>
              <Dropdown
                value={selectedGestion}
                optionLabel="nombre"
                onChange={(e) => {
                  setSelectedGestion(e.value);
                }}
                options={gestiones}
                valueTemplate={(option) => {
                  console.log(option, "Option value");
                  return (
                    <div>
                      <span>{option?.nombre} - {new Date(option?.fecha_inicio).toLocaleDateString()} | {new Date(option?.fecha_fin).toLocaleDateString()}</span>
                    </div>
                  );
                }}

                itemTemplate={(option) => {
                  console.log(option, "Option");
                  return (
                    <div>
                      <span>{option?.nombre} - {new Date(option?.fecha_inicio).toLocaleDateString()} | {new Date(option?.fecha_fin).toLocaleDateString()}</span>

                    </div>);
                }}
              />
            </div>
            <div>
              <p>Periodo</p>
              <Dropdown
                disabled={!selectedGestion}
                value={selectedPeriodo}
                optionLabel="nombre"
                onChange={(e) => {
                  setSelectedPeriodo(e.value);
                }}
                options={selectedGestion?.periodos}
                valueTemplate={(option) => {
                  console.log(option, "Option value");
                  return (
                    <div>
                      <span>{option?.nombre} - {new Date(option?.fecha_inicio).toLocaleDateString()} | {new Date(option?.fecha_fin).toLocaleDateString()}</span>
                    </div>
                  );
                }}
                itemTemplate={(option) => {
                  console.log(option, "Option");
                  return (
                    <div>
                      <span>{option?.nombre} - {new Date(option?.fecha_inicio).toLocaleDateString()} | {new Date(option?.fecha_fin).toLocaleDateString()}</span>
                    </div>
                  );
                }}
              />
            </div>
            <div>
              <p>Moneda</p>
              <p>(Si la moneda seleecionada no coincide con el cambio registrado para el comprobante, se traera el valor de la moneda primaria)</p>
              <Dropdown
                disabled={!selectedPeriodo}
                value={selectedMoneda}
                optionLabel="nombre"
                onChange={(e) => {
                  setSelectedMoneda(e.value);
                }}
                options={monedas}
              />

            </div>
            <p>¿Traer de todos los periodos en la gestión?</p>
            <InputSwitch
              disabled={!selectedPeriodo}
              checked={todos_periodos}
              onChange={() => {
                setTodosPeriodos(!todos_periodos);
              }}
            />

          </div>
          <button
            disabled={!selectedPeriodo}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
            onClick={
              () => {

                window.open(urlReporte({
                  valores: {
                    sessionDecorator: "no",
                    chrome: "false",
                    decorate: "no",
                    toolbar: "false",
                    j_username: 'jasperadmin', j_password: 'bitnami',
                    id_gestion: todos_periodos ? selectedGestion?.id : null,
                    id_periodo: selectedPeriodo?.id,
                    id_moneda: selectedMoneda?.id,
                  }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2Fcuenta_report&standAlone=true`
                }), '_blank');
                console.log(selectedPeriodo, "Periodo seleccionado");
                console.log(todos_periodos, "Todos los periodos");
                console.log(selectedGestion, "Gestion seleccionada");
                console.log(selectedMoneda, "Moneda seleccionada");
              }
            }
          >Ver Reporte</button>
        </div>
        <h2>Reportes de balance inicial</h2>
        <h2>Reportes de libro diario</h2>
        <h2>Reportes de libro mayor</h2>
      </div>
    </>
  );
};

import { useEffect, useState } from "react";
import { GetEmpresa } from "../home/Menu";
import { useParams } from "react-router";
import { fetchGestionPorEmpresa } from "../gestion/Gestion";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { TabView, TabPanel } from 'primereact/tabview';
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
    GetEmpresa({ id: Number(id_param) }).then((res: any) => {
      console.log(res, "Empresa");
      setEmpresa(res);
      console.log(res.empresa_monedas[0].moneda_alternativa);
      console.log(res.empresa_monedas[0].moneda_principal);
      setMonedas([res.empresa_monedas[0].moneda_alternativa, res.empresa_monedas[0].moneda_principal]);
    });
    fetchGestionPorEmpresa({ id: Number(id_param) }).then((res) => {
      console.log(res, "Gestiones");
      setGestiones(res);
    });
  }, []);
  const [selectedGestionR_BI, setSelectedGestionR_BI] = useState<any>(null);
  const [selectedMonedaR_BI, setSelectedMonedaR_BI] = useState<any>(null); //Para la gestion seleccionada siempre
  const [selectedGestionR_SS, setSelectedGestionR_SS] = useState<any>(null);
  const [selectedMonedaR_SS, setSelectedMonedaR_SS] = useState<any>(null); //Para la gestion seleccionada siempre


  const [selectedGestionR_LD, setSelectedGestionR_LD] = useState<any>(null);
  const [selectedPeriodoR_LD, setSelectedPeriodoR_LD] = useState<any>(null); //Para la gestion seleccionada siempre
  const [todos_periodos_R_LD, setTodosPeriodosR_LD] = useState<boolean>(false); //Para la gestion seleccionada siempre
  const [selectedMonedaR_LD, setSelectedMonedaR_LD] = useState<any>(null); //Para la gestion seleccionada siempre

  const [selectedGestionR_LM, setSelectedGestionR_LM] = useState<any>(null);
  const [selectedPeriodoR_LM, setSelectedPeriodoR_LM] = useState<any>(null); //Para la gestion seleccionada siempre
  const [todos_periodos_R_LM, setTodosPeriodosR_LM] = useState<boolean>(false); //Para la gestion seleccionada siempre
  const [selectedMonedaR_LM, setSelectedMonedaR_LM] = useState<any>(null); //Para la gestion seleccionada siempre
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header='Balance Inicial' prevButton={""} nextButton={""} closeIcon={""}>
          <div className="bg-gray-200 rounded-lg p-2 flex gap-4 justify-evenly">
            <div>
              <h2 className="text-center text-2xl ">Reportes de balance inicial</h2>
              <div>
                <p>Gestion</p>
                <Dropdown
                  value={selectedGestionR_BI}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedGestionR_BI(e.value);
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
                <p>Moneda</p>
                <p>(Si la moneda seleecionada no coincide con el cambio registrado para el comprobante, se traera el valor de la moneda primaria)</p>
                <Dropdown
                  disabled={!selectedGestionR_BI}
                  value={selectedMonedaR_BI}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedMonedaR_BI(e.value);
                  }}
                  options={monedas}
                />

              </div>

            </div>
            <button
              disabled={!selectedGestionR_BI || !selectedMonedaR_BI}
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
                      id_gestion: selectedGestionR_BI?.id,
                      id_moneda: selectedMonedaR_BI?.id,
                    }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2FReporteBalanceInicial&standAlone=true`
                  }), '_blank');
                }
              }
            >Ver Reporte</button>
          </div>
        </TabPanel>
        <TabPanel header='Libro Diario' prevButton={""} nextButton={""} closeIcon={""}>
          <div className="bg-gray-200 rounded-lg p-2 flex gap-4 justify-evenly ">
            <div>
              <h2 className="text-center text-2xl ">Reportes de libro diario</h2>
              <div>
                <p>Gestion</p>
                <Dropdown
                  value={selectedGestionR_LD}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedGestionR_LD(e.value);
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

              Periodos de la gestión
              <div>
                <p>Periodo</p>
                <Dropdown
                  disabled={!selectedGestionR_LD}
                  value={selectedPeriodoR_LD}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedPeriodoR_LD(e.value);
                  }}
                  options={selectedGestionR_LD?.periodos}
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
                  disabled={!selectedGestionR_LD}
                  value={selectedMonedaR_LD}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedMonedaR_LD(e.value);
                  }}
                  options={monedas}
                />

              </div>

              <p>¿Traer de todos los periodos en la gestión?</p>
              <InputSwitch
                disabled={!selectedPeriodoR_LD}
                checked={todos_periodos_R_LD}
                onChange={() => {
                  setTodosPeriodosR_LD(!todos_periodos_R_LD);
                }}
              />
            </div>
            <button
              disabled={!selectedGestionR_LD || !selectedMonedaR_LD}
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
                      id_gestion: todos_periodos_R_LD ? selectedGestionR_LD?.id : "",
                      id_periodo: selectedPeriodoR_LD?.id,
                      id_moneda: selectedMonedaR_LD?.id,
                    }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ%2FLibro_diario_rep&reportUnit=%2FZ%2FLibro_diario_rep%2FMainLibroDiario&standAlone=true`
                  }), '_blank');
                }
              }
            >Ver Reporte</button>
          </div>
        </TabPanel>
        <TabPanel header='Libro Mayor' prevButton={""} nextButton={""} closeIcon={""}>
          <div className="bg-gray-200 rounded-lg p-2 flex gap-4 justify-evenly ">
            <div>
              <h2 className="text-center text-2xl ">Reportes de libro Mayor</h2>
              <div>
                <p>Gestion</p>
                <Dropdown
                  value={selectedGestionR_LM}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedGestionR_LM(e.value);
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

              Periodos de la gestión
              <div>
                <p>Periodo</p>
                <Dropdown
                  disabled={!selectedGestionR_LM}
                  value={selectedPeriodoR_LM}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedPeriodoR_LM(e.value);
                  }}
                  options={selectedGestionR_LM?.periodos}
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
                  disabled={!selectedGestionR_LM}
                  value={selectedMonedaR_LM}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedMonedaR_LM(e.value);
                  }}
                  options={monedas}
                />

              </div>

              <p>¿Traer de todos los periodos en la gestión?</p>
              <InputSwitch
                disabled={!selectedPeriodoR_LM}
                checked={todos_periodos_R_LM}
                onChange={() => {
                  setTodosPeriodosR_LM(!todos_periodos_R_LM);
                }}
              />
            </div>
            <button
              disabled={!selectedGestionR_LM || !selectedMonedaR_LM}
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
                      id_gestion: todos_periodos_R_LM ? selectedGestionR_LM?.id : "",
                      id_periodo: selectedPeriodoR_LM?.id,
                      id_moneda: selectedMonedaR_LM?.id,
                    }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ%2FLibro_mayor_rep&reportUnit=%2FZ%2FLibro_mayor_rep%2Flm_main&standAlone=true`
                  }), '_blank');
                }
              }
            >Ver Reporte</button>
          </div>
        </TabPanel>
        <TabPanel header='Sumas y Saldos' prevButton={""} nextButton={""} closeIcon={""}>
          <div className="bg-gray-200 rounded-lg p-2 flex gap-4 justify-evenly">
            <div>
              <h2 className="text-center text-2xl ">Reportes Comprobación de Sumas y Saldos</h2>
              <div>
                <p>Gestion</p>
                <Dropdown
                  value={selectedGestionR_SS}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedGestionR_SS(e.value);
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
                <p>Moneda</p>
                <p>(Si la moneda seleecionada no coincide con el cambio registrado para el comprobante, se traera el valor de la moneda primaria)</p>
                <Dropdown
                  disabled={!selectedGestionR_SS}
                  value={selectedMonedaR_SS}
                  optionLabel="nombre"
                  onChange={(e) => {
                    setSelectedMonedaR_SS(e.value);
                  }}
                  options={monedas}
                />

              </div>

            </div>
            <button
              disabled={!selectedGestionR_SS || !selectedMonedaR_SS}
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
                      id_gestion: selectedGestionR_SS?.id,
                      id_moneda: selectedMonedaR_SS?.id,
                    }, urlBase: `${baseUrlReports}/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FZ&reportUnit=%2FZ%2FReporteComprobacionSumasYSaldo&standAlone=true`
                  }), '_blank');
                }
              }
            >Ver Reporte</button>
          </div>
        </TabPanel>

      </TabView >
    </>
  );
};
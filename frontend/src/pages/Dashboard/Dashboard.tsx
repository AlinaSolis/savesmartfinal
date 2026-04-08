import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Col,
  Divider,
  List,
  Modal,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
  Tooltip,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  TrophyOutlined,
  HistoryOutlined,
  WalletOutlined,
  PieChartOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Layout } from "../../layout/Layout";

// --- IMPORTACIÓN DE IMÁGENES ---
import sieteDiasAhorrando from "../../assets/insignias/7_Dias_Ahorrando.png";
import treintaDiasSinFallar from "../../assets/insignias/30_Dias_Sin_Fallar.png";
import cazadorDeGastosHormiga from "../../assets/insignias/Cazador_de_Gastos_Hormiga.png";
import cerditoFeliz from "../../assets/insignias/Cerdito_Feliz.png";
import compradorInteligente from "../../assets/insignias/Comprador_Inteligente.png";
import constanteComoTortuga from "../../assets/insignias/Constante_como_Tortuga.png";
import disciplinaFinanciera from "../../assets/insignias/Disciplina_Financiera.png";
import educacionAsegurada from "../../assets/insignias/Educacion_Asegurada.png";
import maestroDelAhorro from "../../assets/insignias/Maestro_del_Ahorro.png";
import metaCreada from "../../assets/insignias/Meta_creada.png";
import metaMillennial from "../../assets/insignias/Meta_Millennial.png";
import miPrimerAuto from "../../assets/insignias/Mi_Primer_Auto.png";
import planificador from "../../assets/insignias/Planificador.png";
import primerAhorro from "../../assets/insignias/Primer_ahorro.png";
import primerChequeoDeGastos from "../../assets/insignias/Primer_chequeo_de_gastos.png";
import primeraMetaAlcanzada from "../../assets/insignias/Primera_Meta_Alcanzada.png";
import rachaDe3Meses from "../../assets/insignias/Racha_de_3_Meses.png";
import usuarioVip from "../../assets/insignias/Usuario_VIP.png";
import viajeLogrado from "../../assets/insignias/Viaje_Logrado.png";
import visionFinanciera from "../../assets/insignias/Vision_Financiera.png";

const { Title, Text } = Typography;

type Movimiento = {
  id: string;
  tipo: "gasto" | "ingreso";
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
};

type Insignia = {
  id: string;
  nombre: string;
  descripcion: string;
  desbloqueada: boolean;
  imagen: string;
  progreso: number;
};

function dinero(n: number) {
  return Number(n).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
}

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// Catálogo base con todas las imágenes
const insigniasMock: Insignia[] = [
  { id: "1", nombre: "Primer Ahorro", descripcion: "Cuando el usuario registra su primer depósito.", desbloqueada: false, imagen: primerAhorro, progreso: 0 },
  { id: "2", nombre: "Meta Creada", descripcion: "Por crear su primera meta de ahorro.", desbloqueada: false, imagen: metaCreada, progreso: 0 },
  { id: "3", nombre: "Primer chequeo de gastos", descripcion: "Por su primera consulta financiera.", desbloqueada: false, imagen: primerChequeoDeGastos, progreso: 0 },
  { id: "4", nombre: "Cerdito Feliz", descripcion: "$5,000 acumulados.", desbloqueada: false, imagen: cerditoFeliz, progreso: 0 },
  { id: "5", nombre: "Constante como Tortuga", descripcion: "$10,000 acumulados.", desbloqueada: false, imagen: constanteComoTortuga, progreso: 0 },
  { id: "6", nombre: "Visión Financiera", descripcion: "$30,000 acumulados.", desbloqueada: false, imagen: visionFinanciera, progreso: 0 },
  { id: "7", nombre: "Maestro del Ahorro", descripcion: "$60,000 acumulados.", desbloqueada: false, imagen: maestroDelAhorro, progreso: 62 },
  { id: "8", nombre: "Meta Millennial", descripcion: "$100,000 acumulados.", desbloqueada: false, imagen: metaMillennial, progreso: 35 },
  { id: "9", nombre: "7 Días Ahorrando", descripcion: "Una semana completa ahorrando.", desbloqueada: false, imagen: sieteDiasAhorrando, progreso: 0 },
  { id: "10", nombre: "30 Días Sin Fallar", descripcion: "Un mes completo de constancia.", desbloqueada: false, imagen: treintaDiasSinFallar, progreso: 24 },
  { id: "11", nombre: "Racha de 3 Meses", descripcion: "Tres meses ahorrando sin fallar.", desbloqueada: false, imagen: rachaDe3Meses, progreso: 40 },
  { id: "12", nombre: "Disciplina Financiera", descripcion: "6 meses ahorrando seguido.", desbloqueada: false, imagen: disciplinaFinanciera, progreso: 18 },
  { id: "13", nombre: "Usuario VIP", descripcion: "1 año usando la app.", desbloqueada: false, imagen: usuarioVip, progreso: 10 },
  { id: "14", nombre: "Primera Meta Alcanzada", descripcion: "Cumple tu primera meta.", desbloqueada: false, imagen: primeraMetaAlcanzada, progreso: 0 },
  { id: "15", nombre: "Viaje Logrado", descripcion: "Meta de viaje alcanzada.", desbloqueada: false, imagen: viajeLogrado, progreso: 55 },
  { id: "16", nombre: "Educación Asegurada", descripcion: "Meta educativa completada.", desbloqueada: false, imagen: educacionAsegurada, progreso: 30 },
  { id: "17", nombre: "Mi Primer Auto", descripcion: "Meta para tu primer auto.", desbloqueada: false, imagen: miPrimerAuto, progreso: 48 },
  { id: "18", nombre: "Cazador de Gastos Hormiga", descripcion: "Reduce gastos pequeños.", desbloqueada: false, imagen: cazadorDeGastosHormiga, progreso: 70 },
  { id: "19", nombre: "Comprador Inteligente", descripcion: "Reduce gastos un 20%.", desbloqueada: false, imagen: compradorInteligente, progreso: 52 },
  { id: "20", nombre: "Planificador", descripcion: "Usa presupuestos mensuales.", desbloqueada: false, imagen: planificador, progreso: 65 },
];

function KpiCard(props: {
  titulo: string;
  valor: string;
  icono: React.ReactNode;
  glow?: "primario" | "secundario" | "acento";
}) {
  const glowClass =
    props.glow === "primario"
      ? "glow-primario"
      : props.glow === "secundario"
      ? "glow-secundario"
      : props.glow === "acento"
      ? "glow-acento"
      : "";

  return (
    <Card className="glass tarjeta-kpi tarjeta-compacta kpi-card-hover">
      <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
        <div className={`icono-kpi ${glowClass}`}>{props.icono}</div>
      </Space>
      <div style={{ marginTop: 12 }}>
        <div className="texto-muted">{props.titulo}</div>
        <div className="kpi-valor">{props.valor}</div>
      </div>
    </Card>
  );
}

function InsigniaItem({ item }: { item: Insignia }) {
  return (
    <Tooltip
      title={
        <div style={{ maxWidth: 240 }}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>{item.nombre}</div>
          <div style={{ opacity: 0.85, marginBottom: 8 }}>{item.descripcion}</div>
          <div style={{ fontSize: 12, marginBottom: 6 }}>Progreso: {item.progreso}%</div>
          <Progress
            percent={item.progreso}
            showInfo={false}
            strokeColor={item.desbloqueada ? "#10b981" : "#00d4ff"}
            trailColor="rgba(255,255,255,0.08)"
            size="small"
          />
        </div>
      }
    >
      <div className={`insignia-dashboard ${item.desbloqueada ? "insignia-on" : "insignia-off"}`}>
        <div className="insignia-dashboard-icono">
          <img
            src={item.imagen}
            alt={item.nombre}
            className={`insignia-dashboard-img ${
              item.nombre === "Mi Primer Auto" ? "img-auto-dashboard" : "img-normal-dashboard"
            }`}
          />
        </div>
      </div>
    </Tooltip>
  );
}

export function Dashboard() {
  const [modalInsignias, setModalInsignias] = useState(false);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [insignias, setInsignias] = useState<Insignia[]>(insigniasMock);
  const [statsBD, setStatsBD] = useState({ balance: 0, ingresos: 0, gastos: 0, ahorro: 0 });
  const [cargando, setCargando] = useState(true);

  // EFECTO PARA TRAER DATOS DEL BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Estadísticas y movimientos
        const dashRes = await axios.get("http://127.0.0.1:8000/api/dashboard");
        setMovimientos(dashRes.data.recent_transactions);
        
        setStatsBD({
          balance: parseFloat(dashRes.data.stats.balance_total),
          ingresos: parseFloat(dashRes.data.stats.ingresos_mes),
          gastos: parseFloat(dashRes.data.stats.gastos_mes),
          ahorro: parseFloat(dashRes.data.stats.ahorro_mes) || 0
        });

        // 2. Insignias desbloqueadas por el usuario
        const userBadgesRes = await axios.get("http://127.0.0.1:8000/api/user/badges");
        
        // Extraemos solo los nombres (títulos) de las insignias que sí ganó
        const unlockedTitles = userBadgesRes.data.map((b: { titulo: string }) => b.titulo);

        // Mapeamos nuestro catálogo local y encendemos las que el backend nos diga
        const updatedInsignias = insigniasMock.map(ins => ({
          ...ins,
          desbloqueada: unlockedTitles.includes(ins.nombre),
          progreso: unlockedTitles.includes(ins.nombre) ? 100 : ins.progreso
        }));

        setInsignias(updatedInsignias);

      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  const resumen = useMemo(() => {
    const metaAhorro = 1500;
    const progresoAhorro = metaAhorro > 0 ? Math.min((statsBD.ahorro / metaAhorro) * 100, 100) : 0;
    const presupuesto = 3000;
    const usoPresupuesto = presupuesto > 0 ? Math.min((statsBD.gastos / presupuesto) * 100, 100) : 0;

    return {
      gastos: statsBD.gastos,
      ingresos: statsBD.ingresos,
      balance: statsBD.balance,
      ahorro: statsBD.ahorro,
      metaAhorro,
      progresoAhorro,
      presupuesto,
      usoPresupuesto,
    };
  }, [statsBD]);

  const insigniasDesbloqueadas = useMemo(() => insignias.filter((i) => i.desbloqueada), [insignias]);
  const insigniasDestacadas = useMemo(() => insigniasDesbloqueadas.slice(0, 4), [insigniasDesbloqueadas]);

  if (cargando) {
    return <Layout><div style={{ color: 'white', padding: 50, textAlign: 'center' }}>Cargando información...</div></Layout>;
  }

  return (
    <Layout>
      <div className="dashboard-grid">
        <div className="dashboard-header">
          <div>
            <Title level={1} className="titulo-dashboard">Inicio</Title>
            <Text className="texto-muted">
              Controla tus gastos, registra ingresos y avanza en tus metas.
            </Text>
          </div>
          <Tag color={resumen.balance >= 0 ? "cyan" : "red"} className="etiqueta-pill etiqueta-balance">
            {resumen.balance >= 0 ? "Balance estable" : "Balance en riesgo"}
          </Tag>
        </div>

        <Row gutter={[16, 16]} className="fila-superior">
          <Col xs={24} lg={14}>
            <Card className="glass hero-fintech hero-alto">
              <div className="orbe orbe-1" />
              <div className="orbe orbe-2" />
              <div className="hero-contenido">
                <Title level={3} className="hero-titulo">¡Bienvenido de vuelta!</Title>
                <Text className="texto-muted hero-texto">
                  Hoy vas bien: revisa tus movimientos y ajusta tu presupuesto si es necesario.
                </Text>
                <Space wrap style={{ marginTop: 14 }}>
                  <Button size="middle" className="btn-fintech btn-primario glow-primario" icon={<ArrowDownOutlined />}>
                    Registrar gasto
                  </Button>
                  <Button size="middle" className="btn-fintech btn-secundario glow-secundario" icon={<ArrowUpOutlined />}>
                    Registrar ingreso
                  </Button>
                  <Button size="middle" className="btn-fintech btn-neutro" icon={<TrophyOutlined />}>
                    Ver metas
                  </Button>
                </Space>
                <Divider className="divider-suave" />
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={12}>
                    <Card className="glass subcard tarjeta-compacta panel-resumen">
                      <Space style={{ width: "100%", justifyContent: "space-between" }}>
                        <Space>
                          <SafetyCertificateOutlined style={{ color: "#10b981" }} />
                          <Text className="panel-titulo">Meta de ahorro</Text>
                        </Space>
                        <Text className="texto-muted">{dinero(resumen.metaAhorro)}</Text>
                      </Space>
                      <div style={{ marginTop: 10 }}>
                        <Progress percent={Math.round(resumen.progresoAhorro)} showInfo={false} strokeColor="#10b981" trailColor="rgba(255,255,255,0.08)" />
                        <div className="meta-linea">
                          <span>Actual: {dinero(resumen.ahorro)}</span>
                          <span>{Math.round(resumen.progresoAhorro)}%</span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card className="glass subcard tarjeta-compacta panel-resumen">
                      <Space style={{ width: "100%", justifyContent: "space-between" }}>
                        <Space>
                          <PieChartOutlined style={{ color: "#f59e0b" }} />
                          <Text className="panel-titulo">Presupuesto</Text>
                        </Space>
                        <Text className="texto-muted">{dinero(resumen.presupuesto)}</Text>
                      </Space>
                      <div style={{ marginTop: 10 }}>
                        <Progress percent={Math.round(resumen.usoPresupuesto)} showInfo={false} strokeColor="#f59e0b" trailColor="rgba(255,255,255,0.08)" />
                        <div className="meta-linea">
                          <span>Gasto: {dinero(resumen.gastos)}</span>
                          <span>{Math.round(resumen.usoPresupuesto)}%</span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <div className="kpi-grid kpi-alto">
              <KpiCard titulo="Gastos del mes" valor={dinero(resumen.gastos)} glow="primario" icono={<WalletOutlined style={{ color: "#ef4444", fontSize: 22 }} />} />
              <KpiCard titulo="Ahorro del mes" valor={dinero(resumen.ahorro)} glow="acento" icono={<SafetyCertificateOutlined style={{ color: "#10b981", fontSize: 22 }} />} />
              <KpiCard titulo="Ingresos del mes" valor={dinero(resumen.ingresos)} glow="secundario" icono={<ArrowUpOutlined style={{ color: "#10b981", fontSize: 22 }} />} />
              <KpiCard titulo="Balance" valor={dinero(resumen.balance)} icono={<WalletOutlined style={{ color: "#00d4ff", fontSize: 22 }} />} />
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 2 }}>
          <Col xs={24} lg={16}>
            <Card
              className="glass"
              title={<Space><HistoryOutlined /><span style={{ color: "#f5f5f5" }}>Últimos movimientos</span></Space>}
              extra={<Text className="texto-muted">Últimos {movimientos.length}</Text>}
              classNames={{ body: "card-body-sin-padding" }}
            >
              <div className="lista-scroll">
                <List
                  dataSource={movimientos}
                  locale={{ emptyText: <span className="texto-muted">Aún no hay movimientos registrados.</span> }}
                  renderItem={(m) => {
                    const esGasto = m.tipo === "gasto";
                    return (
                      <List.Item className="movimiento-list-item">
                        <div className="item-movimiento">
                          <Tag color={esGasto ? "red" : "green"} className="etiqueta-pill etiqueta-movimiento">
                            {esGasto ? "Gasto" : "Ingreso"}
                          </Tag>
                          <div className="mov-info">
                            <div className="mov-titulo">{m.descripcion}</div>
                            <div className="mov-meta">{m.categoria} • {formatearFecha(m.fecha)}</div>
                          </div>
                          <div className={`mov-monto ${esGasto ? "monto-negativo" : "monto-positivo"}`}>
                            {esGasto ? "-" : "+"}{dinero(m.monto)}
                          </div>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              className="glass insignias-dashboard-card"
              title={<Space><TrophyOutlined /><span style={{ color: "#f5f5f5" }}>Insignias</span></Space>}
              extra={<Button type="link" onClick={() => setModalInsignias(true)} style={{ color: "#00d4ff", paddingInline: 0 }}>Ver todas</Button>}
            >
              <div className="insignias-grid-dashboard">
                {insigniasDestacadas.map((i) => (
                  <InsigniaItem key={i.id} item={i} />
                ))}
              </div>
              <Divider className="divider-suave" />
              <Text className="texto-muted texto-insignias-resumen">
                Has desbloqueado {insigniasDesbloqueadas.length} de {insignias.length} insignias.
              </Text>
            </Card>
          </Col>
        </Row>

        <Modal
          title={<span style={{ color: "#f5f5f5" }}>Todas tus insignias</span>}
          open={modalInsignias}
          onCancel={() => setModalInsignias(false)}
          footer={null}
          width={820}
          className="glass" 
          styles={{
            header: { 
              background: "transparent", 
              borderBottom: "1px solid rgba(255,255,255,0.06)" 
            },
            body: { 
              paddingTop: 18, 
              paddingBottom: 12 
            },
          }}
        >
          <div className="insignias-grid-dashboard">
            {insignias.map((i) => (
              <InsigniaItem key={i.id} item={i} />
            ))}
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
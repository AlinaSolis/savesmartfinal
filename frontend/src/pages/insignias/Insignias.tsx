import React, { useState, useEffect } from "react";
import { Card, Col, Progress, Row, Typography, Layout as AntLayout } from "antd";
import Sidebar from "../../components/Layout/Sidebar";
import apiBadges from "../../services/apiBadges";
import { notificacionesService } from "../../services/notificacionesService";
import { useAuth } from '../../context/AuthContext'

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
const { Content } = AntLayout;

type Insignia = {
  id: string;
  nombre: string;
  descripcion: string;
  desbloqueada: boolean;
  imagen: string;
  progreso: number;
  categoria: string;
};

// Renombramos la constante a insigniasMock para usarla como nuestro "diccionario base"
const insigniasMock: Insignia[] = [
  { id: "1", nombre: "Primer Ahorro", descripcion: "Cuando el usuario registra su primer depósito.", desbloqueada: false, imagen: primerAhorro, progreso: 0, categoria: "Primeras acciones" },
  { id: "2", nombre: "Meta Creada", descripcion: "Por crear su primera meta de ahorro.", desbloqueada: false, imagen: metaCreada, progreso: 0, categoria: "Primeras acciones" },
  { id: "3", nombre: "Primer chequeo de gastos", descripcion: "Por su primera consulta financiera.", desbloqueada: false, imagen: primerChequeoDeGastos, progreso: 0, categoria: "Primeras acciones" },
  { id: "4", nombre: "Cerdito Feliz", descripcion: "$5,000 acumulados.", desbloqueada: false, imagen: cerditoFeliz, progreso: 0, categoria: "Cantidad ahorrada" },
  { id: "5", nombre: "Constante como Tortuga", descripcion: "$10,000 acumulados.", desbloqueada: false, imagen: constanteComoTortuga, progreso: 0, categoria: "Cantidad ahorrada" },
  { id: "6", nombre: "Visión Financiera", descripcion: "$30,000 acumulados.", desbloqueada: false, imagen: visionFinanciera, progreso: 0, categoria: "Cantidad ahorrada" },
  { id: "7", nombre: "Maestro del Ahorro", descripcion: "$60,000 acumulados.", desbloqueada: false, imagen: maestroDelAhorro, progreso: 62, categoria: "Cantidad ahorrada" },
  { id: "8", nombre: "Meta Millennial", descripcion: "$100,000 acumulados.", desbloqueada: false, imagen: metaMillennial, progreso: 35, categoria: "Cantidad ahorrada" },
  { id: "9", nombre: "7 Días Ahorrando", descripcion: "Una semana completa ahorrando.", desbloqueada: false, imagen: sieteDiasAhorrando, progreso: 0, categoria: "Constancia" },
  { id: "10", nombre: "30 Días Sin Fallar", descripcion: "Un mes completo de constancia.", desbloqueada: false, imagen: treintaDiasSinFallar, progreso: 24, categoria: "Constancia" },
  { id: "11", nombre: "Racha de 3 Meses", descripcion: "Tres meses ahorrando sin fallar.", desbloqueada: false, imagen: rachaDe3Meses, progreso: 40, categoria: "Constancia" },
  { id: "12", nombre: "Disciplina Financiera", descripcion: "6 meses ahorrando seguido.", desbloqueada: false, imagen: disciplinaFinanciera, progreso: 18, categoria: "Constancia" },
  { id: "13", nombre: "Usuario VIP", descripcion: "1 año usando la app.", desbloqueada: false, imagen: usuarioVip, progreso: 10, categoria: "Constancia" },
  { id: "14", nombre: "Primera Meta Alcanzada", descripcion: "Cumple tu primera meta.", desbloqueada: false, imagen: primeraMetaAlcanzada, progreso: 0, categoria: "Metas cumplidas" },
  { id: "15", nombre: "Viaje Logrado", descripcion: "Meta de viaje alcanzada.", desbloqueada: false, imagen: viajeLogrado, progreso: 55, categoria: "Metas cumplidas" },
  { id: "16", nombre: "Educación Asegurada", descripcion: "Meta educativa completada.", desbloqueada: false, imagen: educacionAsegurada, progreso: 30, categoria: "Metas cumplidas" },
  { id: "17", nombre: "Mi Primer Auto", descripcion: "Meta para tu primer auto.", desbloqueada: false, imagen: miPrimerAuto, progreso: 48, categoria: "Metas cumplidas" },
  { id: "18", nombre: "Cazador de Gastos Hormiga", descripcion: "Reduce gastos pequeños.", desbloqueada: false, imagen: cazadorDeGastosHormiga, progreso: 70, categoria: "Hábitos financieros" },
  { id: "19", nombre: "Comprador Inteligente", descripcion: "Reduce gastos un 20%.", desbloqueada: false, imagen: compradorInteligente, progreso: 52, categoria: "Hábitos financieros" },
  { id: "20", nombre: "Planificador", descripcion: "Usa presupuestos mensuales.", desbloqueada: false, imagen: planificador, progreso: 65, categoria: "Hábitos financieros" },
];

const categorias = [
  "Primeras acciones",
  "Cantidad ahorrada",
  "Constancia",
  "Metas cumplidas",
  "Hábitos financieros",
];

function InsigniaCard({ item }: { item: Insignia }) {
  const esAuto = item.nombre === "Mi Primer Auto";

  return (
    <Card className={`glass insignia-card-page ${item.desbloqueada ? "" : "insignia-off"}`}>
      <div className="insignia-card-icono">
        <img
          src={item.imagen}
          alt={item.nombre}
          className={`insignia-card-img ${esAuto ? "img-auto" : "img-normal"}`}
        />
      </div>
      <div className="insignia-card-titulo">{item.nombre}</div>
      <div className="insignia-card-texto">{item.descripcion}</div>
      <div className="insignia-progreso-wrap">
        <div className="insignia-progreso-top">
          <span>Progreso</span>
          <span>{item.progreso}%</span>
        </div>
        <Progress
          percent={item.progreso}
          showInfo={false}
          strokeColor={item.desbloqueada ? "#10b981" : "#00d4ff"}
          trailColor="rgba(255,255,255,0.08)"
          size="small"
        />
      </div>
    </Card>
  );
}

export function Insignias() {
  const { userId } = useAuth()
  // Estado con la lista dinámica conectada a la BD
  const [insigniasList, setInsigniasList] = useState<Insignia[]>(insigniasMock);
  const [cargando, setCargando] = useState(true);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);

  // Obtener notificaciones no leídas (igual que en NotificacionesPage)
  useEffect(() => {
    const fetchNotificaciones = async () => {
      if (!userId) return;
      try {
        const data = await notificacionesService.getNotificaciones(userId);
        const noLeidas = data.notificaciones?.filter((n: any) => !n.leida).length || 0;
        setNotificacionesNoLeidas(noLeidas);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    };
    fetchNotificaciones();
    const intervalo = setInterval(fetchNotificaciones, 10000);
    return () => clearInterval(intervalo);
  }, []);

  // Obtener insignias desde el backend
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const userBadgesRes = await apiBadges.get("/user/badges");
        
        // Obtenemos los títulos de las insignias que el usuario ya ganó
        const unlockedTitles = userBadgesRes.data.map((b: { titulo: string }) => b.titulo);

        // Actualizamos nuestra lista encendiendo las que coincidan
        const updatedInsignias = insigniasMock.map((ins) => ({
          ...ins,
          desbloqueada: unlockedTitles.includes(ins.nombre),
          progreso: unlockedTitles.includes(ins.nombre) ? 100 : ins.progreso,
        }));

        setInsigniasList(updatedInsignias);
      } catch (error) {
        console.error("Error al cargar insignias desde el servidor:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchBadges();
  }, []);

  if (cargando) {
    return (
      <AntLayout style={{ minHeight: '100vh', background: '#0f1117' }}>
        <Sidebar notificacionesNoLeidas={notificacionesNoLeidas} />
        <Content style={{ padding: '24px', background: '#0f1117' }}>
          <div style={{ color: 'white', padding: 50, textAlign: 'center' }}>Cargando tu vitrina de logros...</div>
        </Content>
      </AntLayout>
    );
  }

  return (
    <AntLayout style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Sidebar notificacionesNoLeidas={notificacionesNoLeidas} />
      <Content style={{ padding: '24px', background: '#0f1117' }}>
        <div className="dashboard-grid">
          <div>
            <Title level={1} className="titulo-dashboard">
              Mis insignias
            </Title>
            <Text className="texto-muted">
              Visualiza tus logros y progreso dentro de SaveSmart.
            </Text>
          </div>

          {categorias.map((categoria) => {
            // Filtramos usando nuestro nuevo estado dinámico
            const items = insigniasList.filter((insignia) => insignia.categoria === categoria);
            
            if (items.length === 0) return null;

            return (
              <Card
                key={categoria}
                className="glass"
                title={<span style={{ color: "#f5f5f5" }}>{categoria}</span>}
              >
                <Row gutter={[16, 16]}>
                  {items.map((item) => (
                    <Col key={item.id} xs={24} sm={12} lg={8} xl={6}>
                      <InsigniaCard item={item} />
                    </Col>
                  ))}
                </Row>
              </Card>
            );
          })}
        </div>
      </Content>
    </AntLayout>
  );
}
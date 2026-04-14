import React, { useMemo, useState, useEffect, useCallback } from "react";
import { metasService, type Meta } from "../../services/metasService";
import "../../styles/app.css";
import { useNavigate } from "react-router-dom";
import apiBadges from "../../services/apiBadges";
import { notificacionesService } from "../../services/notificacionesService";
import { transactionService } from "../../services/transactionService";
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
  Layout as AntLayout, // renombramos para evitar conflicto
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
import Sidebar from "../../components/Layout/Sidebar"; // 👈 importamos el Sidebar igual que en NotificacionesPage
import { useAuth } from "../../context/AuthContext";

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

function formatearFecha(fecha: string) {
  // La fecha ya viene formateada desde el backend ("09 Apr 2026"), la retornamos directamente
  return fecha;
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

// ─── Metas / Goals ───────────────────────────────────────────────────────────
const META_COLORS = [
  { value: '#22d3ee' }, { value: '#10b981' }, { value: '#a855f7' },
  { value: '#f59e0b' }, { value: '#f43f5e' }, { value: '#3b82f6' },
];

const META_EMOJIS = ['✈️','🚗','🏠','📚','💍','🏥','💻','🎓','🌴','🎯','💰','🏖️'];

function GoalsModal({ isOpen, onClose, userId }: { isOpen: boolean; onClose: () => void; userId: number | null }) {
  const [metas, setMetas] = React.useState<Meta[]>([]);
  const [loadingMetas, setLoadingMetas] = React.useState(false);
  const [savingMeta, setSavingMeta] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [editingMeta, setEditingMeta] = React.useState<Meta | null>(null);
  const [nombre, setNombre] = React.useState('');
  const [emoji, setEmoji] = React.useState('✈️');
  const [objetivo, setObjetivo] = React.useState('');
  const [ahorrado, setAhorrado] = React.useState('');
  const [color, setColor] = React.useState('#22d3ee');
  const [descripcion, setDescripcion] = React.useState('');

  // Cargar metas al abrir
  React.useEffect(() => {
    if (!isOpen || !userId) return;
    setLoadingMetas(true);
    metasService.getAll(userId)
      .then(setMetas)
      .catch(() => setMetas([]))
      .finally(() => setLoadingMetas(false));
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const openNew = () => {
    setEditingMeta(null);
    setNombre(''); setEmoji('✈️'); setObjetivo(''); setAhorrado(''); setColor('#22d3ee'); setDescripcion('');
    setShowForm(true);
  };

  const openEdit = (m: Meta) => {
    setEditingMeta(m);
    setNombre(m.nombre); setEmoji(m.emoji); setObjetivo(String(m.objetivo));
    setAhorrado(String(m.ahorrado)); setColor(m.color); setDescripcion(m.descripcion || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !objetivo || !userId) return;
    setSavingMeta(true);
    const payload = {
      user_id: userId,
      nombre,
      emoji,
      descripcion,
      objetivo: parseFloat(objetivo),
      ahorrado: parseFloat(ahorrado || '0'),
      color,
    };
    try {
      if (editingMeta) {
        const updated = await metasService.update(editingMeta.id, payload);
        setMetas(prev => prev.map(m => m.id === editingMeta.id ? updated : m));
      } else {
        const created = await metasService.create(payload);
        setMetas(prev => [created, ...prev]);
      }
      setShowForm(false);
    } catch {
      // silencioso — no bloquea la UI
    } finally {
      setSavingMeta(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!userId) return;
    try {
      await metasService.delete(id, userId);
      setMetas(prev => prev.filter(m => m.id !== id));
    } catch { /* silencioso */ }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '11px 14px', color: '#f3f4f6',
    fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af',
    marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(160deg, #111318 0%, #0d0f14 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {showForm ? (editingMeta ? 'Editar Meta' : 'Nueva Meta') : 'Mis Metas'}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#4b5563', fontSize: 13 }}>
              {showForm ? 'Define tu objetivo de ahorro' : 'Controla tu progreso hacia tus sueños'}
            </p>
          </div>
          <button
            onClick={showForm ? () => setShowForm(false) : onClose}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', fontSize: 18, lineHeight: 1 }}
          >×</button>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '20px 0 0' }} />

        {/* Body */}
        <div style={{ padding: '20px 28px 28px', overflowY: 'auto', flex: 1 }}>
          {!showForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loadingMetas ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                  <p style={{ margin: 0, fontSize: 14 }}>Cargando metas...</p>
                </div>
              ) : metas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#4b5563' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                  <p style={{ margin: 0, fontSize: 15, color: '#6b7280' }}>Aún no tienes metas creadas</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13 }}>¡Crea tu primera meta y empieza a ahorrar!</p>
                </div>
              ) : metas.map(m => {
                const pct = m.objetivo > 0 ? Math.min((m.ahorrado / m.objetivo) * 100, 100) : 0;
                const done = pct >= 100;
                return (
                  <div key={m.id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${m.color}25`, borderRadius: 16, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 30 }}>{m.emoji}</span>
                        <div>
                          <div style={{ color: '#f3f4f6', fontWeight: 600, fontSize: 15 }}>{m.nombre}</div>
                          {m.descripcion && <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{m.descripcion}</div>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => openEdit(m)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
                        <button onClick={() => handleDelete(m.id)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑️</button>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: done ? '#10b981' : m.color, transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: m.color, fontWeight: 600 }}>{dinero(m.ahorrado)}</span>
                      <span style={{ color: done ? '#10b981' : '#6b7280' }}>
                        {done ? '✅ ¡Meta alcanzada!' : `${Math.round(pct)}% — faltan ${dinero(m.objetivo - m.ahorrado)}`}
                      </span>
                      <span style={{ color: '#6b7280' }}>{dinero(m.objetivo)}</span>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={openNew}
                style={{ marginTop: 4, padding: '13px 0', borderRadius: 12, background: 'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(167,139,250,0.08))', border: '1px dashed rgba(34,211,238,0.3)', color: '#22d3ee', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,211,238,0.16), rgba(167,139,250,0.16))'}
                onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(167,139,250,0.08))'}
              >+ Nueva meta</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Emoji */}
              <div>
                <label style={labelStyle}>Icono</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {META_EMOJIS.map(e => (
                    <button key={e} type="button" onClick={() => setEmoji(e)} style={{ width: 42, height: 42, borderRadius: 10, fontSize: 20, background: emoji === e ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.03)', border: emoji === e ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>{e}</button>
                  ))}
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label style={labelStyle}>Nombre de la meta</label>
                <input type="text" placeholder="Ej: Viaje a Cancún, Mi primer auto" value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} required
                  onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>

              {/* Descripción */}
              <div>
                <label style={labelStyle}>Descripción <span style={{ color: '#4b5563', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span></label>
                <input type="text" placeholder="Ej: Vacaciones en diciembre" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>

              {/* Montos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Objetivo ($)</label>
                  <input type="number" placeholder="0.00" min="0" step="0.01" value={objetivo} onChange={e => setObjetivo(e.target.value)} style={inputStyle} required
                    onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div>
                  <label style={labelStyle}>Ya ahorrado ($)</label>
                  <input type="number" placeholder="0.00" min="0" step="0.01" value={ahorrado} onChange={e => setAhorrado(e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
              </div>

              {/* Color */}
              <div>
                <label style={labelStyle}>Color</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {META_COLORS.map(c => (
                    <button key={c.value} type="button" onClick={() => setColor(c.value)} style={{ width: 32, height: 32, borderRadius: '50%', background: c.value, border: color === c.value ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s', boxShadow: color === c.value ? `0 0 12px ${c.value}90` : 'none' }} />
                  ))}
                </div>
              </div>

              {/* Preview */}
              {nombre && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}30`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f3f4f6', fontWeight: 600, fontSize: 14 }}>{nombre}</div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 99, width: objetivo ? `${Math.min((parseFloat(ahorrado||'0')/parseFloat(objetivo))*100,100)}%` : '0%', background: color, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                  <span style={{ color, fontWeight: 700, fontSize: 13 }}>{objetivo ? `${Math.round(Math.min((parseFloat(ahorrado||'0')/parseFloat(objetivo))*100,100))}%` : '0%'}</span>
                </div>
              )}

              {/* Botones */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '12px 0', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#9ca3af', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                >Cancelar</button>
                <button type="submit" disabled={savingMeta}
                  style={{ padding: '12px 0', borderRadius: 12, background: 'linear-gradient(135deg, #22d3ee, #a78bfa)', border: 'none', color: '#0a0c10', fontSize: 14, fontWeight: 700, cursor: savingMeta ? 'not-allowed' : 'pointer', opacity: savingMeta ? 0.7 : 1 }}
                >{savingMeta ? 'Guardando...' : editingMeta ? 'Guardar cambios' : 'Crear meta'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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
        <div style={{ maxWidth: 220 }}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>{item.nombre}</div>
          <div style={{ opacity: 0.85, fontSize: 12, marginBottom: 8 }}>{item.descripcion}</div>
          <div style={{ fontSize: 11, marginBottom: 4, color: "#a1a1aa" }}>Progreso: {item.progreso}%</div>
          <Progress
            percent={item.progreso}
            showInfo={false}
            strokeColor={item.desbloqueada ? "#10b981" : "#00d4ff"}
            trailColor="rgba(255,255,255,0.08)"
            size="small"
          />
        </div>
      }
      placement="top"
    >
      <div className={`insignia-card-item ${item.desbloqueada ? "insignia-card-on" : "insignia-card-off"}`}>
        <div className="insignia-card-img-wrap">
          <img
            src={item.imagen}
            alt={item.nombre}
            className="insignia-card-img"
          />
        </div>
        <p className="insignia-card-nombre">{item.nombre}</p>
        {item.desbloqueada && (
          <span className="insignia-card-badge">✓</span>
        )}
      </div>
    </Tooltip>
  );
}

export function Dashboard() {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const [modalInsignias, setModalInsignias] = useState(false);
  const [modalMetas, setModalMetas] = useState(false);
  const [todosMovimientos, setTodosMovimientos] = useState<Movimiento[]>([]);
  const [paginaMovimientos, setPaginaMovimientos] = useState(0);
  const [insignias, setInsignias] = useState<Insignia[]>(insigniasMock);
  const MOV_POR_PAGINA = 5;
  const [statsBD, setStatsBD] = useState({ balance: 0, ingresos: 0, gastos: 0, ahorro: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Obtener notificaciones no leídas
  useEffect(() => {
    if (!userId) return;
    const fetchNotificaciones = async () => {
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
  }, [userId]);

  // DATOS DEL BACKEND
  const fetchData = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const txList: { id: number; title: string; category: string; amount: number; date: string }[] =
        await transactionService.getAllTransactions(userId ?? 0);

      const now = new Date();
      const mesActual = now.getMonth();
      const anioActual = now.getFullYear();
      let ingresosMes = 0;
      let gastosMes = 0;

      const movimientosFormateados: Movimiento[] = txList.map((t) => {
        const fechaObj = new Date(t.date);
        if (fechaObj.getMonth() === mesActual && fechaObj.getFullYear() === anioActual) {
          if (t.amount > 0) ingresosMes += t.amount;
          else gastosMes += Math.abs(t.amount);
        }
        return {
          id: String(t.id),
          tipo: t.amount >= 0 ? "ingreso" : "gasto",
          descripcion: t.title,
          categoria: t.category,
          monto: Math.abs(t.amount),
          fecha: t.date,
        };
      });

      setTodosMovimientos(movimientosFormateados);
      setPaginaMovimientos(0);
      setStatsBD({
        balance: txList.reduce((acc, t) => acc + t.amount, 0),
        ingresos: ingresosMes,
        gastos: gastosMes,
        ahorro: Math.max(0, ingresosMes - gastosMes),
      });

      // Insignias — falla silenciosamente
      try {
        const userBadgesRes = await apiBadges.get(`/user/badges?user_id=${userId}`);
        const unlockedTitles = userBadgesRes.data.map((b: { titulo: string }) => b.titulo);
        setInsignias(insigniasMock.map(ins => ({
          ...ins,
          desbloqueada: unlockedTitles.includes(ins.nombre),
          progreso: unlockedTitles.includes(ins.nombre) ? 100 : ins.progreso,
        })));
      } catch { /* badges no disponible */ }

    } catch (err) {
      console.error("Error al conectar con el backend:", err);
      setError("No se pudo conectar con el servidor. Intenta de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const movimientos = useMemo(
    () => todosMovimientos.slice(paginaMovimientos * MOV_POR_PAGINA, (paginaMovimientos + 1) * MOV_POR_PAGINA),
    [todosMovimientos, paginaMovimientos]
  );
  const totalPaginas = Math.ceil(todosMovimientos.length / MOV_POR_PAGINA);

  const insigniasDesbloqueadas = useMemo(() => insignias.filter((i) => i.desbloqueada), [insignias]);
  const insigniasDestacadas = useMemo(() => insigniasDesbloqueadas.slice(0, 4), [insigniasDesbloqueadas]);

  if (cargando) {
    return (
      <AntLayout style={{ minHeight: "100vh", background: "#0f1117" }}>
        <Sidebar notificacionesNoLeidas={notificacionesNoLeidas} />
        <Content style={{ padding: "24px", background: "#0f1117" }}>
          <div style={{ color: "white", padding: 50, textAlign: "center" }}>Cargando información...</div>
        </Content>
      </AntLayout>
    );
  }

  return (
    <AntLayout style={{ minHeight: "100vh", background: "#0f1117" }}>
      <Sidebar notificacionesNoLeidas={notificacionesNoLeidas} />

      <Content style={{
        padding: isMobile ? "16px" : "32px 40px",
        background: "#0f1117",
        paddingBottom: isMobile ? "80px" : "40px",
        overflowY: "auto",
        minHeight: "100vh",
      }}>
        <div className="dashboard-grid">

          {/* ── Header ── */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: isMobile ? 16 : 0,
            marginBottom: isMobile ? 20 : 32,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 16 }}>
              <div style={{
                width: isMobile ? 42 : 52, height: isMobile ? 42 : 52,
                borderRadius: 16,
                background: "linear-gradient(135deg, #0891b2, #a855f7)",
                boxShadow: "0 0 20px rgba(168,85,247,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <WalletOutlined style={{ fontSize: isMobile ? 22 : 28, color: "#fff" }} />
              </div>
              <div>
                <h1 style={{ color: "#f7f8f7", fontSize: isMobile ? 22 : 30, margin: 0, fontWeight: 700 }}>
                  Inicio
                </h1>
                <p style={{ color: "#555", margin: 0, fontSize: isMobile ? 12 : 14 }}>
                  Controla tus gastos, registra ingresos y avanza en tus metas.
                </p>
              </div>
            </div>
            <Tag color={resumen.balance >= 0 ? "cyan" : "red"} className="etiqueta-pill etiqueta-balance">
              {resumen.balance >= 0 ? "Balance estable" : "Balance en riesgo"}
            </Tag>
          </div>

          {/* ── Error con Reintentar ── */}
          {error && (
            <div style={{
              background: "#1a0f0f", border: "1px solid #ef444440",
              borderRadius: 16, padding: isMobile ? "16px" : "24px 28px",
              marginBottom: 24, display: "flex", alignItems: "center",
              gap: isMobile ? 12 : 20,
            }}>
              <div style={{
                width: isMobile ? 40 : 52, height: isMobile ? 40 : 52,
                borderRadius: "50%", background: "rgba(239,68,68,0.12)",
                border: "2px solid rgba(239,68,68,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="#ef4444" width={isMobile ? 20 : 26} height={isMobile ? 20 : 26}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#ef4444", fontWeight: 700, fontSize: isMobile ? 13 : 15, margin: "0 0 4px" }}>Error de conexión</p>
                <p style={{ color: "#6b7280", fontSize: isMobile ? 12 : 13, margin: 0 }}>{error}</p>
              </div>
              <button onClick={() => fetchData()} style={{
                padding: isMobile ? "6px 12px" : "8px 18px", borderRadius: 10,
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444", fontSize: isMobile ? 12 : 13, fontWeight: 600,
                cursor: "pointer", flexShrink: 0,
              }}>Reintentar</button>
            </div>
          )}

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
                    <Button size="middle" className="btn-fintech btn-primario glow-primario" icon={<ArrowDownOutlined />} onClick={() => navigate("/transacciones")}>
                      Registrar gasto
                    </Button>
                    <Button size="middle" className="btn-fintech btn-secundario glow-secundario" icon={<ArrowUpOutlined />} onClick={() => navigate("/transacciones")}>
                      Registrar ingreso
                    </Button>
                    <Button size="middle" className="btn-fintech btn-neutro" icon={<TrophyOutlined />} onClick={() => setModalMetas(true)}>
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
                extra={
                  todosMovimientos.length > 0 && (
                    <Text className="texto-muted">
                      {paginaMovimientos * MOV_POR_PAGINA + 1}–{Math.min((paginaMovimientos + 1) * MOV_POR_PAGINA, todosMovimientos.length)} de {todosMovimientos.length}
                    </Text>
                  )
                }
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

                {/* Barra de navegación */}
                {totalPaginas > 1 && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 20px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <button
                      onClick={() => setPaginaMovimientos(p => Math.max(0, p - 1))}
                      disabled={paginaMovimientos === 0}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: paginaMovimientos === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: paginaMovimientos === 0 ? "#374151" : "#9ca3af",
                        cursor: paginaMovimientos === 0 ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, transition: "all 0.15s",
                      }}
                    >‹</button>

                    {Array.from({ length: totalPaginas }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPaginaMovimientos(i)}
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: paginaMovimientos === i
                            ? "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(167,139,250,0.2))"
                            : "rgba(255,255,255,0.03)",
                          border: paginaMovimientos === i
                            ? "1px solid rgba(34,211,238,0.4)"
                            : "1px solid rgba(255,255,255,0.07)",
                          color: paginaMovimientos === i ? "#22d3ee" : "#6b7280",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: paginaMovimientos === i ? 700 : 400,
                          transition: "all 0.15s",
                        }}
                      >{i + 1}</button>
                    ))}

                    <button
                      onClick={() => setPaginaMovimientos(p => Math.min(totalPaginas - 1, p + 1))}
                      disabled={paginaMovimientos === totalPaginas - 1}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: paginaMovimientos === totalPaginas - 1 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: paginaMovimientos === totalPaginas - 1 ? "#374151" : "#9ca3af",
                        cursor: paginaMovimientos === totalPaginas - 1 ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, transition: "all 0.15s",
                      }}
                    >›</button>
                  </div>
                )}
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

          {/* ── Modal Metas ─────────────────────────────────────────────── */}
          <GoalsModal
            isOpen={modalMetas}
            onClose={() => setModalMetas(false)}
            userId={userId}
          />

          <Modal
            title={<span style={{ color: "#f5f5f5", fontWeight: 700 }}>Todas tus insignias</span>}
            open={modalInsignias}
            onCancel={() => setModalInsignias(false)}
            footer={null}
            width={900}
            wrapClassName="modal-insignias-dark"
            style={{ "--ant-color-bg-elevated": "#0f1117" } as React.CSSProperties}
            styles={{
              header: { background: "#0f1117", borderBottom: "1px solid #1f2235", padding: "16px 24px", margin: 0 },
              body: { background: "#0f1117", padding: "20px 24px 24px" },
              mask: { backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.7)" },
            }}
          >
            <div className="insignias-modal-grid">
              {insignias.map((i) => (
                <InsigniaItem key={i.id} item={i} />
              ))}
            </div>
          </Modal>
        </div>
      </Content>
    </AntLayout>
  );
}
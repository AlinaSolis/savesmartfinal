import { Layout as AntLayout } from "antd";
import { SwapOutlined } from "@ant-design/icons";

import CategoryCard from "../../components/Layout/CategoryCard";
import Sidebar from "../../components/Layout/Sidebar";
import TransactionItem from "../../components/Layout/TransactionItem";
import TransactionModal from "../../components/Layout/TransactionModal";
import { showSuccess, showError } from "../../utils/sweetalert";
import { ICONS, renderIcon } from "../../utils/iconMap";
import { categoryService } from "../../services/categoryService";
import { transactionService } from "../../services/transactionService";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const { Content } = AntLayout;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface Category {
  title: string;
  icon: string;
  type: string;
}

interface Transaction {
  id?: number;
  title: string;
  category: string;
  amount: number;
  date: string;
}

function CategoryModal({ isOpen, onClose, onSave }: CategoryModalProps) {
  const { userId } = useAuth();
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("gasto");
  const [icon, setIcon] = useState<string>("wallet");
  const [customIcon, setCustomIcon] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isIncome = type === "ingreso";
  const iconOptions = Object.entries(ICONS).map(([id, data]) => ({
    id,
    label: data.label,
  }));
  const activeIcon = customIcon.trim() ? customIcon.trim() : icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;

    const newCategoryData = {
      name,
      type,
      icon_identifier: activeIcon,
      is_custom: true,
      user_id: userId,
    };

    setIsLoading(true);
    categoryService.createCategory(newCategoryData)
      .then((data) => {
        onSave(data);
        showSuccess("Categoría creada correctamente");
        setName("");
        setType("gasto");
        setIcon("wallet");
        setCustomIcon("");
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Error al crear la categoría. Inténtalo de nuevo.");
      })
      .finally(() => setIsLoading(false));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '11px 14px',
    color: '#f3f4f6',
    fontSize: 14,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    marginBottom: 8,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #111318 0%, #0d0f14 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          width: '100%',
          maxWidth: 420,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: 20, fontWeight: 700,
              background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Nueva Categoría
            </h2>
            <p style={{ margin: '4px 0 0', color: '#4b5563', fontSize: 13 }}>
              Organiza tus movimientos
            </p>
          </div>
          <button type="button" onClick={onClose} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#6b7280', fontSize: 18, lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '20px 0 0' }} />

        {/* Body */}
        <div style={{ padding: '20px 28px 28px', overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Nombre */}
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                placeholder="Ej: Transporte, Salario"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                required
              />
            </div>

            {/* Tipo */}
            <div>
              <label style={labelStyle}>Tipo</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setType("ingreso")}
                  style={{
                    padding: '10px 0', borderRadius: 12,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    border: isIncome ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    background: isIncome ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                    color: isIncome ? '#10b981' : '#6b7280',
                  }}
                >↑ Ingreso</button>
                <button
                  type="button"
                  onClick={() => setType("gasto")}
                  style={{
                    padding: '10px 0', borderRadius: 12,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    border: !isIncome ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    background: !isIncome ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                    color: !isIncome ? '#ef4444' : '#6b7280',
                  }}
                >↓ Gasto</button>
              </div>
            </div>

            {/* Icono */}
            <div>
              <label style={labelStyle}>Icono</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {renderIcon(activeIcon, "w-5 h-5")}
                </div>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Vista previa del icono seleccionado</span>
              </div>
              <select
                value={icon}
                onChange={(e) => { setIcon(e.target.value); setCustomIcon(""); }}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  colorScheme: 'dark',
                  background: '#0d0f14',
                  color: '#f3f4f6',
                }}
                onFocus={e => (e.target as HTMLSelectElement).style.borderColor = 'rgba(34,211,238,0.4)'}
                onBlur={e => (e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                {iconOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} style={{ background: '#0d0f14', color: '#f3f4f6' }}>
                    {opt.label} ({opt.id})
                  </option>
                ))}
                <option value="custom" style={{ background: '#0d0f14', color: '#f3f4f6' }}>Otro...</option>
              </select>
              {icon === "custom" && (
                <input
                  type="text"
                  placeholder="Identificador del icono (ej: wallet)"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  style={{ ...inputStyle, marginTop: 8 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              )}
            </div>

            {/* Botones */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 0', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#9ca3af', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >Cancelar</button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 0', borderRadius: 12,
                  background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
                  border: 'none',
                  color: '#0a0c10', fontSize: 14, fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >{isLoading ? 'Guardando...' : 'Crear Categoría'}</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = () => {
    if (!userId) return;
    setError(null);
    categoryService.getAllCategories(userId)
      .then((data) => {
        setCategories(data.map((cat: any) => ({
          title: cat.name,
          icon: cat.icon_identifier,
          type: cat.type === "ingreso" ? "Ingreso" : "Gasto",
        })));
      })
      .catch(() => setError("No se pudo conectar con el servidor. Intenta de nuevo más tarde."));
    transactionService.getAllTransactions(userId)
      .then((data) => setTransactions(data))
      .catch(() => setError("No se pudo conectar con el servidor. Intenta de nuevo más tarde."));
  };

  useEffect(() => { cargarDatos(); }, [userId]);

  const handleSaveTransaction = (backendData: any, formData: any) => {
    const [year, month, day] = formData.date.split("-");
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const formattedDate = dateObj.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newTransactionToDisplay: Transaction = {
      id: backendData.id,
      title: formData.description || formData.category,
      category: formData.category,
      date: formattedDate,
      amount: formData.type === "income" ? Number(formData.amount) : -Number(formData.amount),
    };

    setTransactions((prev) => [newTransactionToDisplay, ...prev]);
  };

  const handleSaveCategory = (categoryData: any) => {
    const newCategoryToDisplay: Category = {
      title: categoryData.name,
      icon: categoryData.icon_identifier,
      type: categoryData.type === "ingreso" ? "Ingreso" : "Gasto",
    };
    setCategories((prev) => [...prev, newCategoryToDisplay]);
  };

  const filteredTransactions = activeCategory === "Todas"
    ? transactions
    : transactions.filter((t) => t.category === activeCategory);

  const contentPadding = isMobile ? '16px' : '32px 40px';

  return (
    <AntLayout style={{ minHeight: "100vh", background: "#0f1117" }}>
      <Sidebar />

      <Content style={{
        padding: contentPadding,
        background: "#0f1117",
        paddingBottom: isMobile ? '80px' : contentPadding,
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? 16 : 0,
          marginBottom: isMobile ? 20 : 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16 }}>
            <div style={{
              width: isMobile ? 42 : 52,
              height: isMobile ? 42 : 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0891b2, #a855f7)',
              boxShadow: '0 0 20px rgba(168,85,247,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <SwapOutlined style={{ fontSize: isMobile ? 22 : 28, color: '#fff' }} />
            </div>
            <div>
              <h1 style={{
                color: '#f7f8f7',
                fontSize: isMobile ? 22 : 30,
                margin: 0,
                fontWeight: 700,
              }}>
                Transacciones
              </h1>
              <p style={{ color: '#555', margin: 0, fontSize: isMobile ? 12 : 14 }}>
                Gestiona tus ingresos y gastos
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #00d4ff20, #a855f720)',
              border: '1px solid #00d4ff40',
              color: '#fff',
              borderRadius: 12,
              padding: '0 20px',
              height: 42,
              fontSize: isMobile ? 13 : 15,
              fontWeight: 500,
              width: isMobile ? '100%' : 'auto',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #00d4ff30, #a855f730)';
              e.currentTarget.style.borderColor = '#00d4ff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #00d4ff20, #a855f720)';
              e.currentTarget.style.borderColor = '#00d4ff40';
            }}
          >
            + Agregar Transacción
          </button>
        </div>

        {/* ── Error con Reintentar ── */}
        {error && (
          <div style={{
            background: '#1a0f0f', border: '1px solid #ef444440',
            borderRadius: 16, padding: isMobile ? '16px' : '24px 28px',
            marginBottom: 24, display: 'flex', alignItems: 'center',
            gap: isMobile ? 12 : 20,
          }}>
            <div style={{
              width: isMobile ? 40 : 52, height: isMobile ? 40 : 52,
              borderRadius: '50%', background: 'rgba(239,68,68,0.12)',
              border: '2px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="#ef4444" width={isMobile ? 20 : 26} height={isMobile ? 20 : 26}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#ef4444', fontWeight: 700, fontSize: isMobile ? 13 : 15, margin: '0 0 4px' }}>Error de conexión</p>
              <p style={{ color: '#6b7280', fontSize: isMobile ? 12 : 13, margin: 0 }}>{error}</p>
            </div>
            <button onClick={() => cargarDatos()} style={{
              padding: isMobile ? '6px 12px' : '8px 18px', borderRadius: 10,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444', fontSize: isMobile ? 12 : 13, fontWeight: 600,
              cursor: 'pointer', flexShrink: 0,
            }}>Reintentar</button>
          </div>
        )}

        {/* ── Categorías ── */}
        <div style={{ marginBottom: isMobile ? 24 : 36 }}>
          <h3 style={{ color: '#fff', fontSize: isMobile ? 16 : 18, fontWeight: 600, marginBottom: isMobile ? 12 : 20 }}>
            Categorías
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: isMobile ? 10 : 16,
          }}>
            <div
              onClick={() => setActiveCategory("Todas")}
              style={{
                cursor: 'pointer',
                borderRadius: 16,
                outline: activeCategory === "Todas" ? '2px solid #a855f7' : '2px solid transparent',
                outlineOffset: 2,
                transition: 'outline 0.15s',
              }}
            >
              <CategoryCard icon="chart" title="Todas" type="General" />
            </div>

            {categories.map((cat, index) => (
              <div
                key={index}
                onClick={() => setActiveCategory(cat.title)}
                style={{
                  cursor: 'pointer',
                  borderRadius: 16,
                  outline: activeCategory === cat.title ? '2px solid #a855f7' : '2px solid transparent',
                  outlineOffset: 2,
                  transition: 'outline 0.15s',
                }}
              >
                <CategoryCard icon={cat.icon} title={cat.title} type={cat.type} />
              </div>
            ))}

            <div
              onClick={() => setIsCategoryModalOpen(true)}
              style={{ cursor: 'pointer', borderRadius: 16 }}
            >
              <div style={{
                background: '#1a1d27',
                border: '1px solid #2d3148',
                borderRadius: 16,
                padding: isMobile ? '14px 8px' : '20px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: isMobile ? 90 : 110,
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.background = '#1f2335'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d3148'; e.currentTarget.style.background = '#1a1d27'; }}
              >
                <div style={{ fontSize: 28, marginBottom: 6, color: '#555' }}>+</div>
                <p style={{ color: '#aaa', fontSize: 12, fontWeight: 600, margin: 0 }}>Nueva</p>
                <p style={{ color: '#555', fontSize: 11, margin: 0 }}>Categoría</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Historial ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 20, flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ color: '#fff', fontSize: isMobile ? 16 : 18, fontWeight: 600, margin: 0 }}>
              Historial de Transacciones
            </h3>
            <span style={{
              color: '#666', fontSize: 12,
              background: '#1a1d27', border: '1px solid #2d3148',
              borderRadius: 20, padding: '3px 12px',
            }}>
              {filteredTransactions.length} transacción{filteredTransactions.length !== 1 ? 'es' : ''}
            </span>
          </div>

          <div style={{ background: '#13151f', borderRadius: 20, border: '1px solid #1f2235', padding: isMobile ? 16 : 24 }}>
            {filteredTransactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: isMobile ? '32px 0' : '48px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                <h4 style={{ color: '#ccc', fontWeight: 600, margin: '0 0 6px' }}>No hay transacciones</h4>
                <p style={{ color: '#555', fontSize: 13, margin: 0 }}>Comienza agregando tu primera transacción</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredTransactions.map((t, index) => (
                  <TransactionItem
                    key={t.id || index}
                    title={t.title}
                    category={t.category}
                    amount={t.amount}
                    date={t.date}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </Content>

      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSaveTransaction}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </AntLayout>
  );
}
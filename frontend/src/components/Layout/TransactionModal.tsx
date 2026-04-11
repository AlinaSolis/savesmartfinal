import { useEffect, useState } from "react";
import { renderIcon } from "../../utils/iconMap";
import { showError, showSuccess } from "../../utils/sweetalert";
import { categoryService } from "../../services/categoryService";
import { transactionService } from "../../services/transactionService";
import apiBadges from "../../services/apiBadges";
import { useAuth } from "../../context/AuthContext";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (backendData: any, formData: any) => void;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function TransactionModal({ isOpen, onClose, onSave }: TransactionModalProps) {
  const { userId } = useAuth();
  const [type, setType] = useState<string>("expense");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<Category | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      categoryService.getAllCategories(userId)
        .then((data: any[]) => {
          const income: Category[] = data
            .filter((cat: any) => cat.type === "ingreso")
            .map((cat: any) => ({ id: cat.id, name: cat.name, icon: cat.icon_identifier }));
          const expense: Category[] = data
            .filter((cat: any) => cat.type === "gasto")
            .map((cat: any) => ({ id: cat.id, name: cat.name, icon: cat.icon_identifier }));
          setIncomeCategories(income);
          setExpenseCategories(expense);
        })
        .catch((error: any) => console.error("Error al cargar categorías:", error));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCategories = type === "income" ? incomeCategories : expenseCategories;
  const isIncome = type === "income";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    const newTransactionData = {
      user_id: userId,
      type,
      category: category.name,
      amount,
      description,
      date,
    };

    setIsLoading(true);
    transactionService.createTransaction(newTransactionData)
      .then((data) => {
        // Notificar al servicio de insignias directamente desde el frontend
        apiBadges.post('/internal/webhook/transaction', {
          user_id: userId,
          monto: parseFloat(amount),
          tipo: type === 'income' ? 'ingreso' : 'gasto',
        }).catch(() => { /* insignias no disponibles, continúa igual */ });

        onSave(data, newTransactionData);
        showSuccess("Transacción agregada correctamente");
        setAmount("");
        setDescription("");
        setCategory(null);
        setDate(new Date().toISOString().split('T')[0]);
        setType("expense");
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Error al guardar la transacción. Inténtalo de nuevo.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setCategory(null);
    setIsDropdownOpen(false);
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
        <div style={{
          padding: '24px 28px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Nueva Transacción
            </h2>
            <p style={{ margin: '4px 0 0', color: '#4b5563', fontSize: 13 }}>
              Registra tu movimiento financiero
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#6b7280', fontSize: 18, lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '20px 0 0' }} />

        {/* Body */}
        <div style={{ padding: '20px 28px 28px', overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Tipo */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Tipo
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleTypeChange("income")}
                  style={{
                    padding: '10px 0',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    border: isIncome ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    background: isIncome ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                    color: isIncome ? '#10b981' : '#6b7280',
                  }}
                >
                  ↑ Ingreso
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("expense")}
                  style={{
                    padding: '10px 0',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    border: !isIncome ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    background: !isIncome ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                    color: !isIncome ? '#ef4444' : '#6b7280',
                  }}
                >
                  ↓ Gasto
                </button>
              </div>
            </div>

            {/* Monto */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Monto
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: '#4b5563', fontSize: 15, fontWeight: 600, pointerEvents: 'none',
                }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '11px 14px 11px 28px',
                    color: '#f3f4f6',
                    fontSize: 15,
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  required
                />
              </div>
            </div>

            {/* Categoría */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Categoría
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: isDropdownOpen ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '11px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                <span style={{ fontSize: 14, color: category ? '#f3f4f6' : '#4b5563' }}>
                  {category ? category.name : 'Selecciona una categoría'}
                </span>
                <svg
                  style={{ width: 16, height: 16, color: '#6b7280', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                  background: '#141720',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  zIndex: 10,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                  maxHeight: 220,
                  overflowY: 'auto',
                }}>
                  {currentCategories.length === 0 ? (
                    <div style={{ padding: '12px 16px', color: '#6b7280', fontSize: 13, textAlign: 'center' }}>
                      Sin categorías disponibles
                    </div>
                  ) : (
                    currentCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => { setCategory(cat); setIsDropdownOpen(false); }}
                        style={{
                          width: '100%', textAlign: 'left',
                          padding: '10px 16px',
                          display: 'flex', alignItems: 'center', gap: 10,
                          background: category?.id === cat.id ? 'rgba(34,211,238,0.08)' : 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                          color: category?.id === cat.id ? '#22d3ee' : '#d1d5db',
                          fontSize: 14,
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { if (category?.id !== cat.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { if (category?.id !== cat.id) e.currentTarget.style.background = 'transparent' }}
                      >
                        <span>{renderIcon(cat.icon, "w-4 h-4")}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Descripción <span style={{ color: '#374151', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Almuerzo en el centro"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '11px 14px',
                  color: '#f3f4f6',
                  fontSize: 14,
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Fecha */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '11px 14px',
                  color: '#f3f4f6',
                  fontSize: 14,
                  outline: 'none',
                  colorScheme: 'dark',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                required
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 0',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#9ca3af',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 0',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
                  border: 'none',
                  color: '#0a0c10',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

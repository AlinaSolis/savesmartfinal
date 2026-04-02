import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import Button from "../../components/Layout/Button";
import CategoryCard from "../../components/Layout/CategoryCard";
import Sidebar from "../../components/Layout/Sidebar";
import TransactionItem from "../../components/Layout/TransactionItem";
import TransactionModal from "../../components/Layout/TransactionModal";
import { showSuccess, showError } from "../../utils/sweetalert";
import { ICONS, renderIcon } from "../../utils/iconMap";

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

// --- COMPONENTE MODAL PARA CATEGORÍAS ---
function CategoryModal({ isOpen, onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("gasto");
  const [icon, setIcon] = useState<string>("wallet");
  const [customIcon, setCustomIcon] = useState<string>("");

  const iconOptions = Object.entries(ICONS).map(([id, data]) => ({
    id,
    label: data.label,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type) return;

    const newCategoryData = {
      name,
      type,
      icon_identifier: customIcon.trim() ? customIcon.trim() : icon, // Guarda el id del icono
      is_custom: true,
    };

    // Petición POST al backend para guardar la categoría
    fetch("http://127.0.0.1:8000/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(newCategoryData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al guardar la categoría");
        }
        return response.json();
      })
      .then((data) => {
        // Llamamos a onSave con los datos
        onSave(data);

        // Mostrar notificación de éxito
        showSuccess("Categoría creada correctamente");

        // Limpiamos el formulario
        setName("");
        setType("gasto");
        setIcon("");
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        // Mostrar notificación de error
        showError("Error al crear la categoría. Inténtalo de nuevo.");
      });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0f1115] border border-gray-800 rounded-[2rem] w-full max-w-md p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Nueva Categoría
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Nombre */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Comida, Transporte"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1c1f26] border border-gray-700 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Tipo</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setType("ingreso")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      type === "ingreso"
                        ? "bg-cyan-500 text-black"
                        : "bg-[#1c1f26] text-gray-400 hover:bg-[#252932]"
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                    Ingreso
                  </button>

                  <button
                    type="button"
                    onClick={() => setType("gasto")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      type === "gasto"
                        ? "bg-fuchsia-500 text-white"
                        : "bg-[#1c1f26] text-gray-400 hover:bg-[#252932]"
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                      <polyline points="16 17 22 17 22 11"></polyline>
                    </svg>
                    Gasto
                  </button>
                </div>
              </div>

              {/* Icono */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Icono</label>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1c1f26] border border-gray-700 flex items-center justify-center">
                    {renderIcon(customIcon.trim() ? customIcon.trim() : icon, "w-6 h-6")}
                  </div>
                  <span className="text-sm text-gray-300">
                    Selecciona un icono para esta categoría
                  </span>
                </div>
                <select
                  value={icon}
                  onChange={(e) => {
                    setIcon(e.target.value);
                    setCustomIcon("");
                  }}
                  className="w-full bg-[#1c1f26] border border-gray-700 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} ({opt.id})
                    </option>
                  ))}
                  <option value="custom">Otro...</option>
                </select>

                {icon === "custom" && (
                  <input
                    type="text"
                    placeholder="Ingresa el identificador (ej: wallet)"
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    className="mt-3 w-full bg-[#1c1f26] border border-gray-700 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  />
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl bg-[#1c1f26] hover:bg-[#252932] text-white font-medium transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold text-black bg-gradient-to-r from-cyan-400 to-purple-500 hover:opacity-90 transition-opacity"
                >
                  Agregar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function Transactions() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  
  // Categorías de la BD
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Transacciones de la BD (inicia vacío en lugar de estático)
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch de categorías al montar
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        const formattedCategories: Category[] = data.map((cat: any) => ({
          title: cat.name,
          icon: cat.icon_identifier,
          type: cat.type === "ingreso" ? "Ingreso" : "Gasto",
        }));
        setCategories(formattedCategories);
      })
      .catch((error) => console.error("Error al cargar categorías principales:", error));
  }, []);

  // Fetch del historial de transacciones al montar
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        // Asumiendo que tu controlador ya devuelve todo formateado
        // (title, category, amount ya negativo si es gasto, date formateada)
        setTransactions(data);
      })
      .catch((error) => console.error("Error al cargar transacciones:", error));
  }, []);

  // Manejador que recibe la transacción guardada desde el modal
  const handleSaveTransaction = (backendData: any, formData: any) => {
    // Formatear la fecha manualmente solo para mostrarla instantáneamente sin recargar la página
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

  // Manejador para guardar categoría
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

  return (
    <div className="flex min-h-screen bg-[#0a0b0f]">
      <Sidebar />

      <div className="flex-1 lg:ml-0 p-4 sm:p-6 lg:p-10 pt-16 lg:pt-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Transacciones
            </h1>
            <p className="text-gray-400 text-base lg:text-lg">Gestiona tus ingresos y gastos</p>
          </div>

          <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
            + Agregar Transacción
          </Button>
        </div>

        {/* SECCIÓN DE CATEGORÍAS */}
        <div className="mb-8 lg:mb-12">
          <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6">Categorías</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6">
            {/* Botón Todas */}
            <div
              onClick={() => setActiveCategory("Todas")}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                activeCategory === "Todas"
                  ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0a0b0f] scale-105"
                  : ""
              }`}
            >
              <CategoryCard icon="chart" title="Todas" type="General" />
            </div>

            {categories.map((cat, index) => (
              <div
                key={index}
                onClick={() => setActiveCategory(cat.title)}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  activeCategory === cat.title
                    ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0a0b0f] scale-105"
                    : ""
                }`}
              >
                <CategoryCard
                  icon={cat.icon}
                  title={cat.title}
                  type={cat.type}
                />
              </div>
            ))}

            {/* Botón Agregar Categoría */}
            <div
              onClick={() => setIsCategoryModalOpen(true)}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-200 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] group">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-gray-400 group-hover:text-cyan-400 transition-colors">+</div>
                <h3 className="font-semibold text-gray-300 group-hover:text-white transition-colors text-center text-sm sm:text-base">Nueva</h3>
                <p className="text-gray-500 text-xs sm:text-sm text-center">Categoría</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE HISTORIAL */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
            <h3 className="text-xl lg:text-2xl font-semibold text-white">Historial de Transacciones</h3>
            <div className="text-sm text-gray-400 bg-[#1c1f26] px-3 py-1 rounded-full border border-gray-700">
              {filteredTransactions.length} transacción{filteredTransactions.length !== 1 ? 'es' : ''}
            </div>
          </div>

          <div className="bg-[#0f1115] rounded-2xl border border-gray-800 p-4 sm:p-6">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <div className="text-5xl lg:text-6xl mb-4">📊</div>
                <h4 className="text-lg lg:text-xl font-semibold text-gray-300 mb-2">No hay transacciones</h4>
                <p className="text-gray-500 text-sm lg:text-base">Comienza agregando tu primera transacción</p>
              </div>
            ) : (
              <div className="space-y-3">
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
      </div>

      {/* IMPLEMENTACIÓN DEL NUEVO MODAL */}
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
    </div>
  );
}
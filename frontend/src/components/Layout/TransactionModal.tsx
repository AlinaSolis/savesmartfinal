import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { renderIcon } from "../../utils/iconMap";
import { showError, showSuccess } from "../../utils/sweetalert";

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
  const [type, setType] = useState<string>("expense");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<Category | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Estados para almacenar las categorías desde la BD
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);

  // Fetch a la API cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      fetch("http://127.0.0.1:8000/api/categories")
        .then((response) => response.json())
        .then((data) => {
          // Filtramos y formateamos las categorías de ingreso
          const income: Category[] = data
            .filter((cat: any) => cat.type === "ingreso")
            .map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon_identifier,
            }));

          // Filtramos y formateamos las categorías de gasto
          const expense: Category[] = data
            .filter((cat: any) => cat.type === "gasto")
            .map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              icon: cat.icon_identifier,
            }));

          setIncomeCategories(income);
          setExpenseCategories(expense);
        })
        .catch((error) => console.error("Error al cargar categorías:", error));
    }
  }, [isOpen]);

  const currentCategories = type === "income" ? incomeCategories : expenseCategories;

  const renderCategoryIcon = (iconIdentifier: string) => {
    // Evita mostrar emojis en la UI; se usan SVG consistentes
    // Si iconIdentifier es null o no existe en el mapa, renderIcon devuelve el ícono por defecto.
    return renderIcon(iconIdentifier, "w-5 h-5");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !date) return;

    const newTransactionData = {
      type,
      category: category.name,
      amount,
      description,
      date,
    };

    // Petición POST al backend para guardar la transacción
    fetch("http://127.0.0.1:8000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(newTransactionData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al guardar la transacción");
        }
        return response.json();
      })
      .then((data) => {
        // Llamamos a onSave con los datos del backend y los del form para formatear
        onSave(data, newTransactionData);

        // Mostrar notificación de éxito
        showSuccess("Transacción agregada correctamente");

        // Limpiamos el formulario
        setAmount("");
        setDescription("");
        setCategory(null);
        setDate(new Date().toISOString().split('T')[0]);
        setType("expense");
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        // Mostrar notificación de error
        showError("Error al guardar la transacción. Inténtalo de nuevo.");
      });
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setCategory(null); // Reiniciar categoría al cambiar de tipo
    setIsDropdownOpen(false);
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
              Nueva Transacción
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Tipo (Ingreso / Gasto) */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Tipo</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("income")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      type === "income"
                        ? "bg-[#10b981] text-black"
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
                    onClick={() => handleTypeChange("expense")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      type === "expense"
                        ? "bg-[#ef4444] text-white"
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

              {/* Categoría Dropdown */}
              <div className="relative">
                <label className="text-sm font-medium text-white mb-2 block">Categoría</label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#1c1f26] border border-gray-700 hover:border-gray-500 rounded-2xl px-4 py-3.5 text-left flex items-center justify-between text-white transition-colors"
                >
                  <span className={!category ? "text-gray-400" : ""}>
                    {category ? (
                      <span className="flex items-center gap-2">
                         {category.name}
                      </span>
                    ) : (
                      "Selecciona una categoría"
                    )}
                  </span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-[85px] left-0 w-full bg-[#1c1f26] border border-gray-700 rounded-xl overflow-hidden z-10 shadow-lg">
                    <div className="px-4 py-3 border-b border-gray-600 text-gray-300 text-sm">
                      Selecciona una categoría
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {currentCategories.length === 0 ? (
                        <div className="px-4 py-3 text-gray-400 text-center">Cargando...</div>
                      ) : (
                        currentCategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategory(cat);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                              category?.id === cat.id ? "bg-cyan-500 text-white" : "text-gray-400 hover:bg-[#252932] hover:text-white"
                            }`}
                          >
                            <span className="text-lg">
                              {renderCategoryIcon(cat.icon)}
                            </span>
                            <span className={category?.id === cat.id ? "font-medium text-cyan-200" : "font-normal"}>
                              {cat.name}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Monto */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#1c1f26] border border-gray-700 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Descripción (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Almuerzo en el centro"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1c1f26] border border-gray-700 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Fecha</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#1c1f26] border border-gray-700 rounded-2xl px-4 py-3.5 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all [color-scheme:dark]"
                    required
                  />
                </div>
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
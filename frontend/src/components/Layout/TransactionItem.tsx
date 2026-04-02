
interface TransactionItemProps {
  title: string;
  category: string;
  amount: number;
  date: string;
}

export default function TransactionItem({ title, category, amount, date }: TransactionItemProps) {
  const isPositive = amount > 0;

  // Función para obtener icono basado en el tipo de transacción
  const getTransactionIcon = () => {
    if (isPositive) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
        </svg>
      ); // Flecha hacia arriba para ingresos
    }
    return (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.707-8.293l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414z" clipRule="evenodd" />
      </svg>
    ); // Flecha hacia abajo para gastos
  };

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 sm:p-5 bg-[#1c1f26] hover:bg-[#252932] rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${
        isPositive
          ? "bg-emerald-500/20 text-emerald-300"
          : "bg-fuchsia-500/20 text-fuchsia-300"
      }`}>
        {getTransactionIcon()}
      </div>

      <div className="min-w-0">
        <h4 className="font-semibold text-white group-hover:text-gray-100 transition-colors truncate text-base sm:text-lg">{title}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-1">
          <span className="text-sm sm:text-base text-gray-300 truncate font-medium">{category}</span>
          <span className="text-xs sm:text-sm text-gray-500 truncate">{date}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0 ml-2">
        <p className={`text-lg sm:text-2xl font-bold ${
          isPositive ? "text-emerald-400" : "text-fuchsia-400"
        }`}>
          {isPositive ? "+" : "-"}${Math.abs(amount).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
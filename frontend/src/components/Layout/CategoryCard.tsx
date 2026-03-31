import { renderIcon } from "../../utils/iconMap";

interface CategoryCardProps {
  icon: string;          // identificador del icono
  title: string;
  type?: string;         // 'ingreso', 'income', 'gasto', 'expense' u otro
}

export default function CategoryCard({ icon, title, type }: CategoryCardProps) {
  // Icono renderizado desde identificador (icon_identifier)
  const IconElement = renderIcon(icon, "w-10 h-10");
  // Función para obtener colores basados en el tipo
  const getTypeColors = () => {
    switch (type?.toLowerCase()) {
      case 'ingreso':
      case 'income':
        return {
          bg: 'from-emerald-500/10 to-emerald-600/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400'
        };
      case 'gasto':
      case 'expense':
        return {
          bg: 'from-fuchsia-500/10 to-violet-600/10',
          border: 'border-fuchsia-500/30',
          text: 'text-fuchsia-400'
        };
      default:
        return {
          bg: 'from-slate-500/10 to-slate-600/10',
          border: 'border-slate-500/30',
          text: 'text-slate-400'
        };
    }
  };

  const colors = getTypeColors();

  return (
    <div className={`bg-gradient-to-br ${colors.bg} p-6 rounded-2xl border ${colors.border} hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer group min-h-[120px] flex flex-col items-center justify-center text-center`}>
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{IconElement}</div>
      <h3 className="font-semibold text-white group-hover:text-gray-100 transition-colors mb-1">{title}</h3>
      <p className={`text-sm ${colors.text} capitalize`}>{type}</p>
    </div>
  );
}
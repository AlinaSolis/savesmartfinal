import React from "react";
import {
    HiOutlineAcademicCap,
    HiOutlineBell,
    HiOutlineCake,
    HiOutlineCash,
    HiOutlineChartBar,
    HiOutlineCreditCard,
    HiOutlineGift,
    HiOutlineGlobeAlt,
    HiOutlineHeart,
    HiOutlineHome,
    HiOutlineMusicNote,
    HiOutlineReceiptTax,
    HiOutlineShoppingBag,
    HiOutlineSparkles,
    HiOutlineTicket,
    HiOutlineTruck,
} from "react-icons/hi";

interface IconData {
  label: string;
  icon: any;
}

// Mapeo de identificadores de iconos a componentes de react-icons.
// Guarda el valor de "id" en la base de datos (campo icon_identifier).
// Ejemplo de valores válidos: "wallet", "food", "car", "home", "chart", "shopping".

export const ICONS: Record<string, IconData> = {
  wallet: {
    label: "Billetera",
    icon: HiOutlineCreditCard,
  },
  income: {
    label: "Ingreso",
    icon: HiOutlineCash,
  },
  savings: {
    label: "Ahorros",
    icon: HiOutlineSparkles,
  },
  bills: {
    label: "Servicios",
    icon: HiOutlineReceiptTax,
  },
  subscriptions: {
    label: "Suscripciones",
    icon: HiOutlineBell,
  },
  travel: {
    label: "Viajes",
    icon: HiOutlineGlobeAlt,
  },
  gifts: {
    label: "Regalos",
    icon: HiOutlineGift,
  },
  hobbies: {
    label: "Hobbies",
    icon: HiOutlineTicket,
  },
  food: {
    label: "Comida",
    icon: HiOutlineCake,
  },
  entertainment: {
    label: "Entretenimiento",
    icon: HiOutlineMusicNote,
  },
  home: {
    label: "Casa",
    icon: HiOutlineHome,
  },
  car: {
    label: "Transporte",
    icon: HiOutlineTruck,
  },
  chart: {
    label: "Resumen",
    icon: HiOutlineChartBar,
  },
  shopping: {
    label: "Compras",
    icon: HiOutlineShoppingBag,
  },
  health: {
    label: "Salud",
    icon: HiOutlineHeart,
  },
  education: {
    label: "Educación",
    icon: HiOutlineAcademicCap,
  },
};

export function renderIcon(id: string, className: string = "w-8 h-8"): React.ReactElement {
  const IconComponent = ICONS[id]?.icon;
  if (!IconComponent) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" />
      </svg>
    );
  }

  return <IconComponent className={className} />;
}
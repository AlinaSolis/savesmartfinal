import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    // Marca
    colorPrimary: "#00d4ff",
    colorInfo: "#00d4ff",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",

    // Texto
    colorText: "#f5f5f5",
    colorTextSecondary: "#a1a1aa",

    // Fondos
    colorBgBase: "#0a0a0a",
    colorBgContainer: "rgba(20, 20, 20, 0.7)",

    // Bordes / radios
    colorBorder: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    borderRadiusLG: 16,
  },
  components: {
    Layout: {
      bodyBg: "#0a0a0a",
      siderBg: "rgba(15, 15, 15, 0.8)",
    },
    Menu: {
      darkItemBg: "transparent",
      darkItemSelectedBg: "rgba(0, 212, 255, 0.12)",
      darkItemSelectedColor: "#f5f5f5",
      darkItemColor: "#a1a1aa",
      darkItemHoverColor: "#f5f5f5",
    },
    Card: {
      colorBgContainer: "rgba(20, 20, 20, 0.7)",
      colorBorderSecondary: "rgba(255, 255, 255, 0.1)",
    },
  },
};
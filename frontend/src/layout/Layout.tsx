import { Layout as AntLayout, Menu, Typography, Badge } from "antd";
import {
  AppstoreOutlined,
  SwapOutlined,
  RadarChartOutlined,
  UserOutlined,
  BellOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = AntLayout;
const { Text } = Typography;

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey =
    location.pathname === "/"
      ? "dashboard"
      : location.pathname.replace("/", "");

  return (
    <div className="fondo-app app-layout-root">
      <AntLayout className="app-layout">
        <Sider
          width={260}
          className="glass-sidebar sidebar-fijo"
          breakpoint="lg"
          collapsedWidth={0}
        >
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 1 }}>
                <span style={{ color: "#00d4ff" }}>SAVE</span>
                <span style={{ color: "#a855f7" }}>SMART</span>
              </div>
              <Text style={{ color: "#a1a1aa" }}>Tu futuro financiero</Text>
            </div>

            <Menu
              mode="inline"
              theme="dark"
              selectedKeys={[selectedKey]}
              onClick={({ key }) => {
                const ruta = key === "dashboard" ? "/" : `/${key}`;
                navigate(ruta);
              }}
              style={{ background: "transparent" }}
              items={[
                {
                  key: "dashboard",
                  icon: <AppstoreOutlined />,
                  label: "Dashboard",
                },
                {
                  key: "insignias",
                  icon: <TrophyOutlined />,
                  label: "Insignias",
                },
                {
                  key: "transacciones",
                  icon: <SwapOutlined />,
                  label: "Transacciones",
                },
                {
                  key: "analisis",
                  icon: <RadarChartOutlined />,
                  label: "Análisis IA",
                },
                {
                  key: "perfil",
                  icon: <UserOutlined />,
                  label: "Perfil",
                },
                {
                  key: "notificaciones",
                  icon: (
                      <BellOutlined />
                  ),
                  label: "Notificaciones",
                },
              ]}
            />
          </div>
        </Sider>

        <AntLayout className="layout-derecho">
          <Content className="contenido-scroll">
            <div className="contenedor">{children}</div>
          </Content>
        </AntLayout>
      </AntLayout>
    </div>
  );
}
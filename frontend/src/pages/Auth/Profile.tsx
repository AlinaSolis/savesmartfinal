import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/authService";
import "../../styles/Profile.css";

import {
  User,
  Mail,
  Lock,
  LayoutDashboard,
  ArrowLeftRight,
  Brain,
  Bell,
  LogOut,
  ChevronDown,
  Plus
} from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
}

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // 🔥 SUBPERFILES
  const [activeSubProfile, setActiveSubProfile] =
    useState<"perfil" | "transacciones">("perfil");

  // 🔥 TOAST
  const [showToast, setShowToast] = useState(false);

  // 🔥 MENÚ
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // 🔥 CARGAR USUARIO
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    const userId = parsedUser.id;

    api.get(`/profile/${userId}`)
      .then(res => {
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: ""
        });
      })
      .catch(() => navigate("/login"));

  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 🔥 GUARDAR
  const handleSave = async () => {
    if (!user) return;

    try {
      await api.put(`/profile/${user.id}`, formData);

      localStorage.setItem("user", JSON.stringify({
        ...user,
        name: formData.name,
        email: formData.email
      }));

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);

    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-wrapper">

      {/* 🔥 TOAST */}
      {showToast && (
        <div className="toast-success">
          <strong>✔ Datos actualizados</strong>
          <p>Tu perfil se guardó correctamente</p>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SaveSmart</h2>
          <p>Tu futuro financiero</p>
        </div>

        <ul className="menu">

          {/* DASHBOARD */}
          <li onClick={() => toggleMenu("dashboard")} className="menu-item">
            <div className="menu-title">
              <LayoutDashboard size={18} />
              Dashboard
              <ChevronDown
                size={16}
                className={openMenu === "dashboard" ? "rotate" : ""}
              />
            </div>

            {openMenu === "dashboard" && (
              <ul className="submenu">
                <li>Resumen</li>
                <li>Ingresos</li>
              </ul>
            )}
          </li>

          <li><ArrowLeftRight size={18} /> Transacciones</li>
          <li><Brain size={18} /> Análisis IA</li>

          {/* PERFIL CON SUBMENU */}
          <li className="menu-item active" onClick={() => toggleMenu("perfil")}>
            <div className="menu-title">
              <User size={18} />
              Perfil
              <ChevronDown
                size={16}
                className={openMenu === "perfil" ? "rotate" : ""}
              />
            </div>

            {openMenu === "perfil" && (
              <ul className="submenu">
                <li onClick={() => setActiveSubProfile("perfil")}>
                  Datos del Perfil
                </li>
                <li onClick={() => setActiveSubProfile("transacciones")}>
                  Transacciones
                </li>
              </ul>
            )}
          </li>

          <li>
            <Bell size={18} />
            Notificaciones
          </li>

          <li onClick={handleLogout} className="logout-item">
            <LogOut size={18} /> Cerrar Sesión
          </li>
        </ul>
      </aside>

      {/* CONTENIDO */}
      <main className="profile-content">

        <h1 className="page-title">Perfil</h1>

        <div className="profile-grid">

          {/* 🔴 PERFIL */}
          {activeSubProfile === "perfil" && (
            <>
              <div className="left-column">
                <div className="card user-card">
                  <div className="avatar-container">
                    <img
                      src={`https://ui-avatars.com/api/?name=${formData.name}`}
                      alt="avatar"
                    />
                  </div>

                  <h3>{formData.name}</h3>
                  <p>{formData.email}</p>
                </div>
              </div>

              <div className="right-column">
                <div className="card form-card">
                  <h3>Información Personal</h3>

                  <div className="form-group">
                    <label>Nombre</label>
                    <div className="input-wrapper">
                      <User size={16} />
                      <input
                        value={formData.name}
                        onChange={(e) =>
                          handleChange("name", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-wrapper">
                      <Mail size={16} />
                      <input
                        value={formData.email}
                        onChange={(e) =>
                          handleChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Nueva contraseña</label>
                    <div className="input-wrapper">
                      <Lock size={16} />
                      <input
                        type="password"
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <button className="save-btn" onClick={handleSave}>
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 🟢 TRANSACCIONES */}
          {activeSubProfile === "transacciones" && (
            <>
              <div className="left-column">
                <div className="card stats-card">
                  <h3>Estadísticas Rápidas</h3>
                  <div className="stat-row">
                    <span>Días en SaveSmart</span>
                    <span className="highlight">1</span>
                  </div>
                </div>
              </div>

              <div className="right-column">
                <div className="card goals-card">
                  <div className="goals-header">
                    <h3>Metas de Ahorro</h3>
                    <button className="new-goal">
                      <Plus size={14} /> Nueva Meta
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Profile;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, TrendingUp } from "lucide-react";
import { login } from "../../services/authService";// IMPORTANTE: Asegúrate de tener este archivo
import "../../styles/Login.css";
 
type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      localStorage.setItem("user", JSON.stringify(response.user));

      // ✅ ÉXITO
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/perfil");
      }, 2000);

    } catch (error: any) {
      console.error(error);

      // ❌ ERROR BONITO
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="login-container">

      {/* ===== LADO IZQUIERDO ===== */}
      <div className="login-left">
        <div className="left-content">
          <div className="brand">
            <div className="logo-box">
              <TrendingUp size={26} />
            </div>
            <h1>SaveSmart</h1>
          </div>

          <h2 className="hero-title">
            Tu futuro financiero <br />
            <span className="gradient-text">
              comienza aquí
            </span>
          </h2>

          <p className="subtitle">
            Gestiona tus ahorros con inteligencia artificial y alcanza tus
            metas financieras más rápido.
          </p>
        </div>
      </div>

      {/* ===== LADO DERECHO ===== */}
      <div className="login-right">
        <div className="form-card">
          <h2>Bienvenido</h2>
          <p className="form-subtitle">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Correo Electrónico"
                required
                value={formData.email}
                onChange={(e) =>
                  updateFormData("email", e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                required
                value={formData.password}
                onChange={(e) =>
                  updateFormData("password", e.target.value)
                }
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="register-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/register">Regístrate gratis</Link>
          </p>
        </div>
      </div>

      {/* ✅ MODAL ÉXITO */}
      {showSuccess && (
        <div className="success-modal">
          <div className="modal-content success">
            <h3>Inicio de sesión exitoso</h3>
            <p>Redirigiendo a tu perfil...</p>
          </div>
        </div>
      )}

      {/* MODAL de ERROR */}
      {showError && (
        <div className="error-modal">
          <div className="modal-content error">
            <h3>Datos erróneos</h3>
            <p>Correo o contraseña incorrectos</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;

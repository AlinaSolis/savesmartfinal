import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, TrendingUp } from "lucide-react";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Login.css";

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Estados para validación en vivo
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Función de validación por campo
  const validateField = (field: keyof LoginFormData, value: string): string => {
    switch (field) {
      case "email":
        if (!value.trim()) return "El correo electrónico es obligatorio";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Correo electrónico no válido";
        return "";
      case "password":
        if (!value) return "La contraseña es obligatoria";
        if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        return "";
      default:
        return "";
    }
  };

  // Validar todos los campos (para el submit)
  const validateAll = (): boolean => {
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  // Marcar campo como "tocado" al perder el foco
  const handleBlur = (field: keyof LoginFormData) => {
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, formData[field]) }));
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateAll();
    if (!isValid) {
      showToast("Por favor, completa todos los campos correctamente", "error");
      return;
    }

    setIsLoading(true);
    try {
      await authService.signIn({
        email: formData.email,
        password: formData.password,
      });
      refreshUser();
      showToast("¡Inicio de sesión exitoso!", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Correo o contraseña incorrectos";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LADO IZQUIERDO */}
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
            <span className="gradient-text">comienza aquí</span>
          </h2>
          <p className="subtitle">
            Gestiona tus ahorros con inteligencia artificial y alcanza tus
            metas financieras más rápido.
          </p>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="login-right">
        <div className="form-card">
          <center>
            <h2>Bienvenido</h2>
            <p className="form-subtitle">Ingresa tus credenciales para continuar</p>
          </center>

          <form onSubmit={handleLogin}>
            {/* Campo EMAIL */}
            <div className="label-container">
              <label className="custom-label">
                Correo electrónico <span className="required">*</span>
              </label>
            </div>
            <div className={`input-group ${errors.email && touched.email ? "error" : ""}`}>
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Escribe tu correo electrónico"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
              />
            </div>
            {errors.email && touched.email && <div className="error-message">{errors.email}</div>}

            {/* Campo CONTRASEÑA */}
            <div className="label-container">
              <label className="custom-label">
                Contraseña <span className="required">*</span>
              </label>
            </div>
            <div className={`input-group ${errors.password && touched.password ? "error" : ""}`}>
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Escribe tu contraseña"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && <div className="error-message">{errors.password}</div>}

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="login-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/register">Regístrate gratis</Link>
            <div style={{ padding: "8px" }}></div>
            <hr />
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Login;
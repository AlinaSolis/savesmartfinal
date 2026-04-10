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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar antes de enviar
    const isValid = validateAll();
    if (!isValid) return;

    setIsLoading(true);
    try {
      await authService.signIn({
        email: formData.email,
        password: formData.password,
      });
      refreshUser();
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar si el botón debe estar deshabilitado
  const isFormInvalid = !formData.email || !formData.password || !!errors.email || !!errors.password;

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
              disabled={isLoading || isFormInvalid}
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

      {/* MODAL ÉXITO */}
      {showSuccess && (
        <div className="success-modal">
          <div className="modal-content success">
            <h3>Inicio de sesión exitoso</h3>
            <p>Redirigiendo a tu perfil...</p>
          </div>
        </div>
      )}

      {/* MODAL ERROR */}
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
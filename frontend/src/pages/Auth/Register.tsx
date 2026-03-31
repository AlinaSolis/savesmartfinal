import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  TrendingUp,
} from "lucide-react";
import api from "../../services/authService";
import "../../styles/Register.css";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      showToast("El correo electrónico no es válido ❌", "error");
      return;
    }

    if (formData.password.length < 8) {
      showToast("La contraseña debe tener mínimo 8 caracteres ❌", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Las contraseñas no coinciden ❌", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/signup", {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("Respuesta:", response.data);

      showToast("¡Cuenta creada exitosamente! 🚀", "success");

      setTimeout(() => navigate("/login"), 1500);

    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Error al conectar con el servidor";

      showToast(errorMsg, "error");
      console.error(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="register-container">

      {/* IZQUIERDA */}
      <div className="register-left">
        <div className="left-content">
          <div className="brand">
            <div className="logo-box">
              <TrendingUp size={28} />
            </div>
            <h1>SaveSmart</h1>
          </div>

          <h2 className="hero-title">
            Comienza tu viaje hacia la <br />
            <span className="gradient-text">
              libertad financiera
            </span>
          </h2>

          <p className="subtitle">
            Regístrate gratis y descubre cómo la inteligencia artificial
            puede transformar tu forma de ahorrar.
          </p>

          <div className="info-card">
            <h4>100% Seguro y Encriptado</h4>
            <p>Tus datos están protegidos con los más altos estándares.</p>
          </div>

          <div className="info-card">
            <h4>Configuración Rápida</h4>
            <p>Empieza a ahorrar en menos de 3 minutos.</p>
          </div>
        </div>
      </div>

      {/* DERECHA */}
      <div className="register-right">
        <div className="form-card">
          <h2>Crea tu cuenta</h2>
          <p className="form-subtitle">
            Únete a miles de usuarios que ya ahorran de forma inteligente
          </p>

          <form onSubmit={handleRegister}>

            <div className="input-group">
              <User className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Nombre Completo"
                required
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
              />
            </div>

            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Correo Electrónico"
                required
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                required
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateFormData("confirmPassword", e.target.value)
                }
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <div className="password-box">
              <strong>La contraseña debe contener:</strong>
              <ul>
                <li>Al menos 8 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Un número</li>
              </ul>
            </div>

            {/* 🔥 FIX AQUÍ */}
            <div className="terms">
              <input type="checkbox" required />
              <span>
                Acepto los{" "}
                <button type="button" className="link-btn">
                  Términos y Condiciones
                </button>{" "}
                y la{" "}
                <button type="button" className="link-btn">
                  Política de Privacidad
                </button>
              </span>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear Cuenta Gratis"}
            </button>
          </form>

          <p className="login-text">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
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

export default Register;
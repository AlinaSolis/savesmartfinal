import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../../services/apiAuth";
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

  // Estados para errores de cada campo (se muestran al submit o al tocar el campo)
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estados para saber si el usuario ya "tocó" cada campo (para mostrar error solo después de interactuar o submit)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Estados para la caja de requisitos de contraseña
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Validación de requisitos de contraseña
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    number: false,
  });

  // Validar contraseña en tiempo real (requisitos)
  useEffect(() => {
    const pwd = formData.password;
    const valid = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    };
    setPasswordValid(valid);
  }, [formData.password]);

  // Función para validar un campo específico y devolver mensaje de error
  const validateField = (field: keyof RegisterFormData, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "El nombre es obligatorio";
        return "";
      case "email":
        if (!value) return "El correo es obligatorio";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Correo electrónico no válido";
        return "";
      case "password":
        if (!value) return "La contraseña es obligatoria";
        if (!passwordValid.length || !passwordValid.uppercase || !passwordValid.number)
          return "La contraseña no cumple los requisitos";
        return "";
      case "confirmPassword":
        if (!value) return "Confirma tu contraseña";
        if (value !== formData.password) return "Las contraseñas no coinciden";
        return "";
      default:
        return "";
    }
  };

  // Validar todos los campos (para el submit)
  const validateAll = (): boolean => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
    };
    setErrors(newErrors);
    // Marcar todos como "tocados" para que se muestren los errores
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    // Retorna true si no hay errores
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Si el campo ya había sido "tocado", validar en vivo
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  // Marcar campo como "tocado" cuando pierde el foco
  const handleBlur = (field: keyof RegisterFormData) => {
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, formData[field]) }));
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Validar todos los campos
    const isValid = validateAll();

    if (!isValid) {
      // Mostrar un toast general también (opcional)
      showToast("Por favor, completa todos los campos correctamente", "error");
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
      showToast("¡Cuenta creada exitosamente!", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Error al conectar con el servidor";
      showToast(errorMsg, "error");
      console.error(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar si mostrar la caja de requisitos de contraseña
  const showPasswordRules = (passwordFocus || formData.password.length > 0) && 
    !(passwordValid.length && passwordValid.uppercase && passwordValid.number);

  return (
    <div className="register-container">
      {/* LADO IZQUIERDO */}
      <div className="register-left">
        <div className="left-content">
          <div className="brand">
            <div  className="logo-box">
              <TrendingUp size={28} />
            </div>
              <h1>SaveSmart</h1> 
            
          </div>
          <h2 className="hero-title">
            Comienza tu viaje hacia la <br />
            <span className="gradient-text">libertad financiera</span>
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

      {/* LADO DERECHO */}
      <div className="register-right">
        <div className="form-card">
          <center><h2>Crea tu cuenta</h2></center>
          <p className="form-subtitle">
            Únete a miles de usuarios que ya ahorran de forma inteligente
          </p>

          <form onSubmit={handleRegister}>
            {/* Campo NOMBRE */}
            <div className="label-container">
              <label className="custom-label">
                Nombre completo <span className="required">*</span>
              </label>
            </div>
            <div className={`input-group ${errors.name && touched.name ? "error" : ""}`}>
              <User className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Escribe tu nombre completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
              />
            </div>
            {errors.name && touched.name && <div className="error-message">{errors.name}</div>}

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
                placeholder="ejemplo@correo.com"
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
                placeholder="Crea una contraseña segura"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => {
                  setPasswordFocus(false);
                  handleBlur("password");
                }}
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

            {/* Caja de requisitos de contraseña (aparece solo cuando es necesario) */}
            {showPasswordRules && (
              <div className={`password-box ${submitAttempted && !(passwordValid.length && passwordValid.uppercase && passwordValid.number) ? "password-box-error" : ""}`}>
                <strong>La contraseña debe contener:</strong>
                <ul>
                  <li className={passwordValid.length ? "valid" : "invalid"}>
                    {passwordValid.length ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    Al menos 8 caracteres
                  </li>
                  <li className={passwordValid.uppercase ? "valid" : "invalid"}>
                    {passwordValid.uppercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    Una letra mayúscula
                  </li>
                  <li className={passwordValid.number ? "valid" : "invalid"}>
                    {passwordValid.number ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    Un número
                  </li>
                </ul>
              </div>
            )}

            {/* Campo CONFIRMAR CONTRASEÑA */}
            <div className="label-container">
              <label className="custom-label">
                Confirmar contraseña <span className="required">*</span>
              </label>
            </div>
            <div className={`input-group ${errors.confirmPassword && touched.confirmPassword ? "error" : ""}`}>
              <Lock className="input-icon" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}

            {/* Términos y condiciones */}
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
            ¿Ya tienes cuenta? <br></br><Link to="/login">Inicia sesión</Link>
                <div  style={{ margin: '9px'}}></div>
            
            <hr />
          </p>
        </div>
      </div>

      {/* Toast (éxito o error) */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Register;
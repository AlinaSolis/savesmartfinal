import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, TrendingUp } from "lucide-react";
import { authService } from "../../services/authService";
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
    await authService.signIn({
      email: formData.email,
      password: formData.password,
    });

    // ÉXITO
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/perfil");
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
         <center> 
          <h2>Bienvenido</h2>
          <p className="form-subtitle">
            Ingresa tus credenciales para continuar
          </p>
          
          </center>

          <form onSubmit={handleLogin}>
                <div className="label-container">
                  <label className="custom-label">
                    Correo electrónico <span className="required">*</span>
                  </label>
                </div> 
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Escribe tu correo electrónico"
                required
                value={formData.email}
                onChange={(e) =>
                  updateFormData("email", e.target.value)
                }
              />
            </div>
                <div className="label-container">
                  <label className="custom-label">
                    Escribe tu contraseña <span className="required">*</span>
                  </label>
                </div> 
                
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Escribe tu contraseña"
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
          

          <div className="login-text">
            ¿No tienes una cuenta?{" "}
            <div >
                 <Link to="/register">Regístrate gratis</Link>
            </div>
           <div style={{ padding: '8px' }}></div>
            <hr />
            
          </div>
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
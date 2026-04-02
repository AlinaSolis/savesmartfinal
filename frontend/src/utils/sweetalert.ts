import Swal from 'sweetalert2';

// Configuración base de SweetAlert2 con tema oscuro
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#0f1115',
  color: '#ffffff',
  customClass: {
    popup: 'border border-gray-700',
    timerProgressBar: 'bg-gradient-to-r from-cyan-400 to-purple-500'
  }
});

export const showSuccess = (message: string, title: string = '¡Éxito!'): Promise<any> => {
  return Toast.fire({
    icon: 'success',
    title: title,
    text: message,
  });
};

export const showError = (message: string, title: string = 'Error'): Promise<any> => {
  return Toast.fire({
    icon: 'error',
    title: title,
    text: message,
  });
};

export const showWarning = (message: string, title: string = 'Advertencia'): Promise<any> => {
  return Toast.fire({
    icon: 'warning',
    title: title,
    text: message,
  });
};

export const showInfo = (message: string, title: string = 'Información'): Promise<any> => {
  return Toast.fire({
    icon: 'info',
    title: title,
    text: message,
  });
};

export const showConfirm = (message: string, title: string = '¿Estás seguro?'): Promise<any> => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    background: '#0f1115',
    color: '#ffffff',
    customClass: {
      popup: 'border border-gray-700',
      confirmButton: 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold px-6 py-2 rounded-lg mx-2',
      cancelButton: 'bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg mx-2'
    },
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  });
};

export default Swal;
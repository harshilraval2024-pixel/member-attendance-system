import Swal from 'sweetalert2';

// Pre-configured SweetAlert2 instance matching the teal/blue theme
const swal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary mx-1',
    cancelButton: 'btn btn-outline-secondary mx-1',
    popup: 'swal-themed',
  },
  buttonsStyling: false,
});

// ─── Success toast (top-end) ───
export const showSuccess = (title, text) =>
  swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2500,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    iconColor: '#0d9488',
  });

// ─── Error toast (top-end) ───
export const showError = (title, text) =>
  swal.fire({
    icon: 'error',
    title,
    text,
    timer: 3500,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    iconColor: '#ef4444',
  });

// ─── Delete confirmation dialog ───
export const confirmDelete = (name) =>
  swal.fire({
    title: 'Delete Member?',
    html: `<p style="color:#64748b;margin:0">You are about to permanently delete <strong>${name}</strong>. This action cannot be undone.</p>`,
    icon: 'warning',
    iconColor: '#ef4444',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true,
  });

// ─── Generic confirmation dialog ───
export const confirmAction = (title, text, confirmText = 'Confirm') =>
  swal.fire({
    title,
    text,
    icon: 'question',
    iconColor: '#0d9488',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

// ─── Welcome / info popup ───
export const showWelcome = (username) =>
  swal.fire({
    icon: 'success',
    title: 'Welcome back!',
    text: username ? `Signed in as ${username}` : 'Login successful',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    iconColor: '#0d9488',
  });

export default swal;

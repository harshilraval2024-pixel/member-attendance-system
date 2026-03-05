import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores';
import LoginForm from '../components/forms/LoginForm';
import { showWelcome, showError } from '../utils/swal';

const LoginPage = observer(() => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const success = await authStore.login(values);
    if (success) {
      showWelcome(authStore.admin?.username);
      navigate('/');
    } else {
      showError('Login Failed', authStore.error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card">
        <div className="login-header">
          <div className="login-logo">
            <FontAwesomeIcon icon={faSignInAlt} />
          </div>
          <h3>Member Attendance System</h3>
          <p>Sign in to your admin account</p>
        </div>

        <div className="card-body">
          {authStore.error && (
            <div className="alert alert-danger py-2">{authStore.error}</div>
          )}

          <LoginForm onSubmit={handleLogin} loading={authStore.loading} />

          <div className="text-center mt-3">
            <small style={{ color: 'var(--gray-400)' }}>
              Demo: admin@example.com / admin123
            </small>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoginPage;

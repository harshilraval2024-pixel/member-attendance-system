import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { loginValidationSchema } from '../../utils/validationSchemas';

const LoginForm = ({ onSubmit, loading }) => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="mb-3">
            <label className="form-label">
              <FontAwesomeIcon icon={faEnvelope} className="me-1" />
              Email
            </label>
            <Field name="email" type="email" className="form-control" placeholder="admin@example.com" />
            <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <FontAwesomeIcon icon={faLock} className="me-1" />
              Password
            </label>
            <Field name="password" type="password" className="form-control" placeholder="Enter password" />
            <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;

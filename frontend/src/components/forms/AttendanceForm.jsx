import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendarAlt,
  faClipboardCheck,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { memberStore } from '../../stores';
import { attendanceValidationSchema } from '../../utils/validationSchemas';

const AttendanceForm = observer(({ onSubmit }) => {
  useEffect(() => {
    memberStore.fetchMembers({ limit: 1000 });
  }, []);

  const initialValues = {
    memberId: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={attendanceValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await onSubmit(values);
          resetForm();
        } catch (err) {
          // handled by store
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="card" style={{ borderRadius: '14px', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <div className="card-header card-header-blue">
              <FontAwesomeIcon icon={faClipboardCheck} className="me-2" />
              Record Attendance
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} className="me-1 text-muted" />
                    Member <span className="text-danger">*</span>
                  </label>
                  <Field as="select" name="memberId" className="form-select">
                    <option value="">Select a member</option>
                    {memberStore.members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.firstName} {m.surname}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="memberId" component="div" className="text-danger small mt-1" />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1 text-muted" />
                    Date <span className="text-danger">*</span>
                  </label>
                  <Field name="date" type="date" className="form-control" />
                  <ErrorMessage name="date" component="div" className="text-danger small mt-1" />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faClipboardCheck} className="me-1 text-muted" />
                    Status <span className="text-danger">*</span>
                  </label>
                  <Field as="select" name="status" className="form-select">
                    <option value="">Select status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-danger small mt-1" />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Record Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
});

export default AttendanceForm;

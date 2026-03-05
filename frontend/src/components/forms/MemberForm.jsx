import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendarAlt,
  faMapMarkerAlt,
  faBriefcase,
  faGraduationCap,
  faBuilding,
  faTools,
  faHeart,
  faSave,
  faPlus,
  faTimes,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { memberValidationSchema } from '../../utils/validationSchemas';
import { formatDateInput } from '../../utils/helpers';

const MemberForm = ({ initialValues, onSubmit, isEditing = false }) => {
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const defaultValues = {
    firstName: '',
    surname: '',
    fatherName: '',
    dob: '',
    address: '',
    status: '',
    studyField: '',
    jobTitle: '',
    company: '',
    skills: [],
    occupation: '',
    interests: [],
    ...initialValues,
    dob: initialValues?.dob ? formatDateInput(initialValues.dob) : '',
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={memberValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await onSubmit(values);
          if (!isEditing) resetForm();
        } catch (err) {
          // Error handled by store
        }
        setSubmitting(false);
      }}
      enableReinitialize
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          {/* Personal Information */}
          <div className="card mb-4" style={{ borderRadius: '14px', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <div className="card-header card-header-teal">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Personal Information
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} className="me-1 text-muted" />
                    First Name <span className="text-danger">*</span>
                  </label>
                  <Field name="firstName" className="form-control" placeholder="Enter first name" />
                  <ErrorMessage name="firstName" component="div" className="text-danger small mt-1" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} className="me-1 text-muted" />
                    Surname <span className="text-danger">*</span>
                  </label>
                  <Field name="surname" className="form-control" placeholder="Enter surname" />
                  <ErrorMessage name="surname" component="div" className="text-danger small mt-1" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUserTie} className="me-1 text-muted" />
                    Father Name <span className="text-danger">*</span>
                  </label>
                  <Field name="fatherName" className="form-control" placeholder="Enter father name" />
                  <ErrorMessage name="fatherName" component="div" className="text-danger small mt-1" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1 text-muted" />
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <Field name="dob" type="date" className="form-control" />
                  <ErrorMessage name="dob" component="div" className="text-danger small mt-1" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1 text-muted" />
                    Address <span className="text-danger">*</span>
                  </label>
                  <Field name="address" className="form-control" placeholder="Enter address" />
                  <ErrorMessage name="address" component="div" className="text-danger small mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Education / Job */}
          <div className="card mb-4" style={{ borderRadius: '14px', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <div className="card-header card-header-blue">
              <FontAwesomeIcon icon={faBriefcase} className="me-2" />
              Education / Job Status
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Field as="select" name="status" className="form-select">
                    <option value="">Select status</option>
                    <option value="studying">Studying</option>
                    <option value="working">Working</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-danger small mt-1" />
                </div>

                {values.status === 'studying' && (
                  <div className="col-md-8">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faGraduationCap} className="me-1 text-muted" />
                      Field of Study <span className="text-danger">*</span>
                    </label>
                    <Field name="studyField" className="form-control" placeholder="e.g. Computer Science" />
                    <ErrorMessage name="studyField" component="div" className="text-danger small mt-1" />
                  </div>
                )}

                {values.status === 'working' && (
                  <>
                    <div className="col-md-4">
                      <label className="form-label">
                        <FontAwesomeIcon icon={faBriefcase} className="me-1 text-muted" />
                        Job Title <span className="text-danger">*</span>
                      </label>
                      <Field name="jobTitle" className="form-control" placeholder="e.g. Software Engineer" />
                      <ErrorMessage name="jobTitle" component="div" className="text-danger small mt-1" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        <FontAwesomeIcon icon={faBuilding} className="me-1 text-muted" />
                        Company Name <span className="text-danger">*</span>
                      </label>
                      <Field name="company" className="form-control" placeholder="e.g. Tech Corp" />
                      <ErrorMessage name="company" component="div" className="text-danger small mt-1" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card mb-4" style={{ borderRadius: '14px', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <div className="card-header card-header-slate">
              <FontAwesomeIcon icon={faTools} className="me-2" />
              Additional Information
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Skills */}
                <div className="col-md-6">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faTools} className="me-1 text-muted" />
                    Skills
                  </label>
                  <FieldArray name="skills">
                    {({ push, remove }) => (
                      <div>
                        <div className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Add a skill"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (skillInput.trim()) {
                                  push(skillInput.trim());
                                  setSkillInput('');
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              if (skillInput.trim()) {
                                push(skillInput.trim());
                                setSkillInput('');
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {values.skills.map((skill, index) => (
                            <span key={index} className="tag-badge tag-skill d-flex align-items-center gap-1">
                              {skill}
                              <FontAwesomeIcon
                                icon={faTimes}
                                className="ms-1 tag-remove"
                                style={{ cursor: 'pointer' }}
                                onClick={() => remove(index)}
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Interests */}
                <div className="col-md-6">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faHeart} className="me-1 text-muted" />
                    Interests
                  </label>
                  <FieldArray name="interests">
                    {({ push, remove }) => (
                      <div>
                        <div className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Add an interest"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (interestInput.trim()) {
                                  push(interestInput.trim());
                                  setInterestInput('');
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-info"
                            onClick={() => {
                              if (interestInput.trim()) {
                                push(interestInput.trim());
                                setInterestInput('');
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {values.interests.map((interest, index) => (
                            <span key={index} className="tag-badge tag-interest d-flex align-items-center gap-1">
                              {interest}
                              <FontAwesomeIcon
                                icon={faTimes}
                                className="ms-1 tag-remove"
                                style={{ cursor: 'pointer' }}
                                onClick={() => remove(index)}
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Occupation */}
                <div className="col-12">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faBriefcase} className="me-1 text-muted" />
                    Occupation
                  </label>
                  <Field name="occupation" className="form-control" placeholder="Enter occupation" />
                  <ErrorMessage name="occupation" component="div" className="text-danger small mt-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  {isEditing ? 'Update Member' : 'Register Member'}
                </>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default MemberForm;

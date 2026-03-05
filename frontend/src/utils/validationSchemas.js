import * as Yup from 'yup';

export const memberValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Cannot exceed 50 characters'),
  surname: Yup.string()
    .required('Surname is required')
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Cannot exceed 50 characters'),
  fatherName: Yup.string()
    .required('Father name is required')
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Cannot exceed 50 characters'),
  dob: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  address: Yup.string()
    .required('Address is required')
    .max(200, 'Cannot exceed 200 characters'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['studying', 'working'], 'Invalid status'),
  studyField: Yup.string().when('status', {
    is: 'studying',
    then: (schema) => schema.required('Field of study is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  jobTitle: Yup.string().when('status', {
    is: 'working',
    then: (schema) => schema.required('Job title is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  company: Yup.string().when('status', {
    is: 'working',
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  skills: Yup.array().of(Yup.string()),
  occupation: Yup.string().max(100, 'Cannot exceed 100 characters'),
  interests: Yup.array().of(Yup.string()),
});

export const attendanceValidationSchema = Yup.object().shape({
  memberId: Yup.string().required('Please select a member'),
  date: Yup.date().required('Date is required'),
  status: Yup.string()
    .required('Attendance status is required')
    .oneOf(['present', 'absent'], 'Invalid status'),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Must be at least 6 characters'),
});

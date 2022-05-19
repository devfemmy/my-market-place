import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
  email: yup.string().email().required('email is required'),
  password: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

export const RegisterSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('last name is required'),
  phoneNumber: yup.string().required('phone is required'),
  email: yup.string().email().required('email is required'),
  password: yup
    .string()
    .min(8, ({min}) => `password must be at least ${min} characters`)
    .required('password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('confirm password is required'),
});

export const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required('email is required'),
});

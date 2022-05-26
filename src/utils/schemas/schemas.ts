import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
  email: yup.string().email().required('email is required'),
  password: yup
    .string()
    .min(7, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

export const RegisterSchema = yup.object().shape({
  fName: yup.string().required('First name is required'),
  lName: yup.string().required('last name is required'),
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

export const StoreFormSchema = yup.object().shape({
  storeName: yup.string().required('Store name is required'),
  description: yup.string().required('Store description is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  street: yup.string().required('Street name is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
});

import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup
    .string()
    .min(6, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

export const RegisterSchema = yup.object().shape({
  fName: yup.string().required('First name is required'),
  lName: yup.string().required('Last name is required'),
  phoneNumber: yup.string().min(7, ({min}) => `Phone must be at least ${min} characters`)
  .required('Phone is required'),
  email: yup.string().email().required('Email is required'),
  password: yup
    .string()
    .min(11, ({min}) => `Password must be at least ${min} characters`)
    .required('password is required'),
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref('password'), null], 'Passwords must match')
  //   .required('Confirm password is required'),
});

export const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
});

export const StoreFormSchema = yup.object().shape({
  storeName: yup.string().required('Store name is required'),
  description: yup.string().required('Store description is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  street: yup.string().required('Street name is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
});

export const ProductFormData1Schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string(),
  category: yup.string().required('Category is required'),
  sizes: yup.bool(),
  colours: yup.bool(),
});

export const StaffFormDataSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email().required('Email is required'),
  role: yup.string().required('Role is required'),
});


export const DeliveryFormSchema = yup.object().shape({  
  state: yup.string().required('State is required'),
  price: yup.string().required('Price is required')
});

export const LandmarkFormSchema = yup.object().shape({  
  city: yup.string().required('City is required'),
  price: yup.string().required('Price is required')
});

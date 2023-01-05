import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup
    .string()
    .min(6, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

export const updateSchema = yup.object().shape({
  fName: yup.string().required('First Name is required'),
  lName: yup.string().required('Last Name is required')
});
export const DeliverySchema = yup.object().shape({
  first_name: yup.string().required('Receiver firstname is required'), 
  last_name: yup.string().required('Receiver lastname is required'), 
  // email: yup.string().email().required('Receiver email is required'), 
  street: yup.string().required('Street is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  phone_number: yup.number().required('Phone number is required')
 });
 export const PayoutSchema = yup.object().shape({
  bankName: yup.string().required('Bank name is required'),
  bankNumber: yup.string().required('Bank number is required'),

 })
export const AddStaffSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  role: yup.string().required('Role is required')
 })
 export const ProfileFormSchema = yup.object().shape({
  lName: yup.string().required('Surname is required'),
  fName: yup.string().required('First name is required'),
  email: yup.string().email().required('Email is required'),
  mobile: yup.string().required('Phone number is required'),
 })

export const RegisterSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email().required('Email is required'),
  password: yup
    .string()
    .min(6, ({min}) => `Password must be at least ${min} characters`)
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
  // estimatedDeliveryDuration: yup.string().required('Estimated delivery duration is required'),
});
export const ProductColorAloneSchema = yup.object().shape({  
  price: yup.number().min(500, ({min}) => `Price must be at least ${min}`).required('Price is required'),
  description: yup.string().required('Description is required')
});
 
export const ProductNoColorSchema = yup.object().shape({  
  price: yup.number().min(500, ({min}) => `Price must be at least ${min}`).required('Price is required')
 });

 export const ProductColorSchema = yup.object().shape({  
  description: yup.string().required('Color description is required')
 });
 
export const ProductSizeSchema = yup.object().shape({  
  price: yup.number().min(500, ({min}) => `Price must be at least ${min}`).required('Price is required'),
  size: yup.string().required('Size is required')
 });


export const ProductSchema = yup.object().shape({  
  productName: yup.string().required('Product name is required'),
  productDescription: yup.string().required('Product description is required'),
  category: yup.string().required('Category is required'),
  estimated_delivery_duration: yup.string().required("Expected Delivery Duration is required")
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

export const PayoutFormDataSchema = yup.object().shape({
  account_name: yup.string().required('Account name is required'),
  bank_account_number: yup.string().required('Account number is required'),
  bank_name: yup.string().required('Bank is required'),
});


export const DeliveryFormSchema = yup.object().shape({  
  state: yup.string().required('State is required'),
  price: yup.string().required('Price is required')
});

export const LandmarkFormSchema = yup.object().shape({  
  city: yup.string().required('City is required'),
  price: yup.string().required('Price is required')
});

import { LoginInput } from '@/graphql/generated/graphql'
import * as yup from 'yup'
export const loginSchema: yup.ObjectSchema<LoginInput> = yup.object({
  email: yup.string().email('Invalid email format').required('Please enter your email address'),
  password: yup.string().required('Please enter your password'),
})

import * as yup from "yup";

export const registrationSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required")
      .min(2, `Username must be at least 4 characters`),
    email: yup
      .string()
      .required("Email is required")
      .email("Must be a valid email"),
    name: yup
      .string()
      .required("Name is required")
      .min(2, `Username must be at least 4 characters`),
    password: yup
      .string()
      .required("Password is required")
      .min(4, `Password must be at least 4 characters`)
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number"),
  })
  .required();

export type RegistrationFormData = yup.InferType<typeof registrationSchema>;

import * as yup from "yup";

export const registrationSchema = yup
  .object({
    username: yup.string().required("Username is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Must be a valid email"),
    name: yup.string().required("Name is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export type RegistrationFormData = yup.InferType<typeof registrationSchema>;

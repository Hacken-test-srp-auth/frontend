import * as yup from "yup";

export const profileSchema = yup
  .object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, `Name must be at least 4 characters`),
    username: yup
      .string()
      .required("Username is required")
      .min(2, `Name must be at least 4 characters`),
  })
  .required();

export type ProfileFormData = yup.InferType<typeof profileSchema>;

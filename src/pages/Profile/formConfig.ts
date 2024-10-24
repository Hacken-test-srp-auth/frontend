import * as yup from "yup";

export const profileSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    username: yup.string().required("Username is required"),
  })
  .required();

export type ProfileFormData = yup.InferType<typeof profileSchema>;

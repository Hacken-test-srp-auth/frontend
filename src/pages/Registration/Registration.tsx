import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { User, Mail, UserPlus } from "lucide-react";

import { Link } from "react-router-dom";
import { register as registerUser } from "~/services/auth";
import useBoundStore from "~/store/useStore";
import { PasswordInput, FormInput } from "~/components";
import { RegistrationFormData, registrationSchema } from "./formConfig";
import { SRPService } from "~/srp/srp-client";

export const Registration: React.FC = () => {
  const { setLoggedIn } = useBoundStore();

  const methods = useForm<RegistrationFormData>({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = async ({
    email,
    name,
    username,
    password,
  }: RegistrationFormData) => {
    const { salt, verifier } = SRPService.generateRegistrationData(
      email,
      password
    );

    const registrationData = {
      email,
      name,
      username,
      salt,
      verifier,
    };

    try {
      const { refreshToken, accessToken } =
        await registerUser(registrationData);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Account
      </h2>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              name="username"
              label="Username"
              placeholder="Enter your username"
              icon={<User className="h-4 w-4 text-gray-500" />}
            />

            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="h-4 w-4 text-gray-500" />}
            />

            <FormInput
              name="name"
              label="Name"
              placeholder="Enter your full name"
              icon={<UserPlus className="h-4 w-4 text-gray-500" />}
            />

            <PasswordInput name="password" placeholder="Create a password" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Register
            </button>

            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Already have an account?
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

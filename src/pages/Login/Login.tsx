import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { completeLogin, initLogin } from "~/services/auth";
import useBoundStore from "~/store/useStore";
import { PasswordInput, FormInput } from "~/components";
import { LoginFormData, loginSchema } from "./formConfig";
import { SRPService } from "~/srp/srp-client";
import { ethers } from "ethers";

export const Login: FC = () => {
  const { setLoggedIn } = useBoundStore();

  const methods = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      const { salt, serverPublicKey } = await initLogin(email);

      const { clientPublicKey, clientProof, K } = SRPService.computeLoginProof(
        email,
        password,
        salt,
        serverPublicKey
      );

      const { accessToken, refreshToken, M2 } = await completeLogin(
        email,
        clientPublicKey,
        clientProof
      );

      const expectedM2 = ethers.keccak256(
        ethers.concat([
          ethers.toBeArray(BigInt(clientPublicKey)),
          ethers.getBytes(clientProof),
          K,
        ])
      );

      if (M2 !== ethers.hexlify(expectedM2)) {
        throw new Error("Server verification failed");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Welcome Back
      </h2>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="h-4 w-4 text-gray-500" />}
            />

            <PasswordInput name="password" placeholder="Enter your password" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Sign In
            </button>

            <Link
              to="/registration"
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
            >
              Create account
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

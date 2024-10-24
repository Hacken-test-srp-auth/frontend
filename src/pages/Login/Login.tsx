import React, { useState } from "react";
import { ethers } from "ethers";
import { completeLogin, initLogin } from "~/services/auth";
import useBoundStore from "~/store/useStore";
import { SRPService } from "~/srp/srp-client";
import { LoginFormData, loginSchema } from "./formConfig";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";

export const Login: React.FC = () => {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const { setLoggedIn } = useBoundStore();

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    const { email, password } = data;
    try {
      const { salt, serverPublicKey } = await initLogin(email);

      const { clientPublicKey, clientProof, K } = SRPService.computeLoginProof(
        email,
        password,
        salt,
        serverPublicKey
      );

      // Step 5: Complete login
      const { accessToken, refreshToken, M2 } = await completeLogin(
        email,
        clientPublicKey,
        clientProof
      );

      // Step 6: Verify server proof
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

      // Redirect or update app state here
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
            >
              <Mail className="h-4 w-4 text-gray-500" />
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter your email"
              className={classNames(
                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white",
                {
                  "border-red-500": errors.email,
                  "border-gray-300": !errors.email,
                }
              )}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
            >
              <Lock className="h-4 w-4 text-gray-500" />
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={classNames(
                  "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white",
                  {
                    "border-red-500": errors.password,
                    "border-gray-300": !errors.password,
                  }
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
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
    </div>
  );
};

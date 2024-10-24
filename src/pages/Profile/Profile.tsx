import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { User, Mail, Loader2 } from "lucide-react";
import useBoundStore from "~/store/useStore";
import { FormInput } from "~/components/FormInput";
import { ProfileFormData, profileSchema } from "./formConfig";

export const Profile: FC = () => {
  const { profile, updateProfile, setProfile } = useBoundStore();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      username: profile?.username || "",
    },
  });

  useEffect(() => {
    setProfile();
  }, [setProfile]);

  useEffect(() => {
    if (profile) {
      methods.reset({
        name: profile.name,
        username: profile.username,
      });
    }
  }, [profile, methods]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateProfile(data);
      setSuccessMessage("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Profile Settings
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              name="name"
              label="Name"
              placeholder="Enter your name"
              icon={<User className="h-4 w-4 text-gray-500" />}
            />
            <FormInput
              name="username"
              label="Username"
              placeholder="Enter your username"
              icon={<Mail className="h-4 w-4 text-gray-500" />}
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200">
              {successMessage}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

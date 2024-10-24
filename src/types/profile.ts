export interface Profile {
  name: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name: string;
  username: string;
}

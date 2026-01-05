import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    backendData?: {
      token?: string;
      user_data?: any;
      is_registered?: boolean;
      missing_fields?: any;
      error?: string;
    };
    accessToken?: string;
    role?: string;
  }

  interface User {
    backendData?: {
      token?: string;
      user_data?: any;
      is_registered?: boolean;
      missing_fields?: any;
      error?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    backendToken?: string;
    backendData?: {
      token?: string;
      user_data?: any;
      is_registered?: boolean;
      missing_fields?: any;
      error?: string;
    };
    role?: string;
  }
}


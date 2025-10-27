export interface IUserTokenManager {
  accessToken: string;
  refreshToken: string;
  expirationTime: number;
}

export interface ISecureStoreAuthData {
  accessToken: string;
  refreshToken: string;
  uid: string;
  email: string;
  expirationTime: number;
}

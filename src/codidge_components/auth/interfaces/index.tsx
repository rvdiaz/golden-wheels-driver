export enum IAuthModuleKeys {
  signIn = 'SignIn',
  signUp = 'SignUp',
  forcePasswordChange = 'ForcePasswordChange',
  confirmResetPassword = 'ConfirmResetPassword',
  resetPassword = 'ResetPassword',
  verifyEmail = 'VerifyEmail',
  mfa = 'Mfa',
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface ChangePasswordFormData {
  confirmationCode: string;
  newPassword: string;
}

export interface MfaFormData {
  code: string;
}

export enum IAuthModuleKeys {
  signIn = 'SignIn',
  signUp = 'SignUp',
  /**
   * The one-time code emailed by Cognito when the driver signs in.
   *
   * Drivers on Codidge are passwordless: there is no password to set and none to forget, so
   * `forcePasswordChange` no longer occurs on this path. It is kept because the same auth
   * module is shared with other apps whose pools still use passwords.
   */
  emailOtp = 'EmailOtp',
  forcePasswordChange = 'ForcePasswordChange',
  confirmResetPassword = 'ConfirmResetPassword',
  resetPassword = 'ResetPassword',
  verifyEmail = 'VerifyEmail',
  mfa = 'Mfa',
}

export interface LoginFormData {
  email: string;
  /** Unused on the passwordless driver path; still required by password-based pools. */
  password?: string;
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
  /** Only in the forgot-password flow — the invitation flow has no code. */
  confirmationCode?: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface MfaFormData {
  code: string;
}

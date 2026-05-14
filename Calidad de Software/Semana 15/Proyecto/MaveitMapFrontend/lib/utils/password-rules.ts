'use client';

export function getPasswordValidation(password: string) {
  const length = password.length >= 8;
  const upper = /[A-Z]/.test(password);
  const lower = /[a-z]/.test(password);
  const number = /\d/.test(password);
  const special = /[^A-Za-z0-9]/.test(password);
  return {
    length,
    upper,
    lower,
    number,
    special,
    isValid: length && upper && lower && number && special,
  };
}

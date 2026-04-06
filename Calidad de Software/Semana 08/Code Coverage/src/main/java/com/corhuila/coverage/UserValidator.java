package com.corhuila.coverage;

public class UserValidator {

    public boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return email.contains("@") && email.contains(".");
    }

    public boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        return hasUpper && hasDigit;
    }

    public boolean isValidUsername(String username) {
        if (username == null || username.length() < 3) {
            return false;
        }
        return username.matches("[a-zA-Z0-9_]+");
    }
}
package com.corhuila.calidad;

public class BankAccount {
    private double balance;
    private String accountNumber;

    // DEFECTO 7: Campo mutable sin sincronización
    public double balance_public = 0.0;

    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    // DEFECTO 8: Lógica ilógica
    public void deposit(double amount) {
        if (amount < 0) {
            System.out.println("Error: cantidad negativa");
            balance = balance + amount; // ¡Sigue depositando cantidad negativa!
        }
    }

    // DEFECTO 9: Comparación con == en lugar de equals()
    public boolean isSameAccount(BankAccount other) {
        return this.accountNumber == other.accountNumber; // Incorrecto
    }

    // DEFECTO 10: Código muerto
    public double getBalance() {
        double temp = balance * 2;
        return balance; // temp nunca se usa
    }
}

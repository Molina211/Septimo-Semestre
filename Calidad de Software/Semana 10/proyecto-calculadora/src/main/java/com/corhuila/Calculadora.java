package com.corhuila;

/**
 * Calculadora simple que realiza operaciones matemáticas básicas.
 * Cumple con los requisitos REQ-001 a REQ-005.
 */
public class Calculadora {

    /**
     * Suma dos números enteros.
     * REQ-001: Suma de dos números
     *
     * @param a primer número
     * @param b segundo número
     * @return suma de a + b
     */
    public int sumar(int a, int b) {
        return a + b;
    }

    /**
     * Resta dos números enteros.
     * REQ-002: Resta de dos números
     *
     * @param a minuendo
     * @param b sustraendo
     * @return resta a - b
     */
    public int restar(int a, int b) {
        return a - b;
    }

    /**
     * Multiplica dos números enteros.
     * REQ-003: Multiplicación de dos números
     *
     * @param a multiplicando
     * @param b multiplicador
     * @return producto a * b
     */
    public int multiplicar(int a, int b) {
        return a * b;
    }

    /**
     * Divide dos números.
     * REQ-004: División de dos números
     * REQ-005: Validar divisor no cero
     *
     * @param a dividendo
     * @param b divisor
     * @return resultado de a / b como double
     * @throws IllegalArgumentException si b es cero
     */
    public double dividir(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("El divisor no puede ser cero");
        }
        return (double) a / b;
    }
}

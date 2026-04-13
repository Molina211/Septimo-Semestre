package com.corhuila;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Suite de pruebas unitarias para la clase Calculadora.
 * Cada método de prueba corresponde a un caso de prueba del plan.
 */
public class CalculadoraTest {

    private Calculadora calc = new Calculadora();

    // ========== PRUEBAS PARA SUMA (REQ-001) ==========

    /**
     * TC-001: Suma normal
     * Verifica que la suma de dos números positivos es correcta
     */
    @Test
    public void testSumarDosNumerosPositivos() {
        // ARRANGE
        int a = 5;
        int b = 3;

        // ACT
        int resultado = calc.sumar(a, b);

        // ASSERT
        assertEquals(8, resultado, "5 + 3 debe ser 8");
    }

    /**
     * TC-002: Suma con negativos
     * Verifica que la suma funciona con números negativos
     */
    @Test
    public void testSumarNumerosNegativos() {
        int resultado = calc.sumar(-5, -3);
        assertEquals(-8, resultado, "-5 + (-3) debe ser -8");
    }

    /**
     * TC-003: Suma con cero
     * Verifica que sumar cero no afecta el resultado
     */
    @Test
    public void testSumarConCero() {
        int resultado = calc.sumar(5, 0);
        assertEquals(5, resultado, "5 + 0 debe ser 5");
    }

    // ========== PRUEBA PARA RESTA (REQ-002) ==========

    /**
     * TC-004: Resta normal
     */
    @Test
    public void testRestarDosNumeros() {
        int resultado = calc.restar(10, 4);
        assertEquals(6, resultado, "10 - 4 debe ser 6");
    }

    // ========== PRUEBA PARA MULTIPLICACIÓN (REQ-003) ==========

    /**
     * TC-005: Multiplicación normal
     */
    @Test
    public void testMultiplicarDosNumeros() {
        int resultado = calc.multiplicar(4, 5);
        assertEquals(20, resultado, "4 * 5 debe ser 20");
    }

    // ========== PRUEBAS PARA DIVISIÓN (REQ-004 y REQ-005) ==========

    /**
     * TC-006: División normal
     * Verifica que la división retorna un double correctamente
     */
    @Test
    public void testDividirDosNumeros() {
        double resultado = calc.dividir(10, 2);
        assertEquals(5.0, resultado, 0.01, "10 / 2 debe ser 5.0");
    }

    /**
     * TC-007: División por cero lanza excepción
     * Verifica que se lanza IllegalArgumentException cuando divisor es cero
     */
    @Test
    public void testDividirPorCeroThrowsException() {
        assertThrows(
                IllegalArgumentException.class,
                () -> calc.dividir(10, 0),
                "Debe lanzar IllegalArgumentException cuando divisor es 0"
        );
    }
}

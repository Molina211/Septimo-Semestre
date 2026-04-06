package com.corhuila.coverage;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

public class CalculatorTest {

    private Calculator calc;

    @Before
    public void setUp() {
        calc = new Calculator();
    }

    @Test
    public void testAdd() {
        assertEquals(5, calc.add(2, 3));
        assertEquals(0, calc.add(-1, 1));
    }

    @Test
    public void testSubtract() {
        assertEquals(1, calc.subtract(3, 2));
    }

    @Test
    public void testMultiply() {
        assertEquals(6, calc.multiply(2, 3));
        assertEquals(0, calc.multiply(2, 0));
    }

    @Test
    public void testDivide() {
        assertEquals(2.0, calc.divide(4, 2), 0.01);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testDivideByZero() {
        calc.divide(1, 0);
    }

    @Test
    public void testIsPositive() {
        assertTrue(calc.isPositive(5));
        assertFalse(calc.isPositive(-5));
    }

    @Test
    public void testGetGrade() {
        assertEquals("A", calc.getGrade(95));
        assertEquals("B", calc.getGrade(85));
        assertEquals("C", calc.getGrade(75));
        assertEquals("D", calc.getGrade(65));
        assertEquals("F", calc.getGrade(50));
    }
}
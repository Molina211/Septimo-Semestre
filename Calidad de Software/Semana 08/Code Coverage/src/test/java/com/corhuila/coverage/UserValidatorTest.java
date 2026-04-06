package com.corhuila.coverage;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

public class UserValidatorTest {

    private UserValidator validator;

    @Before
    public void setUp() {
        validator = new UserValidator();
    }

    @Test
    public void testValidEmail() {
        assertTrue(validator.isValidEmail("user@example.com"));
        assertFalse(validator.isValidEmail("invalidemail"));
        assertFalse(validator.isValidEmail(""));
        assertFalse(validator.isValidEmail(null));
    }

    @Test
    public void testEmailMissingParts() {
        assertFalse(validator.isValidEmail("user@com"));
        assertFalse(validator.isValidEmail("user.com"));
    }

    @Test
    public void testValidPassword() {
        assertTrue(validator.isValidPassword("MyPass123"));
        assertFalse(validator.isValidPassword("short"));
        assertFalse(validator.isValidPassword("nouppercase123"));
        assertFalse(validator.isValidPassword("NODIGITS"));
    }

    @Test
    public void testPasswordNull() {
        assertFalse(validator.isValidPassword(null));
    }

    @Test
    public void testPasswordNoUpperNoDigit() {
        assertFalse(validator.isValidPassword("password"));
    }

    @Test
    public void testPasswordExactLengthNoUpperNoDigit() {
        assertFalse(validator.isValidPassword("abcdefgh"));
    }

    @Test
    public void testValidUsername() {
        assertTrue(validator.isValidUsername("user_123"));
        assertFalse(validator.isValidUsername("ab"));
        assertFalse(validator.isValidUsername("user@invalid"));
    }

    @Test
    public void testUsernameNull() {
        assertFalse(validator.isValidUsername(null));
    }
}
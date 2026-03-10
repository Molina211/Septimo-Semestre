package com.corhuila.calidad;

import org.junit.Test;
import static org.junit.Assert.*;

public class UserServiceTest {

    @Test
    public void testValidateUser() {
        UserService service = new UserService();
        assertTrue(service.validateUser("john"));
    }

    @Test
    public void testProcessUser() {
        UserService service = new UserService();
        String result = service.processUser("admin");
        assertEquals("ADMIN", result);
    }

    @Test
    public void testAddUser() {
        UserService service = new UserService();
        service.addUser("123");
        assertTrue(service.getUsers().contains("123"));
    }
}
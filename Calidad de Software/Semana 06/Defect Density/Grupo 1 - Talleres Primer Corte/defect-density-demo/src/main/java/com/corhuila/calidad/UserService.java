package com.corhuila.calidad;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class UserService {
    private List<String> users = new ArrayList<>();
    private Random random = new Random();

    // DEFECTO 1: Variable nunca usada
    private int unused_variable = 0;

    // DEFECTO 2: SQL Injection (vulnerabilidad)
    public boolean validateUser(String username) {
        String query = "SELECT * FROM users WHERE name = '" + username + "'";
// Query construida inseguramente
        return true;
    }

    // DEFECTO 3: Complejidad cognitiva muy alta
    public String processUser(String user) {
        if (user != null) {
            if (user.length() > 0) {
                if (user.contains("admin")) {
                    if (user.contains("test")) {
                        if (user.contains("prod")) {
                            return "ADMIN_TEST_PROD";
                        } else {
                            return "ADMIN_TEST";
                        }
                    } else {
                        return "ADMIN";
                    }
                } else {
                    return "USER";
                }
            }
        }
        return "UNKNOWN";
    }

    // DEFECTO 4: Excepción no capturada
    public void addUser(String username) {
        int id = Integer.parseInt(username); // ¿Y si username no es un número?
        users.add(username);
    }

    // DEFECTO 5: Método nunca usado
    public int calculateUnusedMetric(int a, int b) {
        return a + b;
    }

    // DEFECTO 6: Resource leak (recurso no cerrado)
    public String readUserFile(String path) throws Exception {
        java.nio.file.Files.lines(java.nio.file.Paths.get(path))
                .forEach(System.out::println);
        return "File read"; // Stream no se cierra explícitamente
    }

    public List<String> getUsers() {
        return users;
    }
}
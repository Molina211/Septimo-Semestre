/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package javaapplication1;

/**
 *
 * @author Jose Llanos
 * Fecha: 16-enero-2026
 * 
 * Enunciado del Ejercicio
 * 
 * Caso de Estudio: "Librería CleanCode"
 * Desarrolle un módulo backend para procesar la compra de libros. El sistema debe cumplir con los siguientes requerimientos funcionales, 
 * aplicando rigurosamente los estándares de calidad de software:
 * 
 * 1. Validación: Verificar que el cliente y la orden sean válidos.
 * 2. Inventario: Confirmar si hay stock suficiente del libro solicitado.
 * 3. Cálculo: Calcular el precio final con impuestos (IVA 19%).
 * 4. Notificación: Simular el envío de un correo de confirmación.
 * 5. Manejo de Errores: Si algo falla (falta de stock, datos inválidos), 
 * el sistema debe detenerse y reportar el error de forma clara sin usar "códigos de error" (como -1), sino excepciones.
 * 
 */

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class BookStoreClean {

    public static void main(String[] args) {
        // [CLEAN CODE] Configuración de dependencias (Inyección manual para el ejemplo)
        InventoryService inventory = new InventoryService();
        NotificationService notifier = new NotificationService();
        OrderProcessor processor = new OrderProcessor(inventory, notifier);

        System.out.println("--- Inicio del Procesamiento de Pedidos ---\n");

        // Escenario 1: Compra Exitosa
        try {
            Customer customer = new Customer("Juan Pérez", "juan@corhuila.edu.co");
            Book cleanCodeBook = new Book("Clean Code", 50.00, "REF-9988");
            Order order = new Order(customer, cleanCodeBook, 2);

            processor.processOrder(order);
            System.out.println(" Escenario 1: Pedido procesado correctamente.");

        } catch (OrderException e) {
            System.err.println("❌ Error: " + e.getMessage());
        }

        System.out.println("\n-------------------------------------------\n");

        // Escenario 2: Fallo por Stock (Manejo de Errores)
        try {
            Customer customer = new Customer("Maria Gomez", "maria@mail.com");
            Book scarceBook = new Book("Libro Agotado", 20.00, "REF-0000");
            Order order = new Order(customer, scarceBook, 500); // Cantidad exagerada

            processor.processOrder(order); // Esto lanzará excepción

        } catch (OrderException e) {
            // [CLEAN CODE] Capturamos la excepción de negocio, no una genérica Exception
            System.out.println(" Escenario 2 (Controlado): El sistema detectó el error correctamente.");
            System.out.println("   Mensaje de error: " + e.getMessage());
        }
    }

    // ==========================================
    // SECCIÓN: DOMINIO Y DATOS
    // ==========================================

    /**
     * [CLEAN CODE] Nombres Significativos: Clase sustantivo, PascalCase.
     */
    static class Customer {
        private final String fullName;
        private final String email;

        public Customer(String fullName, String email) {
            this.fullName = fullName;
            this.email = email;
        }

        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
    }

    static class Book {
        private final String title;
        private final double basePrice;
        private final String sku;

        public Book(String title, double basePrice, String sku) {
            this.title = title;
            this.basePrice = basePrice;
            this.sku = sku;
        }

        public String getTitle() { return title; }
        public double getBasePrice() { return basePrice; }
        public String getSku() { return sku; }
    }

    static class Order {
        private final Customer customer;
        private final Book book;
        private final int quantity;

        public Order(Customer customer, Book book, int quantity) {
            this.customer = customer;
            this.book = book;
            this.quantity = quantity;
        }

        public Customer getCustomer() { return customer; }
        public Book getBook() { return book; }
        public int getQuantity() { return quantity; }
    }

    // ==========================================
    // SECCIÓN: EXCEPCIONES PERSONALIZADAS
    // [CLEAN CODE] Guía Sección 6: Preferir Excepciones sobre Códigos de Error
    // ==========================================

    static class OrderException extends RuntimeException {
        public OrderException(String message) {
            super(message);
        }
    }

    static class OutOfStockException extends OrderException {
        public OutOfStockException(String sku) {
            super("Stock insuficiente para el producto: " + sku);
        }
    }

    static class InvalidDataException extends OrderException {
        public InvalidDataException(String field) {
            super("Dato inválido requerido: " + field);
        }
    }

    // ==========================================
    // SECCIÓN: SERVICIOS (LÓGICA DE NEGOCIO)
    // [CLEAN CODE] Guía Sección 8: SRP (Responsabilidad Única)
    // ==========================================

    static class InventoryService {
        // [CLEAN CODE] Simulación de base de datos
        public boolean isStockAvailable(String sku, int quantity) {
            // Lógica simulada: Si el SKU es "REF-0000", no hay stock.
            return !"REF-0000".equals(sku) || quantity <= 0;
        }
    }

    static class NotificationService {
        // [CLEAN CODE] Función pequeña y enfocada
        public void sendOrderConfirmation(Customer customer, double totalAmount) {
            validateEmail(customer.getEmail());
            System.out.println("   📧 Enviando correo a: " + customer.getEmail());
            System.out.println("   📄 Asunto: Tu pedido por $" + String.format("%.2f", totalAmount) + " ha sido confirmado.");
        }

        // [CLEAN CODE] Método privado auxiliar para validación (DRY)
        private void validateEmail(String email) {
            if (email == null || !email.contains("@")) {
                throw new InvalidDataException("Email del cliente");
            }
        }
    }

    /**
     * Clase principal que orquesta el proceso.
     * [CLEAN CODE] Guía Sección 3: Funciones deben ser pequeñas.
     */
    static class OrderProcessor {
        private static final double TAX_RATE = 1.19; // Constante UPPER_SNAKE_CASE

        private final InventoryService inventoryService;
        private final NotificationService notificationService;

        // [CLEAN CODE] Inyección de dependencias (SOLID: DIP)
        public OrderProcessor(InventoryService inventoryService, NotificationService notificationService) {
            this.inventoryService = inventoryService;
            this.notificationService = notificationService;
        }

        /**
         * Método principal de procesamiento.
         * Nótese que se lee como una narración de pasos de alto nivel.
         */
        public void processOrder(Order order) {
            validateOrderIntegrity(order);
            checkInventoryAvailability(order);

            double totalAmount = calculateTotalWithTax(order);

            completeTransaction(order, totalAmount);
        }

        // --- Métodos privados (Desglose para legibilidad) ---

        private void validateOrderIntegrity(Order order) {
            if (order == null) {
                throw new InvalidDataException("La orden no puede ser nula");
            }
            if (order.getCustomer() == null) {
                throw new InvalidDataException("Cliente no identificado");
            }
        }

        private void checkInventoryAvailability(Order order) {
            String sku = order.getBook().getSku();
            int qty = order.getQuantity();

            if (!inventoryService.isStockAvailable(sku, qty)) {
                throw new OutOfStockException(sku);
            }
        }

        private double calculateTotalWithTax(Order order) {
            double subtotal = order.getBook().getBasePrice() * order.getQuantity();
            return subtotal * TAX_RATE;
        }

        private void completeTransaction(Order order, double totalAmount) {
            // Aquí iría la lógica de guardar en BD
            System.out.println("   💾 Guardando orden en base de datos...");
            notificationService.sendOrderConfirmation(order.getCustomer(), totalAmount);
        }
    }
}

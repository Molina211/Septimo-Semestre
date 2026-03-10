# MapWebBusiness

Mapa iterativo para Trade Marketing que consolida la operación en campo: puntos de venta, métricas de tráfico y un heatmap generado en tiempo real a partir de las ventas registradas.

## Arquitectura

- **Backend:** microservicio Spring Boot 4 (Java 17 + Maven) con Spring MVC, Spring Data JPA y conexión a MySQL. Expone un conjunto de endpoints REST para registrar ventas, agregar filtros temporales y calcular métricas preprocesadas que alimentan el mapa, el heatmap y el panel analítico.
- **Frontend:** SPA construida con Angular 19 y Leaflet. Emplea componentes standalone para renderizar el mapa, el control lateral y el hero con activación del heatmap, consumiendo los endpoints del backend directamente a través de `/api/ventas`.
- **Persistencia:** contenedor MySQL (ver `MaveitMapBackend/docker-compose.yml`). La tabla `ventas` persiste nombre, coordenadas, cantidad, sello de tiempo, hora y día de la semana, y es llenada automáticamente por `Ventas` antes de cada persistencia.

## Características clave

1. **Mapa de ventas georreferenciado.** Cada punto se representa como un marcador circular y se colorea según el nivel calculado por el backend (`MINIMO`, `BAJO`, `MEDIO`, `ALTO`).
2. **Heatmap de intensidad.** Layer opcional sobre el mapa que normaliza la cantidad de ventas para destacar zonas críticas.
3. **Registro asistido.** Haz clic sobre el mapa, completa nombre/cantidad y guarda una venta nueva desde el panel izquierdo.
4. **Filtros temporales.** Define un rango `inicio`/`fin` (tipo `datetime-local`) y despliega solo los eventos de ese período.
5. **Analytics de horario.** Lista de ventas agrupadas por hora, útil para detectar ventanas de mayor actividad.

## Cómo empezar (local)

### 1. Arrancar la base de datos

```powershell
cd MaveitMapBackend
docker compose up -d
```

El servicio expone MySQL en `localhost:3307` y crea automáticamente la base `maveitmap` con usuario y contraseña. Si prefieres otro puerto/credencial, ajusta `application.properties` antes de iniciar el backend.

### 2. Ejecutar el backend

```powershell
cd MaveitMapBackend
./mvnw clean package
./mvnw spring-boot:run
```

El servicio corre por defecto en `http://localhost:8080`. Ya tiene habilitado `@CrossOrigin("*")`, así que Angular puede consumirlo desde `http://localhost:4200`. Si cambias la base de datos, edita `src/main/resources/application.properties` y vuelve a reiniciar.

### 3. Ejecutar el frontend

```powershell
cd MaveitMapFrontend
npm install
npm run start
```

Angular inicia `ng serve` en el puerto 4200 y monta la ruta principal (`/`) sobre `MapPageComponent`. El mapa se alimenta desde los endpoints REST definidos abajo.

## Estructura de carpetas

- `MaveitMapBackend/`: servicio Spring Boot. Contiene `src/` con controladores, servicios, repositorios, DTOs y entidad `Ventas`.
- `MaveitMapFrontend/`: SPA Angular 19 con Leaflet y Heatmap; componentes tipo `map-card`, `control-panel`, `hero` y `map-page`.
- `.gitignore`, etc.: configuración de trabajo.

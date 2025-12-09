# 🎮 Level Up Gamer - E-commerce Full Stack

**Level Up Gamer** es una plataforma de comercio electrónico diseñada para la venta de hardware y periféricos gaming. Este proyecto implementa una arquitectura Full Stack robusta, separando el Frontend (React) del Backend (Spring Boot), con una base de datos relacional (MySQL) y autenticación segura.

## 🚀 Tecnologías Utilizadas

### Frontend
* **Framework:** React 18
* **Estilos:** Bootstrap 5 + CSS Personalizado (Tema Dark/Gamer).
* **Routing:** React Router DOM v6.
* **Gestión de Estado:** Context API (Nativo de React).
* **Cliente HTTP:** Axios (con interceptores para JWT).
* **Testing:** Jasmine + Karma (Pruebas unitarias de lógica de negocio).

### Backend
* **Framework:** Spring Boot 3 (Java 17).
* **Seguridad:** Spring Security + JWT (JSON Web Tokens).
* **Persistencia:** Spring Data JPA + Hibernate.
* **Base de Datos:** MySQL.

---

## ⚙️ Funcionalidades Principales

1.  **Catálogo de Productos:** Visualización dinámica, filtrado por categorías y búsqueda en tiempo real.
2.  **Carrito de Compras:** Persistencia local, cálculo de subtotales y gestión de stock.
3.  **Autenticación y Usuarios:**
    * Login y Registro con validaciones.
    * Roles de usuario (ADMIN vs CLIENTE).
    * Panel de Perfil con historial de compras.
4.  **Panel de Administración:** Rutas protegidas para la gestión de inventario (CRUD de productos).
5.  **Blog de Noticias:** Sección informativa integrada.
6.  **Sistema de Órdenes:** Generación de pedidos y visualización de detalles de compra.

---

## 🛠️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### 1. Base de Datos (MySQL)
1.  Abre tu gestor de base de datos (MySQL Workbench o similar).
2.  Crea una base de datos llamada `levelup_db`.
3.  Ejecuta el script `script_datos.sql` ubicado en la raíz de este proyecto para poblar las tablas iniciales (Usuarios, Categorías, Productos).

### 2. Backend (Spring Boot)
1.  Abre el proyecto del servidor en tu IDE favorito (IntelliJ IDEA, Eclipse).
2.  Configura el archivo `application.properties` con tus credenciales de MySQL:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/levelup_db
    spring.datasource.username=TU_USUARIO
    spring.datasource.password=TU_CONTRASEÑA
    ```
3.  Ejecuta la aplicación (`LevelUpApplication.java`). El servidor iniciará en `http://localhost:8080`.

### 3. Frontend (React)
1.  Abre una terminal en la carpeta raíz del frontend.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm start
    ```
4.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Ejecución de Pruebas (Testing)

El proyecto utiliza **Jasmine** y **Karma** para pruebas unitarias enfocadas en la lógica de negocio extraída (`src/utils`).

Para ejecutar los tests:

```bash
npm run test:karma

src/
├── Components/      # Componentes reutilizables
│   ├── common/      # Navbar, Footer, Listas genéricas
│   ├── products/    # Lógica específica de productos
│   ├── cart/        # Widgets y lógica del carrito
│   └── user/        # Contextos y dropdowns de usuario
├── Pages/           # Vistas principales (Home, Login, Cart, Admin)
├── utils/           # Lógica pura extraída para Testing (Jasmine)
├── config/          # Configuración de Axios e Interceptores
└── Styles/          # Archivos CSS globales y temas
Conceptos Clave Implementados
Context API: Se utiliza para evitar el "prop drilling".

UserContext: Maneja la sesión y el token JWT.

CartContext: Gestiona el estado global del carrito.

ProductContext: Centraliza la carga y filtrado de productos.

Separación de Lógica: Las validaciones complejas y cálculos matemáticos se extrajeron a la carpeta utils para facilitar las pruebas unitarias independientes con Jasmine.

Rutas Protegidas: Uso de componentes Wrapper (AdminRoute) para restringir el acceso a paneles administrativos.
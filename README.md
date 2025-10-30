# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
---------
###1. Estructura general del proyecto

Framework: React para el frontend.

Ruteo: React Router (Routes y Route) para navegación entre páginas.

Estado global: Se maneja con Context API (UserContext y CartContext).

Componentes: Separados en carpetas Components, Pages y Data.

Estilos: Bootstrap para diseño responsivo.



---

2. Contextos (User y Cart)

Propósito: Compartir datos entre varios componentes sin pasar props manualmente.

UserContext: Maneja información del usuario (login, logout, perfil).

CartContext: Maneja el carrito de compras (añadir, remover, limpiar items).

Clave:

Los componentes hijos se reciben como children.

useContext permite acceder al estado y funciones de forma sencilla.

useEffect se usa para sincronizar el carrito con localStorage.




---

3. Componentes principales

App.jsx:

Es el contenedor principal.

Envuelve todo en UserProvider y CartProvider.

Contiene el Navbar y el Routes para las páginas.

Pasa los productos a Home y AdminPanel mediante props.


Navbar:

Muestra links de navegación y el nombre “Level Up Gamer”.

Puede consumir UserContext para mostrar login o perfil.


Páginas (Pages):

Home: Lista de productos.

AdminPanel: Gestión de productos.

Cart: Muestra productos añadidos.

Login, Register, Profile: Manejo de usuario.




---

4. Funcionalidades importantes

Productos: Se guardan en App usando useState.

Carrito:

Añadir, remover, limpiar.

Persistente usando localStorage.


Rutas protegidas: AdminRoute permite que solo admins accedan a ciertas páginas.

Resposividad: Bootstrap asegura que el diseño se vea bien en distintos dispositivos.



---

5. Testeo

Herramientas: Aunque la pauta dice Jasmine/Karma, tú usaste Jest.

Pruebas principales:

Renderizado de componentes (Navbar, Home, etc.).

Funcionalidad de Contextos (CartProvider y UserProvider).

Verificación de elementos en pantalla.


Errores comunes:

Navigate necesita <Router> envolviendo todo.

Componentes importados incorrectamente pueden ser undefined.




---

6. Conceptos clave para explicar

children: Elementos que pasan dentro de un componente contenedor.

Context API: Manejo de estado global para no pasar props innecesariamente.

Props y State: Props para pasar datos a hijos, State para cambios internos.

useEffect: Para efectos secundarios, como sincronizar con localStorage.

React Router: Navegación y protección de rutas.

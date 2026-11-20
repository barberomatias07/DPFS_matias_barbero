# Retrospectiva del Proyecto Integrador - Cultura Nacional (Sprints 1 al 6)

Para evaluar cómo fue evolucionando **Cultura Nacional** desde las primeras pantallas estáticas hasta la migración completa a base de datos relacional, armé esta retrospectiva aplicando la dinámica de la **estrella de mar** etapa por etapa.

---

# Sprint 1: Maquetado, Wireframes y Arranque en Git

## 🌟 ¿Qué empezar a hacer?
- Armar tableros de seguimiento (Trello / GitHub Projects) desde el día uno para dividir las Historias de Usuario en tareas concretas y manejables.
- Definir y ordenar la estructura de carpetas del proyecto antes de inicializar el repositorio local de Git.

## 🚀 ¿Qué hacer más?
- Detallar mejor los wireframes de escritorio y mobile para tener una referencia exacta al momento de tirar el HTML y el CSS.
- Practicar con constancia el flujo básico de Git (`status`, `add`, `commit`, `push`) para mantener el historial limpio desde el arranque.

## ✅ ¿Qué continuar haciendo?
- Mantener la identidad visual oscura del sitio (fondos negros/grises, acentos en rojo, tipografía clara) y el orden prolijo de los directorios (`public/`, `wireframes/`).
- Encarar los errores de consola de forma directa y analítica hasta encontrar la raíz del problema.

## 📉 ¿Qué hacer menos?
- Demorar la vinculación inicial con el repositorio remoto en GitHub.
- Dejar el armado de la documentación y la retrospectiva para último momento.

## 🛑 ¿Qué dejar de hacer?
- Dudar cuando aparecen advertencias o conflictos en Git: resolverlos en el momento antes de seguir metiendo código arriba.

---

# Sprints 2 y 3: Servidor Express, Arquitectura MVC y Vistas con EJS

## 🌟 ¿Qué empezar a hacer?
- Separar las responsabilidades desde el primer minuto bajo el patrón **MVC**: dejar `app.js` limpio para configuraciones globales, delegar las URLs a los archivos de `routes/` y mandar toda la lógica a los `controllers/`.
- Usar `partials` de EJS (`head.ejs`, `header.ejs`, `footer.ejs`) para reutilizar la estructura base sin repetir bloques de HTML.

## 🚀 ¿Qué hacer más?
- Aprovechar el renderizado dinámico con EJS para alimentar el catálogo (`index.ejs`) y el detalle de cada prenda (`productDetail.ejs`) sin hardcodear datos en la vista.
- Revisar siempre que los enlaces a hojas de estilo e imágenes apunten con rutas absolutas (`/css/...`, `/images/...`).

## ✅ ¿Qué continuar haciendo?
- Mantener modularizadas las rutas y vistas separando lo que es de productos y lo que es de usuarios.
- Sostener la coherencia estética en cada pantalla nueva que se suma al proyecto.

## 📉 ¿Qué hacer menos?
- Dejar código HTML estático repetido en vistas que ya trabajan con plantillas dinámicas.
- Concentrar demasiadas rutas sueltas en un mismo archivo sin agruparlas por recurso.

## 🛑 ¿Qué dejar de hacer?
- Usar rutas relativas (`./`) para llamar recursos de `public/` dentro de Express, porque se rompen apenas entrás a una ruta anidada como `/detalle/:id`.
- Olvidar refrescar forzando caché (`Ctrl + F5`) cuando se ajustan estilos CSS.

---

# Sprint 4: Persistencia en JSON, Multer y CRUD Completo

## 🌟 ¿Qué empezar a hacer?
- Implementar **Multer** para atajar las fotos que subo desde los formularios de alta y edición, renombrándolas con `Date.now()` para que nunca se pisen dos imágenes con el mismo nombre.
- Sumar `method-override` en `app.js` para poder mandar peticiones reales de tipo `PUT` (editar) y `DELETE` (borrar) desde los formularios HTML.

## 🚀 ¿Qué hacer más?
- Validar en el controlador de edición que, si no subo una foto nueva, la remera conserve la imagen que ya tenía guardada en lugar de quedar vacía.
- Probar el ciclo completo del CRUD (Crear $\rightarrow$ Ver en Home $\rightarrow$ Editar $\rightarrow$ Borrar) cada vez que se toca el controlador de productos.

## ✅ ¿Qué continuar haciendo?
- Mantener el catálogo de remeras históricas y culturales bien estructurado con su nombre, frase, descripción, precio y lista de talles.
- Guardar los avances en Git apenas queda andando cada operación del CRUD.

## 📉 ¿Qué hacer menos?
- Manipular a mano los archivos `.json` mientras el servidor está levantado, para evitar errores de sintaxis al leer o escribir datos.

## 🛑 ¿Qué dejar de hacer?
- Hardcodear productos nuevos directo en las vistas: toda alta, modificación o baja tiene que pasar sí o sí por las rutas y controladores del CRUD.

---

# Sprint 5: Autenticación, Encriptación, Sesiones y Middlewares

## 🌟 ¿Qué empezar a hacer?
- Encriptar todas las contraseñas con **`bcryptjs`** (`hashSync` al registrar y `compareSync` al loguear) para que jamás quede una clave en texto plano.
- Implementar **`express-session`** y **`cookie-parser`** para mantener al usuario logueado mientras navega y recordar su sesión con una cookie si tilda *"Recordarme"*.
- Armar middlewares propios (`userLoggedMiddleware`, `guestMiddleware`, `authMiddleware`) para compartir los datos del usuario con todas las vistas (`res.locals`) y proteger las rutas privadas.

## 🚀 ¿Qué hacer más?
- Limpiar datos sensibles antes de guardar al usuario en sesión (borrarle la propiedad `password` al objeto antes de meterlo en `req.session.userLogged`).
- Usar Multer también en el registro de usuarios para que cada cuenta pueda subir su propio avatar o caer en una imagen por defecto si no sube nada.

## ✅ ¿Qué continuar haciendo?
- Mantener separados los flujos de usuarios (`usersRoutes.js` y `usersController.js`) de los de productos (`mainRoutes.js` y `mainController.js`).
- Comentar paso a paso la lógica de seguridad y sesión para tener claro qué hace cada validación.

## 📉 ¿Qué hacer menos?
- Duplicar chequeos de sesión dentro de cada controlador cuando un middleware de ruta puede frenar o redirigir antes de entrar.

## 🛑 ¿Qué dejar de hacer?
- Guardar contraseñas sin hashear o mandar el objeto completo del usuario (con clave incluida) hacia las vistas EJS.

---

# Sprint 6: Base de Datos Relacional MySQL, Sequelize y Carrito Funcional

## 🌟 ¿Qué empezar a hacer?
- Diseñar el **Diagrama Entidad-Relación (DER)** y pasar toda la estructura a scripts SQL reproducibles (`structure.sql` y `data.sql`) para la base `cultura_nacional_db`.
- Configurar **Sequelize** con `mysql2` mapeando las 6 tablas (`roles`, `users`, `categories`, `products`, `sizes` y la tabla intermedia N:M `product_sizes` con `ON DELETE CASCADE`) y sus asociaciones (`belongsTo`, `hasMany`, `belongsToMany`).
- Hacer funcional de punta a punta el **carrito de compras** (`req.session.carrito`), conectándolo con MySQL para traer el precio real de cada remera, elegir el talle desde el detalle, actualizar cantidades, eliminar ítems y cerrar la compra.

## 🚀 ¿Qué hacer más?
- Trabajar todas las consultas a la base con funciones asíncronas (`async / await`) envueltas en bloques `try / catch` para capturar cualquier falla de conexión o consulta sin que se caiga el servidor.
- Chequear en phpMyAdmin después de cada prueba de registro, creación o borrado que las tablas y las claves foráneas queden sincronizadas.

## ✅ ¿Qué continuar haciendo?
- Mantener la compatibilidad entre los datos que devuelve Sequelize y el formato que esperan las vistas EJS existentes para no romper el front-end durante la migración.
- Verificar los logs SQL en la terminal al levantar con `npm start` para confirmar que cada vista consulta correctamente a MySQL.

## 📉 ¿Qué hacer menos?
- Cambiar de archivo rápido sin guardar (`Ctrl + S`) o sin reiniciar el servidor Node, ya que los cambios en controladores, modelos o rutas no se aplican hasta reiniciar el proceso.

## 🛑 ¿Qué dejar de hacer?
- Dejar funciones de controladores sin exportar o cruzadas entre archivos (que hacen que Express tire `TypeError: argument handler must be a function` al levantar las rutas).
- Depender de archivos JSON locales ahora que toda la persistencia de usuarios, roles, categorías, talles y productos corre sobre MySQL.
## Retrospectiva - Sprint 7 (Validaciones)

* **Comenzar a hacer (Start Doing):**
  * Validar siempre en doble capa: en el navegador con JavaScript para dar respuesta inmediata y en el servidor con `express-validator` para proteger MySQL.
  * Limpiar automáticamente las imágenes subidas por Multer cuando falla alguna validación en el controlador.
* **Hacer más (More Of):**
  * Probar todos los casos borde de cada formulario (campos vacíos, longitudes mínimas, emails duplicados y extensiones de archivo inválidas) antes de commitear.
  * Mantener las reglas desacopladas en archivos propios dentro de `middlewares/` (`userValidations.js` y `productValidations.js`).
* **Continuar haciendo (Continue Doing):**
  * Persistir los datos cargados (`oldData`) cuando un formulario vuelve con errores para mejorar la experiencia del usuario.
  * Dividir el desarrollo en bloques cortos verificables paso a paso.
* **Hacer menos (Less Of):**
  * Confiar en las validaciones nativas del navegador (`required`), usando `novalidate` para controlar los mensajes propios de la aplicación.
* **Dejar de hacer (Stop Doing):**
  * Trackear carpetas pesadas como `node_modules` en el repositorio; asegurar su exclusión en `.gitignore`.
  ## Retrospectiva - Sprint 8 (APIs y Dashboard en React)

* **Comenzar a hacer (Start Doing):**
  * Exponer endpoints REST desacoplados con estructuras JSON claras y sin información sensible para alimentar aplicaciones externas.
  * Configurar `cors` desde el inicio cuando se conecta un front-end independiente como React con un servidor Express.
* **Hacer más (More Of):**
  * Modularizar la interfaz en componentes reutilizables (`MetricCard`, `LastProductPanel`, `CategoriesPanel`, `ProductsListPanel`) para mantener el código limpio y escalable.
  * Verificar cada endpoint en el navegador antes de consumirlo desde el front-end.
* **Continuar haciendo (Continue Doing):**
  * Mantener la coherencia visual entre la tienda principal y el panel administrativo.
  * Trabajar en bloques cortos probando la conexión real contra MySQL en cada paso.
* **Hacer menos (Less Of):**
  * Hardcodear datos de prueba en el front-end cuando ya se cuenta con una API conectada a la base de datos.
* **Dejar de hacer (Stop Doing):**
  * Dejar carpetas de dependencias sin ignorar al crear subproyectos nuevos (`dashboard/node_modules`).
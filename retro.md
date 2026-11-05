# Retrospectiva del Sprint 1 - Cultura Nacional

Para evaluar el desarrollo del primer sprint del proyecto integrador, aplicamos la dinámica de la **estrella de mar**, analizando las distintas áreas de mejora y consolidación del flujo de trabajo.

## 🌟 ¿Qué empezar a hacer?
* Implementar tableros de gestión ágil (Trello o GitHub Projects) desde el día uno para subdividir mejor las Historias de Usuario.
* Planificar con mayor anticipación la estructura de carpetas antes de inicializar el entorno local de Git.

## 🚀 ¿Qué hacer más?
* Profundizar en el diseño y detalle de los wireframes para que sirvan como una guía más precisa durante el maquetado estático.
* Mantener la constancia en las pruebas de comandos de Git y control de versiones para evitar conflictos de ramas.

## ✅ ¿Qué continuar haciendo?
* Mantener el código ordenado y la estructura de directorios prolija (`public/`, `wireframes/`, etc.).
* Aplicar un enfoque analítico y directo en la resolución de errores técnicos de la terminal.

## 📉 ¿Qué hacer menos?
* Demorar la sincronización inicial con el repositorio remoto de GitHub.
* Dejar la documentación y los archivos de retrospectiva para el final de la etapa.

## 🛑 ¿Qué dejar de hacer?
* Dudar de la resolución de conflictos en Git: abordarlos de inmediato en cuanto la terminal arroja una advertencia.
# Retrospectiva del Sprint 2 y Sprint 3 - Cultura Nacional

Para evaluar el desarrollo del segundo y tercer sprint del proyecto integrador, continuamos aplicando la dinámica de la **estrella de mar**, analizando cómo nos adaptamos a la implementación del servidor con Express, el motor de vistas EJS y la arquitectura MVC.

## 🌟 ¿Qué empezar a hacer?
- Separar las responsabilidades del código desde el principio (Patrón MVC): delegar las rutas al `Router` y la lógica de renderizado a los `Controllers` para no sobrecargar el archivo principal `app.js`.
- Limpiar la caché del navegador (`Ctrl + F5`) obligatoriamente cada vez que se modifican archivos estáticos (CSS o imágenes) para evitar falsos errores de renderizado.

## 🚀 ¿Qué hacer más?
- Aprovechar al máximo el motor EJS implementando `partials` (`head`, `header`, `footer`) en todas las vistas nuevas, garantizando que el diseño y la navegación sean consistentes sin repetir código.
- Revisar meticulosamente las rutas absolutas (con la barra inicial `/`) al enlazar archivos estáticos en la carpeta `public` para evitar que se rompan las vistas anidadas.

## ✅ ¿Qué continuar haciendo?
- Mantener el enfoque analítico y metódico al momento de diagnosticar errores en el servidor Node o en la consola.
- Sostener la coherencia visual del proyecto (estética oscura, bordes, tipografía) que le da identidad al sitio de Cultura Nacional.
- Seguir utilizando buenas prácticas de Git, guardando el progreso al finalizar cada funcionalidad importante de los sprints.

## 📉 ¿Qué hacer menos?
- Dejar bloques de código HTML estático dentro de las vistas dinámicas: reemplazar de inmediato los encabezados y pies de página viejos por sus respectivos `<%- include %>`.
- Concentrar rutas de forma manual en el archivo de entrada del servidor en lugar de modularizarlas.

## 🛑 ¿Qué dejar de hacer?
- Utilizar rutas relativas (`./`) para llamar a imágenes y hojas de estilo en un entorno de Express; trabajar siempre con rutas absolutas para asegurar el correcto funcionamiento del motor de plantillas.
- Olvidar reiniciar el servidor (`Ctrl + C` y `node app.js`) después de realizar cambios estructurales en los archivos JavaScript.
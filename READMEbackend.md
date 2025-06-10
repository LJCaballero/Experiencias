🚀 Experiencias Diferentes: ¡Nuestro Proyecto! 🚀
¡Hola a todos!

Aquí tenéis el corazón de nuestro proyecto "Experiencias Diferentes". La idea es crear una plataforma donde la gente pueda encontrar y reservar aventuras únicas: surf, barranquismo, masajes, buceo, paseos en velero... ¡todo lo que se os ocurra!

Este proyecto está dividido en dos grandes partes que trabajan juntas:

El Front-End: Es lo que el usuario ve y con lo que interactúa. Lo estamos construyendo con React, para que sea súper ágil y se vea genial en cualquier móvil, tablet o PC.

El Back-End: Esta es la "cocina" donde se gestiona toda la lógica, se guardan los datos y se preparan las respuestas para el Front-End. Lo estamos haciendo con Node.js y Express.js, que son herramientas muy potentes.

💻 Cómo Poner en Marcha el Back-End (¡La Cocina de la App!)
Si quieres que la "cocina" de nuestra app empiece a funcionar en tu ordenador, sigue estos pasos. ¡Es más fácil de lo que parece!

Antes de Empezar, ¿Qué Necesitas?
Asegúrate de tener instaladas estas herramientas en tu sistema:

Node.js: Necesitamos la versión 16 o una más reciente.

npm: Viene solito cuando instalas Node.js.

MySQL / PostgreSQL (o tu base de datos preferida): Necesitas tener un servidor de base de datos funcionando.

Pasos para Configurar y Arrancar:
Traer el Proyecto a tu PC (Clonar el Repositorio):
Si aún no tienes el código en tu máquina, abre tu terminal (o Git Bash) y ve a la carpeta donde quieres guardarlo. Luego, usa este comando:

git clone https://github.com/tu_usuario/ExperienciasDiferentes.git
cd ExperienciasDiferentes

(¡Ojo! Cambia tu_usuario y ExperienciasDiferentes por los datos reales de nuestro repositorio, claro.)

Entrar en la Carpeta del Back-End:
Ahora, vamos a la carpeta específica de la "cocina":

cd backend

Instalar los "Ingredientes" (Dependencias):
Necesitamos que npm (nuestro gestor de paquetes) descargue todas las librerías que usa el Back-End. Asegúrate de que en el package.json de la carpeta backend tienes "type": "module" para que todo funcione bien con import/export.

npm install

Preparar los "Secretos" de la App (.env):
Crea un archivo llamado .env (¡con el punto delante!) justo en la raíz de la carpeta backend (al lado de package.json). Aquí guardaremos cosas importantes que no queremos que se vean en el código público. Copia este ejemplo y rellena tus datos:

PORT=4000
MYSQL_HOST=localhost
MYSQL_USER=tu_usuario_bd
MYSQL_PASSWORD=tu_contraseña_bd
MYSQL_DATABASE=experiencias_db
JWT_SECRET=una_clave_secreta_muy_larga_y_dificil_de_adivinar_1234567890ABCDEF

¡MUY IMPORTANTE! Cambia JWT_SECRET por una cadena de texto larga y que solo tú conozcas. ¡Es la llave de seguridad!

Montar el "Almacén de Datos" (Base de Datos):

Crea una base de datos con el mismo nombre que pusiste en MYSQL_DATABASE (por ejemplo, experiencias_db).

Luego, tenemos que crear las "mesas" (tablas) donde guardaremos toda la información (usuarios, experiencias, reservas). Aquí te dejo los comandos SQL que usamos para crearlas. Ejecútalos en tu programa de base de datos:

-- Tabla de Usuarios
CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(255) UNIQUE NOT NULL,
username VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role ENUM('cliente', 'admin') DEFAULT 'cliente',
name VARCHAR(255),
lastname VARCHAR(255),
bio TEXT,
avatar VARCHAR(255),
active BOOLEAN DEFAULT false,
registration_code VARCHAR(255),
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Experiencias
CREATE TABLE experiences (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
location VARCHAR(255) NOT NULL,
image VARCHAR(255),
date DATE NOT NULL,
price DECIMAL(10, 2) NOT NULL,
min_plazas INT NOT NULL,
total_plazas INT NOT NULL,
active BOOLEAN DEFAULT true,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reservas
CREATE TABLE bookings (
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
experience_id INT NOT NULL,
booking_date DATE NOT NULL,
num_persons INT NOT NULL,
status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (experience_id) REFERENCES experiences(id)
);

¡Un detalle! Asegúrate de añadir un usuario con rol de admin en la tabla users para que puedas probar las cosas de administrador.

¡Enciende el Servidor Back-End!
Con todo listo, es hora de encender la "cocina". En la terminal (todavía en la carpeta backend), usa:

npm start # Si tienes un script 'start' en package.json

# O si usas nodemon para que se reinicie solo al guardar cambios:

npm run dev # Si tienes un script 'dev' configurado para nodemon

Verás que el servidor se inicia y te dirá que está escuchando en http://localhost:4000 (o el puerto que hayas puesto en tu .env). ¡Ya está funcionando!

🚪 Las "Puertas" de la Cocina (Endpoints de la API)
Aquí te dejamos una lista de las "puertas" principales que tiene nuestro Back-End. Son los puntos a los que el Front-End (o tú mismo con Postman) puede enviar peticiones para que la app haga cosas:

Para Entrar y Gestionar Usuarios:
POST /register: Para que alguien se apunte a la plataforma.

POST /login: Para iniciar sesión y conseguir tu "carnet mágico" (token JWT).

GET /users/validate/:codigo_de_registro: Para activar una cuenta con el código del email.

POST /password/recovery: Si se te olvida la contraseña, por aquí pides ayuda.

PUT /password/reset: Para cambiar la contraseña con el enlace que te llega.

GET /users/:id: Para ver los datos de un usuario (si tienes permiso, claro).

PUT /users/:id: Para actualizar tu perfil.

PUT /users/:id/password: Para cambiar tu contraseña.

Para las Experiencias:
GET /experiences: Para ver todas las experiencias. ¡Puedes usar filtros por palabras, si están activas, por precio o por fechas! Y también ordenarlas.

GET /experiences/:id: Para ver todos los detalles de una experiencia en concreto.

POST /experiences: ¡Solo para administradores! Para crear una experiencia nueva.

PUT /experiences/:id: ¡Solo para administradores! Para cambiar los detalles de una experiencia que ya existe.

PUT /experiences/:id/status: ¡Solo para administradores! Para activar, desactivar o confirmar una experiencia.

Para las Reservas:
POST /bookings: ¡Aquí es donde reservas tu experiencia! (Necesitas estar logeado).

GET /users/:id/bookings: Para ver todas las experiencias que has reservado.

DELETE /bookings/:id: Para cancelar una reserva (siempre que se pueda, claro).

POST /experiences/:id/rating: Para dejar tu valoración de 1 a 5 estrellas después de haber disfrutado la experiencia.

📚 Un Último Apunte...
Postman: Si quieres probar estas "puertas" del Back-End, te recomendamos usar Postman. Es una herramienta genial para enviar peticiones y ver las respuestas.

El Front-End: La parte visual de la app está en la carpeta frontend/. Si quieres arrancarla, busca su propio README.md dentro de esa carpeta para ver sus instrucciones específicas.

¡Esperamos que disfrutes mucho trabajando en "Experiencias Diferentes"! Si tienes dudas, ¡aquí estamos!

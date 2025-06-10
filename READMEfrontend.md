# 🚀 Experiencias Diferentes: ¡Nuestro Front-End! 🚀

¡Hola a todos!

Aquí tenéis el corazón de nuestro proyecto "Experiencias Diferentes". La idea es crear una plataforma donde la gente pueda encontrar y reservar aventuras únicas: surf, barranquismo, masajes, buceo, paseos en velero... ¡todo lo que se os ocurra!

Este repositorio se enfoca exclusivamente en el **Front-End**: Es lo que el usuario ve y con lo que interactúa directamente en el navegador. Lo estamos construyendo con **React** (usando Vite para el desarrollo), para que sea súper ágil y se vea genial en cualquier móvil, tablet o PC.

---

## 🎨 Cómo Poner en Marcha el Front-End (¡La Sala de Estar de la App!)

Para ver la interfaz de usuario de la aplicación en tu navegador, sigue estos sencillos pasos:

### Antes de Empezar, ¿Qué Necesitas?

Asegúrate de tener instaladas estas herramientas en tu sistema:

- **Node.js**: Necesitamos la versión 16 o una más reciente. Puedes descargarla desde [nodejs.org](https://nodejs.org/).
- **npm**: Viene solito cuando instalas Node.js.

### Pasos para Configurar y Arrancar:

1.  **Traer el Proyecto a tu PC (Clonar el Repositorio):**
    Si aún no tienes el código en tu máquina, abre tu terminal (o Git Bash) y ve a la carpeta donde quieres guardarlo. Luego, usa este comando:

    ```bash
    git clone [https://github.com/LJCaballero/Experiencias.git](https://github.com/LJCaballero/Experiencias.git) # O la URL de tu repositorio de Frontend si es diferente
    cd Experiencias/frontend # Si tu repositorio es el conjunto de ambos y el frontend está en una subcarpeta
    # O si este repositorio es SOLO el frontend: cd Experiencias-Frontend
    ```

    _Ajusta la URL y la ruta `cd` según si este `README` está en un repositorio solo de frontend o dentro de un repositorio que contiene frontend y backend._

2.  **Instalar los "Muebles" (Dependencias de React):**
    Necesitamos que `npm` descargue todas las librerías que usa la parte visual de la app. Asegúrate de estar en la carpeta **raíz de tu proyecto Frontend** (`Experiencias/frontend` o `Experiencias-Frontend`). Ejecuta:

    ```bash
    npm install
    ```

3.  **¡Enciende la Sala de Estar! (Inicia el Servidor de Desarrollo):**
    Una vez que las dependencias estén instaladas, puedes iniciar la aplicación de React. Desde la misma carpeta raíz de tu Frontend, usa:

    ```bash
    npm run dev
    ```

    Esto iniciará el servidor de desarrollo de Vite (que hace que React funcione) y te dará una dirección URL (normalmente `http://localhost:5173/`). Copia esa URL y pégala en tu navegador para ver la aplicación funcionando.

---

## 🗺️ Las "Calles" del Front-End (Rutas de Navegación)

Aquí te muestro las principales "calles" por las que puedes navegar en la aplicación, y qué "edificio" (página/componente) verás en cada una. Estas rutas son gestionadas por React Router DOM:

- **`/`**:

  - **Página:** `HomePage.jsx`
  - **Descripción:** La página principal de la aplicación, con un mensaje de bienvenida y posiblemente un resumen de las experiencias destacadas.

- **`/login`**:

  - **Página:** `LoginPage.jsx`
  - **Descripción:** El lugar para iniciar sesión en tu cuenta.

- **`/register`**:

  - **Página:** `RegisterPage.jsx`
  - **Descripción:** Aquí te puedes registrar si eres nuevo en la plataforma.

- **`/recover-password`**:

  - **Página:** `RecoverPasswordPage.jsx` (Aún por crear en este Sprint)
  - **Descripción:** Si olvidaste tu contraseña, esta página te ayudará a recuperarla.

- **`/create-experience`**:

  - **Página:** `CreateExperiencePage.jsx` (Aún por crear en este Sprint)
  - **Descripción:** (Solo para administradores) Aquí se crean nuevas experiencias.

- **`/edit-experience/:id`**:

  - **Página:** `EditExperiencePage.jsx` (Aún por crear en este Sprint)
  - **Descripción:** (Solo para administradores) Para modificar los detalles de una experiencia existente, usando su ID.

- **`/experiences/:id`**:

  - **Página:** `ExperienceDetailPage.jsx` (Aún por crear en este Sprint)
  - **Descripción:** Muestra toda la información detallada de una experiencia específica, como fotos, descripción y comentarios.

- **`/profile`**:

  - **Página:** `UserProfilePage.jsx` (Aún por crear en este Sprint)
  - **Descripción:** Tu perfil personal, donde puedes ver y editar tus datos.

- **`/my-bookings`**:

  - **Página:** `MyBookingsPage.jsx` (Aún por crear en este Sprint)
  - **Descripción:** Una lista de todas las experiencias que has reservado.

- **`*` (cualquier otra ruta)**:
  - **Página:** `NotFoundPage.jsx` (Aún por crear en este Sprint)
  - **Descripción:** La página que se muestra si intentas ir a una dirección que no existe en nuestra aplicación.

---

## 📚 Un Último Apunte...

- **Conexión con el Back-End:** Este Front-End necesita un Back-End (API) para funcionar completamente. Asegúrate de que tu servidor Back-End esté funcionando para que la aplicación pueda cargar datos y realizar operaciones.
- **Mobile First & Responsive:** Nuestro Front-End está diseñado pensando primero en los móviles, ¡así que se verá genial en cualquier dispositivo!
- **Feedback de Errores:** La aplicación te dará mensajes claros si algo sale mal al comunicarse con el servidor.

---

¡Esperamos que disfrutes mucho trabajando en "Experiencias Diferentes"! Si tienes dudas, ¡aquí estamos!

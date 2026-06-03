# ReapasoReact

1. Página de Autenticación (pages/login/Login.jsx)

  Estado Inicial: El archivo tenía importaciones rotas hacia utilidades de sesión que no existían o estaban mal ubicadas.

  Lo que hice:
   * Gestión de Estado Local: Implementé un estado credentials con un objeto { username, password } sincronizado con los inputs de Material UI.
   * Integración con React Query (useMutation): Utilicé el hook useMutation para manejar el proceso de login. Esto permite gestionar automáticamente los estados de isPending (cargando) y isError
     (cuando las credenciales fallan), mostrando alertas visuales al usuario.
   * Persistencia de Sesión: Al recibir una respuesta exitosa del backend, el objeto de sesión (que incluye el Token JWT, el ID del usuario y su Nombre) se guarda en el localStorage bajo la llave
     postManagerSession.
   * Redirección Inteligente: Si un usuario intenta entrar al Login teniendo ya una sesión activa, el componente lo redirige automáticamente al /feed.

  ---

  2. Página Principal (pages/feed/FeedPage.jsx)

  Estado Inicial: Crítico. El archivo contenía exactamente el mismo código que la página de Login (un error de duplicación), por lo que el "Feed" no existía.

  Lo que hice (Reconstrucción Total):
   * Consumo de Datos (useQuery): Implementé la carga de publicaciones mediante useQuery. Esta función se encarga de llamar al backend, cachear los resultados y refrescar la vista.
   * Flujo de Creación de Posts: Conecté el componente UserPostForm con una mutación (createPostMutation). Cuando el usuario escribe un post y pulsa "Enviar":
       1. Se envía el contenido + el ID del usuario logueado al servidor.
       2. Al tener éxito, se usa queryClient.invalidateQueries(['posts']), lo que fuerza a React Query a descargar la lista actualizada, haciendo que el nuevo post aparezca instantáneamente.
   * Visualización Dinámica: Implementé un mapeo (.map()) de la lista de publicaciones. Cada post se envuelve en un contenedor que, al hacer clic, utiliza el hook useNavigate para llevar al
     usuario al detalle de esa publicación específica (/post/:id).

  ---

  3. Página de Detalle (pages/post/PostPage.jsx)

  Estado Inicial: La carpeta estaba vacía. No existía una forma de ver comentarios o interactuar con un post individual.

  Lo que hice (Nueva Implementación):
   * Captura de Parámetros de URL: Utilicé useParams para obtener el ID de la publicación desde la URL (ej: /post/1).
   * Carga de Datos Relacionados: La página realiza dos peticiones en paralelo: una para obtener la información del Post y otra para traer su lista de comentarios (getCommentsByPostId).
   * Gestión de Comentarios:
       * Implementé un formulario local dentro de la página para agregar comentarios.
       * Al comentar, se envía el userId de la sesión activa para que el backend sepa quién escribió el comentario.
       * Tras comentar, la lista de comentarios se refresca automáticamente.
   * Navegación de Retorno: Añadí un botón de "Volver al Feed" para mejorar la experiencia de usuario (UX).

  ---

  Resumen de la Arquitectura en pages:

   1. Seguridad (Guardias): Todas las páginas (excepto Login) verifican la existencia del token en localStorage. Si no existe, bloquean el acceso y redirigen a /auth/login.
   2. Sincronización de Datos: Se eliminó el uso de useEffect manual para cargar datos, reemplazándolo por React Query. Esto evita bugs de sincronización y hace que la app se sienta mucho más
      rápida.
   3. UI Consistente: Se utilizaron componentes de Material UI (Container, Stack, CircularProgress) para asegurar que el espaciado y la estética sean profesionales y responsivos.
   4. Separación de Responsabilidades: Las páginas solo contienen la lógica de "Vista". La lógica de "Comunicación" (peticiones Axios) se movió a los archivos services dentro de cada carpeta para
      mantener el código limpio.
  Con estos cambios, la aplicación pasó de ser un conjunto de archivos estáticos a una red social funcional con flujo de datos real.

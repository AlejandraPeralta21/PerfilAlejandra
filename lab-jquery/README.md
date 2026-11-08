# LÚMINA | Karaoke & Music Lounge

Sitio web estático premium para un lounge de karaoke, desarrollado como proyecto académico de **Diseño Web II — UPDS**.

Incluye catálogo musical con filtros combinados, favoritos, salas interactivas, reservas con calculadora de precios, promociones, temporizador real de confirmación de 60 segundos, bitácoras de actividad exportables, formulario de contacto, configuración de tema y preferencias. Todo funciona sin backend y persiste en `LocalStorage`.

---

## 1. Ejecutar el proyecto

### Opción A — Abrir directamente

Abre `index.html` en un navegador moderno. El sitio no requiere compilación ni servidor.

> Recomendado usar un servidor local para evitar restricciones del navegador y probar el comportamiento tal como se publicará.

### Opción B — Servidor local con Python

```bash
python -m http.server 4173
```

Luego abre:

```text
http://localhost:4173/
```

### Opción C — Visual Studio Code

1. Instala la extensión **Live Server**.
2. Haz clic derecho sobre `index.html`.
3. Selecciona **Open with Live Server**.

### Requisitos

- Navegador actualizado (Chrome, Edge, Firefox o Safari recientes).
- Conexión a internet para cargar Google Fonts, Bootstrap 5, Bootstrap Icons y jQuery desde CDN.
- JavaScript habilitado.
- `LocalStorage` habilitado para guardar reservas, favoritos, bitácoras y preferencias.

---

## 2. Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `lumina-karaoke`.
2. Sube el contenido del proyecto conservando esta estructura:

```text
/
├── index.html
├── README.md
├── css/
│   └── estilos.css
├── js/
│   ├── app.js
│   ├── bitacoras.js
│   ├── validaciones.js
│   ├── catalogo.js
│   └── reservas.js
└── assets/
    └── imagenes/
```

3. En el repositorio entra a **Settings → Pages**.
4. En **Source**, selecciona **Deploy from a branch**.
5. Elige la rama `main` y la carpeta `/ (root)`.
6. Guarda y espera la publicación.
7. La URL tendrá la forma:

```text
https://TU-USUARIO.github.io/lumina-karaoke/
```

### Consideraciones para GitHub Pages

- Las rutas son relativas (`css/estilos.css`, `js/app.js`, `assets/imagenes/...`), por lo que funcionan dentro de un repositorio.
- No se necesita configuración adicional ni variables de entorno.
- `LocalStorage` funciona por navegador y por dominio. Los datos de la versión local no se comparten con la versión publicada.

---

## 3. Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura HTML5, secciones, modales, formularios y carga de librerías. |
| `css/estilos.css` | Diseño visual completo, temas noche/marfil, responsive, animaciones y estados. |
| `js/app.js` | Núcleo: navegación hash, menú lateral, tema, modales accesibles, toasts, almacenamiento seguro, preferencias y estadísticas. |
| `js/catalogo.js` | Datos de 61 canciones, filtros, búsqueda, orden, favoritos, “mi lista” y detalle de canción. |
| `js/reservas.js` | Salas, acordeones jQuery, disponibilidad, formulario de reserva, promociones, calculadora y temporizador de 60 segundos. |
| `js/bitacoras.js` | Registro real de interacciones, filtros, búsqueda, rango de fechas, estadísticas, exportación y limpieza. |
| `js/validaciones.js` | Validaciones reutilizables y formulario de contacto con estados de error, carga y éxito. |
| `assets/imagenes/` | Fotografías locales, portadas SVG por género y fallbacks SVG. |

---

## 4. Funcionalidades principales

### Navegación y experiencia

- Aplicación de una sola página con rutas por hash: `#inicio`, `#catalogo`, `#salas`, `#reservaciones`, `#promociones`, `#mis-reservas`, `#bitacoras`, `#contacto`, `#configuracion`.
- Menú lateral con las 9 secciones, disponible en escritorio y móvil.
- Botón hamburguesa visible en todas las resoluciones.
- Cierre del menú con botón, fondo, tecla `Escape` o navegación.
- Foco atrapado dentro del menú y de los modales mientras están abiertos.
- Animaciones de aparición, contadores y transiciones suaves.
- Soporte de `prefers-reduced-motion` y opción manual para reducir animaciones.
- Tema oscuro **Noche** y tema claro **Marfil**, persistente entre recargas.
- Toasts accesibles para confirmar acciones.
- Modales con cierre por `Escape`, botón, fondo y restauración de foco.

### Catálogo musical

- 61 canciones de demostración.
- 10 categorías: Pop, Rock, Baladas, Reguetón, Salsa, Cumbia, Románticas, Clásicos, Urbana e Inglés.
- Subcategorías por categoría.
- Filtros combinables por categoría, subcategoría, artista, búsqueda y orden.
- Contador de resultados y estado vacío con opción para limpiar filtros.
- Orden por título, artista o duración.
- Favoritos persistentes.
- “Mi lista” para canciones elegidas.
- Modal de detalle con género, artista, duración, dificultad y acciones.
- Atajo `/` para enfocar la búsqueda dentro del catálogo.
- Portadas SVG locales por género y fallback si una imagen falla.

### Salas

- Cinco salas: Classic, Premium, VIP, Party y Dúo.
- Precios y capacidades:
  - Classic: 40 Bs/h, 8 personas.
  - Premium: 65 Bs/h, 10 personas.
  - VIP: 100 Bs/h, 14 personas.
  - Party: 120 Bs/h, 20 personas.
  - Dúo: 35 Bs/h, 2–4 personas.
- Acordeones implementados con jQuery:
  - `$(document).ready()`
  - `$('.accordion-btn').click()`
  - `slideToggle()`
  - `addClass()` / `removeClass()`
  - `html()`
- La sala seleccionada actualiza el degradado, icono, características y el formulario de reserva.
- Navegación por teclado en las tarjetas destacadas.

### Reservas

- Formulario completo con nombre, teléfono, correo, sala, fecha, hora, duración, personas y notas.
- Validaciones específicas por campo y mensajes accesibles.
- Calculadora de precio en tiempo real según sala, duración y promoción.
- Validación de fecha futura, horario de atención, capacidad y conflictos de disponibilidad.
- Seis promociones de demostración:
  - `HAPPY15`
  - `ROMANCE20`
  - `DUO2X1`
  - `CUMPLE25`
  - `ESTUDIANTE10`
  - `VIPNIGHT15`
- Las promociones se validan según sala, día, horario y duración.
- El descuento solo se aplica después de pulsar **Aplicar**.
- La reserva se guarda inmediatamente como **Pendiente**.
- Temporizador obligatorio de **60 segundos** basado en una fecha límite real (`expiresAt`), no en un contador que se reinicia.
- El modal muestra el tiempo exacto en formato `MM:SS` y la hora real de vencimiento.
- Puedes cerrar el modal (X, fondo o `Escape`) sin cancelar la reserva: el contador sigue corriendo y aparece en cada tarjeta de **Mis reservas**.
- Se permiten varias reservas pendientes a la vez, cada una con su propio contador y sus botones **Continuar** para reabrir la confirmación.
- Al crear una reserva nueva, cualquier pendiente vencida se marca como **Expirada** y la nueva se abre con su temporizador.
- El resumen de reserva muestra una imagen de la sala seleccionada y se actualiza al cambiar de sala.
- Formulario compacto: dos columnas en escritorio y tres columnas en pantallas amplias para reducir el desplazamiento vertical.
- Flujo de confirmación:
  - `01:00` → `00:00`.
  - **Confirmar** cambia a **Confirmada** y deja el formulario listo para crear otra reserva.
  - **Cancelar** cambia solo esa reserva a **Cancelada** y conserva las demás pendientes.
  - Al agotarse el tiempo cambia a **Expirada**.
  - La expiración ocurre una sola vez por reserva, aunque el modal esté cerrado.
- Si se recarga la página, el tiempo restante se calcula desde la fecha límite original y se reabre la pendiente que vence primero.
- Se impiden reservas duplicadas y conflictos con reservas activas.
- Códigos de reserva con formato demostrativo `LUM-YYMMDD-XXXX`.

### Mis reservas

- Filtros por estado: todas, pendientes, confirmadas, canceladas y expiradas.
- Búsqueda por código, nombre o sala.
- Detalle de cada reserva.
- Cancelación de reservas activas con confirmación.
- Eliminación de registros con confirmación.
- Estados vacíos y contadores por filtro.

### Promociones

- Seis promociones visibles con imagen, condiciones y código.
- Filtros por tipo de promoción.
- Aplicación de código desde la sección o desde el formulario de reserva.
- Indicador visual de promoción aplicada.
- Registro del último código aplicado en `LocalStorage`.
- Validación de vigencia y condiciones.

### Bitácoras

- Registro real de interacciones del usuario: navegación, filtros, favoritos, reservas, promociones, tema, formularios, errores y sistema.
- Indicador de eventos nuevos en la cabecera.
- Filtros por tipo de evento.
- Búsqueda por acción, elemento o descripción.
- Rango de fechas desde/hasta.
- Orden cronológico ascendente o descendente.
- Contador de resultados y estadísticas.
- Exportación a **CSV** y **JSON**.
- Limpieza del historial con confirmación.
- Límite de 500 eventos para proteger el almacenamiento.

### Contacto

- Formulario con nombre, correo, teléfono opcional, asunto, mensaje y aceptación de privacidad.
- Validación en tiempo real y al enviar.
- Estados de carga y éxito.
- Registro del intento en bitácoras.

### Configuración

- Selector visual de tema Noche / Marfil con indicador **Activo**.
- Nombre para mostrar y sala favorita.
- Activación o desactivación de toasts.
- Reducción manual de animaciones.
- Estadísticas de uso de `LocalStorage`: reservas, eventos y favoritos.
- Exportación completa de datos locales en JSON.
- Borrado total de datos locales con confirmación y recarga.
- Información académica del proyecto.

### Accesibilidad

- HTML semántico y regiones con `aria-labelledby`.
- Etiquetas asociadas a todos los campos.
- Mensajes de error con `aria-live`.
- Estados `aria-expanded`, `aria-pressed`, `aria-hidden` y `aria-modal`.
- Foco visible y navegación por teclado.
- Cierre de menú y modales con `Escape`.
- Foco atrapado en menú y modales.
- Respeto por `prefers-reduced-motion`.
- Contraste cuidado en ambos temas.

---

## 5. Datos y almacenamiento local

Las claves usan el prefijo `lumina_`:

| Clave | Contenido |
|---|---|
| `lumina_theme` | Tema activo (`dark` o `light`). |
| `lumina_settings` | Nombre, sala favorita, toasts y reducción de movimiento. |
| `lumina_reservations` | Reservas en todos sus estados, incluidas las pendientes con su `expiresAt`. |
| `lumina_promotions` | Último código de promoción aplicado. |
| `lumina_favorites` | IDs de canciones favoritas. |
| `lumina_my_list` | IDs de canciones agregadas a “mi lista”. |
| `lumina_logs` | Eventos de bitácora. |
| `lumina_logs_seen_ts` | Marca de última revisión de bitácoras. |
| `lumina_reduce_motion` | Preferencia de movimiento reducido. |

El acceso a `LocalStorage` está envuelto en bloques `try/catch`. Si el almacenamiento falla o está lleno, la aplicación muestra un toast y continúa funcionando sin romperse.

---

## 6. Simulaciones locales (importante)

Este proyecto es **académico y demostrativo**. No existe backend ni base de datos compartida.

- Las reservas **no son reales** y no se envían a un servidor.
- No se envían correos electrónicos ni mensajes de WhatsApp.
- El formulario de contacto simula el envío y muestra una confirmación local.
- Las descargas CSV/JSON se generan en el navegador.
- Las imágenes son fotografías de demostración y portadas SVG creadas para el proyecto.
- La disponibilidad de salas, métricas, testimonios y promociones es demostrativa.
- El temporizador de 60 segundos es una retención simulada de la reserva.
- Los datos se guardan únicamente en el navegador y dispositivo del usuario.
- Borrar los datos del navegador o usar otro dispositivo hace que la información no esté disponible.
- La aplicación depende de CDN para jQuery, Bootstrap, Bootstrap Icons y Google Fonts; sin internet, el diseño y algunas interacciones pueden verse afectados.

---

## 7. Checklist de pruebas

### Navegación y menú

- [ ] Abrir el sitio en `http://localhost:4173/`.
- [ ] Navegar por las 9 secciones desde el menú lateral.
- [ ] Verificar que la URL cambia con hash y que el botón “atrás” funciona.
- [ ] Abrir el menú en móvil y escritorio.
- [ ] Cerrar con el botón, el fondo y `Escape`.
- [ ] Comprobar que el foco se mueve al botón de cierre y se restaura al cerrar.
- [ ] Verificar que `Tab` y `Shift+Tab` no salen del menú abierto.

### Catálogo

- [ ] Confirmar 61 canciones y 10 categorías.
- [ ] Buscar por título y por artista.
- [ ] Combinar categoría, subcategoría, búsqueda y orden.
- [ ] Probar el contador de resultados.
- [ ] Forzar un estado vacío y usar “Limpiar filtros”.
- [ ] Agregar y quitar favoritos; recargar y comprobar persistencia.
- [ ] Agregar a “Mi lista” y filtrar por esa lista.
- [ ] Abrir el detalle de una canción y probar sus acciones.
- [ ] Probar el atajo `/` dentro del catálogo.

### Salas

- [ ] Abrir y cerrar cada acordeón.
- [ ] Comprobar que solo una sala queda abierta a la vez.
- [ ] Verificar el cambio de degradado, icono y detalles.
- [ ] Usar “Reservar esta sala” y confirmar que el formulario se sincroniza.
- [ ] Navegar las tarjetas destacadas con teclado.

### Reservas y promociones

- [ ] Enviar el formulario vacío y revisar todos los errores.
- [ ] Probar teléfono, correo, fecha pasada, hora fuera de rango y capacidad.
- [ ] Verificar el cálculo de precio al cambiar sala, horas y personas.
- [ ] Aplicar un código válido y comprobar el descuento.
- [ ] Probar un código inválido o no elegible.
- [ ] Crear una reserva y verificar que aparece como **Pendiente**.
- [ ] Confirmar antes de `00:00` y comprobar **Confirmada**.
- [ ] Crear otra reserva, cancelarla y comprobar **Cancelada**.
- [ ] Crear otra reserva, dejar vencer el temporizador y comprobar **Expirada**.
- [ ] Recargar durante el minuto pendiente y verificar que el tiempo restante continúa.
- [ ] Comprobar que el modal muestra el tiempo exacto y la hora de vencimiento.
- [ ] Cerrar el modal con X, fondo o `Escape` y verificar que la reserva sigue **Pendiente** con el contador en su tarjeta.
- [ ] Crear dos reservas pendientes en salas u horarios distintos y comprobar que ambas tarjetas cuentan atrás.
- [ ] Confirmar una pendiente y cancelar la otra con **Continuar**, sin afectar a la restante.
- [ ] Crear otra reserva mientras una pendiente sigue activa y comprobar que se permite.
- [ ] Dejar vencer una pendiente con el modal cerrado y verificar **Expirada** una sola vez.
- [ ] Confirmar que la tarjeta de la reserva pendiente también muestra el tiempo restante.
- [ ] Cambiar de sala y comprobar que la imagen del resumen se actualiza.
- [ ] Intentar duplicar una reserva en el mismo horario y comprobar el conflicto.
- [ ] Verificar que la reserva expirada no vuelve a cambiar de estado.

### Mis reservas y bitácoras

- [ ] Filtrar por cada estado y buscar por código o nombre.
- [ ] Abrir el detalle de una reserva.
- [ ] Cancelar una reserva activa y eliminar un registro.
- [ ] Revisar el badge de eventos nuevos.
- [ ] Filtrar bitácoras por tipo, buscar y aplicar rango de fechas.
- [ ] Cambiar el orden cronológico.
- [ ] Exportar CSV y JSON; abrir ambos archivos.
- [ ] Limpiar bitácoras y confirmar que el historial queda vacío.

### Contacto y configuración

- [ ] Enviar el formulario vacío y validar los mensajes.
- [ ] Completar el formulario y comprobar el estado de carga y éxito.
- [ ] Cambiar entre tema Noche y Marfil; verificar el indicador **Activo** y la persistencia.
- [ ] Guardar nombre, sala favorita, toasts y reducción de movimiento.
- [ ] Recargar y verificar que las preferencias se mantienen.
- [ ] Revisar las estadísticas de almacenamiento.
- [ ] Exportar todos los datos y validar el JSON.
- [ ] Borrar todos los datos locales, confirmar y comprobar que la experiencia se restaura.

### Responsive y accesibilidad

- [ ] Probar a 360 px, 768 px, 1024 px y escritorio amplio.
- [ ] Verificar que no existe desplazamiento horizontal global.
- [ ] Revisar legibilidad y contraste en ambos temas.
- [ ] Navegar todo el sitio solo con teclado.
- [ ] Activar reducción de movimiento y comprobar que las animaciones se atenúan.
- [ ] Revisar que las imágenes cargan y que los fallbacks funcionan si faltan archivos.

---

## 8. Tecnologías utilizadas

- HTML5 semántico.
- CSS3 con variables, Grid, Flexbox, media queries y animaciones.
- JavaScript ES6.
- jQuery 3.7.1.
- Bootstrap 5.3.3.
- Bootstrap Icons 1.11.3.
- Google Fonts: Bebas Neue, Manrope y Outfit.
- `LocalStorage` para persistencia.
- `setInterval` para el temporizador de confirmación.
- IntersectionObserver para animaciones de aparición y contadores.
- SVG locales para portadas y fallbacks.

---

## 9. Créditos

- Fotografías de demostración: Unsplash.
- Iconografía: Bootstrap Icons.
- Tipografías: Google Fonts.
- Portadas SVG y composición visual: elaboradas para este proyecto.
- Proyecto académico: **Diseño Web II — UPDS**.

> LÚMINA es una marca ficticia creada con fines educativos.

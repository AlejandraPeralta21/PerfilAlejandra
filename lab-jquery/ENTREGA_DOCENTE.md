# LÚMINA Karaoke — Laboratorio jQuery

Abrir `lab-jquery/index.html` para evaluar el laboratorio. El `index.html` del directorio principal se mantiene intacto.

## Componentes
- Navbar, catálogo musical, filtros y menú hamburguesa con jQuery.
- Salas con tarjetas y tabla VIP de filas alternadas, estado según fecha, hora y duración de la reserva.
- Formulario, cálculo y desglose dinámico, confirmación de reserva y temporizador de 60 segundos.
- Toast superior con `.slideDown()`, permanencia predeterminada de 3 segundos y `.fadeOut()`. El toast de confirmación también dura 3 segundos.
- Bitácoras y persistencia local. No es un servidor de reservas compartido.

## Cómo probar
1. Abrir la página y seleccionar Salas. Revisar tabla VIP.
2. Ir a Reservas, seleccionar sala, fecha, hora y horas. Volver a Salas para ver estado.
3. Crear una reserva, confirmar antes de 60 segundos y observar el toast.
4. Repetir con la misma sala y horario para ver la indicación Reservada.
5. Probar filtros, favoritos, validaciones y bitácoras.

La disponibilidad es simulada y solo considera las reservas almacenadas en el navegador actual.

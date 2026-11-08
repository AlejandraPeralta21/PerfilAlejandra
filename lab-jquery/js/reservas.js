/* =========================================================
   LÚMINA | Karaoke & Music Lounge
   reservas.js — Salas, promociones, cálculo y reservas
   ========================================================= */
(function (window, document) {
  'use strict';

  const LUMINA = (window.LUMINA = window.LUMINA || {});
  const $ = window.jQuery;
  const Storage = LUMINA.Storage;
  const Validation = LUMINA.Validation;

  const HOLD_MS = 60000;
  const MAX_DATE_DAYS = 120;
  const ACTIVE_STATUSES = ['Confirmada', 'Pendiente'];
  const STORAGE_RESERVATIONS = 'reservations';
  const STORAGE_PENDING = 'pending';
  const STORAGE_COUPON = 'coupon';

  const DEFAULT_PENDING_TITLE = 'Confirma tu lugar en el escenario.';
  const DEFAULT_CONFIRM_LABEL = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Confirmar reserva';
  const DEFAULT_HOLD_NOTE = '<i class="bi bi-clock-history" aria-hidden="true"></i> Puedes cerrar esta ventana sin cancelar: el contador sigue visible en «Mis reservas» y puedes crear otra reserva mientras esta espera. Al llegar a 00:00 la sala se libera.';

  const ROOMS = [
    {
      id: 'classic',
      name: 'Sala Classic',
      shortName: 'Classic',
      tagline: 'La experiencia esencial',
      price: 40,
      capacity: 8,
      minPeople: 1,
      icon: 'bi-music-note-beamed',
      image: 'assets/imagenes/room1.jpg',
      badge: 'Más elegida',
      colorA: '#b68b49',
      colorB: '#315dce',
      description: 'Todo lo que necesitas para una primera noche de karaoke, con sonido profesional y una iluminación cálida que invita a quedarse.',
      featuredText: 'Sonido profesional, luz cálida y la energía justa para tu primera gran noche.',
      highlights: [
        { icon: 'bi-people', text: 'Hasta 8 personas' },
        { icon: 'bi-soundwave', text: 'Sonido 2.1' },
        { icon: 'bi-lightbulb', text: 'Luz cálida' }
      ],
      features: [
        { icon: 'bi-mic', label: 'Micrófonos', value: '2 inalámbricos' },
        { icon: 'bi-display', label: 'Pantalla', value: '55" Full HD' },
        { icon: 'bi-music-note-list', label: 'Catálogo', value: '61 canciones demo' },
        { icon: 'bi-lightbulb', label: 'Ambiente', value: 'Iluminación cálida' }
      ]
    },
    {
      id: 'premium',
      name: 'Sala Premium',
      shortName: 'Premium',
      tagline: 'La noche sube de nivel',
      price: 65,
      capacity: 10,
      minPeople: 1,
      icon: 'bi-stars',
      image: 'assets/imagenes/room2.jpg',
      badge: 'Favorita en pareja',
      colorA: '#d9b56f',
      colorB: '#8d5cff',
      description: 'Un espacio más amplio, luces que cambian con cada canción y un sonido envolvente para que nadie se quede sentado.',
      featuredText: 'Más espacio, luces dinámicas y un escenario pensado para compartir.',
      highlights: [
        { icon: 'bi-people', text: 'Hasta 10 personas' },
        { icon: 'bi-music-note', text: 'Sonido profesional' },
        { icon: 'bi-brightness-high', text: 'Luces LED' }
      ],
      features: [
        { icon: 'bi-mic', label: 'Micrófonos', value: '4 inalámbricos' },
        { icon: 'bi-display', label: 'Pantalla', value: '75" 4K' },
        { icon: 'bi-lightning-charge', label: 'Iluminación', value: 'LED dinámica' },
        { icon: 'bi-heart', label: 'Ideal para', value: 'Parejas y amigos' }
      ]
    },
    {
      id: 'vip',
      name: 'Sala VIP',
      shortName: 'VIP',
      tagline: 'Un escenario solo para ti',
      price: 100,
      capacity: 14,
      minPeople: 1,
      icon: 'bi-gem',
      image: 'assets/imagenes/room3.jpg',
      badge: 'Experiencia premium',
      colorA: '#e5c47f',
      colorB: '#9b6bff',
      description: 'La experiencia más exclusiva de Lúmina: sonido envolvente, iluminación inteligente y un ambiente preparado para celebrar a lo grande.',
      featuredText: 'Sonido envolvente, luz inteligente y el servicio más exclusivo.',
      highlights: [
        { icon: 'bi-people', text: 'Hasta 14 personas' },
        { icon: 'bi-speaker', text: 'Sonido surround' },
        { icon: 'bi-stars', text: 'Atención privada' }
      ],
      features: [
        { icon: 'bi-mic', label: 'Micrófonos', value: '6 inalámbricos' },
        { icon: 'bi-display', label: 'Pantalla', value: '85" 4K' },
        { icon: 'bi-badge-vr', label: 'Iluminación', value: 'Inteligente' },
        { icon: 'bi-person-badge', label: 'Servicio', value: 'Atención privada demo' }
      ]
    },
    {
      id: 'party',
      name: 'Sala Party',
      shortName: 'Party',
      tagline: 'La fiesta empieza aquí',
      price: 120,
      capacity: 20,
      minPeople: 1,
      icon: 'bi-vinyl-fill',
      image: 'assets/imagenes/room4.jpg',
      badge: 'Para grupos grandes',
      colorA: '#ff9f7a',
      colorB: '#ec4d86',
      description: 'Diseñada para grupos que cantan fuerte: pista LED, máquina de humo y espacio de sobra para convertir la noche en una fiesta.',
      featuredText: 'Pista LED, humo y espacio para que todo el grupo cante.',
      highlights: [
        { icon: 'bi-people', text: 'Hasta 20 personas' },
        { icon: 'bi-cloud-fog2', text: 'Máquina de humo' },
        { icon: 'bi-vinyl', text: 'Pista LED' }
      ],
      features: [
        { icon: 'bi-mic', label: 'Micrófonos', value: '8 inalámbricos' },
        { icon: 'bi-display', label: 'Pantalla', value: '100" Full HD' },
        { icon: 'bi-cloud-fog2', label: 'Efectos', value: 'Humo + luces' },
        { icon: 'bi-people', label: 'Ideal para', value: 'Cumpleaños y equipos' }
      ]
    },
    {
      id: 'duo',
      name: 'Sala Dúo',
      shortName: 'Dúo',
      tagline: 'Dos voces, una historia',
      price: 35,
      capacity: 4,
      minPeople: 2,
      icon: 'bi-heart-fill',
      image: 'assets/imagenes/room5.jpg',
      badge: 'Íntima y romántica',
      colorA: '#e7a6b6',
      colorB: '#b8476b',
      description: 'Un refugio pequeño y cálido para cantar en pareja o con tu persona favorita, con una selección musical pensada para la ocasión.',
      featuredText: 'Un espacio íntimo para dos, con luz de neón y canciones para recordar.',
      highlights: [
        { icon: 'bi-people', text: '2 a 4 personas' },
        { icon: 'bi-heart', text: 'Ambiente íntimo' },
        { icon: 'bi-music-note-beamed', text: 'Playlist romántica' }
      ],
      features: [
        { icon: 'bi-mic', label: 'Micrófonos', value: '2 inalámbricos' },
        { icon: 'bi-display', label: 'Pantalla', value: '43" Full HD' },
        { icon: 'bi-lightbulb', label: 'Ambiente', value: 'Neón cálido' },
        { icon: 'bi-heart', label: 'Ideal para', value: 'Parejas' }
      ]
    }
  ];

  const PROMOTIONS = [
    {
      code: 'HAPPY15',
      type: 'descuento',
      typeLabel: 'Descuento',
      title: 'Happy Hour Lúmina',
      discount: 15,
      discountLabel: '15%',
      image: 'assets/imagenes/promo5.jpg',
      description: 'Empieza la noche temprano y canta con un 15% menos en el total de tu sala.',
      validity: 'Lun – Jue · antes de las 20:00',
      conditions: ['Válida de lunes a jueves.', 'La reserva debe iniciar antes de las 20:00.', 'Aplica a cualquier sala.'],
      days: [1, 2, 3, 4],
      timeTo: 19 * 60 + 59,
      rooms: null,
      minHours: 1
    },
    {
      code: 'ROMANCE20',
      type: 'temporada',
      typeLabel: 'Temporada',
      title: 'Noche Romántica',
      discount: 20,
      discountLabel: '20%',
      image: 'assets/imagenes/promo1.jpg',
      description: 'Viernes y sábados después de las 20:00, la Sala Premium se convierte en el escenario perfecto para dos.',
      validity: 'Vie & Sáb · desde 20:00',
      conditions: ['Solo Sala Premium.', 'Viernes y sábados.', 'Inicio desde las 20:00 y mínimo 2 horas.'],
      days: [5, 6],
      timeFrom: 20 * 60,
      rooms: ['premium'],
      minHours: 2
    },
    {
      code: 'DUO2X1',
      type: 'experiencia',
      typeLabel: 'Experiencia',
      title: 'Dúo 2x1',
      discount: 50,
      discountLabel: '2x1',
      image: 'assets/imagenes/promo5.jpg',
      description: 'Reserva dos horas en la Sala Dúo y paga solo el equivalente a una. Una noche íntima al mejor precio.',
      validity: 'Lun – Mié · mínimo 2 horas',
      conditions: ['Exclusiva de la Sala Dúo.', 'Válida de lunes a miércoles.', 'Requiere un mínimo de 2 horas.'],
      days: [1, 2, 3],
      rooms: ['duo'],
      minHours: 2
    },
    {
      code: 'CUMPLE25',
      type: 'experiencia',
      typeLabel: 'Experiencia',
      title: 'Cumpleaños a todo volumen',
      discount: 25,
      discountLabel: '25%',
      image: 'assets/imagenes/promo2.jpg',
      description: 'Si vienes a celebrar, nosotros ponemos el escenario. Descuento especial para tu cumpleaños.',
      validity: 'Todos los días · mínimo 2 horas',
      conditions: ['Válida cualquier día.', 'Aplica a cualquier sala.', 'Mínimo 2 horas y mención en observaciones.'],
      days: null,
      rooms: null,
      minHours: 2
    },
    {
      code: 'ESTUDIANTE10',
      type: 'descuento',
      typeLabel: 'Descuento',
      title: 'Noche de estudiantes',
      discount: 10,
      discountLabel: '10%',
      image: 'assets/imagenes/promo4.jpg',
      description: 'Domingo a jueves, reúne a tu grupo y aprovecha un descuento pensado para estudiar menos y cantar más.',
      validity: 'Dom – Jue · mínimo 2 horas',
      conditions: ['Válida de domingo a jueves.', 'Aplica a cualquier sala.', 'Requiere un mínimo de 2 horas.'],
      days: [0, 1, 2, 3, 4],
      rooms: null,
      minHours: 2
    },
    {
      code: 'VIPNIGHT15',
      type: 'temporada',
      typeLabel: 'Temporada',
      title: 'VIP After Night',
      discount: 15,
      discountLabel: '15%',
      image: 'assets/imagenes/promo3.jpg',
      description: 'Viernes y sábados desde las 21:00, la Sala VIP te espera con sonido envolvente y atención privada.',
      validity: 'Vie & Sáb · desde 21:00',
      conditions: ['Solo Sala VIP.', 'Viernes y sábados.', 'Inicio desde las 21:00 y mínimo 2 horas.'],
      days: [5, 6],
      timeFrom: 21 * 60,
      rooms: ['vip'],
      minHours: 2
    }
  ];

  LUMINA.rooms = ROOMS;
  LUMINA.promotions = PROMOTIONS;

  const FIELD_KEYS = {
    bookingName: 'name',
    bookingPhone: 'phone',
    bookingEmail: 'email',
    bookingRoom: 'room',
    bookingDate: 'date',
    bookingTime: 'time',
    bookingHours: 'hours',
    bookingPeople: 'people',
    bookingPromo: 'promo',
    bookingNotes: 'notes',
    bookingTerms: 'terms'
  };

  const FIELD_LABELS = {
    name: 'nombre',
    phone: 'teléfono',
    email: 'correo',
    room: 'sala',
    date: 'fecha',
    time: 'hora',
    hours: 'horas',
    people: 'personas',
    promo: 'cupón',
    notes: 'observaciones',
    terms: 'términos'
  };

  const STATUS_META = {
    Confirmada: { icon: 'bi-check-circle', color: 'var(--success)' },
    Pendiente: { icon: 'bi-hourglass-split', color: 'var(--gold)' },
    Cancelada: { icon: 'bi-x-circle', color: 'var(--danger)' },
    Expirada: { icon: 'bi-slash-circle', color: 'var(--muted)' }
  };

  const state = {
    initialized: false,
    selectedRoomId: ROOMS[0].id,
    statusFilter: 'all',
    promoFilter: 'all',
    coupon: '',
    pending: null,
    timerId: null,
    lastAnnouncedSecond: null,
    submitting: false,
    confirming: false,
    detailId: null,
    started: false,
    roomSwitchToken: 0
  };

  let reservations = [];

  /* ---------- Utilidades ---------- */
  function getRoom(roomId) {
    return ROOMS.find((room) => room.id === roomId) || null;
  }

  function getPromotion(code) {
    const normalized = normalizeCode(code);
    return PROMOTIONS.find((promo) => promo.code === normalized) || null;
  }

  function normalizeCode(value) {
    return String(value || '').trim().toUpperCase();
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function formatHours(value) {
    const hours = Number(value) || 0;
    return hours === 1 ? '1 hora' : hours + ' horas';
  }

  function formatPeople(value) {
    const people = Number(value) || 0;
    return people === 1 ? '1 persona' : people + ' personas';
  }

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  function remainingSeconds(record) {
    return Math.max(0, Math.ceil((Number(record && record.expiresAt) - Date.now()) / 1000));
  }

  function formatRemaining(seconds) {
    const safe = Math.max(0, Math.ceil(Number(seconds) || 0));
    return pad(Math.floor(safe / 60)) + ':' + pad(safe % 60);
  }

  function pendingReservations() {
    return reservations.filter(function (item) {
      return item && item.status === 'Pendiente';
    });
  }

  function activePendingReservations() {
    const now = Date.now();
    return pendingReservations().filter(function (item) {
      return Number(item.expiresAt) > now;
    });
  }

  function updateCardCountdowns() {
    document.querySelectorAll('[data-reservation-countdown]').forEach(function (element) {
      const expiresAt = Number(element.getAttribute('data-expires-at'));
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      const value = element.querySelector('.reservation-countdown-value');
      if (value) value.textContent = formatRemaining(remaining);
      element.classList.toggle('is-urgent', remaining <= 10);
    });
  }

  function timeToMinutes(time) {
    if (!/^\d{2}:\d{2}$/.test(String(time || ''))) return null;
    const parts = String(time).split(':').map(Number);
    return parts[0] * 60 + parts[1];
  }

  function buildStartDate(booking) {
    const date = LUMINA.parseLocalDate(booking && booking.date);
    if (!date) return null;
    const minutes = timeToMinutes(booking.time);
    if (minutes === null) return null;
    date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return date;
  }

  function formatSchedule(time, hours) {
    if (!time) return 'Sin seleccionar';
    const minutes = timeToMinutes(time);
    const end = LUMINA.addHoursToTime(time, hours);
    if (minutes === null || !end) return time;
    const crossesMidnight = minutes + (Number(hours) || 0) * 60 >= 1440;
    return time + ' – ' + end + (crossesMidnight ? ' (+1)' : '');
  }

  function formatDayList(days) {
    const names = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];
    if (!days || !days.length) return 'todos los días';
    if (days.length === 1) return names[days[0]];
    return days.map((day) => names[day]).join(', ');
  }

  function todayISO() {
    return LUMINA.toLocalISO(new Date());
  }

  function dateLimits() {
    const today = new Date();
    const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + MAX_DATE_DAYS);
    return { min: LUMINA.toLocalISO(today), max: LUMINA.toLocalISO(max) };
  }

  function generateCode(date) {
    const stamp = String(date.getFullYear()).slice(2) + pad(date.getMonth() + 1) + pad(date.getDate());
    let code = '';
    let attempts = 0;
    do {
      code = 'LUM-' + stamp + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      attempts += 1;
    } while (reservations.some((item) => item.code === code) && attempts < 20);
    return code;
  }

  function saveReservations(list) {
    const next = Array.isArray(list) ? list : reservations;
    const ok = Storage.set(STORAGE_RESERVATIONS, next);
    if (ok) {
      reservations = next;
      refreshDataViews();
    }
    return ok;
  }

  function refreshDataViews() {
    updateMenuCount();
    refreshShowcaseAvailability();
    renderVipStatus();
    if (LUMINA.refreshStorageStats) LUMINA.refreshStorageStats();
  }

  function updateMenuCount() {
    const menuCount = document.getElementById('menuReservationCount');
    if (menuCount) menuCount.textContent = String(reservations.length);
  }

  function loadReservations() {
    const stored = Storage.get(STORAGE_RESERVATIONS, []);
    if (!Array.isArray(stored)) return [];
    return stored.filter((item) => item && typeof item === 'object' && item.id && item.status);
  }

  function readDraft() {
    return {
      name: document.getElementById('bookingName')?.value || '',
      phone: document.getElementById('bookingPhone')?.value || '',
      email: document.getElementById('bookingEmail')?.value || '',
      roomId: document.getElementById('bookingRoom')?.value || '',
      date: document.getElementById('bookingDate')?.value || '',
      time: document.getElementById('bookingTime')?.value || '',
      hours: document.getElementById('bookingHours')?.value || '',
      people: document.getElementById('bookingPeople')?.value || '',
      promo: document.getElementById('bookingPromo')?.value || '',
      notes: document.getElementById('bookingNotes')?.value || ''
    };
  }

  function availabilityFor(room) {
    const today = todayISO();
    const activeToday = reservations.filter((item) =>
      item.roomId === room.id && item.date === today && ACTIVE_STATUSES.includes(item.status)
    ).length;
    if (activeToday >= 3) return 'Alta demanda hoy';
    return 'Disponible hoy';
  }

  function refreshShowcaseAvailability() {
    const room = getRoom(state.selectedRoomId);
    if (!room) return;
    setText('roomShowcaseAvailability', availabilityFor(room));
  }

  /* ---------- Cupones ---------- */
  function evaluateCoupon(draft) {
    const code = normalizeCode(state.coupon);
    if (!code) {
      return { code: '', promo: null, eligible: false, reason: '', incomplete: false, invalid: false };
    }
    const promo = getPromotion(code);
    if (!promo) {
      return { code, promo: null, eligible: false, reason: 'El cupón “' + code + '” no existe o ya no está disponible.', incomplete: false, invalid: true };
    }
    const check = checkPromotion(promo, draft);
    return {
      code,
      promo,
      eligible: check.ok,
      reason: check.reason,
      incomplete: check.incomplete,
      invalid: false
    };
  }

  function checkPromotion(promo, draft) {
    if (!draft.roomId) {
      return { ok: false, incomplete: true, reason: 'Elige una sala para validar este cupón.' };
    }
    if (!draft.date) {
      return { ok: false, incomplete: true, reason: 'Elige una fecha para validar este cupón.' };
    }
    if (!draft.time) {
      return { ok: false, incomplete: true, reason: 'Elige una hora de inicio para validar este cupón.' };
    }
    if (promo.rooms && !promo.rooms.includes(draft.roomId)) {
      const roomNames = promo.rooms.map((id) => getRoom(id)?.name || id).join(' o ');
      return { ok: false, incomplete: false, reason: 'Válido solo para ' + roomNames + '.' };
    }

    const date = LUMINA.parseLocalDate(draft.date);
    if (!date) {
      return { ok: false, incomplete: false, reason: 'La fecha de la reserva no es válida.' };
    }
    if (promo.days && !promo.days.includes(date.getDay())) {
      return { ok: false, incomplete: false, reason: 'Válido solo los ' + formatDayList(promo.days) + '.' };
    }

    const start = timeToMinutes(draft.time);
    if (start === null) {
      return { ok: false, incomplete: false, reason: 'La hora de inicio no es válida.' };
    }
    if (typeof promo.timeFrom === 'number' && start < promo.timeFrom) {
      return { ok: false, incomplete: false, reason: 'Válido desde las ' + minutesToTime(promo.timeFrom) + '.' };
    }
    if (typeof promo.timeTo === 'number' && start > promo.timeTo) {
      return { ok: false, incomplete: false, reason: 'Válido solo antes de las ' + minutesToTime(promo.timeTo + 1) + '.' };
    }
    if (promo.minHours && (Number(draft.hours) || 0) < promo.minHours) {
      return { ok: false, incomplete: false, reason: 'Requiere un mínimo de ' + formatHours(promo.minHours) + '.' };
    }
    return { ok: true, incomplete: false, reason: '' };
  }

  function minutesToTime(minutes) {
    const normalized = ((Number(minutes) || 0) % 1440 + 1440) % 1440;
    return pad(Math.floor(normalized / 60)) + ':' + pad(normalized % 60);
  }

  function calculateTotals(draft) {
    const room = getRoom(draft.roomId);
    const hours = Number(draft.hours) || 0;
    const rate = room ? room.price : 0;
    const subtotal = rate * hours;
    const evaluation = evaluateCoupon(draft);
    const percent = evaluation.eligible && evaluation.promo ? evaluation.promo.discount : 0;
    const discount = percent ? Math.round(subtotal * percent / 100) : 0;
    return {
      room,
      rate,
      hours,
      subtotal,
      discount,
      total: Math.max(0, subtotal - discount),
      coupon: evaluation
    };
  }

  /* ---------- Fechas de reserva ---------- */
  function buildReservation(draft, totals) {
    const now = new Date();
    const room = totals.room;
    const coupon = totals.coupon;
    return {
      id: LUMINA.uid('res'),
      code: generateCode(now),
      status: 'Pendiente',
      roomId: room.id,
      roomName: room.name,
      roomIcon: room.icon,
      roomColorA: room.colorA,
      roomColorB: room.colorB,
      date: draft.date,
      time: draft.time,
      endTime: LUMINA.addHoursToTime(draft.time, draft.hours),
      hours: Number(draft.hours),
      people: Number(draft.people),
      name: draft.name.trim().slice(0, 60),
      phone: draft.phone.trim().slice(0, 20),
      email: draft.email.trim().slice(0, 120),
      notes: draft.notes.trim().slice(0, 240),
      rate: totals.rate,
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      coupon: coupon.code,
      couponTitle: coupon.promo ? coupon.promo.title : '',
      couponPercent: coupon.eligible && coupon.promo ? coupon.promo.discount : 0,
      couponApplied: Boolean(coupon.eligible && totals.discount > 0),
      couponNote: coupon.eligible ? '' : coupon.reason,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: now.getTime() + HOLD_MS,
      holdMs: HOLD_MS,
      source: 'simulación local'
    };
  }

  function findConflict(draft) {
    const start = buildStartDate(draft);
    if (!start) return null;
    const end = new Date(start.getTime() + (Number(draft.hours) || 0) * 3600000);
    return reservations.find((item) => {
      if (!ACTIVE_STATUSES.includes(item.status)) return false;
      if (item.roomId !== draft.roomId) return false;
      const itemStart = buildStartDate(item);
      if (!itemStart) return false;
      const itemEnd = new Date(itemStart.getTime() + (Number(item.hours) || 0) * 3600000);
      return start < itemEnd && end > itemStart;
    }) || null;
  }

  function updateReservation(id, changes) {
    const index = reservations.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const previous = Object.assign({}, reservations[index]);
    const next = Object.assign({}, reservations[index], changes, { updatedAt: new Date().toISOString() });
    const copy = reservations.slice();
    copy[index] = next;
    if (!saveReservations(copy)) {
      reservations[index] = previous;
      return null;
    }
    return next;
  }

  function removeReservation(id) {
    const index = reservations.findIndex((item) => item.id === id);
    if (index === -1) return false;
    const copy = reservations.slice();
    copy.splice(index, 1);
    return saveReservations(copy);
  }

  /* ---------- Salas: render y selección ---------- */
  function renderRoomSelect() {
    const select = document.getElementById('bookingRoom');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona una sala</option>' + ROOMS.map((room) =>
      '<option value="' + room.id + '">' + LUMINA.escapeHtml(room.name) + ' · ' + LUMINA.formatBs(room.price) + '/h</option>'
    ).join('');
  }

  function renderRooms() {
    const container = document.getElementById('roomsAccordion');
    if (!container) return;

    container.innerHTML = ROOMS.map((room) => {
      const selected = state.selectedRoomId === room.id;
      const featureStrip = room.highlights.slice(0, 3).map((item) =>
        '<span><i class="bi ' + item.icon + '" aria-hidden="true"></i> ' + LUMINA.escapeHtml(item.text) + '</span>'
      ).join('');
      const featureGrid = room.features.map((feature) =>
        '<div class="room-feature-item">' +
          '<i class="bi ' + feature.icon + '" aria-hidden="true"></i>' +
          '<div><small>' + LUMINA.escapeHtml(feature.label) + '</small><span>' + LUMINA.escapeHtml(feature.value) + '</span></div>' +
        '</div>'
      ).join('');

      return (
        '<article class="room-accordion-card' + (selected ? ' is-selected' : '') + '" data-room-id="' + room.id + '" style="--room-a: ' + room.colorA + '; --room-b: ' + room.colorB + ';">' +
          '<button class="accordion-btn" type="button" aria-expanded="false" aria-controls="roomPanel-' + room.id + '" id="roomButton-' + room.id + '">' +
            '<span class="room-accordion-thumb"><img src="' + room.image + '" data-fallback="assets/imagenes/room-fallback.svg" alt="Sala ' + LUMINA.escapeHtml(room.shortName) + '" loading="lazy"></span>' +
            '<span class="room-accordion-name"><strong>' + LUMINA.escapeHtml(room.name) + '</strong><span>Capacidad para ' + room.capacity + ' · ' + LUMINA.escapeHtml(room.tagline) + '</span></span>' +
            '<span class="room-accordion-features">' + featureStrip + '</span>' +
            '<span class="room-accordion-price">' + LUMINA.formatBs(room.price) + ' <small>/ hora</small></span>' +
            '<span class="accordion-chevron"><i class="bi bi-chevron-down" aria-hidden="true"></i></span>' +
          '</button>' +
          '<div class="room-accordion-panel" id="roomPanel-' + room.id + '" role="region" aria-labelledby="roomButton-' + room.id + '">' +
            '<div class="room-accordion-inner">' +
              '<div class="room-accordion-photo"><img src="' + room.image + '" data-fallback="assets/imagenes/room-fallback.svg" alt="Interior de ' + LUMINA.escapeHtml(room.name) + '" loading="lazy"></div>' +
              '<div>' +
                '<div class="room-feature-grid">' + featureGrid + '</div>' +
                '<div class="room-accordion-cta">' +
                  '<button class="btn btn-gold" type="button" data-room-book="' + room.id + '"><i class="bi bi-calendar2-plus" aria-hidden="true"></i> Reservar esta sala</button>' +
                  '<button class="btn btn-outline-gold" type="button" data-room-select="' + room.id + '"><i class="bi bi-check2" aria-hidden="true"></i> Usar en el resumen</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  /* Tabla VIP solicitada en el laboratorio de maquetación UI. */
  function renderVipStatus() {
    const tbody = document.getElementById('vipStatusRows');
    if (!tbody) return;
    const draft = getDraft();
    const hasSchedule = Boolean(draft.date && draft.time && Number(draft.hours) > 0);
    tbody.innerHTML = ROOMS.map((room) => {
      const conflict = hasSchedule ? findConflict(Object.assign({}, draft, { roomId: room.id })) : null;
      const occupied = Boolean(conflict);
      return '<tr><td><strong>' + LUMINA.escapeHtml(room.name) + '</strong></td>' +
        '<td>' + room.capacity + ' personas</td><td>' + LUMINA.formatBs(room.price) + '/h</td>' +
        '<td><span class="vip-state ' + (occupied ? 'vip-occupied' : 'vip-available') + '">' +
        (occupied ? 'Reservada' : (hasSchedule ? 'Disponible' : 'Por consultar')) + '</span></td>' +
        '<td><button type="button" class="btn btn-outline-gold vip-choose" data-vip-room="' + room.id + '">Elegir sala</button></td></tr>';
    }).join('');
    const note = document.getElementById('vipStatusNote');
    if (note) note.textContent = hasSchedule ? 'Disponibilidad para ' + draft.date + ' a las ' + draft.time + ' (' + draft.hours + ' hora(s)). Datos locales de este navegador.' : 'Selecciona fecha, horario y duración en Reservas para consultar conflictos reales del simulador.';
  }

  function renderFeaturedRooms() {
    const grid = document.getElementById('featuredRoomsGrid');
    if (!grid) return;
    grid.innerHTML = ROOMS.slice(0, 3).map((room, index) => {
      const available = availabilityFor(room) === 'Disponible hoy';
      return (
        '<article class="featured-room-card" data-featured-room="' + room.id + '" role="button" tabindex="0" aria-label="Ver ' + LUMINA.escapeHtml(room.name) + '">' +
          '<img src="' + room.image + '" data-fallback="assets/imagenes/room-fallback.svg" alt="' + LUMINA.escapeHtml(room.name) + '" loading="lazy">' +
          '<div class="featured-room-topline">' +
            '<span class="room-chip' + (available ? ' is-available' : '') + '">' + LUMINA.escapeHtml(availabilityFor(room)) + '</span>' +
            '<span class="room-chip">' + (index === 0 ? 'Más elegida' : 'Recomendada') + '</span>' +
          '</div>' +
          '<div class="featured-room-info">' +
            '<span class="eyebrow">' + LUMINA.escapeHtml(room.tagline) + '</span>' +
            '<h3>' + LUMINA.escapeHtml(room.name) + '</h3>' +
            '<p>' + LUMINA.escapeHtml(room.featuredText) + '</p>' +
            '<div class="featured-room-foot">' +
              '<div class="featured-room-price"><strong>' + LUMINA.formatBs(room.price) + '</strong><span>/ hora</span></div>' +
              '<span class="featured-room-capacity"><i class="bi bi-people" aria-hidden="true"></i>Hasta ' + room.capacity + '</span>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function selectRoom(roomId, options) {
    const opts = Object.assign({ log: true, source: 'acordeón', navigate: false, focusDate: false }, options || {});
    const room = getRoom(roomId);
    if (!room) return false;

    state.selectedRoomId = room.id;
    const $showcase = $('#roomShowcase');
    $showcase.css({ '--room-a': room.colorA, '--room-b': room.colorB });

    $('.room-accordion-card').removeClass('is-selected');
    $('#roomsAccordion .room-accordion-card[data-room-id="' + room.id + '"]').addClass('is-selected');

    const token = state.roomSwitchToken + 1;
    state.roomSwitchToken = token;
    const image = document.getElementById('roomShowcaseImg');
    if (image) {
      $(image).addClass('is-switching');
      window.setTimeout(function () {
        if (state.roomSwitchToken !== token) return;
        image.classList.remove('is-fallback-image');
        image.dataset.fallbackApplied = 'false';
        image.src = room.image;
        image.setAttribute('data-fallback', 'assets/imagenes/room-fallback.svg');
        image.alt = 'Interior de ' + room.name;
        $(image).removeClass('is-switching');
      }, 170);
    }

    setText('roomShowcaseBadge', room.badge);
    setText('roomShowcaseTagline', room.tagline);
    setText('roomShowcaseName', room.name);
    setText('roomShowcaseDescription', room.description);
    setText('roomShowcaseAvailability', availabilityFor(room));
    $('#roomShowcaseIcon').html('<i class="bi ' + room.icon + '" aria-hidden="true"></i>');
    $('#roomShowcaseStats').html(room.highlights.map((item) =>
      '<span class="room-mini-stat"><i class="bi ' + item.icon + '" aria-hidden="true"></i> ' + LUMINA.escapeHtml(item.text) + '</span>'
    ).join(''));

    const select = document.getElementById('bookingRoom');
    if (select && select.value !== room.id) select.value = room.id;
    updateCapacityHint(room);
    updateSummary();

    if (opts.navigate) {
      LUMINA.showSection('reservaciones');
    }
    if (opts.focusDate) {
      window.setTimeout(function () {
        document.getElementById('bookingDate')?.focus({ preventScroll: false });
      }, opts.navigate ? 380 : 80);
    }

    if (opts.log) {
      LUMINA.log({
        type: 'jquery',
        action: 'SELECCIONAR SALA',
        element: room.name,
        description: 'La sala seleccionada cambió a ' + room.name + ' (' + LUMINA.formatBs(room.price) + '/h) y el escaparate actualizó su color, icono y detalles.',
        result: 'EXITOSO',
        meta: { roomId: room.id, price: room.price, source: opts.source }
      });
    }
    return true;
  }

  function bindRoomEvents() {
    // Requisito académico: acordeón construido con jQuery y slideToggle().
    $('.accordion-btn').click(function () {
      const $button = $(this);
      const panelId = $button.attr('aria-controls');
      const roomId = $button.closest('.room-accordion-card').attr('data-room-id');
      const room = getRoom(roomId);
      const expanded = $button.attr('aria-expanded') === 'true';
      const $panel = $('#' + panelId);
      const $card = $button.closest('.room-accordion-card');

      $button.attr('aria-expanded', String(!expanded));
      $panel.stop(true, true).slideToggle(260);
      if (expanded) {
        $card.removeClass('is-open');
      } else {
        $card.addClass('is-open');
      }

      selectRoom(roomId, { log: false, source: 'acordeón' });
      LUMINA.log({
        type: 'jquery',
        action: expanded ? 'CONTRAER SALA' : 'DESPLEGAR SALA',
        element: room ? room.name : 'Acordeón de salas',
        description: (expanded ? 'Se ocultaron' : 'Se mostraron') + ' las características de ' + (room ? room.name : 'la sala') + ' usando slideToggle() de jQuery.',
        result: 'EXITOSO',
        meta: { roomId, component: 'acordeón', method: 'slideToggle' }
      });
    });

    $('#roomsAccordion').on('click', '[data-room-select]', function () {
      const room = getRoom(this.getAttribute('data-room-select'));
      if (!room) return;
      selectRoom(room.id, { source: 'acordeón' });
      LUMINA.toast(room.name + ' quedó cargada en tu resumen de reserva.', 'info', 'Sala seleccionada', { duration: 2400 });
    });

    $('#roomsAccordion').on('click', '[data-room-book]', function () {
      const room = getRoom(this.getAttribute('data-room-book'));
      if (!room) return;
      selectRoom(room.id, { source: 'acordeón', navigate: true, focusDate: true });
      LUMINA.toast('Completa la fecha y la hora para ' + room.name + '.', 'success', 'Sala lista para reservar', { duration: 2600 });
    });

    $('#roomBookButton').on('click', function () {
      const room = getRoom(state.selectedRoomId);
      if (!room) return;
      selectRoom(room.id, { source: 'escaparate', navigate: true, focusDate: true });
      LUMINA.toast('Completa la fecha y la hora para ' + room.name + '.', 'success', 'Sala lista para reservar', { duration: 2600 });
    });

    $('#featuredRoomsGrid').on('click', '[data-featured-room]', function () {
      openFeaturedRoom(this.getAttribute('data-featured-room'));
    }).on('keydown', '[data-featured-room]', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFeaturedRoom(this.getAttribute('data-featured-room'));
      }
    });
  }

  function openFeaturedRoom(roomId) {
    const room = getRoom(roomId);
    if (!room) return;
    selectRoom(room.id, { source: 'inicio', log: false });
    LUMINA.showSection('salas');
    LUMINA.log({
      type: 'jquery',
      action: 'ABRIR SALA',
      element: room.name,
      description: 'Se abrió la sección de salas desde la tarjeta destacada de ' + room.name + '.',
      result: 'EXITOSO',
      meta: { roomId: room.id, source: 'inicio' }
    });
  }

  /* ---------- Promociones ---------- */
  function renderPromotions() {
    const grid = document.getElementById('promoGrid');
    if (!grid) return;
    const filtered = state.promoFilter === 'all'
      ? PROMOTIONS
      : PROMOTIONS.filter((promo) => promo.type === state.promoFilter);

    grid.innerHTML = filtered.map((promo) => {
      const applied = normalizeCode(state.coupon) === promo.code;
      return (
        '<article class="promo-card' + (applied ? ' is-applied' : '') + '" data-promo-code="' + promo.code + '">' +
          '<div class="promo-media">' +
            '<img src="' + promo.image + '" data-fallback="assets/imagenes/promo-fallback.svg" alt="Promoción ' + LUMINA.escapeHtml(promo.title) + '" loading="lazy">' +
            '<span class="promo-discount"><strong>' + LUMINA.escapeHtml(promo.discountLabel) + '</strong><span>OFF</span></span>' +
            '<span class="promo-type-badge">' + LUMINA.escapeHtml(promo.typeLabel) + '</span>' +
          '</div>' +
          '<div class="promo-body">' +
            '<div class="promo-code-row">' +
              '<span class="promo-code"><i class="bi bi-ticket-perforated" aria-hidden="true"></i> ' + promo.code + '</span>' +
              '<span class="promo-validity">' + LUMINA.escapeHtml(promo.validity) + '</span>' +
            '</div>' +
            '<h3>' + LUMINA.escapeHtml(promo.title) + '</h3>' +
            '<p>' + LUMINA.escapeHtml(promo.description) + '</p>' +
            '<ul class="promo-conditions">' + promo.conditions.map((condition) =>
              '<li><i class="bi bi-check2" aria-hidden="true"></i> ' + LUMINA.escapeHtml(condition) + '</li>'
            ).join('') + '</ul>' +
            '<button class="btn ' + (applied ? 'btn-outline-gold' : 'btn-gold') + ' promo-apply" type="button" data-promotion-code="' + promo.code + '">' +
              '<i class="bi ' + (applied ? 'bi-check2-circle' : 'bi-ticket-perforated') + '" aria-hidden="true"></i> ' +
              (applied ? 'Cupón cargado' : 'Aplicar promoción') +
            '</button>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    syncPromotionCards();
  }

  function syncPromotionCards() {
    $('#promoGrid .promo-card').each(function () {
      const code = normalizeCode(this.getAttribute('data-promo-code'));
      const applied = code === normalizeCode(state.coupon);
      $(this).toggleClass('is-applied', applied);
      const button = this.querySelector('[data-promotion-code]');
      if (button) {
        button.className = 'btn ' + (applied ? 'btn-outline-gold' : 'btn-gold') + ' promo-apply';
        button.innerHTML = '<i class="bi ' + (applied ? 'bi-check2-circle' : 'bi-ticket-perforated') + '" aria-hidden="true"></i> ' +
          (applied ? 'Cupón cargado' : 'Aplicar promoción');
      }
    });
  }

  function bindPromotionEvents() {
    $('#promoFilters').on('click', '[data-promo-filter]', function () {
      state.promoFilter = this.getAttribute('data-promo-filter');
      $('#promoFilters [data-promo-filter]').removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');
      renderPromotions();
      LUMINA.log({
        type: 'filtros',
        action: 'FILTRAR PROMOCIONES',
        element: 'Promociones',
        description: 'Filtro de promociones aplicado: ' + this.textContent.trim() + '.',
        result: 'EXITOSO',
        meta: { filter: state.promoFilter }
      });
    });

    $('#promoGrid').on('click', '[data-promotion-code]', function () {
      applyPromotionCode(this.getAttribute('data-promotion-code'), { fromCard: true });
    });
  }

  function persistCoupon(code) {
    state.coupon = normalizeCode(code);
    if (state.coupon) {
      Storage.set(STORAGE_COUPON, state.coupon);
      Storage.set('promotions', {
        lastAppliedCode: state.coupon,
        appliedAt: new Date().toISOString(),
        mode: 'simulación local'
      });
    } else {
      Storage.remove(STORAGE_COUPON);
    }
  }

  function clearCoupon(options) {
    persistCoupon('');
    const input = document.getElementById('bookingPromo');
    if (input) input.value = '';
    updateSummary();
    syncPromotionCards();
    if (!options || !options.silent) {
      LUMINA.toast('El cupón se quitó de la reserva.', 'info', 'Cupón retirado', { duration: 2200 });
    }
  }

  function applyPromotionCode(code, options) {
    const opts = Object.assign({ fromCard: false, silent: false }, options || {});
    const promo = getPromotion(code);
    if (!promo) {
      LUMINA.toast('El cupón no existe o ya no está disponible.', 'error', 'Cupón inválido');
      LUMINA.log({
        type: 'errores',
        action: 'APLICAR CUPÓN',
        element: 'Promociones',
        description: 'Se intentó aplicar un cupón inexistente: ' + normalizeCode(code) + '.',
        result: 'FALLIDO',
        meta: { code: normalizeCode(code) }
      });
      return;
    }

    persistCoupon(promo.code);
    const input = document.getElementById('bookingPromo');
    if (input) input.value = promo.code;
    updateSummary();
    syncPromotionCards();

    const evaluation = evaluateCoupon(readDraft());
    if (!opts.silent) {
      if (evaluation.eligible) {
        LUMINA.toast('Cupón ' + promo.code + ' aplicado. El descuento ya se refleja en tu total.', 'success', 'Descuento activo', { duration: 4200 });
      } else {
        LUMINA.toast('Cupón ' + promo.code + ' cargado. ' + evaluation.reason, 'info', 'Revisa las condiciones', { duration: 5200 });
      }
    }

    LUMINA.log({
      type: 'promociones',
      action: 'APLICAR CUPÓN',
      element: promo.title,
      description: 'Cupón ' + promo.code + ' cargado para la reserva. ' + (evaluation.eligible ? 'Cumple las condiciones actuales.' : evaluation.reason),
      result: evaluation.eligible ? 'EXITOSO' : 'INFO',
      meta: { code: promo.code, discount: promo.discount, type: promo.type, fromCard: opts.fromCard }
    });

    if (opts.fromCard) {
      LUMINA.showSection('reservaciones');
      window.setTimeout(function () {
        document.getElementById('bookingDate')?.focus({ preventScroll: false });
      }, 360);
    }
  }

  /* ---------- Resumen y cálculo en vivo ---------- */
  function updateCapacityHint(room) {
    const hint = document.getElementById('capacityHint');
    const peopleInput = document.getElementById('bookingPeople');
    if (!hint) return;
    if (!room) {
      hint.textContent = 'Selecciona una sala para ver su capacidad.';
      if (peopleInput) {
        peopleInput.min = '1';
        peopleInput.max = '20';
      }
      return;
    }
    const range = room.minPeople > 1
      ? 'de ' + room.minPeople + ' a ' + room.capacity + ' personas'
      : 'hasta ' + room.capacity + ' personas';
    hint.textContent = room.name + ': ' + range + '.';
    if (peopleInput) {
      peopleInput.min = String(room.minPeople);
      peopleInput.max = String(room.capacity);
    }
  }

  function adjustHoursMax() {
    const timeInput = document.getElementById('bookingTime');
    const hoursInput = document.getElementById('bookingHours');
    if (!hoursInput) return;
    const start = timeToMinutes(timeInput?.value || '');
    if (start === null) {
      hoursInput.max = '6';
      return;
    }
    const maxHours = Math.max(1, Math.min(6, Math.floor((26 * 60 - start) / 60)));
    hoursInput.max = String(maxHours);
  }

  function updateSummary() {
    const draft = readDraft();
    const totals = calculateTotals(draft);
    const room = totals.room;
    const coupon = totals.coupon;

    setText('summaryRoomName', room ? room.name : 'Elige una sala');
    setText('summaryRoomMeta', room
      ? 'Hasta ' + room.capacity + ' personas · ' + LUMINA.formatBs(room.price) + ' por hora'
      : 'Los detalles aparecerán aquí');
    const roomIcon = document.querySelector('#summaryRoom .summary-room-icon');
    if (roomIcon && room) roomIcon.innerHTML = '<i class="bi ' + room.icon + '" aria-hidden="true"></i>';

    const summaryImage = document.getElementById('summaryRoomImage');
    if (summaryImage && room) {
      if (summaryImage.getAttribute('data-room-id') !== room.id) {
        summaryImage.setAttribute('data-room-id', room.id);
        delete summaryImage.dataset.fallbackApplied;
        summaryImage.classList.remove('is-fallback-image');
        summaryImage.src = room.image;
        summaryImage.alt = 'Sala ' + room.shortName + ' de Lúmina';
      }
      setText('summaryMediaTitle', room.shortName);
    }

    setText('summaryDate', draft.date ? LUMINA.formatDateLong(draft.date) : 'Sin seleccionar');
    setText('summaryTime', draft.time ? formatSchedule(draft.time, draft.hours) : 'Sin seleccionar');
    setText('summaryHours', formatHours(draft.hours));
    setText('summaryPeople', formatPeople(draft.people));
    setText('summaryRate', room ? LUMINA.formatBs(room.price) + ' /h' : '—');
    setText('summarySubtotal', LUMINA.formatBs(totals.subtotal));
    setText('summaryTotal', LUMINA.formatBs(totals.total));

    const discountLine = document.getElementById('discountLine');
    const promoName = document.getElementById('summaryPromoName');
    const promoNote = document.getElementById('summaryPromoNote');
    const promoNoteText = document.getElementById('summaryPromoNoteText');
    const hasDiscount = totals.discount > 0;

    if (discountLine) discountLine.hidden = !hasDiscount;
    setText('summaryDiscount', '− ' + LUMINA.formatBs(totals.discount));
    if (promoName) promoName.textContent = hasDiscount && coupon.promo ? ' · ' + coupon.promo.code : '';

    if (promoNote && promoNoteText) {
      if (!coupon.code) {
        promoNote.hidden = true;
        promoNote.classList.remove('is-warning');
      } else if (coupon.invalid) {
        promoNote.hidden = false;
        promoNote.classList.add('is-warning');
        promoNoteText.textContent = coupon.reason;
      } else if (coupon.eligible && hasDiscount) {
        promoNote.hidden = false;
        promoNote.classList.remove('is-warning');
        promoNoteText.textContent = 'Cupón ' + coupon.code + ' aplicado: ' + coupon.promo.discount + '% de descuento (−' + LUMINA.formatBs(totals.discount) + ').';
      } else {
        promoNote.hidden = false;
        promoNote.classList.add('is-warning');
        promoNoteText.textContent = 'Cupón ' + coupon.code + ' no aplicado: ' + coupon.reason;
      }
    }

    updatePromoStatus(draft, coupon, totals);
  }

  function updatePromoStatus(draft, coupon, totals) {
    const status = document.getElementById('promoStatus');
    const input = document.getElementById('bookingPromo');
    if (!status) return;
    status.className = 'field-hint';
    const typed = normalizeCode(input?.value || draft.promo);
    const applied = normalizeCode(state.coupon);

    if (!typed && !applied) {
      status.textContent = 'Puedes elegir una promoción desde la sección Promociones.';
      return;
    }
    if (typed && typed !== applied) {
      status.classList.add('is-warning');
      status.textContent = 'Pulsa “Aplicar” para validar el cupón ' + typed + '.';
      return;
    }
    if (coupon.invalid) {
      status.classList.add('is-error');
      status.textContent = coupon.reason;
      return;
    }
    if (coupon.eligible && totals.discount > 0) {
      status.classList.add('is-success');
      status.textContent = 'Cupón ' + coupon.code + ' aplicado: ' + coupon.promo.discount + '% de descuento (−' + LUMINA.formatBs(totals.discount) + ').';
      return;
    }
    if (coupon.code) {
      status.classList.add('is-warning');
      status.textContent = 'Cupón ' + coupon.code + ' cargado. ' + coupon.reason;
    }
  }

  /* ---------- Validación ---------- */
  function getErrors(draft) {
    const room = getRoom(draft.roomId);
    const errors = {};
    const terms = document.getElementById('bookingTerms');

    errors.name = Validation.name(draft.name);
    errors.phone = Validation.phone(draft.phone, true);
    errors.email = Validation.email(draft.email);
    errors.room = draft.roomId ? (room ? '' : 'Selecciona una sala válida.') : 'Selecciona una sala para tu reserva.';
    errors.date = Validation.date(draft.date, true);
    errors.time = Validation.time(draft.time);
    errors.hours = Validation.hours(draft.hours);
    errors.people = Validation.people(draft.people, room ? room.capacity : 0);
    errors.notes = String(draft.notes || '').length > 240 ? 'Las observaciones no pueden superar los 240 caracteres.' : '';
    errors.terms = terms && terms.checked ? '' : 'Debes aceptar los términos de reserva para continuar.';

    if (room && Number(draft.people) < room.minPeople) {
      errors.people = room.name + ' requiere al menos ' + room.minPeople + ' personas.';
    }

    const couponText = normalizeCode(draft.promo);
    if (couponText && !getPromotion(couponText)) {
      errors.promo = 'El cupón “' + couponText + '” no existe. Revisa el código o retíralo.';
    } else {
      errors.promo = '';
    }

    if (!errors.date && !errors.time && !errors.hours) {
      const start = buildStartDate(draft);
      if (start && start.getTime() <= Date.now()) {
        errors.time = 'La hora de inicio ya pasó. Elige un horario posterior.';
      }
      const startMinutes = timeToMinutes(draft.time);
      if (startMinutes !== null && startMinutes + (Number(draft.hours) || 0) * 60 > 26 * 60) {
        errors.hours = 'La reserva debe terminar antes de las 02:00. Elige menos horas o una hora de inicio más temprana.';
      }
    }

    return errors;
  }

  function getInputByKey(key) {
    const id = Object.keys(FIELD_KEYS).find((fieldId) => FIELD_KEYS[fieldId] === key);
    return id ? document.getElementById(id) : null;
  }

  function showAllErrors(errors) {
    Object.keys(FIELD_KEYS).forEach(function (id) {
      const input = document.getElementById(id);
      const key = FIELD_KEYS[id];
      if (!input) return;
      if (errors[key]) {
        Validation.showError(input, errors[key]);
      } else {
        Validation.clearError(input);
      }
    });
  }

  function refreshExistingErrors(errors) {
    Object.keys(FIELD_KEYS).forEach(function (id) {
      const input = document.getElementById(id);
      const key = FIELD_KEYS[id];
      if (!input || input.getAttribute('aria-invalid') !== 'true') return;
      if (errors[key]) {
        Validation.showError(input, errors[key]);
      } else {
        Validation.clearError(input);
      }
    });
  }

  function showFieldError(key) {
    const input = getInputByKey(key);
    if (!input) return;
    const errors = getErrors(readDraft());
    if (errors[key]) {
      Validation.showError(input, errors[key]);
    } else {
      Validation.clearError(input);
    }
  }

  function validateBooking(showErrors) {
    const draft = readDraft();
    const errors = getErrors(draft);
    const invalid = Object.keys(errors).filter((key) => Boolean(errors[key]));
    if (showErrors) {
      showAllErrors(errors);
    } else {
      refreshExistingErrors(errors);
    }
    return { draft, errors, invalid };
  }

  /* ---------- Formulario ---------- */
  function restoreSubmitButton(button) {
    if (!button) return;
    button.disabled = false;
    button.classList.remove('is-loading');
    $(button).find('.button-label').html('<i class="bi bi-ticket-perforated" aria-hidden="true"></i> Reservar ahora');
  }

  function setSubmitLoading(button) {
    if (!button) return;
    button.disabled = true;
    button.classList.add('is-loading');
    $(button).find('.button-label').html('<i class="bi bi-hourglass-split" aria-hidden="true"></i> Preparando tu reserva…');
  }

  function bindBookingEvents() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    $('#bookingForm').on('focusin', 'input, select, textarea', function () {
      if (state.started) return;
      state.started = true;
      LUMINA.log({
        type: 'formularios',
        action: 'INICIAR RESERVA',
        element: 'Formulario de reserva',
        description: 'El usuario comenzó a completar el formulario de reserva.',
        result: 'INFO',
        meta: { form: 'reservaciones' }
      });
    });

    $('#bookingForm').on('input change', 'input, select, textarea', function () {
      if (this.id === 'bookingPromo' && normalizeCode(this.value) !== normalizeCode(state.coupon)) {
        persistCoupon('');
        syncPromotionCards();
      }
      if (this.id === 'bookingTime') adjustHoursMax();
      updateSummary();
      refreshExistingErrors(getErrors(readDraft()));
    });

    $('#bookingForm').on('focusout', 'input, select, textarea', function () {
      const key = FIELD_KEYS[this.id];
      if (key && this.id !== 'bookingPromo') showFieldError(key);
      if (this.id === 'bookingPromo' && normalizeCode(this.value) && !getPromotion(this.value)) {
        showFieldError('promo');
      }
    });

    $('#bookingRoom').on('change', function () {
      selectRoom(this.value, { source: 'formulario' });
    });

    $('#applyCouponButton').on('click', function () {
      const input = document.getElementById('bookingPromo');
      const code = normalizeCode(input?.value || '');
      if (!code) {
        if (input) Validation.showError(input, 'Escribe un código de cupón o elige una promoción.');
        LUMINA.toast('Escribe un código de cupón para aplicarlo.', 'warning', 'Cupón vacío', { duration: 2600 });
        input?.focus();
        return;
      }
      applyPromotionCode(code, { fromCard: false });
    });

    $('#bookingForm').on('submit', handleBookingSubmit);
  }

  function handleBookingSubmit(event) {
    event.preventDefault();
    if (state.submitting) return;

    const result = validateBooking(true);
    if (result.invalid.length) {
      Validation.focusFirstError(document.getElementById('bookingForm'));
      LUMINA.toast('Revisa los campos señalados antes de reservar.', 'error', 'Hay datos por corregir');
      LUMINA.log({
        type: 'errores',
        action: 'VALIDAR RESERVA',
        element: 'Formulario de reserva',
        description: 'Reserva rechazada: ' + result.invalid.length + ' campo(s) con errores de validación.',
        result: 'FALLIDO',
        meta: { invalidFields: result.invalid.map((key) => FIELD_LABELS[key] || key).join(', ') }
      });
      return;
    }

    const storedPending = pendingReservations().find(function (item) {
      return Number(item.expiresAt) <= Date.now();
    });
    if (storedPending) expireRecord(storedPending, { silent: true, source: 'nueva reserva' });

    const draft = result.draft;
    const conflict = findConflict(draft);
    if (conflict) {
      const message = 'La ' + conflict.roomName + ' ya está reservada el ' + LUMINA.formatDateShort(conflict.date) + ' de ' + formatSchedule(conflict.time, conflict.hours) + '. Elige otro horario o sala.';
      const timeInput = document.getElementById('bookingTime');
      if (timeInput) Validation.showError(timeInput, message);
      LUMINA.toast(message, 'error', 'Horario no disponible', { duration: 5600 });
      LUMINA.log({
        type: 'errores',
        action: 'RECHAZAR DUPLICADO',
        element: conflict.roomName,
        description: message,
        result: 'FALLIDO',
        meta: { roomId: conflict.roomId, date: conflict.date, time: conflict.time, existingCode: conflict.code }
      });
      return;
    }

    const totals = calculateTotals(draft);
    if (!totals.room) {
      LUMINA.toast('Selecciona una sala válida para continuar.', 'error', 'Sala requerida');
      return;
    }

    const record = buildReservation(draft, totals);
    const next = [record].concat(reservations);
    if (!Storage.set(STORAGE_RESERVATIONS, next)) {
      LUMINA.toast('No se pudo guardar la reserva en este navegador.', 'error', 'Almacenamiento no disponible');
      return;
    }
    reservations = next;

    state.pending = record;
    state.submitting = true;
    const button = document.getElementById('bookingSubmit');
    setSubmitLoading(button);
    renderReservations();
    refreshDataViews();
    startCountdown();

    LUMINA.log({
      type: 'formularios',
      action: 'PREPARAR RESERVA',
      element: 'Formulario de reserva',
      description: 'Datos validados. Se creó la reserva pendiente ' + record.code + ' con un bloqueo de 60 segundos.',
      result: 'INFO',
      meta: { code: record.code, roomId: record.roomId, date: record.date, time: record.time, total: record.total }
    });

    window.setTimeout(function () {
      state.submitting = false;
      restoreSubmitButton(button);
      fillPendingModal(record);
      openPendingModal();
      LUMINA.toast('Tienes 60 segundos para confirmar. También puedes reservar otra sala mientras esta sigue pendiente.', 'info', 'Reserva pendiente', { duration: 5200 });
      LUMINA.log({
        type: 'reservas',
        action: 'CREAR PENDIENTE',
        element: record.roomName,
        description: 'Reserva ' + record.code + ' creada en estado Pendiente para el ' + LUMINA.formatDateShort(record.date) + ' a las ' + record.time + '.',
        result: 'EXITOSO',
        meta: { code: record.code, roomId: record.roomId, total: record.total, holdSeconds: 60 }
      });
    }, 700);
  }

  /* ---------- Reserva pendiente y temporizador ---------- */
  function fillPendingModal(record) {
    const room = getRoom(record.roomId);
    setText('pendingRoomName', record.roomName || 'Sala');
    setText('pendingRoomMeta', (room ? 'Hasta ' + room.capacity + ' personas · ' : '') + LUMINA.formatBs(record.rate || (room ? room.price : 0)) + '/h');
    setText('pendingTotal', LUMINA.formatBs(record.total));
    setText('pendingDate', LUMINA.formatDateLong(record.date));
    setText('pendingTime', formatSchedule(record.time, record.hours));
    setText('pendingHours', formatHours(record.hours));
    setText('pendingPeople', formatPeople(record.people));
    setText('pendingSubtotal', LUMINA.formatBs(record.subtotal));
    setText('pendingDiscount', '− ' + LUMINA.formatBs(record.discount));
    setText('pendingTotalLine', LUMINA.formatBs(record.total));
    setText('countdownDeadline', LUMINA.formatTimeWithSeconds(record.expiresAt));

    const icon = document.getElementById('pendingRoomIcon');
    if (icon) icon.innerHTML = '<i class="bi ' + (record.roomIcon || 'bi-door-open') + '" aria-hidden="true"></i>';

    const discountRow = document.getElementById('pendingDiscountRow');
    if (discountRow) discountRow.hidden = !(Number(record.discount) > 0);

    const promo = document.getElementById('pendingPromo');
    const promoText = document.getElementById('pendingPromoText');
    if (promo && promoText) {
      if (record.coupon && Number(record.discount) > 0) {
        promo.hidden = false;
        promoText.textContent = 'Cupón ' + record.coupon + ' · ' + (record.couponPercent || '') + '% de descuento aplicado.';
      } else if (record.coupon) {
        promo.hidden = false;
        promoText.textContent = 'Cupón ' + record.coupon + ' no aplicado: ' + (record.couponNote || 'no cumple las condiciones.');
      } else {
        promo.hidden = true;
        promoText.textContent = '';
      }
    }
  }

  function resetPendingModal() {
    setText('reservationModalTitle', DEFAULT_PENDING_TITLE);
    setText('countdownDisplay', '01:00');
    setText('countdownDeadline', '--:--:--');
    setText('countdownAria', 'Tienes 1 minuto para confirmar tu reserva.');
    const box = document.getElementById('countdownBox');
    if (box) box.classList.remove('is-urgent', 'is-warning', 'is-expired');
    const bar = document.getElementById('countdownBar');
    if (bar) bar.style.width = '100%';
    const suffix = document.querySelector('.countdown-suffix');
    if (suffix) suffix.textContent = 'PARA CONFIRMAR TU RESERVA';
    const confirmButton = document.getElementById('confirmPendingButton');
    if (confirmButton) {
      confirmButton.disabled = false;
      confirmButton.classList.remove('is-loading');
      $(confirmButton).find('.button-label').html(DEFAULT_CONFIRM_LABEL);
    }
    const cancelButton = document.getElementById('cancelPendingButton');
    if (cancelButton) {
      cancelButton.disabled = false;
      cancelButton.textContent = 'Cancelar reserva';
    }
    $('.hold-note').html(DEFAULT_HOLD_NOTE);
    state.lastAnnouncedSecond = null;
  }

  function openPendingModal() {
    resetPendingModal();
    if (state.pending) fillPendingModal(state.pending);
    LUMINA.Modal.open('reservationModal', {
      focus: '#confirmPendingButton',
      onClose: function () {
        state.pending = null;
        updateCardCountdowns();
      }
    });
    startCountdown();
    updateCardCountdowns();
  }

  function renderCountdown(remaining) {
    const record = state.pending;
    if (!record) return;
    const total = Number(record.holdMs) || HOLD_MS;
    const safe = Math.max(0, Number(remaining) || 0);
    const seconds = Math.ceil(safe / 1000);
    setText('countdownDisplay', pad(Math.floor(seconds / 60)) + ':' + pad(seconds % 60));
    const bar = document.getElementById('countdownBar');
    if (bar) bar.style.width = Math.max(0, Math.min(100, (safe / total) * 100)).toFixed(1) + '%';
    const box = document.getElementById('countdownBox');
    if (box) {
      box.classList.toggle('is-urgent', seconds <= 10);
      box.classList.toggle('is-warning', seconds > 10 && seconds <= 30);
    }
    updateCardCountdowns();

    if (seconds !== state.lastAnnouncedSecond && (seconds <= 5 || seconds === 10 || seconds === 30)) {
      state.lastAnnouncedSecond = seconds;
      setText('countdownAria', seconds > 0
        ? 'Quedan ' + seconds + ' segundos para confirmar tu reserva.'
        : 'El tiempo para confirmar la reserva terminó.');
    }
  }

  function startCountdown() {
    stopCountdown();
    tickPending();
    if (pendingReservations().length) {
      state.timerId = window.setInterval(tickPending, 1000);
    }
  }

  function tickPending() {
    const now = Date.now();
    pendingReservations().slice().forEach(function (record) {
      if (Number(record.expiresAt) <= now) {
        expireRecord(record, {
          silent: false,
          source: 'temporizador'
        });
      }
    });

    if (state.pending) {
      const fresh = reservations.find(function (item) {
        return item.id === state.pending.id && item.status === 'Pendiente';
      });
      if (fresh && Number(fresh.expiresAt) > Date.now()) {
        state.pending = fresh;
        if (LUMINA.Modal.isOpen('reservationModal')) {
          renderCountdown(Number(fresh.expiresAt) - Date.now());
        }
      }
    }

    updateCardCountdowns();

    if (!pendingReservations().length) stopCountdown();
  }

  function stopCountdown() {
    if (state.timerId !== null) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function markExpiredModal() {
    setText('reservationModalTitle', 'El tiempo para confirmar terminó.');
    setText('countdownDisplay', '00:00');
    setText('countdownAria', 'El tiempo para confirmar la reserva terminó. La sala fue liberada.');
    setText('pendingPromoText', '');
    const box = document.getElementById('countdownBox');
    if (box) box.classList.add('is-urgent', 'is-expired');
    const bar = document.getElementById('countdownBar');
    if (bar) bar.style.width = '0%';
    const suffix = document.querySelector('.countdown-suffix');
    if (suffix) suffix.textContent = 'TIEMPO AGOTADO';
    const confirmButton = document.getElementById('confirmPendingButton');
    if (confirmButton) {
      confirmButton.disabled = true;
      confirmButton.classList.remove('is-loading');
      $(confirmButton).find('.button-label').html('<i class="bi bi-hourglass-bottom" aria-hidden="true"></i> Tiempo agotado');
    }
    const cancelButton = document.getElementById('cancelPendingButton');
    if (cancelButton) {
      cancelButton.disabled = false;
      cancelButton.textContent = 'Cerrar';
    }
    $('.hold-note').html('<i class="bi bi-unlock" aria-hidden="true"></i> El bloqueo se liberó automáticamente. La reserva quedó registrada como expirada.');
  }

  function expireRecord(record, options) {
    const opts = Object.assign({ silent: false, close: false, source: 'temporizador' }, options || {});
    if (!record || record.status !== 'Pendiente') {
      if (state.pending && state.pending.id === record?.id) state.pending = null;
      if (opts.close) LUMINA.Modal.close('reservationModal');
      return;
    }

    const updated = updateReservation(record.id, {
      status: 'Expirada',
      expiredAt: new Date().toISOString()
    });
    if (!updated) return;

    const wasOpen = Boolean(state.pending && state.pending.id === record.id);
    if (wasOpen) {
      state.pending = null;
      if (LUMINA.Modal.isOpen('reservationModal')) {
        if (opts.close) LUMINA.Modal.close('reservationModal');
        else {
          markExpiredModal();
          window.setTimeout(function () {
            if (LUMINA.Modal.isOpen('reservationModal') && !state.pending) LUMINA.Modal.close('reservationModal');
          }, 1200);
        }
      }
    }

    renderReservations();
    refreshShowcaseAvailability();
    updateCardCountdowns();
    if (!pendingReservations().length) stopCountdown();

    LUMINA.log({
      type: 'temporizador',
      action: 'EXPIRAR RESERVA',
      element: record.roomName || 'Reserva',
      description: 'Reserva ' + record.code + ' expirada al llegar el contador a 00:00. La sala quedó liberada.',
      result: 'EXPIRADO',
      meta: { code: record.code, roomId: record.roomId, date: record.date, time: record.time, source: opts.source }
    });

    if (!opts.silent) {
      LUMINA.toast('El tiempo para confirmar terminó. La sala se liberó y puedes intentarlo de nuevo.', 'error', 'Reserva expirada', { duration: 5400 });
    }
  }

  function confirmPending() {
    const record = state.pending;
    if (!record || state.confirming) return;

    if (Date.now() >= Number(record.expiresAt)) {
      expireRecord(record, { silent: false, source: 'confirmar fuera de tiempo' });
      return;
    }

    const button = document.getElementById('confirmPendingButton');
    state.confirming = true;
    if (button) {
      button.disabled = true;
      button.classList.add('is-loading');
      $(button).find('.button-label').html('<i class="bi bi-hourglass-split" aria-hidden="true"></i> Confirmando…');
    }

    window.setTimeout(function () {
      const latest = reservations.find(function (item) { return item.id === record.id; });
      if (!latest || latest.status !== 'Pendiente' || Date.now() >= Number(latest.expiresAt)) {
        state.confirming = false;
        if (latest && latest.status === 'Pendiente') expireRecord(latest, { silent: false, source: 'confirmación fuera de plazo' });
        return;
      }
      const updated = updateReservation(record.id, {
        status: 'Confirmada',
        confirmedAt: new Date().toISOString(),
        expiresAt: null
      });

      if (!updated) {
        state.confirming = false;
        if (button) {
          button.disabled = false;
          button.classList.remove('is-loading');
          $(button).find('.button-label').html(DEFAULT_CONFIRM_LABEL);
        }
        LUMINA.toast('No se pudo confirmar la reserva en este navegador.', 'error', 'Almacenamiento no disponible');
        return;
      }

      state.pending = null;
      state.confirming = false;
      updateCardCountdowns();
      LUMINA.Modal.close('reservationModal');
      resetBookingForm();
      renderReservations();
      refreshDataViews();
      if (!pendingReservations().length) stopCountdown();

      LUMINA.log({
        type: 'reservas',
        action: 'CONFIRMAR RESERVA',
        element: updated.roomName,
        description: 'Reserva ' + updated.code + ' confirmada para el ' + LUMINA.formatDateShort(updated.date) + ' a las ' + updated.time + '.',
        result: 'EXITOSO',
        meta: { code: updated.code, roomId: updated.roomId, total: updated.total, status: updated.status }
      });
      LUMINA.toast('Reserva ' + updated.code + ' confirmada. Te esperamos en ' + updated.roomName + '.', 'success', '¡Todo listo para cantar!', { duration: 5600 });
    }, 650);
  }

  function cancelPending(options) {
    const opts = Object.assign({ source: 'botón cancelar', silent: false }, options || {});
    const record = state.pending;

    if (state.confirming) return;

    if (record && Date.now() >= Number(record.expiresAt)) {
      expireRecord(record, { silent: opts.silent, close: true, source: 'cancelar después del tiempo' });
      return;
    }

    if (record) {
      const updated = updateReservation(record.id, {
        status: 'Cancelada',
        cancelledAt: new Date().toISOString()
      });
      if (!updated) {
        LUMINA.toast('No se pudo cancelar la reserva en este navegador.', 'error', 'Almacenamiento no disponible');
        return;
      }
      state.pending = null;
      updateCardCountdowns();
      renderReservations();
      refreshShowcaseAvailability();

      LUMINA.log({
        type: 'reservas',
        action: 'CANCELAR PENDIENTE',
        element: record.roomName || 'Reserva',
        description: 'El usuario canceló la reserva pendiente ' + record.code + '. El bloqueo de la sala se liberó.',
        result: 'CANCELADO',
        meta: { code: record.code, roomId: record.roomId, source: opts.source }
      });
      if (!opts.silent) {
        LUMINA.toast('La reserva pendiente fue cancelada y la sala quedó libre.', 'warning', 'Reserva cancelada', { duration: 3800 });
      }
    }
    LUMINA.Modal.close('reservationModal');
    if (!pendingReservations().length) stopCountdown();
  }

  function restorePending() {
    Storage.remove(STORAGE_PENDING);

    const allPending = pendingReservations();
    if (!allPending.length) {
      updateCardCountdowns();
      return;
    }

    const now = Date.now();
    allPending.forEach(function (record) {
      if (Number(record.expiresAt) <= now) {
        expireRecord(record, { silent: true, source: 'recarga con reserva expirada' });
      }
    });

    const active = activePendingReservations();
    if (!active.length) {
      updateCardCountdowns();
      return;
    }

    const record = active.slice().sort(function (a, b) {
      return Number(a.expiresAt) - Number(b.expiresAt);
    })[0];

    state.pending = record;
    fillPendingModal(record);
    openPendingModal();
    const remaining = remainingSeconds(record);
    LUMINA.log({
      type: 'temporizador',
      action: 'RESTAURAR CONTADOR',
      element: record.roomName || 'Reserva',
      description: 'Se recuperaron ' + active.length + ' reserva(s) pendiente(s) tras recargar la página. La primera vence en ' + remaining + ' segundos.',
      result: 'INFO',
      meta: { code: record.code, remainingSeconds: remaining, pendingCount: active.length }
    });
    LUMINA.toast(
      active.length > 1
        ? 'Recuperamos ' + active.length + ' reservas pendientes. Esta vence primero: quedan ' + remaining + ' segundos.'
        : 'Recuperamos tu reserva pendiente. Quedan ' + remaining + ' segundos para confirmar.',
      'warning',
      'Contador restaurado',
      { duration: 5200 }
    );
  }

  function resetBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    form.reset();
    Validation.clearFormErrors(form);
    const hours = document.getElementById('bookingHours');
    const people = document.getElementById('bookingPeople');
    const roomSelect = document.getElementById('bookingRoom');
    const notesCounter = document.getElementById('notesCounter');
    if (hours) hours.value = '2';
    if (people) people.value = '2';
    if (roomSelect) roomSelect.value = state.selectedRoomId;
    if (notesCounter) notesCounter.textContent = '0';
    state.coupon = '';
    Storage.remove(STORAGE_COUPON);
    const promoInput = document.getElementById('bookingPromo');
    if (promoInput) promoInput.value = '';
    state.started = false;
    adjustHoursMax();
    updateSummary();
    syncPromotionCards();
  }

  /* ---------- Mis reservas ---------- */
  function reservationCardHtml(record) {
    const meta = STATUS_META[record.status] || STATUS_META.Expirada;
    const statusClass = 'status-' + String(record.status || 'expirada').toLowerCase();
    const pendingActive = record.status === 'Pendiente' && Number(record.expiresAt) > Date.now();
    const remaining = pendingActive ? remainingSeconds(record) : 0;
    const countdownMarkup = pendingActive
      ? '<span class="reservation-countdown' + (remaining <= 10 ? ' is-urgent' : '') + '" data-reservation-countdown data-expires-at="' + Number(record.expiresAt) + '">' +
          '<i class="bi bi-hourglass-split" aria-hidden="true"></i> Confirma en ' +
          '<span class="reservation-countdown-value">' + formatRemaining(remaining) + '</span>' +
        '</span>'
      : '';
    const actions = [];

    actions.push('<button class="btn btn-quiet" type="button" data-reservation-action="detail" data-reservation-id="' + LUMINA.escapeHtml(record.id) + '"><i class="bi bi-eye" aria-hidden="true"></i> Detalle</button>');
    if (record.status === 'Confirmada') {
      actions.push('<button class="btn btn-danger-quiet" type="button" data-reservation-action="cancel" data-reservation-id="' + LUMINA.escapeHtml(record.id) + '"><i class="bi bi-x-circle" aria-hidden="true"></i> Cancelar</button>');
    } else if (pendingActive) {
      actions.push('<button class="btn btn-gold" type="button" data-reservation-action="continue" data-reservation-id="' + LUMINA.escapeHtml(record.id) + '"><i class="bi bi-play-circle" aria-hidden="true"></i> Continuar</button>');
    } else if (['Cancelada', 'Expirada'].includes(record.status)) {
      actions.push('<button class="btn btn-quiet icon-only" type="button" data-reservation-action="delete" data-reservation-id="' + LUMINA.escapeHtml(record.id) + '" aria-label="Eliminar registro de reserva ' + LUMINA.escapeHtml(record.code) + '" title="Eliminar registro"><i class="bi bi-trash3" aria-hidden="true"></i></button>');
    }

    return (
      '<article class="reservation-card" data-reservation-id="' + LUMINA.escapeHtml(record.id) + '" style="--status-color: ' + meta.color + ';">' +
        '<div class="reservation-code-block">' +
          '<small>Código</small>' +
          '<span class="reservation-code">' + LUMINA.escapeHtml(record.code) + '</span>' +
          '<span class="reservation-status ' + statusClass + '"><i class="bi ' + meta.icon + '" aria-hidden="true"></i> ' + LUMINA.escapeHtml(record.status) + '</span>' +
        '</div>' +
        '<div class="reservation-main">' +
          '<div class="reservation-title-row">' +
            '<h3>' + LUMINA.escapeHtml(record.roomName) + '</h3>' +
            '<span>Creada el ' + LUMINA.formatDateNumeric(record.createdAt) + '</span>' +
          '</div>' +
          '<div class="reservation-details-inline">' +
            '<span><i class="bi bi-calendar3" aria-hidden="true"></i>' + LUMINA.formatDateLong(record.date) + '</span>' +
            '<span><i class="bi bi-clock" aria-hidden="true"></i>' + formatSchedule(record.time, record.hours) + '</span>' +
            '<span><i class="bi bi-hourglass-split" aria-hidden="true"></i>' + formatHours(record.hours) + '</span>' +
            '<span><i class="bi bi-people" aria-hidden="true"></i>' + formatPeople(record.people) + '</span>' +
            countdownMarkup +
          '</div>' +
        '</div>' +
        '<div class="reservation-side">' +
          '<div class="reservation-total"><span>Total</span><strong>' + LUMINA.formatBs(record.total) + '</strong></div>' +
          '<div class="reservation-actions">' + actions.join('') + '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function updateStatusCounts() {
    const total = reservations.length;
    const allCount = document.getElementById('allCount');
    if (allCount) allCount.textContent = String(total);

    document.querySelectorAll('#reservationStatusFilters [data-status-filter]').forEach(function (button) {
      const status = button.getAttribute('data-status-filter');
      const active = state.statusFilter === status;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
      if (status === 'all') return;
      let count = button.querySelector('.status-filter-count');
      if (!count) {
        count = document.createElement('span');
        count.className = 'status-filter-count';
        button.appendChild(count);
      }
      count.textContent = String(reservations.filter((item) => item.status === status).length);
    });
  }

  function renderReservations() {
    const list = document.getElementById('reservationsList');
    const empty = document.getElementById('reservationsEmpty');
    if (!list) return;

    const sorted = reservations.slice().sort(function (a, b) {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    const filtered = state.statusFilter === 'all'
      ? sorted
      : sorted.filter((item) => item.status === state.statusFilter);

    list.innerHTML = filtered.map(reservationCardHtml).join('');
    if (empty) {
      empty.hidden = filtered.length > 0;
      const heading = empty.querySelector('h3');
      const paragraph = empty.querySelector('p');
      if (!reservations.length) {
        if (heading) heading.textContent = 'Aún no tienes reservas.';
        if (paragraph) paragraph.textContent = 'Tu primera noche en Lúmina está a un clic. Elige una sala y deja que el escenario haga el resto.';
      } else {
        if (heading) heading.textContent = 'No hay reservas en este estado.';
        if (paragraph) paragraph.textContent = 'Prueba con otro filtro o crea una nueva reserva para seguir cantando.';
      }
    }
    updateStatusCounts();
    updateCardCountdowns();
  }

  function openReservationDetail(id) {
    const record = reservations.find((item) => item.id === id);
    if (!record) return;
    state.detailId = id;

    setText('detailCode', record.code);
    setText('reservationDetailTitle', record.roomName + ' · ' + record.status);

    const rows = [
      ['Estado', record.status],
      ['Fecha', LUMINA.formatDateLong(record.date)],
      ['Horario', formatSchedule(record.time, record.hours)],
      ['Duración', formatHours(record.hours)],
      ['Personas', formatPeople(record.people)],
      ['Titular', record.name],
      ['Teléfono', record.phone],
      ['Correo', record.email],
      ['Cupón', record.coupon ? record.coupon + (record.discount > 0 ? ' · ' + record.couponPercent + '% aplicado' : ' · no aplicado') : 'Sin cupón'],
      ['Creada', LUMINA.formatDateNumeric(record.createdAt) + ' · ' + LUMINA.formatTimeWithSeconds(record.createdAt)]
    ];
    if (record.notes) rows.push(['Observaciones', record.notes]);

    const grid = document.getElementById('detailGrid');
    if (grid) {
      grid.innerHTML = rows.map(function (row) {
        return '<div><dt>' + LUMINA.escapeHtml(row[0]) + '</dt><dd>' + LUMINA.escapeHtml(row[1]) + '</dd></div>';
      }).join('');
    }

    const total = document.getElementById('detailTotal');
    if (total) {
      total.innerHTML = '<span>Total de la reserva</span><div style="text-align:right"><strong>' + LUMINA.formatBs(record.total) + '</strong><br><span>Subtotal ' + LUMINA.formatBs(record.subtotal) + (record.discount ? ' · Descuento −' + LUMINA.formatBs(record.discount) : '') + '</span></div>';
    }

    const actions = document.getElementById('detailActions');
    if (actions) {
      const buttons = [];
      if (record.status === 'Pendiente' && Number(record.expiresAt) > Date.now()) {
        buttons.push('<button class="btn btn-gold" type="button" data-detail-action="continue" data-reservation-id="' + LUMINA.escapeHtml(record.id) + '"><i class="bi bi-play-circle" aria-hidden="true"></i> Reanudar confirmación</button>');
      }
      if (['Confirmada', 'Pendiente'].includes(record.status)) {
        buttons.push('<button class="btn btn-danger-quiet" type="button" data-detail-action="cancel" data-reservation-id="' + LUMINA.escapeHtml(record.id) + '"><i class="bi bi-x-circle" aria-hidden="true"></i> Cancelar reserva</button>');
      } else {
        buttons.push('<button class="btn btn-danger-quiet" type="button" data-detail-action="delete" data-reservation-id="' + LUMINA.escapeHtml(record.id) + '"><i class="bi bi-trash3" aria-hidden="true"></i> Eliminar registro</button>');
      }
      buttons.push('<button class="btn btn-quiet" type="button" data-close-modal="reservationDetailModal">Cerrar</button>');
      actions.innerHTML = buttons.join('');
    }

    LUMINA.Modal.open('reservationDetailModal', { focus: '.modal-close' });
    LUMINA.log({
      type: 'reservas',
      action: 'ABRIR DETALLE',
      element: record.roomName,
      description: 'Se abrió el detalle de la reserva ' + record.code + ' en estado ' + record.status + '.',
      result: 'EXITOSO',
      meta: { code: record.code, status: record.status }
    });
  }

  function requestCancelReservation(record) {
    if (!record) return;
    LUMINA.confirm({
      title: '¿Cancelar esta reserva?',
      message: 'La reserva ' + record.code + ' de ' + record.roomName + ' para el ' + LUMINA.formatDateShort(record.date) + ' quedará marcada como cancelada. Esta acción es una simulación local.',
      acceptLabel: 'Sí, cancelar',
      tone: 'danger',
      onAccept: function () {
        performCancelReservation(record);
      }
    });
  }

  function performCancelReservation(record) {
    const previousStatus = record.status;
    const updated = updateReservation(record.id, {
      status: 'Cancelada',
      cancelledAt: new Date().toISOString()
    });

    if (!updated) {
      LUMINA.toast('No se pudo cancelar la reserva en este navegador.', 'error', 'Almacenamiento no disponible');
      return;
    }

    if (state.pending && state.pending.id === record.id) {
      state.pending = null;
      if (LUMINA.Modal.isOpen('reservationModal')) LUMINA.Modal.close('reservationModal');
    }
    renderReservations();
    refreshShowcaseAvailability();
    updateCardCountdowns();
    if (!pendingReservations().length) stopCountdown();
    if (LUMINA.Modal.isOpen('reservationDetailModal')) LUMINA.Modal.close('reservationDetailModal');

    LUMINA.log({
      type: 'reservas',
      action: 'CANCELAR RESERVA',
      element: record.roomName,
      description: 'Reserva ' + record.code + ' cancelada desde Mis reservas. Estado anterior: ' + previousStatus + '.',
      result: 'CANCELADO',
      meta: { code: record.code, roomId: record.roomId, date: record.date, time: record.time }
    });
    LUMINA.toast('La reserva ' + record.code + ' fue cancelada. La sala quedó disponible.', 'warning', 'Reserva cancelada', { duration: 4200 });
  }

  function requestDeleteReservation(record) {
    if (!record) return;
    LUMINA.confirm({
      title: '¿Eliminar el registro?',
      message: 'Se quitará de este navegador el registro ' + record.code + '. No afecta a ninguna reserva real porque toda la experiencia es una simulación.',
      acceptLabel: 'Sí, eliminar',
      tone: 'danger',
      onAccept: function () {
        if (!removeReservation(record.id)) {
          LUMINA.toast('No se pudo eliminar el registro.', 'error', 'Almacenamiento no disponible');
          return;
        }
        if (LUMINA.Modal.isOpen('reservationDetailModal')) LUMINA.Modal.close('reservationDetailModal');
        renderReservations();
        refreshShowcaseAvailability();
        LUMINA.log({
          type: 'reservas',
          action: 'ELIMINAR REGISTRO',
          element: record.roomName,
          description: 'Se eliminó el registro ' + record.code + ' en estado ' + record.status + '.',
          result: 'EXITOSO',
          meta: { code: record.code }
        });
        LUMINA.toast('El registro se eliminó de este navegador.', 'info', 'Registro eliminado', { duration: 3000 });
      }
    });
  }

  function openPendingFromList(record) {
    if (!record || record.status !== 'Pendiente') return;
    if (LUMINA.Modal.isOpen('reservationDetailModal')) LUMINA.Modal.close('reservationDetailModal');

    if (Number(record.expiresAt) <= Date.now()) {
      state.pending = record;
      resetPendingModal();
      fillPendingModal(record);
      LUMINA.Modal.open('reservationModal', {
        focus: '#cancelPendingButton',
        onClose: function () {
          state.pending = null;
          updateCardCountdowns();
        }
      });
      expireRecord(record, { silent: false, source: 'lista de reservas' });
      return;
    }

    state.pending = record;
    fillPendingModal(record);
    openPendingModal();
    LUMINA.log({
      type: 'temporizador',
      action: 'REANUDAR CONTADOR',
      element: record.roomName,
      description: 'Se reanudó el contador de la reserva pendiente ' + record.code + ' desde Mis reservas.',
      result: 'INFO',
      meta: { code: record.code }
    });
  }

  function bindReservationEvents() {
    $('#reservationStatusFilters').on('click', '[data-status-filter]', function () {
      state.statusFilter = this.getAttribute('data-status-filter');
      renderReservations();
      LUMINA.log({
        type: 'filtros',
        action: 'FILTRAR RESERVAS',
        element: 'Mis reservas',
        description: 'Filtro de reservas aplicado: ' + (this.textContent || '').replace(/\s+/g, ' ').trim() + '.',
        result: 'EXITOSO',
        meta: { status: state.statusFilter }
      });
    });

    $('#reservationsList').on('click', '[data-reservation-action]', function () {
      const action = this.getAttribute('data-reservation-action');
      const id = this.getAttribute('data-reservation-id');
      const record = reservations.find((item) => item.id === id);
      if (!record) return;
      if (action === 'detail') openReservationDetail(id);
      if (action === 'cancel') requestCancelReservation(record);
      if (action === 'continue') openPendingFromList(record);
      if (action === 'delete') requestDeleteReservation(record);
    });

    $('#detailActions').on('click', '[data-detail-action]', function () {
      const action = this.getAttribute('data-detail-action');
      const id = this.getAttribute('data-reservation-id');
      const record = reservations.find((item) => item.id === id);
      if (!record) return;
      if (action === 'cancel') requestCancelReservation(record);
      if (action === 'delete') requestDeleteReservation(record);
      if (action === 'continue') openPendingFromList(record);
    });
  }

  function bindModalEvents() {
    $('#confirmPendingButton').on('click', confirmPending);
    $('#cancelPendingButton').on('click', function () {
      cancelPending({ source: 'botón cancelar reserva' });
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      if (pendingReservations().length) startCountdown();
    });
  }

  /* ---------- Inicialización ---------- */
  function init() {
    if (state.initialized) return;
    state.initialized = true;

    reservations = loadReservations();
    state.coupon = normalizeCode(Storage.get(STORAGE_COUPON, ''));

    renderRoomSelect();
    renderRooms();
    renderVipStatus();
    renderFeaturedRooms();
    renderPromotions();
    const vipTable = document.getElementById('vipStatusRows');
    if (vipTable) vipTable.addEventListener('click', function (event) {
      const button = event.target.closest('[data-vip-room]');
      if (!button) return;
      selectRoom(button.dataset.vipRoom, { source: 'tabla VIP' });
      renderVipStatus();
      LUMINA.toast('Sala seleccionada desde la tabla VIP.', 'info', 'Sala elegida');
    });
    const vipRefresh = document.getElementById('vipStatusRefresh');
    if (vipRefresh) vipRefresh.addEventListener('click', renderVipStatus);
    ['bookingDate', 'bookingTime', 'bookingHours'].forEach(function (id) {
      const input = document.getElementById(id);
      if (input) { input.addEventListener('input', renderVipStatus); input.addEventListener('change', renderVipStatus); }
    });
    bindRoomEvents();
    bindPromotionEvents();
    bindBookingEvents();
    bindReservationEvents();
    bindModalEvents();

    const limits = dateLimits();
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
      dateInput.min = limits.min;
      dateInput.max = limits.max;
    }
    adjustHoursMax();

    const settings = LUMINA.getSettings ? LUMINA.getSettings() : {};
    const nameInput = document.getElementById('bookingName');
    if (nameInput && settings.name) nameInput.value = settings.name;
    const initialRoom = getRoom(settings.room) ? settings.room : ROOMS[0].id;
    selectRoom(initialRoom, { log: false, source: 'inicio' });

    const promoInput = document.getElementById('bookingPromo');
    if (promoInput && state.coupon) promoInput.value = state.coupon;

    renderReservations();
    updateSummary();
    restorePending();
    updateMenuCount();
    if (LUMINA.refreshStorageStats) LUMINA.refreshStorageStats();

    LUMINA.log({
      type: 'sistema',
      action: 'INICIALIZAR RESERVAS',
      element: 'Módulo de reservas',
      description: 'Salas, promociones, calculadora y temporizador de 60 segundos listos. Datos guardados solo en este navegador.',
      result: 'INFO',
      meta: { roomCount: ROOMS.length, promotionCount: PROMOTIONS.length, reservations: reservations.length }
    });
  }

  if ($) {
    $(document).ready(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})(window, document);

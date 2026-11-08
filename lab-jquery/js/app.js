/* =========================================================
   LÚMINA | Karaoke & Music Lounge
   app.js — Núcleo de la aplicación
   ========================================================= */
(function (window, document) {
  'use strict';

  const LUMINA = (window.LUMINA = window.LUMINA || {});
  const $ = window.jQuery;

  LUMINA.version = '1.0.0';
  LUMINA.storagePrefix = 'lumina_';

  const DEFAULT_SETTINGS = {
    name: '',
    room: '',
    toasts: true,
    reduceMotion: false
  };

  const SECTION_IDS = [
    'inicio', 'catalogo', 'salas', 'reservaciones', 'promociones',
    'mis-reservas', 'bitacoras', 'contacto', 'configuracion'
  ];

  const TYPE_ICONS = {
    reservas: 'bi-calendar2-check',
    formularios: 'bi-ui-checks',
    navegacion: 'bi-compass',
    filtros: 'bi-funnel',
    jquery: 'bi-braces',
    promociones: 'bi-ticket-perforated',
    errores: 'bi-exclamation-triangle',
    temporizador: 'bi-stopwatch',
    tema: 'bi-palette',
    favoritos: 'bi-heart',
    sistema: 'bi-cpu'
  };

  /* ---------- Almacenamiento seguro ---------- */
  const Storage = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(LUMINA.storagePrefix + key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
      } catch (error) {
        console.warn('[LÚMINA] No se pudo leer el almacenamiento:', key, error);
        return fallback;
      }
    },

    set(key, value) {
      try {
        window.localStorage.setItem(LUMINA.storagePrefix + key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn('[LÚMINA] No se pudo guardar en el almacenamiento:', key, error);
        if (error.name === 'QuotaExceededError') {
          LUMINA.toast('El almacenamiento del navegador está lleno.', 'error', 'No se pudo guardar');
        }
        return false;
      }
    },

    getRaw(key, fallback) {
      try {
        const raw = window.localStorage.getItem(LUMINA.storagePrefix + key);
        return raw === null ? fallback : raw;
      } catch (error) {
        return fallback;
      }
    },

    setRaw(key, value) {
      try {
        window.localStorage.setItem(LUMINA.storagePrefix + key, value);
        return true;
      } catch (error) {
        console.warn('[LÚMINA] No se pudo guardar el valor:', key, error);
        return false;
      }
    },

    remove(key) {
      try {
        window.localStorage.removeItem(LUMINA.storagePrefix + key);
        return true;
      } catch (error) {
        return false;
      }
    },

    keys() {
      const keys = [];
      try {
        for (let index = 0; index < window.localStorage.length; index += 1) {
          const key = window.localStorage.key(index);
          if (key && key.indexOf(LUMINA.storagePrefix) === 0) keys.push(key);
        }
      } catch (error) {
        console.warn('[LÚMINA] No se pudo enumerar LocalStorage.', error);
      }
      return keys;
    },

    all() {
      const data = {};
      this.keys().forEach((fullKey) => {
        const shortKey = fullKey.replace(LUMINA.storagePrefix, '');
        const raw = window.localStorage.getItem(fullKey);
        try {
          data[shortKey] = JSON.parse(raw);
        } catch (error) {
          data[shortKey] = raw;
        }
      });
      return data;
    },

    clearAll() {
      this.keys().forEach((key) => {
        try { window.localStorage.removeItem(key); } catch (error) { /* sin acción */ }
      });
    }
  };

  LUMINA.Storage = Storage;

  /* ---------- Utilidades ---------- */
  function escapeHtml(value) {
    return String(value === null || typeof value === 'undefined' ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function debounce(callback, wait) {
    let timeout = null;
    return function debounced() {
      const args = arguments;
      const context = this;
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => callback.apply(context, args), wait);
    };
  }

  function uid(prefix) {
    const base = prefix || 'id';
    return base + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function pad(number) {
    return String(number).padStart(2, '0');
  }

  function toLocalISO(date) {
    const value = date instanceof Date ? date : new Date(date);
    return value.getFullYear() + '-' + pad(value.getMonth() + 1) + '-' + pad(value.getDate());
  }

  function parseLocalDate(isoDate) {
    if (!isoDate) return null;
    const parts = String(isoDate).split('-').map(Number);
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDateLong(isoDate) {
    const date = parseLocalDate(isoDate);
    if (!date) return 'Sin seleccionar';
    const formatted = new Intl.DateTimeFormat('es-BO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function formatDateShort(isoDate) {
    const date = parseLocalDate(isoDate);
    if (!date) return '—';
    return pad(date.getDate()) + '/' + pad(date.getMonth() + 1) + '/' + date.getFullYear();
  }

  function formatDateNumeric(dateInput) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(date.getTime())) return '—';
    return pad(date.getDate()) + '/' + pad(date.getMonth() + 1) + '/' + date.getFullYear();
  }

  function formatTimeWithSeconds(dateInput) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(date.getTime())) return '—';
    return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function formatBs(value) {
    const number = Number(value) || 0;
    const formatted = new Intl.NumberFormat('es-BO', {
      maximumFractionDigits: 0
    }).format(number);
    return 'Bs ' + formatted;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('es-BO').format(Number(value) || 0);
  }

  function addHoursToTime(timeString, hours) {
    if (!timeString) return '';
    const parts = timeString.split(':').map(Number);
    if (parts.length < 2) return '';
    const total = parts[0] * 60 + parts[1] + (Number(hours) || 0) * 60;
    const normalized = ((total % 1440) + 1440) % 1440;
    return pad(Math.floor(normalized / 60)) + ':' + pad(normalized % 60);
  }

  function capitalize(text) {
    const value = String(text || '');
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function getSettings() {
    const settings = Storage.get('settings', {});
    return Object.assign({}, DEFAULT_SETTINGS, settings && typeof settings === 'object' ? settings : {});
  }

  function saveSettings(settings) {
    return Storage.set('settings', Object.assign({}, getSettings(), settings || {}));
  }

  function triggerDownload(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType || 'application/octet-stream;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 800);
  }

  LUMINA.escapeHtml = escapeHtml;
  LUMINA.debounce = debounce;
  LUMINA.uid = uid;
  LUMINA.toLocalISO = toLocalISO;
  LUMINA.parseLocalDate = parseLocalDate;
  LUMINA.formatDateLong = formatDateLong;
  LUMINA.formatDateShort = formatDateShort;
  LUMINA.formatDateNumeric = formatDateNumeric;
  LUMINA.formatTimeWithSeconds = formatTimeWithSeconds;
  LUMINA.formatBs = formatBs;
  LUMINA.formatNumber = formatNumber;
  LUMINA.addHoursToTime = addHoursToTime;
  LUMINA.capitalize = capitalize;
  LUMINA.getSettings = getSettings;
  LUMINA.saveSettings = saveSettings;
  LUMINA.triggerDownload = triggerDownload;
  LUMINA.typeIcons = TYPE_ICONS;

  /* ---------- Bitácoras: puente seguro ---------- */
  LUMINA.log = function (entry) {
    if (LUMINA.Logs && typeof LUMINA.Logs.add === 'function') {
      return LUMINA.Logs.add(entry);
    }
    return null;
  };

  LUMINA.updateLogIndicators = LUMINA.updateLogIndicators || function () {};

  /* ---------- Toasts ---------- */
  LUMINA.toast = function (message, type, title, options) {
    const opts = Object.assign({ duration: 3000, force: false }, options || {});
    const settings = getSettings();
    if (!settings.toasts && !opts.force) return null;

    const container = document.getElementById('toastContainer');
    if (!container) return null;

    const safeType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
    const icons = {
      success: 'bi-check2-circle',
      error: 'bi-x-circle',
      warning: 'bi-exclamation-triangle',
      info: 'bi-info-circle'
    };
    const defaultTitles = {
      success: 'Listo',
      error: 'Algo no salió bien',
      warning: 'Atención',
      info: 'Información'
    };

    const toast = document.createElement('div');
    toast.className = 'toast-message toast-' + safeType;
    toast.setAttribute('role', safeType === 'error' ? 'alert' : 'status');
    toast.innerHTML =
      '<span class="toast-icon"><i class="bi ' + icons[safeType] + '" aria-hidden="true"></i></span>' +
      '<div class="toast-content"><strong>' + escapeHtml(title || defaultTitles[safeType]) + '</strong><p>' + escapeHtml(message) + '</p></div>' +
      '<button class="toast-close" type="button" aria-label="Cerrar notificación"><i class="bi bi-x-lg" aria-hidden="true"></i></button>';

    container.appendChild(toast);

    if ($) {
      $(toast).hide().slideDown(240);
    }

    const dismiss = function () {
      if (!toast.isConnected) return;
      if ($) {
        $(toast).fadeOut(180, function () { toast.remove(); });
      } else {
        toast.remove();
      }
    };

    const timer = window.setTimeout(dismiss, opts.duration);
    toast.querySelector('.toast-close').addEventListener('click', function () {
      window.clearTimeout(timer);
      dismiss();
    });

    return toast;
  };

  /* ---------- Modales accesibles ---------- */
  const Modal = {
    stack: [],
    lastFocus: null,
    callbacks: new Map(),

    open(id, options) {
      const element = document.getElementById(id);
      if (!element) return false;
      const opts = Object.assign({ focus: null, onClose: null }, options || {});

      // Evita apilar dos veces el mismo modal.
      if (!this.stack.includes(id)) {
        this.stack.push(id);
        this.lastFocus = document.activeElement;
      }

      if (opts.onClose) this.callbacks.set(id, opts.onClose);

      element.hidden = false;
      element.style.display = '';
      element.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      // Añade la clase en el siguiente frame para animar la entrada, con un
      // respaldo por si requestAnimationFrame está pausado (pestaña en segundo plano).
      const openNow = () => {
        if (element.getAttribute('aria-hidden') !== 'false') return;
        element.classList.add('is-open');
      };
      window.requestAnimationFrame(openNow);
      window.setTimeout(openNow, 90);

      const focusTarget = opts.focus
        ? element.querySelector(opts.focus)
        : element.querySelector('.modal-close, button, [href], input, select, textarea');

      window.setTimeout(() => {
        if (focusTarget && typeof focusTarget.focus === 'function') {
          focusTarget.focus({ preventScroll: true });
        } else {
          element.querySelector('.modal-card')?.focus?.({ preventScroll: true });
        }
      }, 40);

      return true;
    },

    close(id, options) {
      const element = document.getElementById(id);
      if (!element) return;
      const opts = Object.assign({ fade: false }, options || {});
      const finish = () => {
        element.classList.remove('is-open');
        element.setAttribute('aria-hidden', 'true');
        element.style.display = '';
        element.hidden = true;
        this.stack = this.stack.filter((item) => item !== id);
        if (!this.stack.length) {
          document.body.classList.remove('modal-open');
        }
        if (this.callbacks.has(id)) {
          const callback = this.callbacks.get(id);
          this.callbacks.delete(id);
          if (typeof callback === 'function') callback();
        }
        if (this.lastFocus && document.contains(this.lastFocus)) {
          this.lastFocus.focus({ preventScroll: true });
        }
      };

      if (opts.fade && $) {
        $(element).fadeOut(220, finish);
      } else {
        finish();
      }
    },

    closeTop(options) {
      const id = this.stack[this.stack.length - 1];
      if (id) this.close(id, options);
    },

    isOpen(id) {
      return this.stack.includes(id);
    }
  };

  LUMINA.Modal = Modal;

  LUMINA.confirm = function (options) {
    const opts = Object.assign({
      title: '¿Estás seguro?',
      message: 'Esta acción no se puede deshacer.',
      acceptLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      tone: 'danger',
      onAccept: null
    }, options || {});

    const title = document.getElementById('confirmModalTitle');
    const message = document.getElementById('confirmModalMessage');
    const accept = document.getElementById('confirmModalAccept');
    const cancel = document.getElementById('confirmModalCancel');
    const icon = document.getElementById('confirmModalIcon');

    if (!title || !message || !accept || !cancel) return;

    title.textContent = opts.title;
    message.textContent = opts.message;
    accept.textContent = opts.acceptLabel;
    cancel.textContent = opts.cancelLabel;
    accept.className = opts.tone === 'danger' ? 'btn btn-danger' : 'btn btn-gold';
    if (icon) {
      icon.className = 'confirm-icon';
      icon.innerHTML = '<i class="bi ' + (opts.tone === 'danger' ? 'bi-exclamation-triangle' : 'bi-question-circle') + '" aria-hidden="true"></i>';
      if (opts.tone !== 'danger') {
        icon.style.borderColor = 'var(--line-gold)';
        icon.style.background = 'var(--gold-soft)';
        icon.style.color = 'var(--gold)';
      } else {
        icon.style.borderColor = '';
        icon.style.background = '';
        icon.style.color = '';
      }
    }

    if ($) {
      $(accept).off('click.luminaConfirm').on('click.luminaConfirm', function () {
        Modal.close('confirmModal');
        if (typeof opts.onAccept === 'function') opts.onAccept();
      });
      $(cancel).off('click.luminaConfirmCancel').on('click.luminaConfirmCancel', function () {
        Modal.close('confirmModal');
      });
    }

    Modal.open('confirmModal', { focus: '#confirmModalCancel' });
  };

  /* ---------- Navegación SPA ---------- */
  function getTargetSection(id) {
    if (!SECTION_IDS.includes(id)) return null;
    return document.getElementById(id);
  }

  function updateActiveNavigation(targetId) {
    document.querySelectorAll('.menu-link').forEach((link) => {
      const active = link.getAttribute('data-target') === targetId;
      link.classList.toggle('is-active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function scrollPageTop(behavior) {
    const reduce = document.documentElement.classList.contains('reduce-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : (behavior || 'smooth') });
  }

  function showSection(targetId, options) {
    const opts = Object.assign({ log: true, push: true, initial: false }, options || {});
    const target = getTargetSection(targetId);
    if (!target) return false;

    const current = document.querySelector('.app-section.is-active');
    const sameSection = current && current.id === targetId;

    if (!sameSection) {
      document.querySelectorAll('.app-section').forEach((section) => {
        section.hidden = true;
        section.classList.remove('is-active');
      });
      target.hidden = false;
      // Fuerza el reinicio de la animación de entrada.
      void target.offsetWidth;
      target.classList.add('is-active');
      updateActiveNavigation(targetId);
    }

    if (opts.push) {
      const newHash = '#' + targetId;
      if (window.location.hash !== newHash) {
        window.history.pushState({ section: targetId }, '', newHash);
      }
    }

    document.body.classList.remove('menu-open');
    closeMenu({ silent: true, restoreFocus: false });

    if (!opts.initial) {
      scrollPageTop();
      const heading = target.querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        window.setTimeout(() => heading.focus({ preventScroll: true }), 90);
      }
    }

    if (opts.log && !sameSection) {
      const label = target.getAttribute('data-section-label') || targetId;
      LUMINA.log({
        type: 'navegacion',
        action: 'ABRIR SECCIÓN',
        element: label,
        description: 'El usuario navegó a la sección “' + label + '”.',
        result: 'EXITOSO',
        meta: { section: targetId }
      });
    }

    document.dispatchEvent(new CustomEvent('lumina:sectionchange', {
      detail: { section: targetId }
    }));

    if (targetId === 'bitacoras' && LUMINA.Logs && typeof LUMINA.Logs.markSeen === 'function') {
      window.setTimeout(() => LUMINA.Logs.markSeen(true), 450);
    }

    return true;
  }

  LUMINA.showSection = showSection;
  LUMINA.navigateTo = showSection;

  /* ---------- Menú lateral ---------- */
  let menuOpen = false;

  function getFocusable(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.offsetParent !== null);
  }

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    const menu = document.getElementById('sideMenu');
    const backdrop = document.getElementById('menuBackdrop');
    const toggle = document.getElementById('menuToggle');
    if (!menu || !backdrop) return;

    if (backdrop) {
      backdrop.hidden = false;
      if ($) $(backdrop).stop(true, true).hide().fadeIn(180);
      backdrop.classList.add('is-visible');
    }
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');

    window.setTimeout(() => {
      const first = menu.querySelector('.menu-close');
      if (first) first.focus({ preventScroll: true });
    }, 80);

    LUMINA.log({
      type: 'navegacion',
      action: 'ABRIR',
      element: 'Menú lateral',
      description: 'Se abrió el menú de navegación.',
      result: 'EXITOSO',
      meta: { component: 'menu' }
    });
  }

  function closeMenu(options) {
    if (!menuOpen) return;
    const opts = Object.assign({ silent: false, restoreFocus: true }, options || {});
    menuOpen = false;
    const menu = document.getElementById('sideMenu');
    const backdrop = document.getElementById('menuBackdrop');
    const toggle = document.getElementById('menuToggle');

    if (menu) {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
    }
    if (backdrop) {
      backdrop.classList.remove('is-visible');
      if ($) {
        $(backdrop).stop(true, true).fadeOut(180, function () {
          this.hidden = true;
          this.style.display = '';
        });
      } else {
        backdrop.hidden = true;
      }
    }
    document.body.classList.remove('menu-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      if (opts.restoreFocus) toggle.focus({ preventScroll: true });
    }

    if (!opts.silent) {
      LUMINA.log({
        type: 'navegacion',
        action: 'CERRAR',
        element: 'Menú lateral',
        description: 'Se cerró el menú de navegación.',
        result: 'EXITOSO',
        meta: { component: 'menu' }
      });
    }
  }

  LUMINA.openMenu = openMenu;
  LUMINA.closeMenu = closeMenu;

  /* ---------- Tema ---------- */
  function syncThemeUI(theme) {
    const toggle = document.getElementById('themeToggle');
    const isLight = theme === 'light';
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(isLight));
      toggle.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
    document.querySelectorAll('[data-set-theme]').forEach((button) => {
      const active = button.getAttribute('data-set-theme') === theme;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const darkCheck = document.getElementById('themeDarkCheck');
    const lightCheck = document.getElementById('themeLightCheck');
    if (darkCheck) darkCheck.textContent = theme === 'dark' ? 'Activo' : '';
    if (lightCheck) lightCheck.textContent = theme === 'light' ? 'Activo' : '';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', isLight ? '#f7f2e8' : '#080a10');
  }

  function setTheme(theme, options) {
    const opts = Object.assign({ silent: false, source: 'botón' }, options || {});
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    const previous = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', nextTheme);
    Storage.setRaw('theme', nextTheme);
    syncThemeUI(nextTheme);

    if (previous !== nextTheme && !opts.silent) {
      LUMINA.log({
        type: 'tema',
        action: 'CAMBIAR',
        element: 'Tema visual',
        description: 'Tema cambiado a ' + (nextTheme === 'light' ? 'modo marfil (claro)' : 'modo noche (oscuro)') + '.',
        result: 'EXITOSO',
        meta: { theme: nextTheme, source: opts.source }
      });
      LUMINA.toast(
        nextTheme === 'light' ? 'Modo marfil activado.' : 'Modo noche activado.',
        'info',
        'Apariencia actualizada',
        { duration: 2400 }
      );
    }

    document.dispatchEvent(new CustomEvent('lumina:themechange', {
      detail: { theme: nextTheme }
    }));
    return nextTheme;
  }

  LUMINA.setTheme = setTheme;

  /* ---------- Preferencias y datos ---------- */
  function applyReduceMotion(enabled) {
    document.documentElement.classList.toggle('reduce-motion', Boolean(enabled));
    if (enabled) {
      Storage.setRaw('reduce_motion', '1');
    } else {
      Storage.remove('reduce_motion');
    }
  }

  function populatePreferenceRooms() {
    const select = document.getElementById('prefRoom');
    if (!select) return;
    const rooms = LUMINA.rooms || [];
    const current = getSettings().room || '';
    const firstOption = '<option value="">Sin preferencia</option>';
    const options = rooms.map((room) =>
      '<option value="' + escapeHtml(room.id) + '">' + escapeHtml(room.name) + ' · ' + formatBs(room.price) + '/h</option>'
    ).join('');
    select.innerHTML = firstOption + options;
    select.value = rooms.some((room) => room.id === current) ? current : '';
  }

  LUMINA.populatePreferenceRooms = populatePreferenceRooms;

  function refreshStorageStats() {
    const reservations = Storage.get('reservations', []);
    const logs = Storage.get('logs', []);
    const favorites = Storage.get('favorites', []);
    const bytes = Storage.keys().reduce((total, key) => {
      const value = window.localStorage.getItem(key) || '';
      return total + key.length + value.length;
    }, 0);
    const kb = bytes / 1024;
    const usage = Math.min(100, (bytes / (5 * 1024 * 1024)) * 100);

    const usageEl = document.getElementById('storageUsage');
    const meterEl = document.getElementById('storageMeterBar');
    const reservationsEl = document.getElementById('storageReservations');
    const logsEl = document.getElementById('storageLogs');
    const favoritesEl = document.getElementById('storageFavorites');

    if (usageEl) usageEl.textContent = kb < 1 ? 'Menos de 1 KB' : kb.toFixed(1).replace('.', ',') + ' KB';
    if (meterEl) meterEl.style.width = Math.max(1, usage).toFixed(1) + '%';
    if (reservationsEl) reservationsEl.textContent = formatNumber(Array.isArray(reservations) ? reservations.length : 0);
    if (logsEl) logsEl.textContent = formatNumber(Array.isArray(logs) ? logs.length : 0);
    if (favoritesEl) favoritesEl.textContent = formatNumber(Array.isArray(favorites) ? favorites.length : 0);
  }

  LUMINA.refreshStorageStats = refreshStorageStats;

  function initSettings() {
    const settings = getSettings();
    const nameInput = document.getElementById('prefName');
    const toastInput = document.getElementById('prefToasts');
    const motionInput = document.getElementById('prefMotion');
    const form = document.getElementById('preferencesForm');

    if (nameInput) nameInput.value = settings.name || '';
    if (toastInput) toastInput.checked = settings.toasts !== false;
    if (motionInput) motionInput.checked = Boolean(settings.reduceMotion);
    populatePreferenceRooms();
    refreshStorageStats();
    syncThemeUI(document.documentElement.getAttribute('data-theme') || 'dark');

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const updated = {
          name: (nameInput?.value || '').trim().slice(0, 40),
          room: document.getElementById('prefRoom')?.value || '',
          toasts: Boolean(toastInput?.checked),
          reduceMotion: Boolean(motionInput?.checked)
        };
        saveSettings(updated);
        applyReduceMotion(updated.reduceMotion);
        refreshStorageStats();
        LUMINA.log({
          type: 'sistema',
          action: 'GUARDAR',
          element: 'Preferencias',
          description: 'Se actualizaron las preferencias del usuario.',
          result: 'EXITOSO',
          meta: { preferredRoom: updated.room || 'ninguna', toasts: updated.toasts, reduceMotion: updated.reduceMotion }
        });
        LUMINA.toast('Tus preferencias se guardaron en este navegador.', 'success', 'Preferencias guardadas');
      });
    }

    document.querySelectorAll('[data-set-theme]').forEach((button) => {
      button.addEventListener('click', function () {
        setTheme(button.getAttribute('data-set-theme'), { source: 'configuración' });
      });
    });

    const exportButton = document.getElementById('exportAllData');
    if (exportButton) {
      exportButton.addEventListener('click', function () {
        const data = {
          exportadoEn: new Date().toISOString(),
          aplicacion: 'LÚMINA · Karaoke & Music Lounge',
          version: LUMINA.version,
          nota: 'Datos locales de demostración. No representan reservas comerciales reales.',
          datos: Storage.all()
        };
        triggerDownload(
          'lumina-datos-' + toLocalISO(new Date()) + '.json',
          JSON.stringify(data, null, 2),
          'application/json;charset=utf-8'
        );
        LUMINA.log({
          type: 'sistema',
          action: 'EXPORTAR',
          element: 'Datos locales',
          description: 'El usuario exportó una copia de sus datos locales en JSON.',
          result: 'EXITOSO',
          meta: { formato: 'JSON' }
        });
        LUMINA.toast('Se descargó una copia de tus datos locales.', 'success', 'Exportación lista');
      });
    }

    const clearButton = document.getElementById('clearUserData');
    if (clearButton) {
      clearButton.addEventListener('click', function () {
        LUMINA.confirm({
          title: '¿Borrar todos los datos locales?',
          message: 'Se eliminarán reservas, favoritos, preferencias, promociones y bitácoras de este navegador. Esta acción no se puede deshacer.',
          acceptLabel: 'Sí, borrar todo',
          tone: 'danger',
          onAccept() {
            Storage.clearAll();
            LUMINA.toast('Datos eliminados. Restaurando la experiencia…', 'warning', 'Datos borrados', { force: true, duration: 1200 });
            window.setTimeout(() => {
              window.location.hash = '';
              window.location.reload();
            }, 850);
          }
        });
      });
    }
  }

  /* ---------- Reveal y contadores ---------- */
  function initReveal() {
    const elements = Array.from(document.querySelectorAll('.reveal'));
    const reduceMotion = document.documentElement.classList.contains('reduce-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((element) => observer.observe(element));

    // Asegura contenido visible si el navegador no dispara el observer.
    window.setTimeout(() => {
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add('is-revealed');
        }
      });
    }, 900);
  }

  function animateCounter(element) {
    if (!element || element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';
    const target = parseFloat(element.getAttribute('data-count')) || 0;
    const decimals = parseInt(element.getAttribute('data-decimals'), 10) || 0;
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const reduceMotion = document.documentElement.classList.contains('reduce-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = (value) => {
      const formatted = new Intl.NumberFormat('es-BO', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value);
      element.textContent = prefix + formatted + suffix;
    };

    if (reduceMotion) {
      render(target);
      return;
    }

    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      render(target * eased);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        render(target);
      }
    };
    window.requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = Array.from(document.querySelectorAll('.stat-value'));
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach((counter) => observer.observe(counter));
  }

  /* ---------- Imágenes de respaldo ---------- */
  function initImageFallbacks() {
    document.addEventListener('error', function (event) {
      const image = event.target;
      if (!image || image.tagName !== 'IMG') return;
      const fallback = image.getAttribute('data-fallback');
      if (!fallback || image.dataset.fallbackApplied === 'true') return;
      image.dataset.fallbackApplied = 'true';
      image.src = fallback;
      image.classList.add('is-fallback-image');
    }, true);
  }

  /* ---------- Inicialización general ---------- */
  function init() {
    initImageFallbacks();
    initSettings();
    initReveal();
    initCounters();

    const currentYear = document.getElementById('currentYear');
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    const initialHash = window.location.hash.replace('#', '');
    const initialSection = SECTION_IDS.includes(initialHash) ? initialHash : 'inicio';
    showSection(initialSection, { initial: true, log: false, push: false });

    // Navegación desde cualquier botón o enlace con data-target.
    document.addEventListener('click', function (event) {
      const navTrigger = event.target.closest('.js-nav');
      if (navTrigger) {
        event.preventDefault();
        const target = navTrigger.getAttribute('data-target');
        if (target) showSection(target);
      }

      if (event.target.closest('.js-scroll-top')) {
        scrollPageTop();
      }

      const closeModalTrigger = event.target.closest('[data-close-modal]');
      if (closeModalTrigger) {
        const id = closeModalTrigger.getAttribute('data-close-modal');
        if (id) Modal.close(id);
      }
    });

    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const menuBackdrop = document.getElementById('menuBackdrop');

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', function () { closeMenu(); });
    if (menuBackdrop) menuBackdrop.addEventListener('click', function () { closeMenu(); });

    document.getElementById('navLogsTop')?.addEventListener('click', function () {
      showSection('bitacoras');
    });

    document.getElementById('themeToggle')?.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark', { source: 'cabecera' });
    });

    // Teclado: Escape y focus trap para menú y modales.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (Modal.stack.length) {
          Modal.closeTop();
          return;
        }
        if (menuOpen) {
          closeMenu();
          return;
        }
      }

      if (event.key === 'Tab') {
        const activeModal = Modal.stack.length ? document.getElementById(Modal.stack[Modal.stack.length - 1]) : null;
        if (activeModal) {
          const focusables = getFocusable(activeModal);
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          return;
        }

        if (menuOpen) {
          const menu = document.getElementById('sideMenu');
          const focusables = getFocusable(menu);
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    });

    // Historial del navegador.
    window.addEventListener('popstate', function () {
      const targetId = window.location.hash.replace('#', '') || 'inicio';
      showSection(SECTION_IDS.includes(targetId) ? targetId : 'inicio', {
        push: false,
        log: true
      });
    });

    window.addEventListener('scroll', function () {
      const header = document.getElementById('siteHeader');
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });

    // Atajo de búsqueda del catálogo.
    document.addEventListener('keydown', function (event) {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      const activeTag = document.activeElement?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;
      if (document.getElementById('catalogo')?.classList.contains('is-active')) {
        event.preventDefault();
        document.getElementById('songSearch')?.focus();
      }
    });

    // Sincroniza la UI del tema si el sistema no lo ha hecho.
    syncThemeUI(document.documentElement.getAttribute('data-theme') || 'dark');
    refreshStorageStats();
  }

  if ($) {
    $(document).ready(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})(window, document);

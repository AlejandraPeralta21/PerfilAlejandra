/* =========================================================
   LÚMINA | Karaoke & Music Lounge
   bitacoras.js — Registro, filtros y exportación de actividad
   ========================================================= */
(function (window, document) {
  'use strict';

  const LUMINA = (window.LUMINA = window.LUMINA || {});
  const $ = window.jQuery;
  const Storage = LUMINA.Storage;

  const MAX_LOGS = 500;
  const PAGE_SIZE = 30;

  const ALLOWED_TYPES = [
    'reservas', 'formularios', 'navegacion', 'filtros', 'jquery',
    'promociones', 'errores', 'temporizador', 'tema', 'favoritos', 'sistema'
  ];

  const TYPE_LABELS = {
    reservas: 'Reserva',
    formularios: 'Formulario',
    navegacion: 'Navegación',
    filtros: 'Filtro',
    jquery: 'jQuery',
    promociones: 'Promoción',
    errores: 'Error',
    temporizador: 'Temporizador',
    tema: 'Tema',
    favoritos: 'Favoritos',
    sistema: 'Sistema'
  };

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

  const SENSITIVE_KEY = /(password|contrase|email|correo|phone|telefono|teléfono|name|nombre|tarjeta|card|cvv)/i;

  const state = {
    type: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
    sort: 'recent',
    limit: PAGE_SIZE
  };

  function sanitizeMetadata(metadata) {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return {};
    const clean = {};
    Object.keys(metadata).forEach((key) => {
      if (SENSITIVE_KEY.test(key)) return;
      const value = metadata[key];
      if (value === null || typeof value === 'undefined') return;
      if (typeof value === 'object') {
        clean[key] = JSON.stringify(value).slice(0, 180);
      } else {
        clean[key] = String(value).replace(/[<>]/g, '').slice(0, 180);
      }
    });
    return clean;
  }

  function normalizeResult(result) {
    const value = String(result || 'EXITOSO').toUpperCase();
    if (['EXITOSO', 'FALLIDO', 'INFO', 'CANCELADO', 'EXPIRADO', 'ERROR'].includes(value)) return value;
    return 'INFO';
  }

  function resultClass(result) {
    return 'result-' + normalizeResult(result).toLowerCase();
  }

  class LogBook {
    constructor() {
      this.logs = Storage.get('logs', []);
      if (!Array.isArray(this.logs)) this.logs = [];
      this.seen = Number(Storage.getRaw('logs_seen_ts', '0')) || 0;
      this.renderTimer = null;
      this.lastSearchLog = 0;
    }

    persist() {
      this.logs = this.logs.slice(0, MAX_LOGS);
      Storage.set('logs', this.logs);
    }

    add(entry) {
      const now = new Date();
      const rawType = String(entry && entry.type ? entry.type : 'sistema').toLowerCase();
      const type = ALLOWED_TYPES.includes(rawType) ? rawType : 'sistema';
      const item = {
        id: 'LOG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
        timestamp: now.toISOString(),
        date: LUMINA.formatDateNumeric(now),
        time: LUMINA.formatTimeWithSeconds(now),
        type,
        action: String(entry.action || 'REGISTRAR').slice(0, 60).toUpperCase(),
        element: String(entry.element || 'Sistema').slice(0, 80),
        description: String(entry.description || 'Evento registrado por el sistema.').slice(0, 300),
        result: normalizeResult(entry.result),
        meta: sanitizeMetadata(entry.meta)
      };

      this.logs.unshift(item);
      this.persist();
      this.updateIndicators(true);
      this.render();
      this.updateMetrics();

      if ($('#bitacoras').hasClass('is-active') && !$('#logsList').is(':hidden')) {
        this.markSeen(true);
      }

      return item;
    }

    list() {
      return this.logs.slice();
    }

    getFiltered() {
      const search = state.search.trim().toLowerCase();
      const from = state.dateFrom ? LUMINA.parseLocalDate(state.dateFrom) : null;
      const to = state.dateTo ? LUMINA.parseLocalDate(state.dateTo) : null;

      let filtered = this.logs.filter((log) => {
        if (state.type !== 'all' && log.type !== state.type) return false;

        if (search) {
          const haystack = [
            log.type, log.action, log.element, log.description, log.result,
            Object.values(log.meta || {}).join(' ')
          ].join(' ').toLowerCase();
          if (!haystack.includes(search)) return false;
        }

        if (from || to) {
          const logDate = LUMINA.parseLocalDate(
            new Date(log.timestamp).getFullYear() + '-' +
            String(new Date(log.timestamp).getMonth() + 1).padStart(2, '0') + '-' +
            String(new Date(log.timestamp).getDate()).padStart(2, '0')
          );
          if (!logDate) return false;
          if (from && logDate < from) return false;
          if (to && logDate > to) return false;
        }
        return true;
      });

      filtered.sort((a, b) => {
        const first = new Date(a.timestamp).getTime();
        const second = new Date(b.timestamp).getTime();
        return state.sort === 'old' ? first - second : second - first;
      });

      return filtered;
    }

    updateIndicators(pulse) {
      const unseen = this.logs.filter((log) => new Date(log.timestamp).getTime() > this.seen).length;
      const topBadge = document.getElementById('logIndicator');
      const menuBadge = document.getElementById('menuLogCount');
      const liveCount = document.getElementById('logLiveCount');
      const topButton = document.getElementById('navLogsTop');

      if (topBadge) {
        topBadge.textContent = unseen > 99 ? '99+' : String(unseen);
        topBadge.hidden = unseen === 0;
      }
      if (menuBadge) menuBadge.textContent = this.logs.length > 99 ? '99+' : String(this.logs.length);
      if (liveCount) liveCount.textContent = LUMINA.formatNumber(this.logs.length) + ' eventos';

      if (pulse && unseen > 0 && topButton) {
        $(topButton).removeClass('is-pulsing');
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            $(topButton).addClass('is-pulsing');
            window.setTimeout(() => $(topButton).removeClass('is-pulsing'), 1000);
          });
        });
      }
    }

    updateMetrics() {
      const total = this.logs.length;
      const reservationCount = this.logs.filter((log) => log.type === 'reservas').length;
      const errorCount = this.logs.filter((log) => log.type === 'errores' || ['FALLIDO', 'ERROR'].includes(log.result)).length;
      const last = this.logs[0];

      const totalEl = document.getElementById('metricTotal');
      const reservationsEl = document.getElementById('metricReservations');
      const errorsEl = document.getElementById('metricErrors');
      const lastEl = document.getElementById('metricLast');
      const lastTypeEl = document.getElementById('metricLastType');
      const menuReservationCount = document.getElementById('menuReservationCount');

      if (totalEl) totalEl.textContent = LUMINA.formatNumber(total);
      if (reservationsEl) reservationsEl.textContent = LUMINA.formatNumber(reservationCount);
      if (errorsEl) errorsEl.textContent = LUMINA.formatNumber(errorCount);
      if (lastEl) lastEl.textContent = last ? last.time : '—';
      if (lastTypeEl) lastTypeEl.textContent = last ? TYPE_LABELS[last.type] + ' · ' + last.action : 'sin actividad';

      const reservations = Storage.get('reservations', []);
      if (menuReservationCount) {
        menuReservationCount.textContent = Array.isArray(reservations) ? String(reservations.length) : '0';
      }
    }

    markSeen(silent) {
      this.seen = Date.now();
      Storage.setRaw('logs_seen_ts', String(this.seen));
      this.updateIndicators(false);
      if (!silent && this.logs.length) {
        LUMINA.toast('Las bitácoras están al día.', 'info', 'Actividad revisada', { duration: 2000 });
      }
    }

    buildEntryHtml(log) {
      const metaEntries = Object.entries(log.meta || {}).filter(([, value]) => value !== '');
      const metaHtml = metaEntries.map(([key, value]) =>
        '<span><i class="bi bi-dot" aria-hidden="true"></i>' + LUMINA.escapeHtml(key) + ': ' + LUMINA.escapeHtml(value) + '</span>'
      ).join('');

      return (
        '<article class="log-entry log-type-' + LUMINA.escapeHtml(log.type) + '" data-log-id="' + LUMINA.escapeHtml(log.id) + '">' +
          '<span class="log-type-icon"><i class="bi ' + (TYPE_ICONS[log.type] || 'bi-dot') + '" aria-hidden="true"></i></span>' +
          '<div class="log-main">' +
            '<div class="log-topline">' +
              '<span class="log-type-label">' + LUMINA.escapeHtml(TYPE_LABELS[log.type] || log.type) + '</span>' +
              '<span class="log-action-label">' + LUMINA.escapeHtml(log.action) + '</span>' +
              '<span class="log-result-badge ' + resultClass(log.result) + '">' + LUMINA.escapeHtml(log.result) + '</span>' +
            '</div>' +
            '<p class="log-description">' + LUMINA.escapeHtml(log.description) + '</p>' +
            '<div class="log-meta">' +
              '<span><i class="bi bi-crosshair" aria-hidden="true"></i>' + LUMINA.escapeHtml(log.element) + '</span>' +
              metaHtml +
            '</div>' +
          '</div>' +
          '<time class="log-time" datetime="' + LUMINA.escapeHtml(log.timestamp) + '">' +
            '<strong>' + LUMINA.escapeHtml(log.time) + '</strong>' +
            '<span>' + LUMINA.escapeHtml(log.date) + '</span>' +
          '</time>' +
        '</article>'
      );
    }

    render() {
      const list = document.getElementById('logsList');
      const empty = document.getElementById('logsEmpty');
      const count = document.getElementById('logsResultCount');
      const activeFilter = document.getElementById('logsActiveFilter');
      const loadMore = document.getElementById('loadMoreLogs');
      if (!list) return;

      const filtered = this.getFiltered();
      const visible = filtered.slice(0, state.limit);
      list.innerHTML = visible.map((log) => this.buildEntryHtml(log)).join('');

      if (empty) empty.hidden = filtered.length > 0;
      if (count) count.textContent = LUMINA.formatNumber(filtered.length) + (filtered.length === 1 ? ' evento' : ' eventos');

      if (activeFilter) {
        const labels = [];
        if (state.type !== 'all') labels.push('Tipo: ' + (TYPE_LABELS[state.type] || state.type));
        if (state.search) labels.push('Búsqueda: “' + state.search + '”');
        if (state.dateFrom) labels.push('Desde: ' + LUMINA.formatDateShort(state.dateFrom));
        if (state.dateTo) labels.push('Hasta: ' + LUMINA.formatDateShort(state.dateTo));
        if (state.sort === 'old') labels.push('Antiguos primero');
        activeFilter.textContent = labels.length ? labels.join(' · ') : 'Mostrando todos los registros';
      }

      if (loadMore) {
        loadMore.hidden = filtered.length <= state.limit;
        loadMore.innerHTML = 'Ver más eventos <i class="bi bi-arrow-down" aria-hidden="true"></i>';
      }

      this.updateMetrics();
      this.updateIndicators(false);
      if (LUMINA.refreshStorageStats) LUMINA.refreshStorageStats();
    }

    scheduleRender() {
      window.clearTimeout(this.renderTimer);
      this.renderTimer = window.setTimeout(() => this.render(), 80);
    }

    resetFilters() {
      state.type = 'all';
      state.search = '';
      state.dateFrom = '';
      state.dateTo = '';
      state.sort = 'recent';
      state.limit = PAGE_SIZE;

      const search = document.getElementById('logSearch');
      const from = document.getElementById('logDateFrom');
      const to = document.getElementById('logDateTo');
      const sort = document.getElementById('logSort');
      if (search) search.value = '';
      if (from) from.value = '';
      if (to) to.value = '';
      if (sort) sort.value = 'recent';
      $('#logTypeFilters .chip-button').removeClass('is-active');
      $('#logTypeFilters .chip-button[data-log-type="all"]').addClass('is-active');
      this.render();
    }

    exportCsv() {
      const filtered = this.getFiltered();
      if (!filtered.length) {
        LUMINA.toast('No hay eventos que coincidan con los filtros actuales.', 'warning', 'Nada que exportar');
        return;
      }

      const safeCsv = (value) => '"' + String(value === null || typeof value === 'undefined' ? '' : value).replace(/"/g, '""') + '"';
      const rows = [
        ['ID', 'Fecha', 'Hora', 'Tipo', 'Acción', 'Elemento', 'Descripción', 'Resultado', 'Metadatos']
      ];

      filtered.forEach((log) => {
        rows.push([
          log.id,
          log.date,
          log.time,
          TYPE_LABELS[log.type] || log.type,
          log.action,
          log.element,
          log.description,
          log.result,
          Object.entries(log.meta || {}).map(([key, value]) => key + ': ' + value).join(' | ')
        ]);
      });

      const csv = '\uFEFF' + rows.map((row) => row.map(safeCsv).join(',')).join('\r\n');
      LUMINA.triggerDownload(
        'lumina-bitacoras-' + LUMINA.toLocalISO(new Date()) + '.csv',
        csv,
        'text/csv;charset=utf-8'
      );

      this.add({
        type: 'sistema',
        action: 'EXPORTAR CSV',
        element: 'Bitácoras',
        description: 'Se exportaron ' + filtered.length + ' eventos filtrados a CSV.',
        result: 'EXITOSO',
        meta: { formato: 'CSV', eventos: filtered.length }
      });
      LUMINA.toast('CSV generado con los eventos visibles.', 'success', 'Exportación lista');
    }

    exportJson() {
      const filtered = this.getFiltered();
      if (!filtered.length) {
        LUMINA.toast('No hay eventos que coincidan con los filtros actuales.', 'warning', 'Nada que exportar');
        return;
      }

      const payload = {
        aplicacion: 'LÚMINA · Karaoke & Music Lounge',
        tipo: 'Bitácoras de actividad',
        exportadoEn: new Date().toISOString(),
        nota: 'Registro local de demostración. No contiene datos sensibles.',
        total: filtered.length,
        eventos: filtered
      };

      LUMINA.triggerDownload(
        'lumina-bitacoras-' + LUMINA.toLocalISO(new Date()) + '.json',
        JSON.stringify(payload, null, 2),
        'application/json;charset=utf-8'
      );

      this.add({
        type: 'sistema',
        action: 'EXPORTAR JSON',
        element: 'Bitácoras',
        description: 'Se exportaron ' + filtered.length + ' eventos filtrados a JSON.',
        result: 'EXITOSO',
        meta: { formato: 'JSON', eventos: filtered.length }
      });
      LUMINA.toast('JSON generado con los eventos visibles.', 'success', 'Exportación lista');
    }

    init() {
      const self = this;

      $('#logTypeFilters').on('click', '.chip-button', function () {
        const type = $(this).attr('data-log-type') || 'all';
        state.type = type;
        state.limit = PAGE_SIZE;
        $('#logTypeFilters .chip-button').removeClass('is-active');
        $(this).addClass('is-active');
        self.render();
        self.add({
          type: 'filtros',
          action: 'FILTRAR BITÁCORAS',
          element: 'Tipo de evento',
          description: 'Filtro de bitácoras aplicado: ' + (TYPE_LABELS[type] || 'Todos') + '.',
          result: 'EXITOSO',
          meta: { filter: type }
        });
      });

      const debouncedLogSearch = LUMINA.debounce(function (term) {
        if (!term) return;
        self.add({
          type: 'filtros',
          action: 'BUSCAR',
          element: 'Bitácoras',
          description: 'Búsqueda en bitácoras: “' + term + '”.',
          result: 'INFO',
          meta: { term }
        });
      }, 850);

      $('#logSearch').on('input', function () {
        state.search = this.value;
        state.limit = PAGE_SIZE;
        self.render();
        debouncedLogSearch(this.value.trim());
      });

      $('#logDateFrom, #logDateTo').on('change', function () {
        state.dateFrom = $('#logDateFrom').val() || '';
        state.dateTo = $('#logDateTo').val() || '';
        state.limit = PAGE_SIZE;
        self.render();
        self.add({
          type: 'filtros',
          action: 'FILTRAR POR FECHA',
          element: 'Bitácoras',
          description: 'Rango de fechas aplicado en las bitácoras.',
          result: 'EXITOSO',
          meta: { from: state.dateFrom || 'sin límite', to: state.dateTo || 'sin límite' }
        });
      });

      $('#logSort').on('change', function () {
        state.sort = this.value;
        state.limit = PAGE_SIZE;
        self.render();
        self.add({
          type: 'filtros',
          action: 'ORDENAR',
          element: 'Bitácoras',
          description: 'Orden de los eventos cambiado a ' + (state.sort === 'old' ? 'antiguos primero' : 'recientes primero') + '.',
          result: 'EXITOSO',
          meta: { sort: state.sort }
        });
      });

      $('#clearLogFilters').on('click', function () {
        self.resetFilters();
        self.add({
          type: 'filtros',
          action: 'LIMPIAR FILTROS',
          element: 'Bitácoras',
          description: 'Se restablecieron todos los filtros de bitácoras.',
          result: 'EXITOSO',
          meta: { scope: 'bitacoras' }
        });
        LUMINA.toast('Filtros de bitácoras restablecidos.', 'info', 'Filtros limpios', { duration: 2200 });
      });

      $('#emptyLogsClear').on('click', function () {
        self.resetFilters();
      });

      $('#loadMoreLogs').on('click', function () {
        state.limit += PAGE_SIZE;
        self.render();
        self.add({
          type: 'jquery',
          action: 'MOSTRAR MÁS',
          element: 'Lista de bitácoras',
          description: 'El usuario cargó más eventos en el historial.',
          result: 'EXITOSO',
          meta: { visibleLimit: state.limit }
        });
      });

      $('#exportLogsCsv').on('click', () => self.exportCsv());
      $('#exportLogsJson').on('click', () => self.exportJson());

      $('#clearLogs').on('click', function () {
        LUMINA.confirm({
          title: '¿Limpiar todo el historial?',
          message: 'Se eliminarán los ' + self.logs.length + ' eventos guardados en este navegador. Después quedará registrada únicamente la acción de limpieza.',
          acceptLabel: 'Limpiar historial',
          tone: 'danger',
          onAccept() {
            const cleared = self.logs.length;
            self.logs = [];
            self.seen = Date.now();
            Storage.setRaw('logs_seen_ts', String(self.seen));
            self.persist();
            state.limit = PAGE_SIZE;
            self.render();
            self.add({
              type: 'sistema',
              action: 'LIMPIAR HISTORIAL',
              element: 'Bitácoras',
              description: 'Se eliminaron ' + cleared + ' eventos del historial local. Inicia un nuevo registro de actividad.',
              result: 'EXITOSO',
              meta: { eventosEliminados: cleared }
            });
            LUMINA.toast('El historial se limpió. La bitácora vuelve a registrar desde ahora.', 'success', 'Historial limpio');
          }
        });
      });

      // Registro inicial real de esta carga (no es un dato de ejemplo).
      this.add({
        type: 'sistema',
        action: 'INICIAR SESIÓN',
        element: 'Aplicación LÚMINA',
        description: 'Sesión de demostración iniciada en este navegador. Datos locales cargados correctamente.',
        result: 'EXITOSO',
        meta: {
          version: LUMINA.version,
          tema: document.documentElement.getAttribute('data-theme') || 'dark',
          almacenamiento: 'LocalStorage'
        }
      });

      this.updateMetrics();
      this.updateIndicators(false);
      this.render();
    }
  }

  const instance = new LogBook();
  LUMINA.Logs = instance;

  // Permite que otros módulos actualicen los indicadores sin recalcular todo.
  LUMINA.updateLogIndicators = function () {
    instance.updateIndicators(false);
    instance.updateMetrics();
  };
  LUMINA.refreshLogStats = function () {
    instance.updateMetrics();
    instance.render();
  };

  if ($) {
    $(document).ready(function () {
      instance.init();
    });
  } else {
    document.addEventListener('DOMContentLoaded', function () { instance.init(); });
  }
})(window, document);

/* =========================================================
   LÚMINA | Karaoke & Music Lounge
   validaciones.js — Validaciones reutilizables y contacto
   ========================================================= */
(function (window, document) {
  'use strict';

  const LUMINA = (window.LUMINA = window.LUMINA || {});
  const $ = window.jQuery;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_PATTERN = /^[67]\d{6,7}$/;

  const Validation = {
    required(value) {
      return String(value === null || typeof value === 'undefined' ? '' : value).trim().length > 0;
    },

    name(value) {
      const text = String(value || '').trim();
      if (!text) return 'Ingresa tu nombre completo.';
      if (text.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
      if (text.length > 60) return 'El nombre no puede superar los 60 caracteres.';
      if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/.test(text)) return 'El nombre solo puede incluir letras, espacios, guiones y puntos.';
      return '';
    },

    email(value) {
      const text = String(value || '').trim();
      if (!text) return 'Ingresa tu correo electrónico.';
      if (!EMAIL_PATTERN.test(text)) return 'Ingresa un correo válido, por ejemplo nombre@correo.com.';
      if (text.length > 120) return 'El correo es demasiado largo.';
      return '';
    },

    phone(value, required) {
      const raw = String(value || '').trim();
      if (!raw) return required ? 'Ingresa tu número de teléfono.' : '';
      let digits = raw.replace(/[\s()+.-]/g, '');
      if (digits.startsWith('591')) digits = digits.slice(3);
      if (!/^\d+$/.test(digits)) return 'El teléfono solo debe contener números y el prefijo +591.';
      if (!PHONE_PATTERN.test(digits)) return 'Ingresa un celular boliviano válido de 7 u 8 dígitos (ej. 71234567).';
      return '';
    },

    date(value, required) {
      if (!value) return required ? 'Selecciona una fecha para tu reserva.' : '';
      const selected = LUMINA.parseLocalDate(value);
      if (!selected) return 'La fecha no es válida.';
      const today = LUMINA.parseLocalDate(LUMINA.toLocalISO(new Date()));
      if (selected < today) return 'La fecha no puede ser anterior a hoy.';
      const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 120);
      if (selected > maxDate) return 'La fecha no puede superar los próximos 120 días.';
      return '';
    },

    time(value) {
      if (!value) return 'Selecciona una hora de inicio.';
      if (!/^\d{2}:\d{2}$/.test(value)) return 'La hora no tiene un formato válido.';
      const [hours, minutes] = value.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      if (totalMinutes < 12 * 60) return 'El horario de atención comienza a las 12:00.';
      if (totalMinutes > 22 * 60) return 'El último horario de inicio es a las 22:00.';
      return '';
    },

    hours(value) {
      const number = Number(value);
      if (!value || Number.isNaN(number)) return 'Indica cuántas horas deseas reservar.';
      if (!Number.isInteger(number)) return 'Las horas deben ser un número entero.';
      if (number < 1 || number > 6) return 'Puedes reservar entre 1 y 6 horas.';
      return '';
    },

    people(value, capacity) {
      const number = Number(value);
      if (!value || Number.isNaN(number)) return 'Indica cuántas personas asistirán.';
      if (!Number.isInteger(number)) return 'La cantidad de personas debe ser un número entero.';
      if (number < 1) return 'Debe haber al menos 1 persona.';
      if (capacity && number > capacity) return 'La sala seleccionada admite un máximo de ' + capacity + ' personas.';
      if (number > 30) return 'Para grupos de más de 30 personas, contáctanos directamente.';
      return '';
    },

    showError(input, message) {
      if (!input) return;
      const errorElement = document.getElementById('error-' + input.id);
      input.setAttribute('aria-invalid', 'true');
      const field = input.closest('.field') || input.closest('.check-field');
      if (field) field.classList.add('has-error');
      if (errorElement) {
        errorElement.textContent = message;
      }
    },

    clearError(input) {
      if (!input) return;
      const errorElement = document.getElementById('error-' + input.id);
      input.removeAttribute('aria-invalid');
      const field = input.closest('.field') || input.closest('.check-field');
      if (field) field.classList.remove('has-error');
      if (errorElement) errorElement.textContent = '';
    },

    clearFormErrors(form) {
      if (!form) return;
      form.querySelectorAll('.field.has-error, .check-field.has-error').forEach((field) => field.classList.remove('has-error'));
      form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
      form.querySelectorAll('[aria-invalid="true"]').forEach((input) => input.removeAttribute('aria-invalid'));
    },

    focusFirstError(form) {
      if (!form) return;
      const invalid = form.querySelector('[aria-invalid="true"]');
      if (invalid) {
        invalid.focus({ preventScroll: false });
        invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  LUMINA.Validation = Validation;

  /* ---------- Utilidades de formularios ---------- */
  function updateCounter(input, output, max) {
    if (!input || !output) return;
    output.textContent = String(Math.min(input.value.length, max || input.maxLength || 9999));
  }

  function initCounters() {
    const message = document.getElementById('contactMessage');
    const messageCounter = document.getElementById('contactMessageCounter');
    if (message && messageCounter) {
      message.addEventListener('input', () => updateCounter(message, messageCounter, 500));
    }

    const notes = document.getElementById('bookingNotes');
    const notesCounter = document.getElementById('notesCounter');
    if (notes && notesCounter) {
      notes.addEventListener('input', () => updateCounter(notes, notesCounter, 240));
    }
  }

  /* ---------- Formulario de contacto ---------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      name: document.getElementById('contactName'),
      email: document.getElementById('contactEmail'),
      phone: document.getElementById('contactPhone'),
      subject: document.getElementById('contactSubject'),
      message: document.getElementById('contactMessage'),
      privacy: document.getElementById('contactPrivacy')
    };

    const button = document.getElementById('contactSubmit');
    const success = document.getElementById('contactSuccess');
    let firstFocusLogged = false;

    const fieldLabels = {
      name: 'nombre',
      email: 'correo',
      phone: 'teléfono',
      subject: 'asunto',
      message: 'mensaje',
      privacy: 'privacidad'
    };

    function validate(showErrors) {
      const errors = {};
      const nameError = Validation.name(fields.name.value);
      const emailError = Validation.email(fields.email.value);
      const phoneError = Validation.phone(fields.phone.value, false);
      const subjectError = fields.subject.value ? '' : 'Selecciona el asunto de tu mensaje.';
      const messageValue = fields.message.value.trim();
      let messageError = '';
      if (!messageValue) {
        messageError = 'Escribe un mensaje para el equipo de Lúmina.';
      } else if (messageValue.length < 20) {
        messageError = 'El mensaje debe tener al menos 20 caracteres.';
      } else if (messageValue.length > 500) {
        messageError = 'El mensaje no puede superar los 500 caracteres.';
      }
      const privacyError = fields.privacy.checked ? '' : 'Debes aceptar la política de privacidad.';

      errors.name = nameError;
      errors.email = emailError;
      errors.phone = phoneError;
      errors.subject = subjectError;
      errors.message = messageError;
      errors.privacy = privacyError;

      Object.keys(errors).forEach((key) => {
        if (errors[key] && showErrors) {
          Validation.showError(fields[key], errors[key]);
        } else if (!showErrors && fields[key] && fields[key].getAttribute('aria-invalid') === 'true' && !errors[key]) {
          Validation.clearError(fields[key]);
        }
      });

      return Object.keys(errors).filter((key) => Boolean(errors[key]));
    }

    Object.keys(fields).forEach((key) => {
      const input = fields[key];
      if (!input) return;

      $(input)
        .on('focus', function () {
          if (!firstFocusLogged) {
            firstFocusLogged = true;
            LUMINA.log({
              type: 'formularios',
              action: 'ENFOCAR',
              element: 'Formulario de contacto',
              description: 'El usuario comenzó a completar el formulario de contacto.',
              result: 'INFO',
              meta: { form: 'contacto' }
            });
          }
        })
        .on('blur', function () {
          validate(true);
        });

      if (key !== 'privacy') {
        $(input).on('input change', function () {
          if (input.getAttribute('aria-invalid') === 'true') validate(true);
        });
      } else {
        $(input).on('change', function () {
          if (input.checked) Validation.clearError(input);
        });
      }
    });

    $(form).on('submit', function (event) {
      event.preventDefault();
      if (button.classList.contains('is-loading')) return;

      const invalid = validate(true);
      if (invalid.length) {
        Validation.focusFirstError(form);
        LUMINA.log({
          type: 'errores',
          action: 'VALIDAR CONTACTO',
          element: 'Formulario de contacto',
          description: 'Envío rechazado: ' + invalid.length + ' campo(s) con errores de validación.',
          result: 'FALLIDO',
          meta: { invalidFields: invalid.map((key) => fieldLabels[key]).join(', ') }
        });
        LUMINA.toast('Revisa los campos señalados antes de enviar.', 'error', 'Hay datos por corregir');
        return;
      }

      if (success) success.hidden = true;
      button.classList.add('is-loading');
      button.disabled = true;
      $(button).find('.button-label').html('<i class="bi bi-hourglass-split" aria-hidden="true"></i> Enviando…');

      LUMINA.log({
        type: 'formularios',
        action: 'ENVIAR',
        element: 'Formulario de contacto',
        description: 'Envío simulado del formulario de contacto iniciado. Asunto: ' + fields.subject.value + '.',
        result: 'INFO',
        meta: { form: 'contacto', subject: fields.subject.value }
      });

      window.setTimeout(function () {
        button.classList.remove('is-loading');
        button.disabled = false;
        $(button).find('.button-label').html('<i class="bi bi-send" aria-hidden="true"></i> Enviar mensaje');

        // Simulación local: no se envía ningún correo ni se contacta a un servidor.
        form.reset();
        Validation.clearFormErrors(form);
        updateCounter(fields.message, document.getElementById('contactMessageCounter'), 500);
        if (success) {
          success.hidden = false;
          if ($) $(success).hide().fadeIn(250);
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        LUMINA.log({
          type: 'formularios',
          action: 'SIMULAR ENVÍO',
          element: 'Formulario de contacto',
          description: 'Mensaje procesado localmente con éxito (simulación sin backend). No se envió correo real.',
          result: 'EXITOSO',
          meta: { form: 'contacto', sendMode: 'simulación local' }
        });
        LUMINA.toast('Tu mensaje fue procesado localmente. El envío es una simulación.', 'success', 'Mensaje enviado', { duration: 5200 });

        if (typeof LUMINA.refreshStorageStats === 'function') LUMINA.refreshStorageStats();
      }, 900);
    });
  }

  function init() {
    initCounters();
    initContactForm();
  }

  if ($) {
    $(document).ready(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})(window, document);

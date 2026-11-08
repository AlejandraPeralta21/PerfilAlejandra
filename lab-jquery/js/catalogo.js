/* =========================================================
   LÚMINA | Karaoke & Music Lounge
   catalogo.js — Catálogo, filtros, favoritos y mi lista
   ========================================================= */
(function (window, document) {
  'use strict';

  const LUMINA = (window.LUMINA = window.LUMINA || {});
  const $ = window.jQuery;
  const Storage = LUMINA.Storage;

  const CATEGORIES = [
    {
      id: 'romanticas', label: 'Románticas', icon: 'bi-heart', mood: 'cantar en pareja',
      subcategories: ['Baladas románticas', 'Pop romántico', 'Clásicos del amor']
    },
    {
      id: 'pop', label: 'Pop', icon: 'bi-stars', mood: 'encender la pista',
      subcategories: ['Pop latino', 'Pop en inglés', 'Pop español']
    },
    {
      id: 'regueton', label: 'Reguetón', icon: 'bi-lightning-charge', mood: 'subir la energía',
      subcategories: ['Reguetón clásico', 'Reguetón moderno', 'Perreo']
    },
    {
      id: 'rock', label: 'Rock', icon: 'bi-soundwave', mood: 'soltar la voz',
      subcategories: ['Rock en español', 'Rock en inglés', 'Rock clásico']
    },
    {
      id: 'baladas', label: 'Baladas', icon: 'bi-moon-stars', mood: 'un momento íntimo',
      subcategories: ['Baladas pop', 'Baladas rock', 'Baladas en inglés']
    },
    {
      id: 'cumbia', label: 'Cumbia', icon: 'bi-disc', mood: 'mover a todo el grupo',
      subcategories: ['Cumbia sonidera', 'Cumbia argentina', 'Cumbia boliviana']
    },
    {
      id: 'salsa', label: 'Salsa', icon: 'bi-vinyl', mood: 'demostrar el ritmo',
      subcategories: ['Salsa clásica', 'Salsa romántica', 'Salsa brava']
    },
    {
      id: 'urbana', label: 'Música urbana', icon: 'bi-broadcast', mood: 'cerrar la noche',
      subcategories: ['Trap', 'Reguetón clásico', 'Reguetón moderno']
    },
    {
      id: 'clasicos', label: 'Clásicos', icon: 'bi-hourglass-split', mood: 'compartir con todas las edades',
      subcategories: ['Boleros', 'Clásicos en español', 'Clásicos en inglés']
    },
    {
      id: 'ingles', label: 'Música en inglés', icon: 'bi-translate', mood: 'lucirte en inglés',
      subcategories: ['Pop inglés', 'Rock inglés', 'Baladas en inglés']
    }
  ];

  const SONGS = [
    { id: 's01', title: 'Noviembre sin ti', artist: 'Reik', category: 'romanticas', subcategory: 'Baladas románticas', duration: '3:34', seconds: 214, difficulty: 'Fácil' },
    { id: 's02', title: 'Me enamoré de ti', artist: 'Chayanne', category: 'romanticas', subcategory: 'Pop romántico', duration: '4:04', seconds: 244, difficulty: 'Media' },
    { id: 's03', title: 'Fuiste tú', artist: 'Ricardo Arjona & Gaby Moreno', category: 'romanticas', subcategory: 'Pop romántico', duration: '4:32', seconds: 272, difficulty: 'Media' },
    { id: 's04', title: 'Por amarte así', artist: 'Cristian Castro', category: 'romanticas', subcategory: 'Clásicos del amor', duration: '4:09', seconds: 249, difficulty: 'Media' },
    { id: 's05', title: 'Entra en mi vida', artist: 'Sin Bandera', category: 'romanticas', subcategory: 'Baladas románticas', duration: '4:00', seconds: 240, difficulty: 'Fácil' },
    { id: 's06', title: 'Amor de siempre', artist: 'Humbe', category: 'romanticas', subcategory: 'Pop romántico', duration: '3:19', seconds: 199, difficulty: 'Media' },

    { id: 's07', title: 'Bailando', artist: 'Enrique Iglesias', category: 'pop', subcategory: 'Pop latino', duration: '4:31', seconds: 271, difficulty: 'Fácil' },
    { id: 's08', title: 'Todo de Ti', artist: 'Rauw Alejandro', category: 'pop', subcategory: 'Pop latino', duration: '3:19', seconds: 199, difficulty: 'Fácil' },
    { id: 's09', title: 'La Camisa Negra', artist: 'Juanes', category: 'pop', subcategory: 'Pop español', duration: '3:36', seconds: 216, difficulty: 'Fácil' },
    { id: 's10', title: 'Shape of You', artist: 'Ed Sheeran', category: 'pop', subcategory: 'Pop en inglés', duration: '3:53', seconds: 233, difficulty: 'Fácil' },
    { id: 's11', title: 'Blinding Lights', artist: 'The Weeknd', category: 'pop', subcategory: 'Pop en inglés', duration: '3:20', seconds: 200, difficulty: 'Media' },
    { id: 's12', title: 'Flowers', artist: 'Miley Cyrus', category: 'pop', subcategory: 'Pop en inglés', duration: '3:20', seconds: 200, difficulty: 'Fácil' },

    { id: 's13', title: 'Gasolina', artist: 'Daddy Yankee', category: 'regueton', subcategory: 'Reguetón clásico', duration: '3:12', seconds: 192, difficulty: 'Fácil' },
    { id: 's14', title: 'Mayor Que Yo', artist: 'Wisin & Yandel', category: 'regueton', subcategory: 'Reguetón clásico', duration: '4:10', seconds: 250, difficulty: 'Media' },
    { id: 's15', title: 'Dákiti', artist: 'Bad Bunny & Jhayco', category: 'regueton', subcategory: 'Reguetón moderno', duration: '3:25', seconds: 205, difficulty: 'Fácil' },
    { id: 's16', title: 'Tití Me Preguntó', artist: 'Bad Bunny', category: 'regueton', subcategory: 'Reguetón moderno', duration: '4:03', seconds: 243, difficulty: 'Media' },
    { id: 's17', title: 'Tusa', artist: 'Karol G & Nicki Minaj', category: 'regueton', subcategory: 'Reguetón moderno', duration: '3:21', seconds: 201, difficulty: 'Media' },
    { id: 's18', title: 'Safaera', artist: 'Bad Bunny', category: 'regueton', subcategory: 'Perreo', duration: '4:55', seconds: 295, difficulty: 'Alta' },
    { id: 's19', title: 'Lala', artist: 'Myke Towers', category: 'regueton', subcategory: 'Reguetón moderno', duration: '3:18', seconds: 198, difficulty: 'Fácil' },

    { id: 's20', title: 'De Música Ligera', artist: 'Soda Stereo', category: 'rock', subcategory: 'Rock en español', duration: '3:33', seconds: 213, difficulty: 'Fácil' },
    { id: 's21', title: 'Persiana Americana', artist: 'Soda Stereo', category: 'rock', subcategory: 'Rock en español', duration: '4:48', seconds: 288, difficulty: 'Media' },
    { id: 's22', title: 'Smells Like Teen Spirit', artist: 'Nirvana', category: 'rock', subcategory: 'Rock en inglés', duration: '5:01', seconds: 301, difficulty: 'Alta' },
    { id: 's23', title: "Sweet Child O' Mine", artist: "Guns N' Roses", category: 'rock', subcategory: 'Rock en inglés', duration: '5:56', seconds: 356, difficulty: 'Alta' },
    { id: 's24', title: 'Bohemian Rhapsody', artist: 'Queen', category: 'rock', subcategory: 'Rock clásico', duration: '5:55', seconds: 355, difficulty: 'Alta' },
    { id: 's25', title: 'Highway to Hell', artist: 'AC/DC', category: 'rock', subcategory: 'Rock clásico', duration: '3:28', seconds: 208, difficulty: 'Media' },

    { id: 's26', title: 'El Triste', artist: 'José José', category: 'baladas', subcategory: 'Baladas pop', duration: '3:29', seconds: 209, difficulty: 'Alta' },
    { id: 's27', title: 'Amor Eterno', artist: 'Rocío Dúrcal', category: 'baladas', subcategory: 'Baladas pop', duration: '4:06', seconds: 246, difficulty: 'Media' },
    { id: 's28', title: 'Recuérdame', artist: 'Carlos Rivera', category: 'baladas', subcategory: 'Baladas pop', duration: '4:16', seconds: 256, difficulty: 'Media' },
    { id: 's29', title: 'My Heart Will Go On', artist: 'Celine Dion', category: 'baladas', subcategory: 'Baladas en inglés', duration: '4:40', seconds: 280, difficulty: 'Alta' },
    { id: 's30', title: 'I Will Always Love You', artist: 'Whitney Houston', category: 'baladas', subcategory: 'Baladas en inglés', duration: '4:31', seconds: 271, difficulty: 'Alta' },
    { id: 's31', title: 'Still Loving You', artist: 'Scorpions', category: 'baladas', subcategory: 'Baladas rock', duration: '6:26', seconds: 386, difficulty: 'Alta' },

    { id: 's32', title: 'Nunca Es Suficiente', artist: 'Los Ángeles Azules & Natalia Lafourcade', category: 'cumbia', subcategory: 'Cumbia sonidera', duration: '3:57', seconds: 237, difficulty: 'Fácil' },
    { id: 's33', title: 'El Listón de Tu Pelo', artist: 'Los Ángeles Azules', category: 'cumbia', subcategory: 'Cumbia sonidera', duration: '3:40', seconds: 220, difficulty: 'Fácil' },
    { id: 's34', title: 'Cómo Te Voy a Olvidar', artist: 'Los Ángeles Azules', category: 'cumbia', subcategory: 'Cumbia sonidera', duration: '3:33', seconds: 213, difficulty: 'Fácil' },
    { id: 's35', title: 'Soy Cordobés', artist: 'Rodrigo', category: 'cumbia', subcategory: 'Cumbia argentina', duration: '3:33', seconds: 213, difficulty: 'Media' },
    { id: 's36', title: 'La Mano de Dios', artist: 'Rodrigo', category: 'cumbia', subcategory: 'Cumbia argentina', duration: '4:04', seconds: 244, difficulty: 'Fácil' },
    { id: 's37', title: 'Llorando Se Fue', artist: 'Los Kjarkas', category: 'cumbia', subcategory: 'Cumbia boliviana', duration: '4:20', seconds: 260, difficulty: 'Media' },

    { id: 's38', title: 'Vivir Mi Vida', artist: 'Marc Anthony', category: 'salsa', subcategory: 'Salsa clásica', duration: '4:12', seconds: 252, difficulty: 'Fácil' },
    { id: 's39', title: 'Flor Pálida', artist: 'Marc Anthony', category: 'salsa', subcategory: 'Salsa romántica', duration: '4:38', seconds: 278, difficulty: 'Media' },
    { id: 's40', title: 'Te Va a Doler', artist: 'Maelo Ruiz', category: 'salsa', subcategory: 'Salsa romántica', duration: '4:40', seconds: 280, difficulty: 'Media' },
    { id: 's41', title: 'La Vida Es un Carnaval', artist: 'Celia Cruz', category: 'salsa', subcategory: 'Salsa clásica', duration: '4:36', seconds: 276, difficulty: 'Fácil' },
    { id: 's42', title: 'Pedro Navaja', artist: 'Rubén Blades', category: 'salsa', subcategory: 'Salsa brava', duration: '7:22', seconds: 442, difficulty: 'Alta' },
    { id: 's43', title: 'Devórame Otra Vez', artist: 'Lalo Rodríguez', category: 'salsa', subcategory: 'Salsa romántica', duration: '5:11', seconds: 311, difficulty: 'Alta' },

    { id: 's44', title: "She Don't Give a Fo", artist: 'Duki', category: 'urbana', subcategory: 'Trap', duration: '3:32', seconds: 212, difficulty: 'Media' },
    { id: 's45', title: 'Rockstar', artist: 'Duki', category: 'urbana', subcategory: 'Trap', duration: '3:08', seconds: 188, difficulty: 'Fácil' },
    { id: 's46', title: 'Goteo', artist: 'Duki', category: 'urbana', subcategory: 'Trap', duration: '2:44', seconds: 164, difficulty: 'Media' },
    { id: 's47', title: 'Mi Gente', artist: 'J Balvin & Willy William', category: 'urbana', subcategory: 'Reguetón clásico', duration: '3:09', seconds: 189, difficulty: 'Fácil' },
    { id: 's48', title: 'Bichota', artist: 'Karol G', category: 'urbana', subcategory: 'Reguetón moderno', duration: '2:58', seconds: 178, difficulty: 'Fácil' },
    { id: 's49', title: 'El Makinon', artist: 'Karol G & Mariah Angeliq', category: 'urbana', subcategory: 'Perreo', duration: '3:29', seconds: 209, difficulty: 'Media' },

    { id: 's50', title: 'Bésame Mucho', artist: 'Luis Miguel', category: 'clasicos', subcategory: 'Boleros', duration: '3:28', seconds: 208, difficulty: 'Media' },
    { id: 's51', title: 'Sabor a Mí', artist: 'Javier Solís', category: 'clasicos', subcategory: 'Boleros', duration: '2:57', seconds: 177, difficulty: 'Media' },
    { id: 's52', title: 'Volver, Volver', artist: 'Vicente Fernández', category: 'clasicos', subcategory: 'Clásicos en español', duration: '2:54', seconds: 174, difficulty: 'Fácil' },
    { id: 's53', title: 'La Bamba', artist: 'Ritchie Valens', category: 'clasicos', subcategory: 'Clásicos en español', duration: '2:05', seconds: 125, difficulty: 'Fácil' },
    { id: 's54', title: 'Hotel California', artist: 'Eagles', category: 'clasicos', subcategory: 'Clásicos en inglés', duration: '6:30', seconds: 390, difficulty: 'Media' },
    { id: 's55', title: 'Twist and Shout', artist: 'The Beatles', category: 'clasicos', subcategory: 'Clásicos en inglés', duration: '2:35', seconds: 155, difficulty: 'Fácil' },

    { id: 's56', title: 'Someone Like You', artist: 'Adele', category: 'ingles', subcategory: 'Baladas en inglés', duration: '4:45', seconds: 285, difficulty: 'Media' },
    { id: 's57', title: 'Rolling in the Deep', artist: 'Adele', category: 'ingles', subcategory: 'Pop inglés', duration: '3:48', seconds: 228, difficulty: 'Media' },
    { id: 's58', title: "Don't Stop Believin'", artist: 'Journey', category: 'ingles', subcategory: 'Rock inglés', duration: '4:11', seconds: 251, difficulty: 'Media' },
    { id: 's59', title: 'I Want It That Way', artist: 'Backstreet Boys', category: 'ingles', subcategory: 'Pop inglés', duration: '3:33', seconds: 213, difficulty: 'Fácil' },
    { id: 's60', title: 'Dancing Queen', artist: 'ABBA', category: 'ingles', subcategory: 'Pop inglés', duration: '3:51', seconds: 231, difficulty: 'Fácil' },
    { id: 's61', title: 'Uptown Funk', artist: 'Mark Ronson & Bruno Mars', category: 'ingles', subcategory: 'Pop inglés', duration: '4:30', seconds: 270, difficulty: 'Media' }
  ].map((song, index) => Object.assign({}, song, {
    order: index,
    cover: 'assets/imagenes/cover-' + song.category + '.svg'
  }));

  const categoryMap = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]));

  function normalizeText(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function difficultyClass(difficulty) {
    return 'difficulty-' + normalizeText(difficulty).replace(/\s+/g, '-');
  }

  const state = {
    search: '',
    category: 'all',
    subcategory: '',
    artist: '',
    sort: 'relevance',
    favoritesOnly: false,
    myListOnly: false
  };

  class Catalog {
    constructor() {
      this.favorites = new Set(Storage.get('favorites', []));
      this.myList = new Set(Storage.get('my_list', []));
      this.currentSongId = null;
      this.searchLogTimer = null;
    }

    persistCollections() {
      Storage.set('favorites', Array.from(this.favorites));
      Storage.set('my_list', Array.from(this.myList));
      this.updateCollectionCounts();
      if (LUMINA.refreshStorageStats) LUMINA.refreshStorageStats();
    }

    updateCollectionCounts() {
      const favoritesEl = document.getElementById('favoritesCount');
      const listEl = document.getElementById('myListCount');
      if (favoritesEl) favoritesEl.textContent = String(this.favorites.size);
      if (listEl) listEl.textContent = String(this.myList.size);
      const favButton = document.getElementById('showFavorites');
      const listButton = document.getElementById('showMyList');
      if (favButton) {
        favButton.classList.toggle('is-active', state.favoritesOnly);
        favButton.setAttribute('aria-pressed', String(state.favoritesOnly));
      }
      if (listButton) {
        listButton.classList.toggle('is-active', state.myListOnly);
        listButton.setAttribute('aria-pressed', String(state.myListOnly));
      }
    }

    getArtistPool() {
      let songs = SONGS;
      if (state.category !== 'all') songs = songs.filter((song) => song.category === state.category);
      if (state.subcategory) songs = songs.filter((song) => song.subcategory === state.subcategory);
      return Array.from(new Set(songs.map((song) => song.artist))).sort((a, b) => a.localeCompare(b, 'es'));
    }

    populateSubcategories() {
      const select = document.getElementById('subcategoryFilter');
      if (!select) return;
      const category = categoryMap[state.category];
      const subcategories = category ? category.subcategories : Array.from(new Set(SONGS.map((song) => song.subcategory))).sort((a, b) => a.localeCompare(b, 'es'));
      if (state.subcategory && !subcategories.includes(state.subcategory)) state.subcategory = '';
      select.innerHTML = '<option value="">Todas las subcategorías</option>' +
        subcategories.map((subcategory) => '<option value="' + LUMINA.escapeHtml(subcategory) + '">' + LUMINA.escapeHtml(subcategory) + '</option>').join('');
      select.value = state.subcategory;
    }

    populateArtists() {
      const select = document.getElementById('artistFilter');
      if (!select) return;
      const artists = this.getArtistPool();
      if (state.artist && !artists.includes(state.artist)) state.artist = '';
      select.innerHTML = '<option value="">Todos los artistas</option>' +
        artists.map((artist) => '<option value="' + LUMINA.escapeHtml(artist) + '">' + LUMINA.escapeHtml(artist) + '</option>').join('');
      select.value = state.artist;
    }

    renderCategories() {
      const container = document.getElementById('categoryChips');
      if (!container) return;
      container.innerHTML =
        '<button class="chip-button' + (state.category === 'all' ? ' is-active' : '') + '" type="button" data-category="all" aria-pressed="' + (state.category === 'all') + '"><i class="bi bi-grid-3x3-gap" aria-hidden="true"></i> Todas</button>' +
        CATEGORIES.map((category) =>
          '<button class="chip-button' + (state.category === category.id ? ' is-active' : '') + '" type="button" data-category="' + category.id + '" aria-pressed="' + (state.category === category.id) + '">' +
            '<i class="bi ' + category.icon + '" aria-hidden="true"></i> ' + LUMINA.escapeHtml(category.label) +
          '</button>'
        ).join('');
    }

    getFilteredSongs() {
      const search = normalizeText(state.search.trim());
      let songs = SONGS.filter((song) => {
        if (state.category !== 'all' && song.category !== state.category) return false;
        if (state.subcategory && song.subcategory !== state.subcategory) return false;
        if (state.artist && song.artist !== state.artist) return false;
        if (state.favoritesOnly && !this.favorites.has(song.id)) return false;
        if (state.myListOnly && !this.myList.has(song.id)) return false;
        if (search) {
          const haystack = normalizeText([song.title, song.artist, song.subcategory, categoryMap[song.category]?.label].join(' '));
          if (!haystack.includes(search)) return false;
        }
        return true;
      });

      if (state.sort === 'az') songs.sort((a, b) => a.title.localeCompare(b.title, 'es'));
      if (state.sort === 'za') songs.sort((a, b) => b.title.localeCompare(a.title, 'es'));
      if (state.sort === 'artist') songs.sort((a, b) => a.artist.localeCompare(b.artist, 'es') || a.title.localeCompare(b.title, 'es'));
      if (state.sort === 'duration') songs.sort((a, b) => a.seconds - b.seconds);

      return songs;
    }

    songCardHtml(song) {
      const category = categoryMap[song.category];
      const isFavorite = this.favorites.has(song.id);
      const isListed = this.myList.has(song.id);
      return (
        '<article class="song-card' + (isFavorite ? ' is-favorite' : '') + '" data-song-id="' + song.id + '">' +
          '<div class="song-cover">' +
            '<img src="' + LUMINA.escapeHtml(song.cover) + '" data-fallback="assets/imagenes/cover-fallback.svg" alt="Portada de ' + LUMINA.escapeHtml(song.title) + '" loading="lazy">' +
            '<span class="song-genre-badge">' + LUMINA.escapeHtml(category.label) + '</span>' +
            '<button class="song-favorite' + (isFavorite ? ' is-favorite' : '') + '" type="button" data-action="favorite" data-song-id="' + song.id + '" aria-pressed="' + isFavorite + '" aria-label="' + (isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos') + ': ' + LUMINA.escapeHtml(song.title) + '" title="' + (isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos') + '">' +
              '<i class="bi ' + (isFavorite ? 'bi-heart-fill' : 'bi-heart') + '" aria-hidden="true"></i>' +
            '</button>' +
            '<div class="song-cover-foot">' +
              '<span><i class="bi bi-clock" aria-hidden="true"></i> ' + LUMINA.escapeHtml(song.duration) + '</span>' +
              '<span><i class="bi bi-soundwave" aria-hidden="true"></i> ' + LUMINA.escapeHtml(song.subcategory) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="song-card-body">' +
            '<h3 class="song-title" title="' + LUMINA.escapeHtml(song.title) + '">' + LUMINA.escapeHtml(song.title) + '</h3>' +
            '<p class="song-artist">' + LUMINA.escapeHtml(song.artist) + '</p>' +
            '<div class="song-tags">' +
              '<span class="song-tag difficulty ' + difficultyClass(song.difficulty) + '">' + LUMINA.escapeHtml(song.difficulty) + '</span>' +
              '<span class="song-tag">' + LUMINA.escapeHtml(category.label) + '</span>' +
            '</div>' +
            '<div class="song-card-actions">' +
              '<button class="btn song-details-button" type="button" data-action="details" data-song-id="' + song.id + '"><i class="bi bi-eye" aria-hidden="true"></i> Ver detalles</button>' +
              '<button class="btn song-list-button' + (isListed ? ' is-added' : '') + '" type="button" data-action="list" data-song-id="' + song.id + '" aria-pressed="' + isListed + '" aria-label="' + (isListed ? 'Quitar de mi lista' : 'Agregar a mi lista') + ': ' + LUMINA.escapeHtml(song.title) + '" title="' + (isListed ? 'Quitar de mi lista' : 'Agregar a mi lista') + '">' +
                '<i class="bi ' + (isListed ? 'bi-check-lg' : 'bi-plus-lg') + '" aria-hidden="true"></i>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }

    render() {
      const grid = document.getElementById('songGrid');
      const empty = document.getElementById('catalogEmpty');
      const count = document.getElementById('resultsCount');
      const filterList = document.getElementById('activeFilterList');
      if (!grid) return;

      const songs = this.getFilteredSongs();
      grid.innerHTML = songs.map((song) => this.songCardHtml(song)).join('');
      if (empty) empty.hidden = songs.length !== 0;
      if (count) {
        const label = songs.length === 1 ? 'canción' : 'canciones';
        count.innerHTML = '<strong>' + songs.length + '</strong> ' + label + ' · de ' + SONGS.length + ' en el catálogo';
      }

      if (filterList) {
        const tags = [];
        if (state.category !== 'all') tags.push(categoryMap[state.category]?.label || state.category);
        if (state.subcategory) tags.push(state.subcategory);
        if (state.artist) tags.push(state.artist);
        if (state.search) tags.push('“' + state.search + '”');
        if (state.favoritesOnly) tags.push('Favoritos');
        if (state.myListOnly) tags.push('Mi lista');
        filterList.innerHTML = tags.map((tag) => '<span class="filter-tag">' + LUMINA.escapeHtml(tag) + '</span>').join('');
      }

      this.updateCollectionCounts();
    }

    applyCategory(categoryId) {
      state.category = categoryId;
      state.subcategory = '';
      state.artist = '';
      this.renderCategories();
      this.populateSubcategories();
      this.populateArtists();
      this.render();

      const label = categoryId === 'all' ? 'Todas las categorías' : categoryMap[categoryId]?.label;
      LUMINA.log({
        type: 'filtros',
        action: 'SELECCIONAR CATEGORÍA',
        element: 'Catálogo musical',
        description: 'Categoría seleccionada: ' + label + '.',
        result: 'EXITOSO',
        meta: { category: categoryId }
      });
    }

    clearFilters(logAction) {
      state.search = '';
      state.category = 'all';
      state.subcategory = '';
      state.artist = '';
      state.sort = 'relevance';
      state.favoritesOnly = false;
      state.myListOnly = false;

      const search = document.getElementById('songSearch');
      const sort = document.getElementById('sortSongs');
      if (search) search.value = '';
      if (sort) sort.value = 'relevance';
      this.renderCategories();
      this.populateSubcategories();
      this.populateArtists();
      this.render();

      LUMINA.log({
        type: 'filtros',
        action: logAction || 'LIMPIAR FILTROS',
        element: 'Catálogo musical',
        description: 'Se restablecieron todos los filtros y colecciones del catálogo.',
        result: 'EXITOSO',
        meta: { section: 'catalogo' }
      });
    }

    toggleFavorite(songId) {
      const song = SONGS.find((item) => item.id === songId);
      if (!song) return;
      if (this.favorites.has(songId)) {
        this.favorites.delete(songId);
        LUMINA.log({
          type: 'favoritos',
          action: 'QUITAR FAVORITO',
          element: song.title,
          description: 'Canción eliminada de favoritos: ' + song.title + ' — ' + song.artist + '.',
          result: 'EXITOSO',
          meta: { songId, artist: song.artist }
        });
        LUMINA.toast('Se quitó “' + song.title + '” de tus favoritos.', 'info', 'Favoritos actualizados', { duration: 2400 });
      } else {
        this.favorites.add(songId);
        LUMINA.log({
          type: 'favoritos',
          action: 'AGREGAR FAVORITO',
          element: song.title,
          description: 'Canción agregada a favoritos: ' + song.title + ' — ' + song.artist + '.',
          result: 'EXITOSO',
          meta: { songId, artist: song.artist }
        });
        LUMINA.toast('“' + song.title + '” está en tus favoritos.', 'success', 'Favorito agregado', { duration: 2600 });
      }
      this.persistCollections();
      this.render();
      if (this.currentSongId === songId) this.syncModalButtons();
    }

    toggleMyList(songId) {
      const song = SONGS.find((item) => item.id === songId);
      if (!song) return;
      if (this.myList.has(songId)) {
        this.myList.delete(songId);
        LUMINA.log({
          type: 'favoritos',
          action: 'QUITAR DE MI LISTA',
          element: song.title,
          description: 'Canción eliminada de Mi lista: ' + song.title + ' — ' + song.artist + '.',
          result: 'EXITOSO',
          meta: { songId, artist: song.artist }
        });
        LUMINA.toast('Canción retirada de Mi lista.', 'info', 'Lista actualizada', { duration: 2300 });
      } else {
        this.myList.add(songId);
        LUMINA.log({
          type: 'favoritos',
          action: 'AGREGAR A MI LISTA',
          element: song.title,
          description: 'Canción agregada a Mi lista: ' + song.title + ' — ' + song.artist + '.',
          result: 'EXITOSO',
          meta: { songId, artist: song.artist }
        });
        LUMINA.toast('“' + song.title + '” se sumó a tu lista de karaoke.', 'success', 'Mi lista actualizada', { duration: 2600 });
      }
      this.persistCollections();
      this.render();
      if (this.currentSongId === songId) this.syncModalButtons();
    }

    openSongDetails(songId) {
      const song = SONGS.find((item) => item.id === songId);
      if (!song) return;
      const category = categoryMap[song.category];
      this.currentSongId = songId;

      const cover = document.getElementById('songModalCover');
      if (cover) {
        cover.src = song.cover;
        cover.alt = 'Portada de ' + song.title;
        cover.setAttribute('data-fallback', 'assets/imagenes/cover-fallback.svg');
      }
      const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      };
      setText('songModalGenre', category.label);
      setText('songModalSubgenre', song.subcategory);
      setText('songModalTitle', song.title);
      setText('songModalArtist', song.artist);
      setText('songModalDescription', category.label + ' · ' + song.subcategory + '. Una canción ideal para ' + category.mood + ' y demostrar tu estilo en el escenario de Lúmina.');
      setText('songModalDuration', song.duration);
      setText('songModalDifficulty', song.difficulty);
      setText('songModalCategory', category.label);
      setText('songModalMood', LUMINA.capitalize(category.mood));

      this.syncModalButtons();
      LUMINA.Modal.open('songModal', { focus: '.modal-close' });
      LUMINA.log({
        type: 'jquery',
        action: 'ABRIR MODAL',
        element: 'Detalle de canción',
        description: 'Se abrió el detalle de “' + song.title + '” mediante un evento jQuery.',
        result: 'EXITOSO',
        meta: { songId, modal: 'songModal' }
      });
    }

    syncModalButtons() {
      const songId = this.currentSongId;
      if (!songId) return;
      const favoriteButton = document.getElementById('songModalFavorite');
      const listButton = document.getElementById('songModalList');
      const isFavorite = this.favorites.has(songId);
      const isListed = this.myList.has(songId);

      if (favoriteButton) {
        favoriteButton.className = isFavorite ? 'btn btn-danger-quiet' : 'btn btn-gold';
        favoriteButton.innerHTML = '<i class="bi ' + (isFavorite ? 'bi-heart-fill' : 'bi-heart') + '" aria-hidden="true"></i> ' +
          (isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos');
      }
      if (listButton) {
        listButton.className = isListed ? 'btn btn-outline-gold' : 'btn btn-glass';
        listButton.innerHTML = '<i class="bi ' + (isListed ? 'bi-check-lg' : 'bi-plus-lg') + '" aria-hidden="true"></i> ' +
          (isListed ? 'En mi lista' : 'Agregar a mi lista');
      }
    }

    bindEvents() {
      const self = this;

      $('#categoryChips').on('click', '.chip-button', function () {
        self.applyCategory(this.getAttribute('data-category'));
      });

      $('#subcategoryFilter').on('change', function () {
        state.subcategory = this.value;
        state.artist = '';
        self.populateArtists();
        self.render();
        self.addFilterLog('FILTRAR SUBCATEGORÍA', 'Subcategoría seleccionada: ' + (this.value || 'todas') + '.', { subcategory: this.value || 'all' });
      });

      $('#artistFilter').on('change', function () {
        state.artist = this.value;
        self.render();
        self.addFilterLog('FILTRAR ARTISTA', 'Artista seleccionado: ' + (this.value || 'todos') + '.', { artist: this.value || 'all' });
      });

      $('#sortSongs').on('change', function () {
        state.sort = this.value;
        self.render();
        self.addFilterLog('ORDENAR CATÁLOGO', 'Orden del catálogo actualizado a ' + this.options[this.selectedIndex].text + '.', { sort: this.value });
      });

      const debouncedSearchLog = LUMINA.debounce(function (term) {
        if (!term) return;
        self.addFilterLog('BUSCAR CANCIÓN', 'Búsqueda en catálogo: “' + term + '”.', { term });
      }, 800);

      $('#songSearch').on('input', function () {
        state.search = this.value;
        self.render();
        debouncedSearchLog(this.value.trim());
      }).on('keyup', function (event) {
        if (event.key === 'Escape') {
          this.value = '';
          state.search = '';
          self.render();
          this.blur();
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          self.addFilterLog('BUSCAR CANCIÓN', 'Búsqueda confirmada con Enter: “' + this.value.trim() + '”.', { term: this.value.trim() || 'vacía', method: 'keyup' });
        }
      });

      $('#showFavorites').on('click', function () {
        state.favoritesOnly = !state.favoritesOnly;
        if (state.favoritesOnly) state.myListOnly = false;
        self.render();
        self.updateCollectionCounts();
        self.addFilterLog(
          state.favoritesOnly ? 'MOSTRAR FAVORITOS' : 'OCULTAR FAVORITOS',
          state.favoritesOnly ? 'El catálogo ahora muestra solo las canciones favoritas.' : 'Se mostró nuevamente el catálogo completo.',
          { favoritesOnly: state.favoritesOnly }
        );
      });

      $('#showMyList').on('click', function () {
        state.myListOnly = !state.myListOnly;
        if (state.myListOnly) state.favoritesOnly = false;
        self.render();
        self.updateCollectionCounts();
        self.addFilterLog(
          state.myListOnly ? 'MOSTRAR MI LISTA' : 'OCULTAR MI LISTA',
          state.myListOnly ? 'El catálogo ahora muestra solo las canciones añadidas a Mi lista.' : 'Se mostró nuevamente el catálogo completo.',
          { myListOnly: state.myListOnly }
        );
      });

      $('#clearCatalogFilters, #emptyClearFilters').on('click', function () {
        self.clearFilters();
        LUMINA.toast('Filtros y colecciones restablecidos.', 'info', 'Catálogo completo', { duration: 2300 });
      });

      $('#songGrid').on('click', '[data-action]', function (event) {
        event.preventDefault();
        const action = this.getAttribute('data-action');
        const songId = this.getAttribute('data-song-id');
        if (action === 'favorite') self.toggleFavorite(songId);
        if (action === 'list') self.toggleMyList(songId);
        if (action === 'details') self.openSongDetails(songId);
      });

      $('#songModalFavorite').on('click', function () {
        if (self.currentSongId) self.toggleFavorite(self.currentSongId);
      });

      $('#songModalList').on('click', function () {
        if (self.currentSongId) self.toggleMyList(self.currentSongId);
      });
    }

    addFilterLog(action, description, meta) {
      LUMINA.log({
        type: 'filtros',
        action,
        element: 'Catálogo musical',
        description,
        result: 'INFO',
        meta: meta || {}
      });
    }

    init() {
      this.renderCategories();
      this.populateSubcategories();
      this.populateArtists();
      this.updateCollectionCounts();
      this.bindEvents();
      this.render();
      LUMINA.catalog = this;
    }
  }

  LUMINA.categories = CATEGORIES;
  LUMINA.songs = SONGS;

  const catalog = new Catalog();

  if ($) {
    $(document).ready(function () { catalog.init(); });
  } else {
    document.addEventListener('DOMContentLoaded', function () { catalog.init(); });
  }
})(window, document);

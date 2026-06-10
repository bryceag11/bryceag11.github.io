/* ── Photo Modal ──
   Opens gallery as an overlay on the Adventures page.
   Uses inline onclick via innerHTML so Magnific Popup cannot intercept. */

var PhotoModal = (function() {
  var overlay, modal, stage, img, counter, thumbStrip, titleEl, locEl, albumNav;
  var imgs = [], cur = 0, curSlug = '', curType = '';
  var allSlugs = [], allTypes = [];
  var tx = 0, built = false, isOpen = false, isFS = false;

  function build() {
    if (built) return;
    overlay = document.createElement('div');
    overlay.className = 'pm-overlay';
    overlay.id = 'pm-overlay';
    overlay.innerHTML =
      '<div class="pm-modal" id="pm-modal">' +
        '<div class="pm-header">' +
          '<button class="pm-album-arr pm-album-arr--l" onclick="PhotoModal.prevAlbum(event)" type="button" aria-label="Previous album">&lsaquo;</button>' +
          '<div class="pm-header-text">' +
            '<span class="pm-title" id="pm-title"></span>' +
            '<span class="pm-loc" id="pm-loc"></span>' +
          '</div>' +
          '<button class="pm-album-arr pm-album-arr--r" onclick="PhotoModal.nextAlbum(event)" type="button" aria-label="Next album">&rsaquo;</button>' +
          '<button class="pm-fs-btn" onclick="PhotoModal.fullscreen(event)" type="button" aria-label="Fullscreen" title="Fullscreen">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>' +
          '</button>' +
          '<button class="pm-close" onclick="PhotoModal.close(event)" type="button" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="pm-stage" id="pm-stage">' +
          '<button class="pm-arr pm-arr--l" onclick="PhotoModal.prev(event)" type="button" aria-label="Previous">&lsaquo;</button>' +
          '<img id="pm-img" draggable="false" alt="">' +
          '<button class="pm-arr pm-arr--r" onclick="PhotoModal.next(event)" type="button" aria-label="Next">&rsaquo;</button>' +
        '</div>' +
        '<div class="pm-count" id="pm-count"></div>' +
        '<div class="pm-thumbs" id="pm-thumbs"></div>' +
      '</div>';

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) PhotoModal.close(e);
    });

    document.body.appendChild(overlay);

    img = document.getElementById('pm-img');
    counter = document.getElementById('pm-count');
    thumbStrip = document.getElementById('pm-thumbs');
    titleEl = document.getElementById('pm-title');
    locEl = document.getElementById('pm-loc');
    stage = document.getElementById('pm-stage');
    modal = document.getElementById('pm-modal');

    /* Swipe */
    stage.addEventListener('touchstart', function(e) { tx = e.changedTouches[0].screenX; }, { passive: true });
    stage.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].screenX - tx;
      if (Math.abs(dx) > 40) { dx > 0 ? show(cur - 1) : show(cur + 1); }
    });

    built = true;
  }

  function buildAlbumList(type) {
    allSlugs = [];
    allTypes = [];
    var data = window.PHOTOGRAPHY_DATA;
    if (!data) return;
    var list = type === 'film' ? (data.film || []) : (data.digital || []);
    list.forEach(function(e) {
      allSlugs.push(e.slug);
      allTypes.push(type);
    });
    /* Also include the other type */
    var other = type === 'film' ? (data.digital || []) : (data.film || []);
    var otherType = type === 'film' ? 'digital' : 'film';
    other.forEach(function(e) {
      allSlugs.push(e.slug);
      allTypes.push(otherType);
    });
  }

  function lookupEntry(slug, type) {
    var data = window.PHOTOGRAPHY_DATA;
    if (!data) return null;
    var list = type === 'film' ? (data.film || []) : (data.digital || []);
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) return list[i];
    }
    return null;
  }

  function show(i) {
    cur = ((i % imgs.length) + imgs.length) % imgs.length;
    img.classList.add('pm-loading');
    img.onload = function() { img.classList.remove('pm-loading'); };
    img.src = imgs[cur];
    counter.textContent = (cur + 1) + ' / ' + imgs.length;
    var all = thumbStrip.children;
    for (var j = 0; j < all.length; j++) {
      if (j === cur) {
        all[j].classList.add('on');
        all[j].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        all[j].classList.remove('on');
      }
    }
    /* Preload adjacent */
    if (imgs.length > 1) {
      var next = (cur + 1) % imgs.length;
      var prev = (cur - 1 + imgs.length) % imgs.length;
      new Image().src = imgs[next];
      new Image().src = imgs[prev];
    }
  }

  function stop(e) { if (e) { e.preventDefault(); e.stopPropagation(); } }

  function loadAlbum(slug, type) {
    curSlug = slug;
    curType = type;
    var imgData = window.PHOTOGRAPHY_IMAGES;
    imgs = (imgData && imgData[slug]) ? imgData[slug].slice() : [];

    /* Fix paths */
    imgs = imgs.map(function(p) {
      if (!p) return p;
      if (p.indexOf('://') !== -1) return p;
      return p.charAt(0) === '/' ? p : '/' + p;
    });

    if (imgs.length === 0) {
      /* Fallback: navigate to gallery page */
      window.location.href = '/photography/' + type + '/' + slug + '/';
      return false;
    }

    var entry = lookupEntry(slug, type);
    var collTitle = type === 'film' ? '35mm' : 'Digital';
    titleEl.textContent = collTitle + ' · ' + (entry ? entry.title : slug);
    locEl.textContent = entry ? entry.location : '';

    /* Build thumbs */
    var html = '';
    for (var i = 0; i < imgs.length; i++) {
      html += '<img class="pm-th' + (i === 0 ? ' on' : '') + '" src="' + imgs[i] + '" onclick="PhotoModal.go(' + i + ',event)" draggable="false" alt="Thumbnail ' + (i+1) + '">';
    }
    thumbStrip.innerHTML = html;

    cur = 0;
    img.src = imgs[0];
    counter.textContent = '1 / ' + imgs.length;

    return true;
  }

  /* Keyboard handler */
  function onKey(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { PhotoModal.close(e); return; }
    if (e.key === 'ArrowLeft') { stop(e); show(cur - 1); }
    if (e.key === 'ArrowRight') { stop(e); show(cur + 1); }
  }

  return {
    open: function(slug, type, e) {
      stop(e);
      build();
      buildAlbumList(type);
      if (!loadAlbum(slug, type)) return;
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      isOpen = true;
      document.addEventListener('keydown', onKey);
      history.pushState({ pm: true, slug: slug, type: type }, '', '/photography/' + type + '/' + slug + '/');
    },

    close: function(e) {
      stop(e);
      if (!isOpen) return;
      if (isFS) PhotoModal.fullscreen(e);
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      isOpen = false;
      document.removeEventListener('keydown', onKey);
      if (history.state && history.state.pm) {
        history.pushState(null, '', '/photography/');
      }
    },

    go: function(i, e) { stop(e); show(i); },
    next: function(e) { stop(e); show(cur + 1); },
    prev: function(e) { stop(e); show(cur - 1); },

    nextAlbum: function(e) {
      stop(e);
      var idx = allSlugs.indexOf(curSlug);
      if (idx === -1) return;
      var next = (idx + 1) % allSlugs.length;
      loadAlbum(allSlugs[next], allTypes[next]);
      buildAlbumList(allTypes[next]);
      history.replaceState({ pm: true, slug: allSlugs[next], type: allTypes[next] }, '', '/photography/' + allTypes[next] + '/' + allSlugs[next] + '/');
    },

    prevAlbum: function(e) {
      stop(e);
      var idx = allSlugs.indexOf(curSlug);
      if (idx === -1) return;
      var prev = (idx - 1 + allSlugs.length) % allSlugs.length;
      loadAlbum(allSlugs[prev], allTypes[prev]);
      buildAlbumList(allTypes[prev]);
      history.replaceState({ pm: true, slug: allSlugs[prev], type: allTypes[prev] }, '', '/photography/' + allTypes[prev] + '/' + allSlugs[prev] + '/');
    },

    fullscreen: function(e) {
      stop(e);
      if (!modal) return;
      isFS = !isFS;
      modal.classList.toggle('pm-fs', isFS);
    },

    isOpen: function() { return isOpen; }
  };
})();

/* Back button support */
window.addEventListener('popstate', function() {
  if (PhotoModal.isOpen()) PhotoModal.close();
});

/* Hook into card clicks */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.photo-card a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var card = link.closest('.photo-card');
      if (!card) return;
      var slug = card.getAttribute('data-photo-marker');
      if (!slug) return;
      var section = card.closest('.photography-section');
      var type = 'film';
      if (section && section.id === 'digital-stories') type = 'digital';
      e.preventDefault();
      e.stopPropagation();
      PhotoModal.open(slug, type, e);
    });
  });
});

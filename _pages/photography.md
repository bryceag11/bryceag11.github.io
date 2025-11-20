---
layout: single
title: "Photography"
permalink: /photography/
classes: photography
author_profile: false
---

{% assign photo = site.data.photography %}

<div class="photography-hero">
  <div>
    <p class="photography-hero__eyebrow">35mm & Digital Photography</p>
    <p>Outside of my research, I love urbex, adrenaline, and film photography. Explore this to see what I've captured. UNDER CONSTRUCTION</p>
    <div class="photography-cta">
      <a class="btn" href="#film-stories">35mm Stories</a>
      <a class="btn btn--outline" href="#digital-stories">Digital Series</a>
    </div>
  </div>
</div>

<div class="photography-toggle" role="group" aria-label="Toggle map between film and digital">
  <button class="photography-toggle__button is-active" data-photo-mode="film">35mm Film</button>
  <button class="photography-toggle__button" data-photo-mode="digital">Digital</button>
</div>

<div class="photography-globe">
  <div id="photo-globe" aria-live="polite"></div>
  <!-- Globe legend removed for cleaner display -->
  <div id="photo-globe-tooltip" class="photo-globe-tooltip" hidden></div>
</div>

<section id="film-stories" class="photography-section" aria-labelledby="film-heading">
  <!-- Film section header removed for cleaner display -->
  <div class="photo-card-grid">
    {% for entry in photo.film %}
      {% assign cover = entry.cover %}
      {% if cover %}
        {% unless cover contains '://' %}
          {% assign cover = cover | relative_url %}
        {% endunless %}
      {% endif %}
      <article class="photo-card" data-photo-marker="{{ entry.slug }}">
        <a href="{{ '/photography/film/' | append: entry.slug | append: '/' | relative_url }}">
          <div class="photo-card-image" style="background-image: url('{{ cover }}');"></div>
          <div class="photo-card-body">
            <h3>{{ entry.title }}</h3>
            <p>{{ entry.description }}</p>
            <p class="photo-card-location">{{ entry.location }}</p>
          </div>
        </a>
      </article>
    {% endfor %}
  </div>
</section>

<section id="digital-stories" class="photography-section" aria-labelledby="digital-heading">
  <!-- Digital section header removed for cleaner display -->
  <div class="photo-card-grid">
    {% for entry in photo.digital %}
      {% assign cover = entry.cover %}
      {% if cover %}
        {% unless cover contains '://' %}
          {% assign cover = cover | relative_url %}
        {% endunless %}
      {% endif %}
      <article class="photo-card photo-card--digital" data-photo-marker="{{ entry.slug }}">
        <a href="{{ '/photography/digital/' | append: entry.slug | append: '/' | relative_url }}">
          <div class="photo-card-image" style="background-image: url('{{ cover }}');"></div>
          <div class="photo-card-body">
            <h3>{{ entry.title }}</h3>
            <p>{{ entry.description }}</p>
            <p class="photo-card-location">{{ entry.location }}</p>
          </div>
        </a>
      </article>
    {% endfor %}
  </div>
</section>

<script>
  window.PHOTOGRAPHY_DATA = {{ photo | jsonify }};
</script>
<!-- Load Three.js from CDN with local fallback -->
<script src="https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.min.js"></script>
<script>
  // Fallback to local if CDN fails
  if (typeof THREE === 'undefined') {
    var script = document.createElement('script');
    script.src = '{{ "/assets/js/vendor/three.min.js" | relative_url }}';
    document.head.appendChild(script);
  }
</script>
<script src="{{ '/assets/js/photography-globe.js' | relative_url }}"></script>

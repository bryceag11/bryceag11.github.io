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
    <p class="photography-hero__eyebrow">35mm · Digital · Field notes</p>
    <h1>Travel snapshots that trail the research.</h1>
    <p>Outside the lab I keep a running log of 35mm and digital sets from residencies, conferences, and field visits. Toggle between film and digital to see where each series was captured, then jump into the galleries for context.</p>
    <div class="photography-cta">
      <a class="btn" href="#film-stories">35mm Stories</a>
      <a class="btn btn--outline" href="#digital-stories">Digital Series</a>
    </div>
  </div>
  <div class="photography-hero__note">
    <p>Film colors = textured earth.<br>Digital sets = wireframe earth.</p>
    <p>Each pin opens into a gallery page with notes, gear, and location callouts.</p>
  </div>
</div>

<div class="photography-toggle" role="group" aria-label="Toggle map between film and digital">
  <button class="photography-toggle__button is-active" data-photo-mode="film">35mm Film</button>
  <button class="photography-toggle__button" data-photo-mode="digital">Digital</button>
</div>

<div class="photography-globe">
  <div id="photo-globe" aria-live="polite"></div>
  <div class="photography-globe__legend">
    <h3>Interactive globe</h3>
    <p>Tap + drag to spin. Pins animate in with the selected catalog. Selecting a card below also highlights the corresponding pin.</p>
    <ul>
      <li><span class="legend-dot legend-dot--film"></span>Film locations (full-color earth)</li>
      <li><span class="legend-dot legend-dot--digital"></span>Digital sets (wireframe earth)</li>
    </ul>
    <p class="photography-globe__note">The rotating globe uses WebGL; if your browser blocks it, you’ll still see every album below.</p>
  </div>
  <div id="photo-globe-tooltip" class="photo-globe-tooltip" hidden></div>
</div>

<section id="film-stories" class="photography-section" aria-labelledby="film-heading">
  <div class="photography-section__header">
    <div>
      <p class="photography-section__kicker">35mm</p>
      <h2 id="film-heading">35mm film travelogues</h2>
      <p>Shot on Canon AE-1, Pentax K1000, Olympus XA, and Nikon FM2 cameras. Grain forward, ready for contact sheets.</p>
    </div>
  </div>
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
            <p class="photo-card-meta">{{ entry.camera }}</p>
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
  <div class="photography-section__header">
    <div>
      <p class="photography-section__kicker">Digital</p>
      <h2 id="digital-heading">Digital expeditions</h2>
      <p>High dynamic range edits, stitched panoramas, and sensor experiments that lean into wireframes and lidar overlays.</p>
    </div>
  </div>
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
            <p class="photo-card-meta">{{ entry.camera }}</p>
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
<script defer src="{{ '/assets/js/vendor/three.min.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/photography-globe.js' | relative_url }}"></script>

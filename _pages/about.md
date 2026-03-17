---
layout: home
permalink: /
title: "Bryce Grant"
author_profile: false
classes: home
redirect_from:
  - /about/
  - /about.html
---

<div class="home-hero" id="top">
  <div class="home-hero__text">
    <h1>Bryce Grant</h1>
    <div class="home-hero__titles">
      <p>Electrical Engineering PhD Candidate</p>
      <p> <a href="https://case.edu/">Case Western Reserve University</a></p>
    </div>
    <p>I am a 2nd year Ph.D. student at <a href="https://case.edu/">Case Western Reserve University</a> where I’m advised by Prof. <a href="https://scholar.google.com/citations?user=4CbVWDcAAAAJ&hl=en">Peng “Edward” Wang</a>. I received my dual B.S. in Electrical and Computer Engineering from the <a href="https://www.uky.edu/">University of Kentucky</a> in 2024. I’m currently funded by the <a href="https://www.nsfgrfp.org/">NSF GRFP</a>.</p>     
    <p>I’m interested in building robotic systems that reason about pose, motion, and uncertainty through geometric structures and causal inference.</p>
    <p>I’m currently working on semantic affordances and topology-informed interpretability for VLAs.</p>
    <div class="home-contact-links">
      <a href="mailto:bag100@case.edu">Email</a>
      <span>/</span>
      <a href="https://scholar.google.com/citations?view_op=list_works&hl=en&user=qzcd4G0AAAAJ" target="_blank" rel="noopener">Google&nbsp;Scholar</a>
      <span>/</span>
      <a href="https://twitter.com/bryceagrant1" target="_blank" rel="noopener">Twitter</a>
      <span>/</span>
      <a href="https://github.com/bryceag11" target="_blank" rel="noopener">GitHub</a>
      <span>/</span>
      <a href="{{ '/files/CV.pdf' | relative_url }}" target="_blank" rel="noopener">Resume</a>
    </div>
  </div>
  <div class="home-hero__media">
    <img src="{{ 'images/bryce_headshot.jpeg' | relative_url }}" alt="Bryce Grant" loading="lazy" decoding="async">
  </div>
</div>

<!-- <section class="home-about">

</section> -->

<div class="home-menu" role="tablist" aria-label="Featured sections">
  <button id="panel-highlights-button" class="home-menu__item is-active" role="tab" aria-selected="true" aria-controls="panel-highlights" data-home-tab="highlights">Highlights</button>
  <button id="panel-publications-button" class="home-menu__item" role="tab" aria-selected="false" aria-controls="panel-publications" data-home-tab="publications">Publications</button>
  <button id="panel-projects-button" class="home-menu__item" role="tab" aria-selected="false" aria-controls="panel-projects" data-home-tab="projects">Projects</button>
  <a class="home-menu__item home-menu__item--link" href="{{ '/photography/' | relative_url }}">Adventures</a>
</div>

<div class="home-panels">
  <section id="panel-highlights" class="home-panel is-active" role="tabpanel" aria-labelledby="panel-highlights-button" data-home-panel="highlights">
    <div class="home-highlights-block">
      {% include home/highlights.html %}
    </div>
    <div class="home-panel-updates">
      <p class="home-section-kicker">Updates</p>
      {% include home/updates.html %}
    </div>
  </section>

  <section id="panel-publications" class="home-panel" role="tabpanel" aria-labelledby="panel-publications-button" data-home-panel="publications">
    {% include home/publications.html %}
  </section>

  <section id="panel-projects" class="home-panel" role="tabpanel" aria-labelledby="panel-projects-button" data-home-panel="projects">
    {% include home/section-cards.html section_id="projects" %}
  </section>
</div>

<script defer src="{{ '/assets/js/home-tabs.js' | relative_url }}"></script>

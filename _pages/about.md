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
    <p>I am a 2nd-year Electrical Engineering Ph.D. student at <a href="https://case.edu/">Case Western Reserve University</a>, where I’m advised by <a href="https://scholar.google.com/citations?user=4CbVWDcAAAAJ&hl=en">Peng “Edward” Wang</a>. I received my dual B.S. in Electrical and Computer Engineering from the <a href="https://www.uky.edu/">University of Kentucky</a> in 2024, and I’m currently funded by the <a href="https://www.nsfgrfp.org/">NSF GRFP</a>. Previously, I spent time at Mercor on the Applied&nbsp;AI team, running data analytics and model evals.</p>     
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

<section class="home-research">
  <h2>Research</h2>
  <p>I’m interested in making robotic perception and manipulation more robust and interpretable. I've developed geometric and algebraic methods for perception<sup class="refs"><a class="ref" href="https://cwru-aism.github.io/QUANpaper/" data-title="Quaternion Approximation Networks for Enhanced Image Classification and Oriented Object Detection" target="_blank" rel="noopener">1</a>,<a class="ref" href="https://cwru-aism.github.io/triangulang/" data-title="TrianguLang: Geometry-Aware Semantic Consensus for Pose-Free 3D Localization" target="_blank" rel="noopener">2</a></sup>, studied the mechanistic structure of transformers and vision-language-action models<sup class="refs"><a class="ref" href="https://cwru-aism.github.io/gluing-lc-page/" data-title="Gluing Local Contexts into Global Meaning" target="_blank" rel="noopener">3</a>,<a class="ref" href="https://cwru-aism.github.io/vla-interp-page/" data-title="Not All Features Are Created Equal: A Mechanistic Study of Vision-Language-Action Models" target="_blank" rel="noopener">4</a></sup>, and built neurosymbolic planning that generalizes across embodiments<sup class="refs"><a class="ref" href="https://cwru-aism.github.io/spark-page/" data-title="Sequential Planning via Anchored Robotic Keypoints" target="_blank" rel="noopener">5</a></sup>. These days I’m extending this to manipulation grounded in audio and touch.</p>
</section>

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

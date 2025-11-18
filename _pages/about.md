---
permalink: /
title: "Bryce Grant"
author_profile: false
classes: home
hide_masthead: true
redirect_from:
  - /about/
  - /about.html
---

<div class="home-hero" id="top">
  <div class="home-hero__text">
    <p class="home-hero__eyebrow">Electrical Engineering PhD Student</p>
    <h1>Case Western Reserve University</h1>
    <p class="home-hero__summary">I study robotic perception for assembly—mixing geometry-aware representations, sequential modeling, and retrieval-augmented pipelines so collaborative robots can explain and adapt their plans.</p>
    <div class="home-contact-links">
      <a href="mailto:bag100@case.edu">Email</a>
      <a href="{{ '/files/Bryce_Grant_CV.pdf' | relative_url }}" target="_blank" rel="noopener">CV</a>
      <a href="https://scholar.google.com/citations?view_op=list_works&hl=en&user=qzcd4G0AAAAJ" target="_blank" rel="noopener">Google Scholar</a>
      <a href="https://www.linkedin.com/in/bryce-grant-162a82132/" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://github.com/bryceag11" target="_blank" rel="noopener">GitHub</a>
      <a href="https://twitter.com/bryceagrant1" target="_blank" rel="noopener">X / Twitter</a>
    </div>
  </div>
  <div class="home-hero__media">
    <img src="{{ 'images/bryce_headshot.jpeg' | relative_url }}" alt="Bryce Grant" loading="lazy" decoding="async">
  </div>
</div>

<section class="home-about">
  <p>I work in the <a href="https://engineering.case.edu/electrical-computer-and-systems-engineering">Electrical, Computer, and Systems Engineering Department</a> at <a href="https://case.edu/">Case Western Reserve University</a>, advised by Prof. <a href="https://scholar.google.com/citations?user=4CbVWDcAAAAJ&hl=en">Peng “Edward” Wang</a>. In the Augmented Intelligence for Smart Manufacturing Lab I prototype multi-camera UR5 setups, quaternion-based perception layers (QUAN), and causal keypoint reasoning for fixtures.</p>
  <p>Recent efforts include a PhD internship at HP focused on retrieval-augmented NLP for enterprise hardware support, a point-cloud intervention toolkit for assembly QA, and prep for the QUAN presentation at IROS 2025.</p>
</section>

<div class="home-menu" role="tablist" aria-label="Featured sections">
  <button id="panel-highlights-button" class="home-menu__item is-active" role="tab" aria-selected="true" aria-controls="panel-highlights" data-home-tab="highlights">Highlights</button>
  <button id="panel-publications-button" class="home-menu__item" role="tab" aria-selected="false" aria-controls="panel-publications" data-home-tab="publications">Publications</button>
  <button id="panel-service-button" class="home-menu__item" role="tab" aria-selected="false" aria-controls="panel-service" data-home-tab="service">Service &amp; Projects</button>
  <a class="home-menu__item home-menu__item--link" href="{{ '/photography/' | relative_url }}">Photography</a>
</div>

<div class="home-panels">
  <section id="panel-highlights" class="home-panel is-active" role="tabpanel" aria-labelledby="panel-highlights-button" data-home-panel="highlights" aria-hidden="false">
    <div class="home-panel__grid home-panel__grid--highlights">
      <div class="home-panel__main">
        {% include home/highlights.html %}
      </div>
      <aside class="home-panel__aside home-updates-inline">
        <div class="home-updates-card__header">
          <p class="home-section-kicker">Updates</p>
          <h3>Recent notes</h3>
          <p>Quick hits from my notebook and travel calendar.</p>
        </div>
        {% include home/updates.html %}
      </aside>
    </div>
  </section>

  <section id="panel-publications" class="home-panel" role="tabpanel" aria-labelledby="panel-publications-button" data-home-panel="publications" aria-hidden="true">
    {% include home/publications.html %}
  </section>

  <section id="panel-service" class="home-panel" role="tabpanel" aria-labelledby="panel-service-button" data-home-panel="service" aria-hidden="true">
    {% include home/section-cards.html section_id="service" %}
  </section>
</div>

<script defer src="{{ '/assets/js/home-tabs.js' | relative_url }}"></script>

---
layout: single
title: "Berlin"
permalink: /photography/film/berlin/
slug: berlin
collection_type: film
author_profile: false
---

{% assign entry = site.data.photography.film | where: "slug", page.slug | first %}
{% include photography/gallery.html entry=entry entry_type="film" collection_title="35mm film" %}

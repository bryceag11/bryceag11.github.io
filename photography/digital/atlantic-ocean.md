---
layout: single
title: "Atlantic Ocean"
permalink: /photography/digital/atlantic-ocean/
slug: atlantic-ocean
collection_type: digital
author_profile: false
---

{% assign entry = site.data.photography.digital | where: "slug", page.slug | first %}
{% include photography/gallery.html entry=entry entry_type="digital" collection_title="Digital" %}

---
layout: single
title: "Central Europe"
permalink: /photography/digital/central-europe/
slug: central-europe
collection_type: digital
author_profile: false
---

{% assign entry = site.data.photography.digital | where: "slug", page.slug | first %}
{% include photography/gallery.html entry=entry entry_type="digital" collection_title="Digital" %}

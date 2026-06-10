---
layout: single
title: "Western Europe"
permalink: /photography/digital/western-europe/
slug: western-europe
collection_type: digital
author_profile: false
---

{% assign entry = site.data.photography.digital | where: "slug", page.slug | first %}
{% include photography/gallery.html entry=entry entry_type="digital" collection_title="Digital" %}

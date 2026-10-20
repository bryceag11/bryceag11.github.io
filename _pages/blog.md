---
layout: single
title: "Blog"
permalink: /blog/
author_profile: false
---

<p><a href="{{ '/feed.xml' | relative_url }}">RSS feed</a></p>

{% for post in site.data.blog %}
<h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
<p><small>{{ post.date | date: "%B %-d, %Y" }}</small></p>
<p>{{ post.summary }}</p>
{% endfor %}

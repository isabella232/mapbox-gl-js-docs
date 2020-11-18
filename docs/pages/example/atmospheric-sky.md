---
title: Add atmospheric sky layer to a map
description: Add a customizable sky layer that simulates the natural scattering of light in the atmosphere
topics:
  - GL JS v2 preview
thumbnail: atmospheric-sky
contentType: example
layout: example
language:
- JavaScript
products:
- Mapbox GL JS
prependJs:
- "import Note from '@mapbox/dr-ui/note';"
- "import Example from '../../components/example';"
- "import html from './atmospheric-sky.html';"
---

{{<Note title='Public beta' theme="beta" >}}
This feature is part of the Mapbox GL JS v2 public beta. All features and workflows are subject to potential changes.
{{</Note>}}
{{ <Example html={html} {...this.props} /> }}

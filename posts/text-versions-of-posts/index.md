---
title: Text output of Blog posts
layout: layouts/posts.tsx
url: './index.html'
date: 2026-01-19T09:35:00Z
categories:
  - Hosting
tags:
  - blogging
  - text
  - html
---
I recently stumbled upon this blog post by [Terence Eden](https://shkspr.mobi/blog/2025/12/a-small-collection-of-text-only-websites/) about serving up blog posts not only as html but also as plain text files.  I like the idea of being able to serve up just text. I have been on this drive lately to try to reduce the size and complexity of pages I serve up lately with personal projects and what better way than just text! Basically serve up as little as possible and preferably little to no javascript.

Yes, it kind of defeats the whole point of the web and serving up more stylish and dynamic pages to view.  And makes putting pictures in a blog post pointless since a text files cannot display an image but if anything, you can put a hyperlink to the image in the text file.

So I have now made all my blog posts output as html as well as a text file.  Every post can be viewed by adding `index.txt` after the slash. For example, to view this as text you can view it at [posts/text-versions-of-posts/index.txt](/posts/text-versions-of-posts/index.txt)

To be able to make this work with [Lume](https://lume.land/), I created a plugin that converts the original markdown file of the blog post to plain text.  It keeps code blocks around to make things more readable and converts any images or links to just the link so it can still be viewed. The plugin that generates text from markdown can be viewed [here](https://github.com/paulmfischer/fear-of-the-undefined/_plugins/txt_output.ts)  I have also update the blog to have a link to the text version at the top of every page for easy access.
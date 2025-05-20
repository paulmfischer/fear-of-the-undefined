---
title: Moving to Cloudflare Pages from Deno Deploy
layout: layouts/posts.tsx
url: './index.html'
date: 2025-05-20T05:00:00Z
categories:
  - Hosting
tags:
  - deno_deploy
  - cloudflare_pages
  - lume
---
I have moved where my blog is hosted for what is the third time in about a year and a half. Originally my blog was hosted on Github pages, about a year ago (January 2024 I believe) I decided to move to Deno Deploy partially because I am using [Lume](https://lume.land/) and partially to just tinker around with Deno Deploy a bit and see how that works.  For what Deno Deploy does and for what I am looking for (a simple and hopefully free hosting location for a SSG blog) it works really well.  I get some analytics to see traffic, can deploy from Github using an actions (for the most part, keep reading for one issue) and I could point my domain to it.

Near the end of March though, all that changed when I was making some changes to my blog and the deployment kept failing due to a file not being valid utf8.
```json
{
  "type": "error",
  "code": "deploymentFailed",
  "ctx": "The deployment failed: content of 'file:///src/_vendor/npm/registry.npmjs.org/highlight.js/11.11.1/styles/brown-papersq.png' module is not valid utf8"
}
```
The problem is that this file is part of a library which is used to build my blog, but it shouldn't even be part of the output of my build.  But this is what caused me to decide to move on from Deno Deploy to Cloudflare Pages.

This error was a bit confusing to me at first because the file in question shouldn't even be making it to Deno Deploy after the blog is built in Github actions.  I was assuming from the way I setup my Github action is that only the `_site` folder was being sent to Deno Deploy and then it would take over from there.  Looking at the logs though, my entire source code is being sent after the build so that `_site` exists and can be served using the `serve.js` file in Deno as the launch point.

So first thought was to modify my build so it only sends exactly what is needed to run on Deno Deploy, `_site`, `serve.js`, and `deno.json`.  That didn't work though because it appears that Deno would still run through the install process when it ran `serve.js` which would again pull in `brown-papersq.png` file and I would get the utf8 is not valid error again.

My next thought was to remove the dependency that was pulling that file in, which in this case is [code highlight](https://lume.land/plugins/code_highlight/) plugin in [Lume](https://lume.land/).  As I started to really think about that tough it just seemed like a bad idea on a couple of fronts. One, I would lose code highlighting from a nice library and would have to find another or do it myself, which I frankly didn't want to do at the time. Second, what happens when another library I pull in has a file that Deno Deploy doesn't like because it isn't valid utf8?

While I was going through all this I also opened a [bug with Deno](https://github.com/denoland/deploy_feedback/issues/837) just to see if this could be fixed or if there was something wrong with how I was deploying.  It appears I am not the only one having this issue and no one else has a fix or getting any feedback on if there could be a fix.  I know it has only been about two months but I didn't want to wait around not being able to make changes to my blog because I am unable to properly deploy.  In fact, this [issue appears](https://github.com/denoland/deploy_feedback/issues?q=is%3Aissue%20state%3Aopen%20utf8) to have been around for more than a couple of months without any traction on it.

So I finally decided it was time to find another host (in this case Cloudflare Pages) and come back to Deno Deploy for another project or another time when this is fixed.  I meant to make this post more about the move to Cloudflare Pages but it ended up being more about why I moved to them.  Might follow this up with how that move went because it was pretty smooth for the most part, just a small hiccup when it came to using a custom domain I wasn't super happy with but so far it has worked out.
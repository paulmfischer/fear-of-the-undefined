---
title: github-actions[bot] denied access to repo
layout: layouts/posts.tsx
url: './index.html'
date: 2022-05-10T05:00:00Z
categories:
  - Troubleshooting
tags:
  - github
  - github-actions
---
I have been working on setting up GitHub Pages for myself and trying out a few themes. Finally settled on the [chirpy theme](https://github.com/cotes2020/jekyll-theme-chirpy). Chirpy has a [starter project](https://github.com/cotes2020/chirpy-starter/generate) that you can generate your repository from. So off I went creating a new repo based on the starter project, pulled my new repository down, made a few changes, committed the changes and then pushed my changes.

Pretty painless process surprisingly which is awesome.

The only issue is that chirpy requires the use of GitHub actions to do the build/deploy phase. No problem, Github Actions are enabled for repositories by default. Watching the actions run after pushing my change only to see that it failed!  Clicking into the failed continuous-delivery job to see the console logs and it has the following at the end.

![cd-failed-deploy](actions-failed.png)

My first thought is that I need to grant the `github-actions[bot]` access to my repository, but how? Did some quick googling and basically nothing on how to give the bot access to my repository so that it can push changes. Looked around in my repositories settings a bit and finally stumbled upon the _Workflow permissions_ section under _Settings -> Actions -> General_.

![settings-actions-general](setting-guide-1.png)

Under the _Workflow permissions_ section the value _Read repository contents permission_ is selected which only allows read access for the `github-actions[bot]`. So simply changing the selection to _Read and write permissions_ and saving to grant the `github-actions[bot]` read/write access to my repository.

![settings-actions-general](setting-guide-2.png)

From there, head back to my failed job, click the _Re-run jobs_ dropdown, then _Re-run all jobs_ for the job to run again.  This time the action completed without failure and I could complete the setup of the chirpy theme and I am off an running!
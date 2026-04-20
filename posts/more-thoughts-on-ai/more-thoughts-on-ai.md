---
title: More Thoughts on AI
layout: layouts/posts.tsx
url: './index.html'
date: 2026-04-20T05:00:00Z
categories:
  - AI
tags:
  - GPT
  - Claude
  - Claude Code
  - Github Copilot
---
In a [previous post](/posts/generate-todo-with-ai) I went through a scenario of trying to build out a TODO website utilizing AI with Github Copilot. At that time, I was able to get a TODO app completed, albeit with some complications along the way as well as the app not fully working.  Since then, I have been utilizing Claude and Claude Code a lot more along side Github Copilot.  I am becoming even more impressed with what it is capable of doing since then, especially how it is changing how I work daily.

I decided to try a more real-world example and utilize Claude/Copilot on my [MediaSet](https://github.com/paulmfischer/MediaSet) project.  This is a media collection app that I have been working on/off again for a long time and continually feel like I am not making a lot of progress.  It hasn't helped that I changed the underlying technology a few times which set everything back to the beginning until last year when I solidified those choices.  Then I started hitting a wall when it came to getting features done that I wanted added (like barcode lookup, image retrieval, etc.)  After trying AI to build a TODO app and seeing how it can help move along some feature work, even if not perfect, I thought why not try AI again but in a more complex scenario and see how it goes.

As I started this work I also changed my approach on how I asked AI to make changes. In my TODO application, I was attempting what a lot of the industry has been calling vibe coding or the perfect prompt. I would give it a single prompt of the entire thing I would want and let it run, making tweaks after it as completed.  When it comes to working on MediaSet, I have been taking two different approaches when it comes to work. 1) Create an implementation document to be followed or 2) Create an Issue/Feature in Github with enough information to do the work.  The approaches do tend to bleed together at times but I have found this to work really well.

The first approach of creating an implementation document typically stems from an issue or feature I have in mind (I typically add these to the project in Github as Issues to keep track of them). I then ask the AI to look at it and build out an implementation detail document.  This is a markdown file that I have been including in the code base to keep a record of initial approach.  This way, I can review what the changes will entail and then have a discussion with the AI on that document.  This discussion could take some time as we discuss different approaches, or use cases that were not thought of; basically spending this time polishing the implementation.  Once I feel comfortable with the implementation details I ask Claude/Copilot from a fresh session to look at the document and implement it. I tend to start a new session so that it doesn't keep any of the decisions we discarded in the context (I am not positive this is a good thing or not but it has been working).

The second approach is basically the same as the first, but the Issue/Feature typically has enough information in it that an implementation document is not needed.  If AI looks at it and sees it is more complex, or raises more questions that are easily answerable then I will ask it to create an implementation document for review.

I have found this approach to work really well. Instead of trying to write a perfect prompt, I spend time having a conversation with the AI coming up with an implementation to get the feature/issue resolved and then let the AI make the actual changes after. This way I am actively involving the AI in the process before any code changes are done and not trying to come up with a perfect prompt and hoping it gets it right. There are times where I still have to ask it for changes either during the work or once it has been completed, but this approach tends to be produce a much more polished output at the end.

This approach has allowed me to get a lot of new features added to my MediaSet project.  These are features that I feel like I would have had to drag myself through and may or may not have enjoyed it. But by letting AI do the work, I have been able to take a more high level approach to the project which has let me see it in a different light. I am not spending all my time in the guts of the project trying to get something to work, I am focusing on getting full features working and polished which has been a lot more rewarding to me. It allows me to become more of a user that is driving features and not the developer. I can still dig into the guts if I need to or want to but I can really take a step back and let AI manage that while I manage the bigger picture.
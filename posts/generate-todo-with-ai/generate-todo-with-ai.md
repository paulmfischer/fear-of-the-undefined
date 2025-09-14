---
title: Generate a Todo app using AI
layout: layouts/posts.tsx
url: './index.html'
date: 2025-09-14T05:00:00Z
categories:
  - AI
tags:
  - GPT
---
I have tried to check out some of the AI tools every now and then to see how well they work when it comes to completing programming related tasks.  From my experience so far, they are very hit or miss.  Sometimes it gives me almost exactly what I am looking for, other times, they fail miserably and give me something that is completely wrong or doesn't even compile.

So I thought why not give it another go with something (relatively?) simple, a todo application built with html, css, and vanilla js that is responsive and includes accessibility.  I utilized Github Copilot and tried to build a Todo application with Claude Sonnet 3.5 and GPT 4.1.  In both cases, I used roughly the same prompt and also did not modify any file by hand.  I asked the agent in both cases to make any changes requested.

What follows is the conversation I had with GPT to build a Todo application.  I won't include the outputted file after every prompt but will link to the result of the file at the end.  I mostly want to focus on the conversation because a reoccurring theme happened when I tried to build a Todo application with GPT and Claude.

Me:
> Using only latest html, javascript, and css, build a responsive and accessible todo application that saves state into local storage. Make a single todo.html file inside the copilot folder.

GPT:
> I will create a single file, copilot/todo.html, containing a responsive and accessible todo app using HTML, CSS, and JavaScript. The app will save todos to localStorage and support adding, toggling, and deleting tasks.
>
>todo.html
>todo.html
>
>has been created with a responsive, accessible todo app using HTML, CSS, and JavaScript. The app saves todos in localStorage and supports adding, toggling, and deleting tasks.

Me:
>Update to allow editing of an the existing todo as well as allow the ability to toggle the state of the item.

GPT:
>I will update the todo app to allow editing an existing todo item inline. Each todo will have an edit button that, when clicked, replaces the label with a text input and save/cancel buttons. Toggling the state will still be possible via the checkbox or label.
>
>I'll add the edit functionality to the JavaScript and update the rendering logic accordingly.
>
>todo.html
>
>The todo app now supports inline editing of existing items with edit, save, and cancel buttons. You can still toggle the completed state using the checkbox or label.

Me:
>Make sure all the buttons are keyboard accessible as well as keeping focus on a button after rerender.

GPT:
>I will update the todo app to ensure all buttons are keyboard accessible by setting tabIndex and using semantic <button\> elements. After rerendering (e.g., after editing or deleting), I will restore focus to the relevant button (edit, save, cancel, or delete) using a focus management strategy with a global variable to track which button should receive focus.
>
>This will improve accessibility and usability for keyboard users.
>
>todo.html
>
>All buttons are now keyboard accessible, and focus is restored to the relevant button after rerendering to improve accessibility for keyboard users.

Me:
>Add some padding between editing a todo name and the save and cancel buttons.  Also remove the crossed out text style when editing a todo item.

GPT:
>I will add CSS to provide padding between the edit input and the save/cancel buttons, and update the rendering logic so the crossed-out style is removed when editing a todo item.
>
>todo.html
>
>Padding has been added between the edit input and the save/cancel buttons, and the crossed-out style is removed when editing a todo item.

Me:
>Make sure that all actions are still keyboard accessible.  Also update the text color of editing a task to not be grayed out.

GPT:
>I will ensure all actions remain keyboard accessible and update the edit input's text color to use the default color (not grayed out) when editing a task.
>
>todo.html
>
>All actions remain keyboard accessible, and the text color for editing a task is now set to the default (not grayed out).

This conversation went on for a bit more but it was mostly me asking for a small tweak and then also asking to add back keyboard accessibility. But out of the gate, what GPT built was a mostly working Todo application which was pretty impressive.  I did have to ask for some tweaks to make the application work more in how I wanted it to. What was interesting is that I had to keep asking it to add back keyboard accessibility. It was like it kept forgetting I wanted that so any change would remove that ability.  This same behavior happened with Claude Sonnet.  Now granted, I could have included an AGENTS.md file to require all changes to be accessible as well as some other behavior to adhere to.

After all of that, this is what GPT had built: [gpt-todo.html](gpt-todo.html)

There is still an issue with the result above in that the edit/delete buttons do not work.  The buttons were working at one point during the conversation but again, GPT would break something after I asked it to make a change to something else.

I would say I am pretty impressed with what can be accomplished but this was a pretty simple example.  Will see if things continue to improve but it could still use some work, or I could use some more practice on prompting an agent to get closer to exactly what I want from the output. 
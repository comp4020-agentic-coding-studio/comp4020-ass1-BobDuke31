# Process overview

## What I built

I built 'Just Run?', a small interactive explainer about beginner running. The main idea is that running looks simple to start, but even 'just running' involves decisions about distance, frequency, intensity and recovery. The user changes those three variables and immediately sees how they affect weekly distance, running days, recovery days and the Monday to Sunday pattern. I kept the project deliberately small: one main idea, one interaction, and a small amount of research evidence to explain why gradual training matters.

## The moments that mattered

### 1. Starting with a small working prototype

I wanted to avoid making the project too large before I knew whether the main idea worked. Instead of asking Claude to build a polished full page immediately, I narrowed the topic and first built the smallest useful interaction: distance, days per week and intensity changing a weekly result. That became the first working prototype in [`d325f79`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BobDuke31/commit/d325f79). I accepted this version because the interaction worked and the automated checks passed. More importantly, having a real prototype made it easier to judge what the project was actually communicating before spending time on visual design.

### 2. Turning research into a standing rule

Once the prototype existed, I did more focused research before adding health and injury claims. Commit [`bb9ddb5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BobDuke31/commit/bb9ddb5) added the research note and showed that some claims needed careful wording, especially population-level injury rates and claims about knee damage. Instead of repeatedly reminding Claude in later prompts, I added these limits to `CLAUDE.md` in [`afea802`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BobDuke31/commit/afea802). This was more useful than another one-off correction because the rule stayed in the project harness. I could see it working when the later page copy kept the population-rate warning and avoided turning the evidence into personal injury predictions ([`2086675`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BobDuke31/commit/2086675)).

### 3. Realising the page explained the wrong thing

The early versions worked technically, but after looking at the page I realised it felt too much like a beginner running-plan generator. That was not the point of the assignment. Instead of adding more features, I kept the same mechanic and changed how it was presented. In [`3eba985`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BobDuke31/commit/3eba985), the page was redesigned as an editorial interactive explainer. The controls became adjustable variables, the results became the visual focus, and the evidence was simplified. The same tests still passed, so I knew the redesign had changed the explanation without breaking the underlying interaction.

### 4. Checking the marked viewport instead of assuming it worked

During the final responsive review, the long intensity option was identified as a possible overflow problem at the 390px phone width used for marking. Rather than redesigning the layout again, I made a small CSS fix in [`a898b56`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-BobDuke31/commit/a898b56) so the field could shrink correctly. I then ran `pnpm check` again and all 26 tests, typechecking, build and lint checks passed. This reminded me that automated tests were useful, but they did not replace checking the actual layout constraints in the brief.
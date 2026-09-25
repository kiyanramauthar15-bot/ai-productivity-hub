# AI Productivity Hub

Build a modern responsive SaaS web app called **AI Workplace Productivity Assistant**.

Create a clean professional dashboard with a **Tiffany blue + deep red/coral** colour palette, white backgrounds, rounded cards, subtle shadows, and modern typography.

### Core Features

1. **Smart Email Generator**

* Input: recipient, subject/purpose, key points.
* Tone selector: Formal, Friendly, Persuasive.
* Generate an AI-written professional email.
* Make the generated email editable with Copy and Regenerate buttons.

2. **Meeting Notes Summarizer**

* Large text area for meeting notes.
* Generate a concise AI summary.
* Automatically display separate sections for **Summary, Action Items, Decisions, and Deadlines**.
* Make results editable and copyable.

3. **AI Task Planner**

* Users enter their tasks, priorities, and available hours.
* Generate a practical daily or weekly schedule.
* Prioritize tasks using urgency and importance.
* Display the schedule as clean task cards or a timeline.
* Allow editing of generated tasks.

### UI

* Left sidebar navigation: Dashboard, Email Generator, Meeting Summarizer, Task Planner, Settings.
* Dashboard should show productivity overview cards and quick actions.
* Responsive for desktop, tablet, and mobile.
* Add polished loading states and empty states.
* Use icons consistently.
* Include a small **Responsible AI** disclaimer stating that AI-generated content should be reviewed before use.

### AI Behaviour

Make outputs feel genuinely AI-generated, professional, contextual, and different based on the user's inputs. Do not use generic placeholder responses. Use structured prompts internally for each feature.

### Technical Constraints

* **Frontend only — no backend, database, authentication, or external API.**
* Store temporary data locally in the browser where useful.
* Implement functional frontend interactions and simulated AI generation without requiring API keys.
* Keep the architecture simple and suitable for a Lovable Free project.
* Prioritize a polished working UI over unnecessary features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b9bd6e4e-373a-4629-9f4f-3f191ac02f06).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

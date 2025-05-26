# igu-learn-components

A collection of web components for teaching, learning, spaced repetition and ITS

## Use

- (`npm i`)
- `npm run rev` for dev server with demo
- `npx vite build` for building (= needed to use components elsewhere)

## Components

### igu-flashcard

A simple flashcard component with front and back content, plus self-evaluation buttons.

#### Usage

```html
<igu-flashcard>
  <span slot="front-title">Question Title</span>
  <span slot="front-content">Question Content</span>
  <span slot="back-title">Answer Title</span>
  <span slot="back-content">Answer Content</span>
</igu-flashcard>
```

#### Features
- Front and back content with optional titles
- "Reveal" button to show the answer
- Self-evaluation buttons (Wrong, Hard, Good, Easy)
- Emits events for reveal and rating actions
- Accessible and responsive design

#### Events
- `reveal`: Emitted when the card is revealed
- `rating`: Emitted when a rating button is clicked, with rating value in event detail

### igu-cloze-reveal

A fill-in-the-blank component that randomly selects elements to hide in a text, based on the `data-is-gap` attribute. **Requires global CSS for cloze styles.**

#### Usage

```html
<!-- Add these styles to your global stylesheet or <head> -->
<style>
  .cloze-hidden {
    color: transparent;
    text-shadow: 0 0 8px #888;
    border-bottom: 2px solid #1976d2;
    background: repeating-linear-gradient(90deg, #eee, #eee 6px, #fff 6px, #fff 12px);
    min-width: 2em;
    cursor: pointer;
    user-select: none;
  }
  .cloze-revealed {
    background-color: #e3f2fd;
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-weight: bold;
    color: inherit;
    border-bottom: 2px solid #1976d2;
  }
</style>

<igu-cloze-reveal num-clozes="3">
  <div slot="pre-cloze">Complete the famous quote:</div>
  <span slot="cloze">
    Whom the <span data-is-gap>gods</span> wish to <span data-is-gap>destroy</span>, they <span data-is-gap>give</span> <span data-is-gap>unlimited</span> <span data-is-gap>resources</span>
  </span>
  <div slot="post-cloze">Think about the meaning of this quote.</div>
</igu-cloze-reveal>
```

#### Properties
- `num-clozes`: Number of elements to randomly select for cloze (with `data-is-gap`)
- `seed`: Optional seed for deterministic random selection

#### Slots
- `pre-cloze`: Optional content before the cloze text
- `cloze`: The main text to be clozed, with cloze-eligible elements marked by `data-is-gap`
- `post-cloze`: Optional content after the cloze text

#### Events
- `cloze-event`: Emitted for both reveal and rating actions
  - Event detail includes:
    - `type`: 'reveal' | 'rating'
    - `rating`: 'wrong' | 'hard' | 'good' | 'easy' (for rating events)
    - `clozedTexts`: Array of the text content of clozed elements
    - `clozedIndices`: Array of indices of clozed elements (relative to all elements with `data-is-gap`)
    - `timeToReveal`: Time taken to reveal (in milliseconds)

#### Features
- Mark cloze-eligible elements with `data-is-gap` (works on any HTML element)
- Random element selection with optional seed
- Subtle highlighting for revealed words
- Self-evaluation buttons
- Accessible design with ARIA labels
- Responsive layout

#### ⚠️ Note on Styling
- Because of web component and Shadow DOM limitations, the cloze styles **must be included in your global stylesheet** (see above) for slotted content to be styled correctly.

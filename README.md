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
- Customizable via CSS custom properties

#### Events
- `reveal`: Emitted when the card is revealed
- `rating`: Emitted when a rating button is clicked, with rating value in event detail

#### Customization
```css
igu-flashcard {
  /* Card */
  --igu-card-bg: #ffffff;
  --igu-card-border: 1px solid #e0e0e0;
  --igu-card-radius: 8px;
  --igu-card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --igu-card-padding: 1.5rem;
  --igu-card-spacing: 1rem;

  /* Typography */
  --igu-title-color: #2c3e50;
  --igu-title-size: 1.25rem;
  --igu-title-weight: 600;
  --igu-content-color: #4a5568;
  --igu-content-size: 1rem;

  /* Buttons */
  --igu-button-bg: #4a90e2;
  --igu-button-color: #ffffff;
  --igu-button-radius: 4px;
  --igu-button-padding: 0.5rem 1rem;
  --igu-button-wrong-bg: #e53e3e;
  --igu-button-hard-bg: #ed8936;
  --igu-button-good-bg: #4299e1;
  --igu-button-easy-bg: #48bb78;
}
```

### igu-cloze-reveal

A fill-in-the-blank component that randomly selects elements to hide in a text, based on the `data-is-gap` attribute.

#### Usage

```html
<!-- Required global styles for cloze gaps -->
<!-- you can use different ones, but they have to exist -->
<style>
  .cloze-hidden {
    filter: blur(4px);
    min-width: 2em;
    user-select: none;
  }
  .cloze-revealed {
    border-radius: 3px;
    font-weight: bold;
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
- Customizable via CSS custom properties

#### Customization
The component can be customized in two ways:

1. **Component Styling** (via CSS custom properties):
```css
igu-cloze-reveal {
  /* Card */
  --igu-card-bg: #ffffff;
  --igu-card-border: 1px solid #e0e0e0;
  --igu-card-radius: 8px;
  --igu-card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --igu-card-padding: 1.5rem;
  --igu-card-spacing: 1rem;

  /* Buttons */
  --igu-button-bg: #4a90e2;
  --igu-button-color: #ffffff;
  --igu-button-radius: 4px;
  --igu-button-padding: 0.5rem 1rem;
  --igu-button-wrong-bg: #e53e3e;
  --igu-button-hard-bg: #ed8936;
  --igu-button-good-bg: #4299e1;
  --igu-button-easy-bg: #48bb78;
}
```

2. **Cloze Gap Styling** (via global CSS):
```css
.cloze-hidden {
  color: transparent;
  filter: blur(4px);
  min-width: 2em;
  user-select: none;
}

.cloze-revealed {
  border-radius: 3px;
  font-weight: bold;
  border-bottom: 2px solid #1976d2;
}
```

⚠️ **Important**: The cloze gap styles (`.cloze-hidden` and `.cloze-revealed`) must be defined in your global stylesheet because they affect slotted content outside the Shadow DOM. These styles cannot be customized via CSS custom properties.

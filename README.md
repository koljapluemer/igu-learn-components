# igu-learn-components

A collection of web components for teaching, learning, spaced repetition and ITS

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

A fill-in-the-blank component that randomly selects elements to hide in a text, based on the `data-is-gap` attribute.

#### Usage

```html
<igu-cloze-reveal num-clozes="2">
  <div slot="pre-cloze">Complete the famous quote:</div>
  <span slot="cloze">
    Whom the gods wish to <span data-is-gap>destroy</span>, they <span data-is-gap>give</span> unlimited <b data-is-gap>resources</b>
  </span>
  <div slot="post-cloze">Think about the meaning of this quote.</div>
</igu-cloze-reveal>
```

#### Properties
- `numClozes`: Number of elements to randomly select for cloze (with `data-is-gap`)
- `seed`: Optional seed for deterministic random selection
- `isRevealed`: Internal state for reveal status

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

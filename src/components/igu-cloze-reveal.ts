import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { theme } from '../styles/theme';
import { selectRandom } from '../utils/random';

interface ClozeEvent {
  type: 'reveal' | 'rating';
  rating?: 'wrong' | 'hard' | 'good' | 'easy';
  clozedTexts: string[];
  clozedIndices: number[];
  timeToReveal?: number;
}

type ClozeState = 'clozed' | 'revealed';

@customElement('igu-cloze-reveal')
export class IguClozeReveal extends LitElement {
  static styles = [
    theme,
    css`
      :host {
        display: block;
        max-width: 600px;
        margin: 0 auto;
        padding: 1rem;
      }
      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        margin-bottom: 1rem;
      }
      .cloze-text {
        font-size: 1.1rem;
        line-height: 1.5;
        margin: 1rem 0;
      }
      .cloze-hidden {
        color: transparent;
        text-shadow: 0 0 8px #888;
        border-bottom: 2px solid var(--color-primary);
        background: repeating-linear-gradient(90deg, #eee, #eee 6px, #fff 6px, #fff 12px);
        min-width: 2em;
        cursor: pointer;
        user-select: none;
      }
      .cloze-revealed {
        background-color: var(--color-primary-light, #e3f2fd);
        padding: 0.1em 0.3em;
        border-radius: 3px;
        font-weight: bold;
        color: inherit;
        border-bottom: 2px solid var(--color-primary);
      }
      .buttons {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 1rem;
      }
      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      button.primary {
        background-color: var(--color-primary);
        color: white;
      }
      button.rating {
        background-color: var(--color-secondary);
        color: white;
      }
      button:hover {
        opacity: 0.9;
      }
      button:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    `
  ];

  @property({ type: Number }) numClozes = 1;
  @property({ type: Number }) seed?: number;

  @state() private clozedIndices: number[] = [];
  @state() private clozedTexts: string[] = [];
  @state() private state: ClozeState = 'clozed';
  @state() private startTime = Date.now();

  protected firstUpdated() {
    this.applyCloze();
    const slot = this.shadowRoot?.querySelector('slot[name="cloze"]') as HTMLSlotElement;
    if (slot) {
      slot.addEventListener('slotchange', () => this.applyCloze());
    }
  }

  private applyCloze() {
    const slot = this.shadowRoot?.querySelector('slot[name="cloze"]') as HTMLSlotElement;
    if (!slot) return;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    let allClozeElements: HTMLElement[] = [];
    assignedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        allClozeElements.push(...Array.from((node as Element).querySelectorAll('[data-is-gap]')) as HTMLElement[]);
      }
    });
    // Remove all cloze classes first
    allClozeElements.forEach((el) => {
      el.classList.remove('cloze-hidden', 'cloze-revealed');
    });
    // Randomly select clozes
    const indices = Array.from(allClozeElements.keys());
    const selectedIndices = selectRandom(indices, Math.min(this.numClozes, indices.length), this.seed);
    this.clozedIndices = selectedIndices;
    this.clozedTexts = selectedIndices.map(i => allClozeElements[i].textContent || '');
    // Hide selected
    selectedIndices.forEach(i => {
      allClozeElements[i].classList.add('cloze-hidden');
      allClozeElements[i].setAttribute('aria-label', 'gap');
      allClozeElements[i].setAttribute('tabindex', '0');
    });
    this.state = 'clozed';
    this.startTime = Date.now();
  }

  private handleReveal() {
    const slot = this.shadowRoot?.querySelector('slot[name="cloze"]') as HTMLSlotElement;
    if (!slot) return;
    const assignedNodes = slot.assignedNodes({ flatten: true });
    let allClozeElements: HTMLElement[] = [];
    assignedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        allClozeElements.push(...Array.from((node as Element).querySelectorAll('[data-is-gap]')) as HTMLElement[]);
      }
    });
    this.clozedIndices.forEach(i => {
      const el = allClozeElements[i];
      if (el) {
        el.classList.remove('cloze-hidden');
        el.classList.add('cloze-revealed');
        el.setAttribute('aria-label', 'revealed gap');
      }
    });
    this.state = 'revealed';
    const timeToReveal = Date.now() - this.startTime;
    this.dispatchEvent(new CustomEvent<ClozeEvent>('cloze-event', {
      detail: {
        type: 'reveal',
        clozedTexts: this.clozedTexts,
        clozedIndices: this.clozedIndices,
        timeToReveal
      }
    }));
  }

  private handleRating(rating: 'wrong' | 'hard' | 'good' | 'easy') {
    this.dispatchEvent(new CustomEvent<ClozeEvent>('cloze-event', {
      detail: {
        type: 'rating',
        rating,
        clozedTexts: this.clozedTexts,
        clozedIndices: this.clozedIndices,
        timeToReveal: Date.now() - this.startTime
      }
    }));
  }

  render() {
    return html`
      <div class="card" role="article">
        <slot name="pre-cloze"></slot>
        <div class="cloze-text" role="text">
          <slot name="cloze"></slot>
        </div>
        <slot name="post-cloze"></slot>
        ${this.state !== 'revealed' 
          ? html`<div class="buttons">
              <button 
                class="primary" 
                @click=${this.handleReveal}
                aria-label="Reveal the hidden words">
                Reveal
              </button>
            </div>`
          : html`<div class="buttons">
              <button 
                class="rating" 
                @click=${() => this.handleRating('wrong')}
                aria-label="Rate as Wrong">
                Wrong
              </button>
              <button 
                class="rating" 
                @click=${() => this.handleRating('hard')}
                aria-label="Rate as Hard">
                Hard
              </button>
              <button 
                class="rating" 
                @click=${() => this.handleRating('good')}
                aria-label="Rate as Good">
                Good
              </button>
              <button 
                class="rating" 
                @click=${() => this.handleRating('easy')}
                aria-label="Rate as Easy">
                Easy
              </button>
            </div>`
        }
      </div>
    `;
  }
}

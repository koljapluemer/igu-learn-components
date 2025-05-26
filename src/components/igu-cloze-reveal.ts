import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
  static styles = css`
    :host {
      display: block;
      --igu-card-bg: #ffffff;
      --igu-card-border: 1px solid #e0e0e0;
      --igu-card-radius: 8px;
      --igu-card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      --igu-card-padding: 1.5rem;
      --igu-card-spacing: 1rem;

      --igu-button-bg: #4a90e2;
      --igu-button-color: #ffffff;
      --igu-button-radius: 4px;
      --igu-button-padding: 0.5rem 1rem;
      --igu-button-spacing: 0.5rem;
      --igu-button-hover-opacity: 0.9;

      --igu-button-wrong-bg: #e53e3e;
      --igu-button-hard-bg: #ed8936;
      --igu-button-good-bg: #4299e1;
      --igu-button-easy-bg: #48bb78;

      max-width: 600px;
      margin: 0 auto;
    }

    .card {
      background: var(--igu-card-bg);
      border: var(--igu-card-border);
      border-radius: var(--igu-card-radius);
      box-shadow: var(--igu-card-shadow);
      margin-bottom: var(--igu-card-spacing);
    }

    .card-content {
      padding: var(--igu-card-padding);
    }

    .card-footer {
      padding: var(--igu-card-padding);
      border-top: var(--igu-card-border);
    }

    .buttons {
      display: flex;
      gap: var(--igu-button-spacing);
      justify-content: center;
      width: 100%;
    }

    button {
      padding: var(--igu-button-padding);
      border: none;
      border-radius: var(--igu-button-radius);
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s;
      background: var(--igu-button-bg);
      color: var(--igu-button-color);
    }

    button:hover {
      opacity: var(--igu-button-hover-opacity);
    }

    button.is-wrong {
      background: var(--igu-button-wrong-bg);
    }

    button.is-hard {
      background: var(--igu-button-hard-bg);
    }

    button.is-good {
      background: var(--igu-button-good-bg);
    }

    button.is-easy {
      background: var(--igu-button-easy-bg);
    }
  `;

  @property({ type: Number, attribute: 'num-clozes', reflect: true }) numClozes = 1;
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
    const numClozes = Number(this.numClozes);
    const selectedIndices = selectRandom(indices, Math.min(numClozes, indices.length), this.seed);
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
        <div class="card-content">
          <slot name="pre-cloze"></slot>
          <slot name="cloze"></slot>
          <slot name="post-cloze"></slot>
        </div>
        <div class="card-footer">
          ${this.state !== 'revealed' 
            ? html`<div class="buttons">
                <button 
                  @click=${this.handleReveal}
                  aria-label="Reveal the hidden words">
                  Reveal
                </button>
              </div>`
            : html`<div class="buttons">
                <button 
                  class="is-wrong" 
                  @click=${() => this.handleRating('wrong')}
                  aria-label="Rate as Wrong">
                  Wrong
                </button>
                <button 
                  class="is-hard" 
                  @click=${() => this.handleRating('hard')}
                  aria-label="Rate as Hard">
                  Hard
                </button>
                <button 
                  class="is-good" 
                  @click=${() => this.handleRating('good')}
                  aria-label="Rate as Good">
                  Good
                </button>
                <button 
                  class="is-easy" 
                  @click=${() => this.handleRating('easy')}
                  aria-label="Rate as Easy">
                  Easy
                </button>
              </div>`
          }
        </div>
      </div>
    `;
  }
}

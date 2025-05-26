import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { theme } from '../styles/theme';

@customElement('igu-flashcard')
export class IguFlashcard extends LitElement {
  static styles = [
    theme,
    css`
      :host {
        display: block;
        max-width: 600px;
        margin: 0 auto;
        padding: 1rem;
      }

      /* Fallback styles when Bulma is not present */
      :host(:not(.has-bulma)) .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        margin-bottom: 1rem;
      }

      :host(:not(.has-bulma)) .title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: var(--color-primary);
      }

      :host(:not(.has-bulma)) .content {
        margin-bottom: 1rem;
      }

      :host(:not(.has-bulma)) .buttons {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 1rem;
      }

      :host(:not(.has-bulma)) button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      :host(:not(.has-bulma)) button.primary {
        background-color: var(--color-primary);
        color: white;
      }

      :host(:not(.has-bulma)) button.rating {
        background-color: var(--color-secondary);
        color: white;
      }

      :host(:not(.has-bulma)) button:hover {
        opacity: 0.9;
      }
    `
  ];

  @property({ type: Boolean }) isRevealed = false;
  @property({ type: String }) cardClass = 'card';
  @property({ type: String }) titleClass = 'title';
  @property({ type: String }) contentClass = 'content';
  @property({ type: String }) buttonsClass = 'buttons';

  private handleReveal() {
    this.isRevealed = true;
    this.dispatchEvent(new CustomEvent('reveal'));
  }

  private handleRating(rating: string) {
    this.dispatchEvent(new CustomEvent('rating', {
      detail: { rating }
    }));
  }

  render() {
    return html`
      <div class="${this.cardClass}">
        <div class="${this.titleClass}"><slot name="front-title"></slot></div>
        <div class="${this.contentClass}"><slot name="front-content"></slot></div>
        
        ${!this.isRevealed 
          ? html`<div class="${this.buttonsClass}">
              <button class="button is-primary" @click=${this.handleReveal}>Reveal</button>
            </div>`
          : html`
            <div class="${this.titleClass}"><slot name="back-title"></slot></div>
            <div class="${this.contentClass}"><slot name="back-content"></slot></div>
            <div class="${this.buttonsClass}">
              <button class="button is-danger" @click=${() => this.handleRating('wrong')}>Wrong</button>
              <button class="button is-warning" @click=${() => this.handleRating('hard')}>Hard</button>
              <button class="button is-info" @click=${() => this.handleRating('good')}>Good</button>
              <button class="button is-success" @click=${() => this.handleRating('easy')}>Easy</button>
            </div>
          `
        }
      </div>
    `;
  }
}

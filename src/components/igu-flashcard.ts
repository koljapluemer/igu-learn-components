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

      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        margin-bottom: 1rem;
      }

      .title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: var(--color-primary);
      }

      .content {
        margin-bottom: 1rem;
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
    `
  ];

  @property({ type: Boolean }) isRevealed = false;

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
      <div class="card">
        <div class="title"><slot name="front-title"></slot></div>
        <div class="content"><slot name="front-content"></slot></div>
        
        ${!this.isRevealed 
          ? html`<div class="buttons">
              <button class="primary" @click=${this.handleReveal}>Reveal</button>
            </div>`
          : html`
            <div class="title"><slot name="back-title"></slot></div>
            <div class="content"><slot name="back-content"></slot></div>
            <div class="buttons">
              <button class="rating" @click=${() => this.handleRating('wrong')}>Wrong</button>
              <button class="rating" @click=${() => this.handleRating('hard')}>Hard</button>
              <button class="rating" @click=${() => this.handleRating('good')}>Good</button>
              <button class="rating" @click=${() => this.handleRating('easy')}>Easy</button>
            </div>
          `
        }
      </div>
    `;
  }
}

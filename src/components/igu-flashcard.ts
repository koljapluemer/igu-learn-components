import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('igu-flashcard')
export class IguFlashcard extends LitElement {
  static styles = css`
    :host {
      display: block;
      --igu-card-bg: #ffffff;
      --igu-card-border: 1px solid #e0e0e0;
      --igu-card-radius: 8px;
      --igu-card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      --igu-card-padding: 1.5rem;
      --igu-card-spacing: 1rem;

      --igu-title-color: #2c3e50;
      --igu-title-size: 1.25rem;
      --igu-title-weight: 600;
      --igu-title-spacing: 0.5rem;

      --igu-content-color: #4a5568;
      --igu-content-size: 1rem;
      --igu-content-spacing: 1rem;

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
      padding: var(--igu-card-padding);
      margin-bottom: var(--igu-card-spacing);
    }

    .title {
      color: var(--igu-title-color);
      font-size: var(--igu-title-size);
      font-weight: var(--igu-title-weight);
      margin-bottom: var(--igu-title-spacing);
    }

    .content {
      color: var(--igu-content-color);
      font-size: var(--igu-content-size);
      margin-bottom: var(--igu-content-spacing);
    }

    .buttons {
      display: flex;
      gap: var(--igu-button-spacing);
      justify-content: center;
      margin-top: var(--igu-card-spacing);
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
              <button @click=${this.handleReveal}>Reveal</button>
            </div>`
          : html`
            <div class="title"><slot name="back-title"></slot></div>
            <div class="content"><slot name="back-content"></slot></div>
            <div class="buttons">
              <button class="is-wrong" @click=${() => this.handleRating('wrong')}>Wrong</button>
              <button class="is-hard" @click=${() => this.handleRating('hard')}>Hard</button>
              <button class="is-good" @click=${() => this.handleRating('good')}>Good</button>
              <button class="is-easy" @click=${() => this.handleRating('easy')}>Easy</button>
            </div>
          `
        }
      </div>
    `;
  }
}

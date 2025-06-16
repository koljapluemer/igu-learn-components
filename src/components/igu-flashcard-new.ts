import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

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

      --igu-button-bg: #48bb78;
      --igu-button-color: #ffffff;
      --igu-button-radius: 4px;
      --igu-button-padding: 0.5rem 1rem;
      --igu-button-spacing: 0.5rem;
      --igu-button-hover-opacity: 0.9;

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
  `;

  private handleRemember() {
    this.dispatchEvent(new CustomEvent('remember'));
  }

  render() {
    return html`
      <div class="card">
        <div class="title"><slot name="front-title"></slot></div>
        <div class="content"><slot name="front-content"></slot></div>
        
        <div class="title"><slot name="back-title"></slot></div>
        <div class="content"><slot name="back-content"></slot></div>
        
        <div class="buttons">
          <button @click=${this.handleRemember}>Thanks, I will remember</button>
        </div>
      </div>
    `;
  }
}

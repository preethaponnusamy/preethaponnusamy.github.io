import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class CustomButtonRedirectPluginDev extends LitElement {
    static properties = {
        pluginLoaded: { type: Boolean },
        redirectUrl: { type: String },
        buttonLabel: { type: String }
    };

    static getMetaConfig() {
        return {
            groupName: "ONC Custom (Dont use)",
            controlName: 'Custom Button Dev',
            description: 'A button that redirects to a URL after form submission.',
            iconUrl: 'data-lookup',
            searchTerms: ['button', 'redirect', 'custom'],
            fallbackDisableSubmit: false,
            version: '1.1',
            pluginAuthor: 'Preetha Ponnusamy',
            standardProperties: {
                fieldLabel: true,
                description: true,
                visibility: true
            },
            properties: {
                redirectUrl: {
                    type: 'string',
                    title: 'Redirect URL',
                    description: 'URL to redirect after form submission',
                    required: true,
                    defaultValue: ''
                },
                buttonLabel: {
                    type: 'string',
                    title: 'Button Label',
                    description: 'Label to display on the button',
                    required: true,
                    defaultValue: 'Submit & Go to Website'
                }
            },
            events: ["ntx-value-change"]
        };
    }

    static styles = css`
        button.redirect-button {
        border-radius: var(--ntx-form-theme-border-radius);
        font-size: var(--ntx-form-theme-text-input-size);
        caret-color: var(--ntx-form-theme-color-input-text);
        color: var(--ntx-form-theme-color-input-text);
        border-color: var(--ntx-form-theme-color-border);
        font-family: var(--ntx-form-theme-font-family);
        background-color: var(--ntx-form-theme-color-input-background);
            border: none;
            color: black;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 100%;
            text-align: center;
        }

        @media (max-width: 600px) {
            button.redirect-button {
                font-size: 14px;
                padding: 8px 16px;
            }
        }
    `;

    constructor() {
        super();
        this.pluginLoaded = false;
        this.redirectUrl = '';
        this.buttonLabel = 'CustomSubmit';
    }


    render() {
        return html`
            <button class="form-control redirect-button" @click="${this.handleButtonClick}">
                ${this.buttonLabel}
            </button>
        `;
    }

    handleButtonClick(event) {
        event.preventDefault();
        this.triggerFormSubmission();
    }

    triggerFormSubmission() {
        const formElement = document.querySelector('form');
        if (formElement) {

            const saveButton = formElement.querySelector('button[data-e2e="btn-save-and-continue"]');
            if (saveButton) {
                // Create and dispatch a click event
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                saveButton.dispatchEvent(event);
            } else {
                console.error("Submit button not found!");
            }
        } else {
            console.error("Form not found!");
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.pluginLoaded) {
            this.pluginLoaded = true;
        }
    }


}

customElements.define('custom-button-redirectdev', CustomButtonRedirectPluginDev);

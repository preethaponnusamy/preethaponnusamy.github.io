import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class CustomButtonRedirectPluginDev extends LitElement {
    static properties = {
        pluginLoaded: { type: Boolean },
        redirectUrl: { type: String },
        buttonLabel: { type: String },
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
        /* Custom styles (not exposed, as you mentioned no button) */
    `;

    constructor() {
        super();
        this.pluginLoaded = false;
        this.redirectUrl = ''; 
        this.buttonLabel = 'CustomSubmit';
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.pluginLoaded) {
            this.pluginLoaded = true;

           
            const formElement = document.querySelector('form');
            if (formElement) {
                formElement.addEventListener('submit', this.handleFormSubmit.bind(this));
            } else {
                console.error("Form not found!");
            }
        }
    }

    handleFormSubmit(event) {
        event.preventDefault(); 
        if (this.redirectUrl) {
            setTimeout(() => {
                window.location.href = this.redirectUrl; 
            }, 100); 
        } else {
            console.error("Redirect URL is not provided!");
        }
    }

 
}
customElements.define('custom-button-redirectdev', CustomButtonRedirectPluginDev);

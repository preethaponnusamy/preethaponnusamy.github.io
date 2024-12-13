import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class CustomButtonRedirectPluginDev extends LitElement {
    static properties = {
        pluginLoaded: { type: Boolean },
        redirectUrl: { type: String },
        submitButtonClass: { type: String } 
    };

    static getMetaConfig() {
        return {
            groupName: "ONC Custom (Dont use)",
            controlName: 'Custom Button Dev',
            description: 'Redirects after form submission using an existing submit button by class name.',
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
                submitButtonClass: {
                    type: 'string',
                    title: 'Submit Button Class',
                    description: 'Class name of the submit button to attach redirection.',
                    required: true,
                    defaultValue: 'submit-button' 
                }
            },
            events: ["ntx-value-change"]
        };
    }

    static styles = css`
        /* No custom button styling */
    `;

    constructor() {
        super();
        this.pluginLoaded = false;
        this.redirectUrl = '';
        this.submitButtonClass = 'submit-button'; 
    }

    render() {
        return html``;  
    }

    handleSubmit(event) {
        event.preventDefault(); 
        if (this.redirectUrl) {
            setTimeout(() => {
                window.location.href = this.redirectUrl; 
            }, 100); 
        } else {
            console.error("Redirect URL is not provided!");
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.pluginLoaded) {
            this.pluginLoaded = true;
        }

       const formElement = document.querySelector('form');
        if (formElement) {
            const submitButton = formElement.querySelector(`button.${this.submitButtonClass}`);
            if (submitButton) {
                submitButton.addEventListener('click', (event) => {
                   this.handleSubmit(event); 
                });
            } else {
                console.log(`Submit button with class '${this.submitButtonClass}' not found!`);
            }
        } else {
            console.log("Form not found!");
        }
    }
}

customElements.define('custom-button-redirectdev', CustomButtonRedirectPluginDev);

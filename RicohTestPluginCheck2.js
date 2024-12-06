import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// define the component
export class RicohTestBasicPluginPreetha2 extends LitElement {

    static properties = {
        who: { type: String },
        message:{type: String}
    };

    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'TestPlugin1',
            fallbackDisableSubmit: false,
            version: '1.0',
            properties: {
                who: {
                    type: 'string',
                    title: 'Who',
                    description: 'Who to say hello to'
                },
                message: {
                    type: 'string',
                    title: 'Message',
                    description: 'Type a Message'
                }
            }
        };
    }

    constructor() {
        super();
        this.who = 'World';
    }

    render() {
        return html`<p>Hello ${this.who} ${this.message}<p/>`;
    }
}

// registering the web component
const elementName = 'ricoh-testplugin-preetha2';
customElements.define(elementName, RicohTestBasicPluginPreetha2);

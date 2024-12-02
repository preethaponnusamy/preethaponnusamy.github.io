import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class TestWebApiRequestDynamicControlsDev extends LitElement {

  static properties = {  
    pluginLoaded: { type: Boolean },  
    message: { type: String },
    webApiUrl: { type: String },
    headers: { type: String },
    isIntegratedAuth: { type: Boolean },
    jsonPaths: { type: Array },
  };

  static getMetaConfig() {
    return {
      groupName: "ONC Custom (Dont use)",
      controlName: 'Test WebApi Request Dynamic Control Dev',
      description: 'Make Web Api request including OnPrem, SPO',
      iconUrl: 'data-lookup',
      searchTerms: ['web', 'webapi'],
      fallbackDisableSubmit: false,
      version: '1.0',
      pluginAuthor: 'Preetha Ponnusamy',
      standardProperties: {
        fieldLabel: true,
        description: true,
        visibility: true
      },
      properties: {
        webApiUrl: {
          type: 'string',
          title: 'WebApi Url',
          description: 'Provide Web API Url',
          required: true,
          defaultValue: 'https://jsonplaceholder.typicode.com/todos'
        },
        headers: {
          type: 'string',
          title: 'Request header',
          description: 'Provide headers as JSON object',
          defaultValue: '{ "Accept" : "application/json" }'
        },
        isIntegratedAuth: {
          type: 'boolean',
          title: 'Is Integrated Authentication',
          description: 'Check yes for Windows Integrated Auth',
          defaultValue: false
        },
        jsonPaths: {
          type: 'array',
          title: 'JSON Path Array',
          description: 'Provide JSON Paths to retrieve dynamic properties (e.g., $.market, $.cities, $.countries)',
          items: { type: 'string' }
        },
       
      },
      events: ["ntx-value-change"]
    };
  }
  constructor() {
    super();
    this.message = 'Loading...';
    this.pluginLoaded = false;
  }

  render() {
    return html`
      <div>${this.message}</div>
    `;
  }

  _propagateOutcomeChanges(targetValue) {
    const args = {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: targetValue,
    };
    const event = new CustomEvent('ntx-value-change', args);
    this.dispatchEvent(event);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('webApiUrl')) {
      this.callApi();
    }
  }

  connectedCallback() {
    if (this.pluginLoaded) {
      return;
    }
    
  }
 
}

customElements.define('test-web-api-request-dynamiccontrols-dev', TestWebApiRequestDynamicControlsDev);

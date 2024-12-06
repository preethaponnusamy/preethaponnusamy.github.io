import { LitElement, css, html, unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { JSONPath } from 'https://cdn.jsdelivr.net/npm/jsonpath-plus@10.1.0/dist/index-browser-esm.min.js';
import Mustache from "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js";

export class TestWebApiRequestDev extends LitElement {

    static properties = {
        pluginLoaded: { type: Boolean },
        message: { type: String },
        webApiUrl: { type: String },
        headers: { type: String },
        isIntegratedAuth: { type: Boolean },
        jsonPath: { type: String },
        displayAs: { type: String },
        mustacheTemplate: { type: String },
        currentPageMode: { type: String },
        outcome: { type: String }
    }

    static getMetaConfig() {
        return {
            groupName: "ONC Custom (Dont use)",
            controlName: 'TestWebApi Request Dev',
            description: 'Make Web Api request including OnPrem, SPO',
            iconUrl: 'data-lookup',
            searchTerms: ['web', 'webapi'],
            fallbackDisableSubmit: false,
            version: '1.2',
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
                    description: 'Provide Web api Url',
                    required: true,
                    defaultValue: 'https://jsonplaceholder.typicode.com/todos'
                },
                headers: {
                    type: 'string',
                    title: 'Request header',
                    description: 'Provide headers as json object',
                    defaultValue: '{ "Accept" : "application/json" }'
                },
                isIntegratedAuth: {
                    type: 'boolean',
                    title: 'Is Integrated Authentication',
                    description: 'Check yes for Windows Integrated Auth',
                    defaultValue: false
                },
                jsonPath: {
                    type: 'string',
                    title: 'JSON Path',
                    description: 'Provide JSON Path to filter out data',
                    defaultValue: '$.[2].title.'
                },
                displayAs: {
                    type: 'string',
                    title: 'Display As',
                    description: 'Provide display type of the control',
                    defaultValue: 'Label'
                },
                mustacheTemplate: {
                    type: 'string',
                    title: 'Mustache Template',
                    description: 'Provide Mustache template (applicable for selected display type)',
                    defaultValue: ''
                },
                outcome: {
                    type: 'string',
                    title: 'Outcome',
                    description: 'If set, the value will be overridden by api response',
                    isValueField: true
                }
            },
            events: ["ntx-value-change", "dropdown1-change", "dropdown2-change"], // Define additional events for individual dropdowns
        };
    }

    static styles = css`
    select.webapi-control {            
      border-radius: var(--ntx-form-theme-border-radius);
      font-size: var(--ntx-form-theme-text-input-size);
      caret-color: var(--ntx-form-theme-color-input-text);
      color: var(--ntx-form-theme-color-input-text);
      border-color: var(--ntx-form-theme-color-border);
      font-family: var(--ntx-form-theme-font-family);
      background-color: var(--ntx-form-theme-color-input-background);
      line-height: var(--ntx-form-control-line-height, 1.25);
      min-height: 33px;
      height: auto;
      padding: 0.55rem;
      border: 1px solid #898f94;
      min-width: 70px;
      position: relative;
      display: block;
      box-sizing: border-box;
      width:100%;
      appearance: none;
      background-image: url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E);
      background-repeat: no-repeat;
      background-position: right 0.7rem top 50%;
      background-size: 0.65rem auto;
    }
    div.webapi-control{
      padding: 4px 0px 3px;
      color: #000;
    }
  `;

    constructor() {
        super()
        this.message = 'Loading...';
        this.webApi = '';
    }

    render() {
        return html`        
        <div>${this.message}</div>
    `
    }

    // Trigger change event for a dropdown
    _triggerDropdownChange(dropdownName, value) {
        const eventDetail = { [dropdownName]: value };
        const event = new CustomEvent(`${dropdownName}-change`, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: eventDetail
        });
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
        this.pluginLoaded = true;
        super.connectedCallback();
        var currentPageModeIndex = this.queryParam("mode");
        this.currentPageMode = (currentPageModeIndex == 0 ? "New" : (currentPageModeIndex == 1 ? "Edit" : "Display"))
        if (window.location.pathname == "/") {
            this.message = html`Please configure control`
            return;
        }

        if (!this.headers) {
            this.headers = '{ "Accept" : "application/json" }'
        }
        if (this.webApiUrl) {
            if (this.isValidJSON(this.headers)) {
                this.callApi();
            }
            else {
                this.message = html`Invalid Headers`
            }
        }
        else {
            this.message = html`Invalid WebApi Url`
        }
    }

    // This function is called when the dropdown changes (e.g., user selects a value)
    constructDropdownTemplate(items, output) {
        if (this.currentPageMode == 'New' || this.currentPageMode == 'Edit') {
            if (typeof items === 'string') {
                items = [items];
            }

            if (Array.isArray(items)) {
                var itemTemplates = [];
                for (var i of items) {
                    if (this.currentPageMode == 'Edit' && i == this.outcome) {
                        itemTemplates.push(html`<option selected>${i}</option>`);
                    }
                    else {
                        itemTemplates.push(html`<option>${i}</option>`);
                    }
                }

                output.push(html`<select class="form-control webapi-control" @change=${e => this._triggerDropdownChange('dropdown1', e.target.value)} >
                              ${itemTemplates}
                            </select>
                        `);
            }
            else {
                output.push(html`<p>WebApi response not returning any data.</p>`);
            }
        }
    }

    // Make the API call
    callApi() {
        this.outcome = "";
        const headersJson = this.isValidJSON(this.headers) ? JSON.parse(this.headers) : {};

        fetch(this.webApiUrl, {
            method: 'GET',
            headers: headersJson
        })
            .then(response => response.json())
            .then(data => {
                if (this.jsonPath) {
                    const jsonPathData = JSONPath({ path: this.jsonPath, json: data });
                    this.outcome = jsonPathData;
                    this.message = html`Data has been fetched and filtered based on JSON path.`;
                }
                else {
                    this.outcome = data;
                    this.message = html`Data has been fetched.`;
                }
                this.requestUpdate();
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                this.message = html`Error fetching data: ${err.message}`;
            });
    }

    // Utility method to check if JSON string is valid
    isValidJSON(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}

customElements.define('test-webapi-request-dev', TestWebApiRequestDev);

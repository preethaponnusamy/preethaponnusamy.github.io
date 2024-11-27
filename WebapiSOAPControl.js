import { LitElement, css, html, unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { JSONPath } from 'https://cdn.jsdelivr.net/npm/jsonpath-plus@10.1.0/dist/index-browser-esm.min.js';
import Mustache from "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js";
export class PreethaWebApiRequestSOAPDev extends LitElement {

    static properties = {
        pluginLoaded: { type: Boolean },
        message: { type: String },
        endpointUrl: { type: String },
        // serviceID: { type: String },
        // servicePassword: { type: String },
        // eradNamespaceURI: { type: String },
        // SOAPBody: { type: String },
        soapEnvelope: { type: String },
        soapAction: { type: String },
        headers: { type: String },
        isIntegratedAuth: { type: Boolean },
        jsonPath: { type: String },
        displayAs: { type: String },
        mustacheTemplate: { type: String },
        currentPageMode: { type: String },
        outcome: { type: String },
        response: { type: String },
        sortOrder: { type: String },
        defaultMessage: { type: String }
    };

    static getMetaConfig() {
        return {
            groupName: "ONC Custom (Dont use)",
            controlName: 'WebApi SOAP Request Dev',
            description: 'Make Web Api request SOAP',
            iconUrl: 'data-lookup',
            searchTerms: ['soap', 'webapi'],
            fallbackDisableSubmit: false,
            version: '1.1',
            pluginAuthor: 'Preetha Ponnusamy',
            standardProperties: {
                fieldLabel: true,
                description: true,
                visibility: true
            },
            properties: {
                // serviceID: {
                //     type: 'string',
                //     title: 'Service ID',
                //     description: 'Provide Service ID',
                //     required: true,
                // },
                // servicePassword: {
                //     type: 'string',
                //     title: 'Service Password',
                //     description: 'Provide Service Password',
                //     required: true,
                // },
                // eradNamespaceURI: {
                //     type: 'string',
                //     title: 'Namespace URI for erad',
                //     description: 'Provide Namespace URI for erad',
                //     required: true,
                // },
                // SOAPBody: {
                //     type: 'string',
                //     title: 'SOAP Body',
                //     description: 'Provide SOAP Body',
                //     required: true,
                // },
                endpointUrl: {
                    type: 'string',
                    title: 'SOAP Endpoint',
                    description: 'Provide SOAP Endpoint ',
                    required: true,
                    defaultValue: 'https://jsonplaceholder.typicode.com/todos'
                },
                soapEnvelope: {
                    type: 'string',
                    title: 'SOAP Envelope',
                    description: 'Provide SOAP Envelope',
                    required: true,
                },
                soapAction: {
                    type: 'string',
                    title: 'SOAP Action',
                    description: 'Provide SOAP Action',
                    required: true,
                },
                headers: {
                    type: 'string',
                    title: 'Request header',
                    description: 'Provide headers as json object',
                    defaultValue: 'Content-Type: "text/xml"; charset="utf-8"'
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
                    enum: ['Label', 'Dropdown', 'Label using Mustache Template'],
                    description: 'Provide display type of the control',
                    defaultValue: 'Label'
                },
                defaultMessage: {
                    type: 'string',
                    title: 'Default Option for Dropdown',
                    description: 'Please provide the default label message',
                    defaultValue: 'Please select an option'
                },
                sortOrder: {
                    type: 'string',
                    title: 'Sort Order',
                    description: 'Sort order of the Dropdown control.',
                    enum: ['asc', 'desc'],
                    defaultValue: 'asc'
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
            events: ["ntx-value-change"],
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
        super();
        this.message = 'Loading...';
        this.response = '';
        this.jsonData = null;
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
    connectedCallback() {
        if (this.pluginLoaded) {
            return;
        }
        this.pluginLoaded = true;
        var currentPageModeIndex = this.queryParam("mode");
        this.currentPageMode = (currentPageModeIndex == 0 ? "New" : (currentPageModeIndex == 1 ? "Edit" : "Display"))
        super.connectedCallback();
        // if (!this.serviceID) {
        //     this.message = "Service ID is required.";
        //     return;
        // }
        // if (!this.servicePassword) {
        //     this.message = "Service Password is required.";
        //     return;
        // }
        // if (!this.eradNamespaceURI) {
        //     this.message = "Namespace URI for erad is required.";
        //     return;
        // }
        // if (!this.SOAPAction) {
        //     this.message = "SOAP Action is required.";
        //     return;
        // }
        // if (!this.SOAPBody) {
        //     this.message = "SOAP Body is required.";
        //     return;

        // }
        if (!this.soapEnvelope) {
            this.message = "SOAP Envelope is required.";
            return;
        }
        if (!this.soapAction) {
            this.message = "SOAP Action is required.";
            return;
        }
        if (!this.endpointUrl) {
            this.message = "SOAP Endpoint is required.";
            return;
        }
        else {
            console.log("Calling SOAP endpoint - start");
            this.makeSoapRequest();
            console.log("Calling SOAP endpoint - end");
        }
    }

    // Send SOAP request when the component is first updated 
    updated(changedProperties) {
        super.updated(changedProperties);
        if (!changedProperties.has('response')) {
            this.makeSoapRequest();
        }
    }

    async makeSoapRequest() {
        // const serviceID = this.serviceID;
        // const servicePassword = this.servicePassword;
        //     const soapEnvelope = `
        //   <soapenv:Envelope xmlns:erad="${this.eradNamespaceURI}" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        //     <soapenv:Header>
        //       <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        //         <wsse:UsernameToken wsu:Id="UsernameToken-4EC151B4BE18CC0AB515084488315391">
        //           <wsse:Username>${serviceID}</wsse:Username>
        //           <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${servicePassword}</wsse:Password>
        //         </wsse:UsernameToken>
        //       </wsse:Security>
        //     </soapenv:Header>
        //     <soapenv:Body>
        //       ${this.SOAPBody}
        //     </soapenv:Body>
        //   </soapenv:Envelope>`;
        const soapEnvelopeData = this.soapEnvelope;
        try {
            const response = await fetch(this.endpointUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml; charset="utf-8"',
                    'SOAPAction': this.soapAction,
                },
                body: soapEnvelopeData,
            });

            if (response.ok) {
                const xml = await response.text();
                this.response = xml;
                var jsonData = this.parseXmlToJson(xml);
                jsonData = this.filterJson(jsonData);
                console.log(jsonData);
                this.plugToForm(jsonData);
            } else {
                this.response = 'Error: ' + response.statusText;
            }
        } catch (error) {
            this.response = 'Error: ' + error.message;
        }
    }
    xmlToJson(xml) {
        const obj = {};

        if (xml.nodeType === 1) {
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (let i = 0; i < xml.attributes.length; i++) {

                    const attribute = xml.attributes.item(i);

                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;

                }

            }

        } else if (xml.nodeType === 3) { // Text node

            obj["#text"] = xml.nodeValue.trim();

        }

        // Process child nodes

        if (xml.hasChildNodes()) {

            for (let i = 0; i < xml.childNodes.length; i++) {

                const child = xml.childNodes.item(i);

                const nodeName = child.nodeName;

                if (!obj[nodeName]) {

                    obj[nodeName] = this.xmlToJson(child);

                } else {

                    if (!Array.isArray(obj[nodeName])) {

                        obj[nodeName] = [obj[nodeName]];

                    }

                    obj[nodeName].push(this.xmlToJson(child));

                }

            }

        }

        return obj;

    }

    parseXmlToJson(xmlResponse) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlResponse, 'text/xml');
        this.jsonData = this.xmlToJson(xmlDoc);
        return this.jsonData;
    }
    filterJson(jsonData) {
        if (!this.jsonPath) {
            this.jsonPath = "$."
        }
        if (jsonData) {
            var result = JSONPath({ path: this.jsonPath, json: jsonData });
            if (result.length == 1 && this.jsonPath.endsWith(".")) {
                result = result[0]
            }
            return result;
        }
    }
    plugToForm(jsonData) {
        if (this.displayAs == "Label") {
            this.constructLabelTemplate(jsonData)
        }
        else if (this.displayAs == "Dropdown") {
            this.constructDropdownTemplate(jsonData)
        }
        else if (this.displayAs == "Label using Mustache Template") {
            this.constructLabelUsingMustacheTemplate(jsonData)
        }
        this._propagateOutcomeChanges(this.outcome);
    }

    constructLabelTemplate(jsonData) {
        var outputTemplate = "";
        var htmlTemplate = html``;

        if (typeof jsonData === 'string' || jsonData instanceof String) {
            outputTemplate = jsonData;
        }
        if (this.isInt(jsonData)) {
            outputTemplate = jsonData.toString();
        }
        if (typeof jsonData == 'boolean') {
            outputTemplate = (jsonData == true ? "true" : "false");
        }
        htmlTemplate = html`<div class="form-control webapi-control">${outputTemplate}</div>`;

        this.outcome = outputTemplate;
        this.message = html`${htmlTemplate}`
    }

    constructDropdownTemplate(items) {
        if (typeof items === 'string') {
            items = [items];
        }

        if (Array.isArray(items)) {
            if (this.sortOrder === 'asc') {
                items.sort((a, b) => a > b ? 1 : -1);
            } else if (this.sortOrder === 'desc') {
                items.sort((a, b) => a < b ? 1 : -1);
            }
        }
        if (this.currentPageMode == 'New' || this.currentPageMode == 'Edit') {
            if (Array.isArray(items)) {
                var itemTemplates = [];
                itemTemplates.push(html`<option value="" disabled selected>${this.defaultMessage || 'Select an option'}</option>`);
                for (var i of items) {
                    if (this.currentPageMode == 'Edit' && i == this.outcome) {
                        itemTemplates.push(html`<option selected>${i}</option>`);
                    }
                    else {
                        itemTemplates.push(html`<option>${i}</option>`);
                    }
                }

                this.message = html`<select class="form-control webapi-control" @change=${e => this._propagateOutcomeChanges(e.target.value)} >
                              ${itemTemplates}
                            </select>
                        `
            }
            else {
                this.message = html`<p>WebApi response not in array. Check WebApi Configuration</p>`
            }
        }
        else {
            this.constructLabelTemplate(this.outcome);
        }
    }

    constructLabelUsingMustacheTemplate(jsonData) {
        var rawValue = "";
        var htmlTemplate = html``;

        if (typeof jsonData === 'string' || jsonData instanceof String) {
            rawValue = jsonData;
        }
        if (this.isInt(jsonData)) {
            rawValue = jsonData.toString();
        }
        if (typeof jsonData == 'boolean') {
            rawValue = (jsonData == true ? "true" : "false");
        }
        if (Array.isArray(jsonData)) {
            rawValue = jsonData;
        }

        var outputTemplate = Mustache.render(this.mustacheTemplate, rawValue);

        htmlTemplate = html`<div class="form-control webapi-control">${unsafeHTML(outputTemplate)}</div>`;

        this.outcome = rawValue;
        this.message = html`${htmlTemplate}`
    }

    isInt(value) {
        return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
    }
    queryParam(param) {
        const urlParams = new URLSearchParams(decodeURIComponent(window.location.search.replaceAll("amp;", "")));
        return urlParams.get(param);
    }

    render() {
        return html`        
        <div>${this.message}</div>
    `
    }
}
const elementName = 'preetha-webapi-soap-request-dev';
customElements.define(elementName, PreethaWebApiRequestSOAPDev);
import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import {JSONPath} from 'https://cdn.jsdelivr.net/npm/jsonpath-plus@10.1.0/dist/index-browser-esm.min.js';

export class PreethaWebApiRequestSOAPDev extends LitElement {

    static properties = {
        who: { type: String },
        response: { type: String },
    };

    static getMetaConfig() {
        return {
            groupName: "ONC Custom (Dont use)",
            controlName: 'WebApi SOAP Request Dev',
            description: 'Make Web Api request SOAP',
            iconUrl: 'data-lookup',
            searchTerms: ['soap', 'webapi'],
            fallbackDisableSubmit: false,
            version: '1.0',
            pluginAuthor: 'Preetha Ponnusamy',
            standardProperties: {
                fieldLabel: true,
                description: true,
                visibility: true
            },
            properties: {
                who: {
                    type: 'string',
                    title: 'Who',
                    description: 'Who to say hello to'
                }
            }
        };
    }

    constructor() {
        super();
        this.who = 'World';
        this.response = '';
        this.jsonData=null;
    }

    connectedCallback() {
        super.connectedCallback();
        console.log("Calling SOAP endpoint - start");
        this.makeSoapRequest();
        console.log("Calling SOAP endpoint - end");
    }

    // Send SOAP request when the component is first updated 
    updated(changedProperties) {
        super.updated(changedProperties);
        if (!changedProperties.has('response')) {
            this.makeSoapRequest();
        }
    }

    async makeSoapRequest() {
        const serviceID = 'era-pmt-branchinfo-serviceid';
        const servicePassword = '_pkJ59$=XVs.gWM7wP:539p$_$@]uX';
        const soapEnvelope = `
      <soapenv:Envelope xmlns:erad="http://www.pnc.com/pmt/ERADBLookupService" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Header>
          <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            <wsse:UsernameToken wsu:Id="UsernameToken-4EC151B4BE18CC0AB515084488315391">
              <wsse:Username>${serviceID}</wsse:Username>
              <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${servicePassword}</wsse:Password>
            </wsse:UsernameToken>
          </wsse:Security>
        </soapenv:Header>
        <soapenv:Body>
          <erad:MarketNameRequest>
            <erad:listMarkets>true</erad:listMarkets>
            <erad:listFutureMarkets>false</erad:listFutureMarkets>
          </erad:MarketNameRequest>
        </soapenv:Body>
      </soapenv:Envelope>`;
        // const serviceID='ERA-PMT-PNCIHierarchyInfo-serviceID';
        // const servicePassword='R404?d!$5dsiC3YagT+1A$M*iSUcqZ';
        // const nonce='BwFC2HW6jfMgHr/N9OCyfw==';
        // const createdDate='2017-12-14T21:23:28.843Z';
        // const repIDInfo='1234';
        //  const soapEnvelope = `<soapenv:Envelope xmlns:get="http://www.pnc.com/pmt/GetRKIInfoService" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        //        <soapenv:Header>
        //        <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        //            <wsse:UsernameToken wsu:Id="UsernameToken-1">
        //                <wsse:Username>${serviceID}</wsse:Username>
        //                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${servicePassword}</wsse:Password>
        //                <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${nonce}</wsse:Nonce>
        //                <wsu:Created>${createdDate}</wsu:Created>
        //            </wsse:UsernameToken>
        //        </wsse:Security>
        //        </soapenv:Header>
        //        <soapenv:Body>
        //            <get:PNCIHierarchyInfoRequest><get:rep_id>${repIDInfo}</get:rep_id></get:PNCIHierarchyInfoRequest>
        //         </soapenv:Body>
        //    </soapenv:Envelope>`;

        try {
            const response = await fetch('https://pmt-sst-qa.pncint.net/pmt-eradblookupservice', {
                // const response = await fetch('https://pmt-sst-qa.pncint.net/pmt-getrkiinfoService', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml; charset="utf-8"',
                    'SOAPAction': 'getMarketNameList',
                    // 'SOAPAction': 'getPNCIHierarchyInfo',
                },
                body: soapEnvelope,
            });

            if (response.ok) {
                const xml = await response.text();
                this.response = xml;
                var jsonData=this.parseXmlToJson(xml);
                jsonData=this.filterJson(jsonData);
                console.log(jsonData);
                // Handle the XML response here
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
    filterJson(jsonData){     
        if(!this.jsonPath){
          this.jsonPath = "$."
        }        
        if(jsonData){         
            var result = JSONPath({path: this.jsonPath, json: jsonData});        
            if (result.length == 1 && this.jsonPath.endsWith(".")) {
                result = result[0]
              }        
            return result;
        }
      }
     plugToForm(jsonData){      
    if(this.displayAs == "Label"){
      this.constructLabelTemplate(jsonData)
    }     
    else if(this.displayAs == "Dropdown"){
      this.constructDropdownTemplate(jsonData)
    } 
    else if(this.displayAs == "Label using Mustache Template"){
      this.constructLabelUsingMustacheTemplate(jsonData)
    }         
    this._propagateOutcomeChanges(this.outcome);
  }

  constructLabelTemplate(jsonData){            
      var outputTemplate = "";
      var htmlTemplate = html``;
      
      if(typeof jsonData === 'string' || jsonData instanceof String){
        outputTemplate = jsonData;
      }    
      if(this.isInt(jsonData)){
        outputTemplate = jsonData.toString();
      }
      if(typeof jsonData == 'boolean'){
        outputTemplate = (jsonData == true ? "true" : "false");
      }
      htmlTemplate = html`<div class="form-control webapi-control">${outputTemplate}</div>`;
      
      this.outcome = outputTemplate;      
      this.message = html`${htmlTemplate}`            
  }

  constructDropdownTemplate(items){    
    if(this.currentPageMode == 'New' || this.currentPageMode == 'Edit'){
      if(Array.isArray(items)){
        var itemTemplates = [];
        for (var i of items) {
          if(this.currentPageMode == 'Edit' && i == this.outcome){
            itemTemplates.push(html`<option selected>${i}</option>`);
          }          
          else{
            itemTemplates.push(html`<option>${i}</option>`);
          }          
        }
        
        this.message = html`<select class="form-control webapi-control" @change=${e => this._propagateOutcomeChanges(e.target.value)} >
                              ${itemTemplates}
                            </select>
                        `       
      }
      else{
        this.message = html`<p>WebApi response not in array. Check WebApi Configuration</p>`
      }
    }    
    else{
      this.constructLabelTemplate(this.outcome);
    }    
  }

  constructLabelUsingMustacheTemplate(jsonData){            
      var rawValue = "";
      var htmlTemplate = html``;
      
      if(typeof jsonData === 'string' || jsonData instanceof String){
        rawValue = jsonData;
      }    
      if(this.isInt(jsonData)){
        rawValue = jsonData.toString();
      }
      if(typeof jsonData == 'boolean'){
        rawValue = (jsonData == true ? "true" : "false");
      }
      if(Array.isArray(jsonData)){
        rawValue = jsonData;
      }
      
      var outputTemplate = Mustache.render(this.mustacheTemplate, rawValue);                     

      htmlTemplate = html`<div class="form-control webapi-control">${unsafeHTML(outputTemplate)}</div>`;
      
      this.outcome = rawValue;      
      this.message = html`${htmlTemplate}`                  
  }

  isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }

    render() {
        return html`
      <p>Hello ${this.who},</p>
      <p>Response: ${this.response}</p>
    `;
    }
}
const elementName = 'preetha-webapi-soap-request-dev';
customElements.define(elementName, PreethaWebApiRequestSOAPDev);

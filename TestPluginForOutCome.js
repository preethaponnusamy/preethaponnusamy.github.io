import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// Define the custom web component
export class TestPluginForOutcome extends LitElement {
  static properties = {
    who: { type: String },
    employeeInfo: { type: Object },  // Define an object property to handle employee information
  };

  // Meta configuration
  static getMetaConfig() {
    return {
      controlName: 'TestOutcome',
      fallbackDisableSubmit: false,
      version: '1.3',  // Updated version to reflect changes
      properties: {
         employeeInfo: {
          type: 'object',
          title: 'Employee Info',
          description: 'Contains employee details like FirstName, LastName, and EmployeeID',
        }
      },
            events: ["ntx-value-change"],
    };
  }

  // Constructor to initialize properties
  constructor() {
    super();
    this.who = 'World';
    this.employeeInfo = {
      FirstName: '',
      LastName: '',
      EmployeeID: '',
    };
  }

  // Render the component
  render() {
    return html`
      <p>Hello ${this.who}</p>
      <p>Employee Name: ${this.employeeInfo.FirstName} ${this.employeeInfo.LastName}</p>
      <p>Employee ID: ${this.employeeInfo.EmployeeID}</p>
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
  // Method to simulate accessing form data from Nintex
  updateEmployeeInfo(newFirstName, newLastName, newEmployeeID) {
    this.employeeInfo.FirstName = newFirstName;
    this.employeeInfo.LastName = newLastName;
    this.employeeInfo.EmployeeID = newEmployeeID;
    this.requestUpdate();
    this._propagateOutcomeChanges(this.outcome);
  }
  connectedCallback(){
  this.updateEmployeeInfo("Preetha","P","2561361")
  }
}

// Register the custom element
const elementName = 'test-outcome';
customElements.define(elementName, TestPluginForOutcome);


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
        who: {
          type: 'string',
          title: 'Who',
          description: 'Who to say hello to',
        },
        employeeInfo: {
          type: 'object',
          title: 'Employee Info',
          description: 'Contains employee details like FirstName, LastName, and EmployeeID',
        }
      }
    };
  }

  // Constructor to initialize properties
  constructor() {
    super();
    this.who = 'World';
    this.employeeInfo = {
      FirstName: 'John',
      LastName: 'Doe',
      EmployeeID: '12345',
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

  // Method to simulate accessing form data from Nintex
  updateEmployeeInfo(newFirstName, newLastName, newEmployeeID) {
    this.employeeInfo.FirstName = newFirstName;
    this.employeeInfo.LastName = newLastName;
    this.employeeInfo.EmployeeID = newEmployeeID;
    this.requestUpdate();
  }
}

// Register the custom element
const elementName = 'test-outcome';
customElements.define(elementName, TestPluginForOutcome);

// Assuming the Nintex Form plugin provides the form context
function handleObjectCustomField(formContext) {
  // Access the custom field designated as the "value field" (EmployeeInfo)
  const employeeInfoControl = formContext.control('EmployeeInfo');

  // Get the value of the EmployeeInfo field (this is an object with FirstName, LastName, EmployeeID)
  const employeeInfo = employeeInfoControl.value; // assuming it returns an object like {FirstName, LastName, EmployeeID}

  // Access fields using dot notation
  const firstName = employeeInfo.FirstName;
  const lastName = employeeInfo.LastName;
  const employeeID = employeeInfo.EmployeeID;

  // Output the data for further processing in the plugin
  console.log('Employee Info:', employeeInfo);
  console.log(`Name: ${firstName} ${lastName}`);
  console.log('Employee ID:', employeeID);

  // If you need to update the value of EmployeeInfo, you can do so like this:
  employeeInfoControl.value.FirstName = 'Jane';
  employeeInfoControl.value.LastName = 'Smith';
  employeeInfoControl.value.EmployeeID = '54321';

  // Trigger the plugin output, which could be sent to a workflow or other areas
  return {
    EmployeeInfo: employeeInfo,  // Return the entire object
    FirstName: firstName,
    LastName: lastName,
    EmployeeID: employeeID
  };
}

// Example usage of the handleObjectCustomField function within the form context
const formContext = {
  control: (controlName) => ({
    value: {
      FirstName: 'John',
      LastName: 'Doe',
      EmployeeID: '12345'
    },
    // You could also define other methods like setValue, getValue, etc. if needed.
  })
};

// Call the function to handle the EmployeeInfo field
const result = handleObjectCustomField(formContext);
console.log(result);

import { LitElement, css, html } from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";

export class OncTest extends LitElement {
  static properties = {
    pluginLoaded: { type: Boolean },
    message: { type: String },
    inputData: { type: String },
    separator: { type: String },
    defaultMessage: { type: String },
    outcome: { type: String },
  };

  static getMetaConfig() {
    return {
      groupName: "ONC Custom",
      controlName: "Dropdown Choice",
      description: "A dropdown control for displaying data from a string.",
      iconUrl: "dropdown",
      searchTerms: ["dropdown"],
      fallbackDisableSubmit: false,
      version: "1.0",
      pluginAuthor: "Preetha Ponnusamy",
      standardProperties: {
        fieldLabel: true,
        description: true,
        visibility: true,
      },
      properties: {
        inputData: {
          type: "string",
          title: "Input Data",
          description: "Comma-separated values to populate the dropdown",
          defaultValue: "",
        },
        separator: {
          type: "string",
          title: "Separator",
          description: "The separator used to split the input data",
          defaultValue: ",",
        },
        defaultMessage: {
          type: "string",
          title: "Default Message",
          description: "The default text displayed in the dropdown",
          defaultValue: "Please select an option",
        },
        outcome: {
          type: "string",
          title: "Outcome",
          description: "The selected value",
          isValueField: true,
          standardProperties: {
            visibility: false,
          },
        },
      },
      events: ["ntx-value-change"],
    };
  }

  static styles = css`
    select.custom-dropdown {
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
      width: 100%;
    }
  `;

  constructor() {
    super();
    this.message = "Please select an option";
    this.inputData = "";
    this.separator = ",";
    this.defaultMessage = "Please select an option";
  }

  render() {
    return html`
      <div>${this.message}</div>
      <div>
        ${this.renderDropdown()}
      </div>
    `;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("inputData")) {
      this.message = this.inputData ? "Please select an option" : "Invalid input data";
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.inputData && this.separator) {
      this.renderDropdown();
    } else {
      this.message = "Please provide valid inputData and separator.";
    }
  }

  renderDropdown() {
    const items = this.inputData.split(this.separator);

    const itemTemplates = items.map(
      (item) => html`<option value="${item}" ?selected="${item === this.outcome}">
        ${item}
      </option>`
    );

    return html`
      <select
        class="custom-dropdown"
        @change="${(e) => this._handleSelectionChange(e.target.value)}"
      >
        <option value="" disabled ?selected="${!this.outcome}">
          ${this.defaultMessage}
        </option>
        ${itemTemplates}
      </select>
    `;
  }

  _handleSelectionChange(selectedValue) {
    this.outcome = selectedValue;
    this.message = selectedValue ? `You selected: ${selectedValue}` : this.defaultMessage;
   this._propagateOutcomeChanges(selectedValue);
  }

  _propagateOutcomeChanges(targetValue) {
    if (!targetValue) return;
    const args = {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: targetValue,
    };
    const event = new CustomEvent("ntx-value-change", args);
    this.dispatchEvent(event);
  }
}

customElements.define("onc-test", OncTest);

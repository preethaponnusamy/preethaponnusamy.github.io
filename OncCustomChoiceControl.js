import {
  LitElement,
  css,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";

export class OncCustomChoiceDev extends LitElement {
  static properties = {
    pluginLoaded: { type: Boolean },
    message: { type: String },
    inputData: { type: String },
    seperator: { type: String },
    displayAs: { type: String },
    currentPageMode: { type: String },
    outcome: { type: String },
    sortOrder: { type: String },
    defaultMessage: { type: String },
  };

  static getMetaConfig() {
    return {
      groupName: "ONC Custom (Dont use)",
      controlName: "Custom Choice Dev",
      description:
        "Choice control display data from SharePoint Multiline text control",
      iconUrl: "data-lookup",
      searchTerms: ["choice", "dropdown", "checkbox"],
      fallbackDisableSubmit: false,
      version: "1.2",
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
          description:
            "Provide the data (string) from the SharePoint column/api response, which will be displayed as options in the control",
          defaultValue: "",
        },
        separator: {
          type: "string",
          title: "Separator",
          description: "Provide seperator to split the input string",
          defaultValue: ",",
        },
        displayAs: {
          type: "string",
          title: "Display As",
          enum: ["Dropdown", "Radio", "Multi-Select Dropdown", "Checkbox"],
          defaultValue: "Dropdown",
          description: "Provide display type of the control",
        },
        defaultMessage: {
          type: "string",
          title: "Default Option for Dropdown",
          description:
            "Provide default selected text (applicable when Display As is set to Dropdown)",
          defaultValue: "Please select an option",
        },
        sortOrder: {
          type: "string",
          title: "Sort Order",
          description: "Sorting order for selected display type",
          enum: ["As Is", "Asc", "Desc"],
          defaultValue: "",
        },
        outcome: {
          type: "string",
          title: "Outcome",
          description:
            "If set, the value will be overridden by plugin response.This will store selected values.",
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
    select.customchoice-control,.custom-multiselect-dropdown {
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
      width: 100%;
      appearance: none;
      background-image: url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E);
      background-repeat: no-repeat;
      background-position: right 0.7rem top 50%;
      background-size: 0.65rem auto;
    }
    div.custom-multiselect-dropdown {
      padding: 4px 0px 3px;
      color: #000;
    }
    .custom-checkbox-group {
      display: block;
    }

    .custom-checkbox-group label {
      display: block;
      margin-right: 5px;
    }
    .custom-multiselect-dropdown {
      padding: 0.35rem;
    }

    .custom-multiselect-dropdown .custom-dropdown-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
    }

    .custom-multiselect-dropdown .custom-dropdown-content {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      z-index: 1;
      max-height: 200px;
      overflow-y: auto;
      padding: 10px;
      display: none;
    }

    .custom-multiselect-dropdown.open .custom-dropdown-content {
      display: block;
    }

    .custom-dropdown-content label {
      display: block;
      padding: 5px 0;
      cursor: pointer;
    }

    .custom-dropdown-content input[type="checkbox"] {
      margin-right: 10px;
    }
  `;

  constructor() {
    super();
    this.message = "Loading...";
    this.inputData = "";
  }

  render() {
    return html` <div>${this.message}</div> `;
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
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("inputData")) {
      this.plugToForm();
    }
  }
  connectedCallback() {
    if (this.pluginLoaded) {
      return;
    }
    this.pluginLoaded = true;
    super.connectedCallback();
    var currentPageModeIndex = this.queryParam("mode");
    this.currentPageMode =
      currentPageModeIndex == 0
        ? "New"
        : currentPageModeIndex == 1
        ? "Edit"
        : "Display";
    if (event.target.innerText == "Edit") this.currentPageMode = "Edit";
    if (!this.inputData) {
      this.message = html`Please provide valid inputData`;
    }
    if (!this.separator) {
      this.message = html`Please provide valid separator`;
    }
    if (this.inputData && this.separator && this.displayAs) {
      this.plugToForm();
    } else {
      this.message = html`Please configure control`;
      return;
    }
  }
  plugToForm() {
    var items;
    if (typeof this.inputData === "string") {
      let sp = this.separator.replace(/\\n/g, "\n");
      items = this.inputData.split(sp);
    }

    if (this.displayAs == "Dropdown") {
      this.constructDropdownTemplate(items);
    } else if (this.displayAs == "Checkbox") {
      this.constructCheckboxTemplate(items);
    } else if (this.displayAs == "Multi-Select Dropdown") {
      this.constructDropdownWithMultiSelectTemplate(items);
    } else if (this.displayAs == "Radio") {
      this.constructRadioButtonTemplate(items);
    }
    this._propagateOutcomeChanges(this.outcome);
  }

  constructDropdownTemplate(items) {
    if (Array.isArray(items)) {
      if (this.sortOrder === "Asc") {
        items.sort((a, b) => (a > b ? 1 : -1));
      } else if (this.sortOrder === "Desc") {
        items.sort((a, b) => (a < b ? 1 : -1));
      }
    }
    if (this.currentPageMode == "New" || this.currentPageMode == "Edit") {
      if (Array.isArray(items)) {
        var itemTemplates = [];
        itemTemplates.push(
         html`<option value="" disabled ?selected="${!this.outcome}">
            ${this.defaultMessage || "Please select an option"}
          </option>`
        );
        for (var i of items) {
          if (this.currentPageMode == "Edit" && i == this.outcome) {
            itemTemplates.push(html`<option selected>${i}</option>`);
          } else {
            itemTemplates.push(html`<option>${i}</option>`);
          }
        }

        this.message = html`<select
          class="form-control customchoice-control"
          @change=${(e) => this._propagateOutcomeChanges(e.target.value)}
        >
          ${itemTemplates}
        </select> `;
      } else {
        this.message = html`<p>
          Invalid input. Please check the configuration
        </p>`;
      }
    } else {
      this.constructLabelTemplate(this.outcome);
    }
  }

  constructCheckboxTemplate(items) {
    if (Array.isArray(items)) {
      if (this.sortOrder === "Asc") {
        items.sort((a, b) => (a > b ? 1 : -1));
      } else if (this.sortOrder === "Desc") {
        items.sort((a, b) => (a < b ? 1 : -1));
      }
    }

    if (this.currentPageMode == "New" || this.currentPageMode == "Edit") {
      if (Array.isArray(items)) {
        let checkboxTemplates = [];
        for (let i of items) {
          const isChecked = this.outcome && this.outcome.includes(i);
          checkboxTemplates.push(html`
            <label>
              <input
                type="checkbox"
                value="${i}"
                ?checked="${isChecked}"
                @change=${(e) => this._handleCheckboxChange(e, i)}
              />
              ${i}
            </label>
          `);
        }

        this.message = html`
          <div class="form-control custom-checkbox-group">${checkboxTemplates}</div>
        `;
      } else {
        this.message = html`<p>
          Invalid input. Please check the configuration
        </p>`;
      }
    } else {
      this.constructLabelTemplate(this.outcome);
    }
  }
  _handleCheckboxChange(e, item) {
    let selectedValues = [...(this.outcome || [])];

    if (e.target.checked) {
      selectedValues.push(item);
    } else {
      selectedValues = selectedValues.filter((val) => val !== item);
    }
    this.outcome = selectedValues;
    this._propagateOutcomeChanges(selectedValues);
  }
  constructLabelTemplate(input) {
    var outputTemplate = "";
    var htmlTemplate = html``;

    if (typeof input === "string" || input instanceof String) {
      outputTemplate = input;
    }
    if (this.isInt(input)) {
      outputTemplate = input.toString();
    }
    if (typeof input == "boolean") {
      outputTemplate = input == true ? "true" : "false";
    }
    htmlTemplate = html`<div class="form-control customchoice-control">
      ${outputTemplate}
    </div>`;

    this.outcome = outputTemplate;
    this.message = html`${htmlTemplate}`;
  }

  constructDropdownWithMultiSelectTemplate(items) {
    if (Array.isArray(items)) {
      if (this.sortOrder === "Asc") {
        items.sort((a, b) => (a > b ? 1 : -1));
      } else if (this.sortOrder === "Desc") {
        items.sort((a, b) => (a < b ? 1 : -1));
      }
    }
    if (this.currentPageMode == "New" || this.currentPageMode == "Edit") {
      if (Array.isArray(items)) {
        let optionTemplates = [];
        for (let i of items) {
          const isSelected = this.outcome && this.outcome.includes(i);
          optionTemplates.push(html`
            <label>
              <input
                type="checkbox"
                value="${i}"
                ?checked="${isSelected}"
                @change=${(e) => this._handleMultiSelectChange(e)}
              />
              ${i}
            </label>
          `);
        }

        this.message = html`
          <div class="form-control customchoice-control custom-multiselect-dropdown" @click=${this._toggleDropdown}>
            <div class="custom-dropdown-toggle">
              <span id="outcome-display">${this.defaultMessage}</span>
             </div>
            <div class="custom-dropdown-content">${optionTemplates}</div>
          </div>
        `;
      } else {
        this.message = html`<p>
          Invalid input. Please check the configuration
        </p>`;
      }
    } else {
      this.constructLabelTemplate(this.outcome);
    }
  }

  _handleMultiSelectChange(e) {
    let selectedValues = [...(this.outcome || [])];
    if (e.target.checked) {
      selectedValues.push(e.target.value);
    } else {
      selectedValues = selectedValues.filter((val) => val !== e.target.value);
    }
    this.outcome = selectedValues;
    const outcomeSpan = this.shadowRoot.querySelector("#outcome-display");
    if (outcomeSpan) {
      outcomeSpan.textContent =
        this.outcome && this.outcome.length > 0
          ? this.outcome.join(", ")
          : "Select options";
    }
    this._propagateOutcomeChanges(selectedValues);
  }
  _toggleDropdown() {
    const dropdown = this.shadowRoot.querySelector(".custom-multiselect-dropdown");
    dropdown.classList.toggle("open");
  }
  constructRadioButtonTemplate(items) {
    if (Array.isArray(items)) {
      if (this.sortOrder === "Asc") {
        items.sort((a, b) => (a > b ? 1 : -1));
      } else if (this.sortOrder === "Desc") {
        items.sort((a, b) => (a < b ? 1 : -1));
      }
    }

    if (this.currentPageMode == "New" || this.currentPageMode == "Edit") {
      if (Array.isArray(items)) {
        let radioButtonTemplates = [];
        for (let i of items) {
          const isSelected = this.outcome === i;
          radioButtonTemplates.push(html`
            <label>
              <input
                type="radio"
                name="custom-radio-group"
                value="${i}"
                ?checked="${isSelected}"
                @change=${(e) => this._handleRadioChange(e)}
              />
              ${i} </label
            ><br />
          `);
        }

        this.message = html`
          <div class="form-control customchoice-control custom-radio-group">${radioButtonTemplates}</div>
        `;
      } else {
        this.message = html`<p>
          WebApi response is not in array format. Please check WebApi
          Configuration.
        </p>`;
      }
    } else {
      this.constructLabelTemplate(this.outcome);
    }
  }

  _handleRadioChange(e) {
    const selectedValue = e.target.value;
    this.outcome = selectedValue;
    this._propagateOutcomeChanges(selectedValue);
  }
  isInt(value) {
    return (
      !isNaN(value) &&
      (function (x) {
        return (x | 0) === x;
      })(parseFloat(value))
    );
  }
  queryParam(param) {
    const urlParams = new URLSearchParams(
      decodeURIComponent(window.location.search.replaceAll("amp;", ""))
    );
    return urlParams.get(param);
  }
}

customElements.define("onc-customchoice-dev", OncCustomChoiceDev);

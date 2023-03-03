interface Data {
  ID: string;
  currency: string;
  country_name: string;
  country_image: string;
  no: string;
  alloy_name: string;
  year: string;
}

interface Alloy {
  alloy_name: string;
}

interface Country {
  country_name: string;
  country_image: string;
}

function createMainInput() {
  const input = document.querySelector("#add") as HTMLElement;
  const inputReactive = new Input(input);
  inputReactive.activate();
}

async function fetchData() {
  const data = await fetch("/api/data.php").then((res) => res.json());
  const countries = await fetch("/api/get_countries.php").then((res) =>
    res.json()
  );
  const alloys = await fetch("/api/get_alloys.php").then((res) => res.json());

  return { data, countries, alloys };
}

class Row {
  data: Data;
  table: HTMLElement;
  isActive: boolean = false;
  input: Input | null = null;
  constructor(data: Data) {
    this.data = data;
    this.table = document.querySelector("#table") as HTMLElement;
    this.createRow();
  }
  createRow() {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="country">${this.data.country_image}</td>
      <td class="currency">${this.data.currency}</td>
      <td class="no">${this.data.no}</td>
      <td class="alloy">${this.data.alloy_name}</td>
      <td class="year">${this.data.year}</td>
      <td class="btn"><button class="btn btn-danger btn-sm remove">X</button></td>
    `;
    this.input = new Input(row);
    row.onclick = (e) => {
      if (!this.input!.isActive) {
        if (e.target === row.querySelector("button")) {
          console.log("remove");
        } else {
          console.log("kurwo ty jebana");
          currentActiveRow = this;
          this.input!.activate();
        }
      } else {
        if (e.target === row.querySelector("button")) {
          console.log("click");
          this.input!.deactivate();
        }
      }
    };
    this.table.prepend(row);
  }
}

class Input {
  element: HTMLElement;
  country: HTMLDivElement;
  currency: HTMLDivElement;
  no: HTMLDivElement;
  alloy: HTMLDivElement;
  year: HTMLDivElement;
  btn: HTMLButtonElement;
  elements: HTMLDivElement[];
  isActive: boolean = false;
  constructor(element: HTMLElement) {
    this.element = element;
    this.country = element.querySelector(".country")!;
    this.currency = element.querySelector(".currency")!;
    this.no = element.querySelector(".no")!;
    this.alloy = element.querySelector(".alloy")!;
    this.year = element.querySelector(".year")!;
    this.btn = element
      .querySelector(".btn")
      ?.querySelector("button") as HTMLButtonElement;
    this.elements = [
      this.country,
      this.currency,
      this.no,
      this.alloy,
      this.year,
    ];
  }
  activate() {
    this.isActive = true;
    this.btn.innerText = "Save";
    this.elements.forEach((element) => {
      if (element.classList.contains("country")) {
        element.innerHTML = `
          <select name="country" id="country">
            ${countryOptions.map((country) => {
              return `<option value="${country.country_name}">${country.country_name}</option>`;
            })}
          </select>
        `;
      } else if (element.classList.contains("alloy")) {
        element.innerHTML = `
          <select name="alloy" id="alloy">
            ${alloyOptions.map((alloy) => {
              return `<option value="${alloy.alloy_name}">${alloy.alloy_name}</option>`;
            })}
          </select>
        `;
      } else {
        let currentValue = element.textContent;
        element.innerHTML = `
          <input type="text" value="${currentValue}" />
          `;
      }
    });
  }
  deactivate() {
    this.btn.innerText = "X";
    this.elements.forEach((element) => {
      let currentValue = element.querySelector("input")?.value;
      element.textContent = currentValue!;
    });
    this.isActive = false;
  }
}

const data = [];
const alloyOptions: Alloy[] = [];
const countryOptions: Country[] = [];
let currentActiveRow: Row | null = null;
const rows: Row[] = [];

fetchData().then((data) => {
  data.countries.forEach((country: Country) => {
    countryOptions.push(country);
  });
  data.alloys.forEach((alloy: Alloy) => {
    alloyOptions.push(alloy);
  });
  data.data.forEach((row: Data) => {
    rows.push(new Row(row));
  });
  createMainInput();
});

window.onclick = (e) => {
  // check if click is outside of input
  if (
    currentActiveRow &&
    !currentActiveRow.input!.element.contains(e.target as Node)
  ) {
    currentActiveRow.input!.deactivate();
    currentActiveRow = null;
  }
};

// createMainInput();

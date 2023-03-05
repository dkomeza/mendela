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

const table = document.querySelector("table") as HTMLTableElement;

function createMainInput() {
  const input = document.querySelector("#add") as HTMLElement;
  const inputReactive = new Input(input);
  inputReactive.activate(true);
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
  row: HTMLTableRowElement | null = null;
  constructor(data: Data) {
    this.data = data;
    this.table = document.querySelector("#table") as HTMLElement;
    this.createRow();
  }
  createRow() {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="country"><img src='./assets/${this.data.country_image}' alt="${this.data.country_name}" /></td>
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
          this.input?.delete(this.data.ID);
          row.remove();
        } else {
          currentActiveRow = this;
          this.input!.activate();
        }
      } else {
        if (e.target === row.querySelector("button")) {
          console.log("click");
          this.input!.deactivate(this.data.ID);
          currentActiveRow = null;
        }
      }
      this.row = row;
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
  activate(main = false) {
    this.isActive = true;
    this.btn.innerText = "Save";
    this.elements.forEach((element) => {
      if (main) {
        if (element.classList.contains("country")) {
          element.innerHTML = `
          <select name="country" id="country" class="input">
            ${countryOptions.map((country) => {
              return `<option value="${country.country_name}">${country.country_name}</option>`;
            })}
          </select>
        `;
        } else if (element.classList.contains("alloy")) {
          element.innerHTML = `
          <select name="alloy" id="alloy" class="input">
            ${alloyOptions.map((alloy) => {
              return `<option value="${alloy.alloy_name}">${alloy.alloy_name}</option>`;
            })}
          </select>
        `;
        } else {
          let currentValue = element.textContent;
          element.innerHTML = `
          <input type="text" value="${currentValue}" class="input" />
          `;
        }
      } else {
        if (element.classList.contains("country")) {
          const img = element.querySelector("img") as HTMLImageElement;
          const alt = img.alt;
          console.log(alt);
          console.log(countryOptions);
          element.innerHTML = `
          <select name="country" id="country" class="input">
            ${countryOptions.map((country) => {
              if (country.country_name === alt) {
                return `<option value="${country.country_name}" selected>${country.country_name}</option>`;
              } else {
                return `<option value="${country.country_name}">${country.country_name}</option>`;
              }
            })}
          </select>
        `;
        } else if (element.classList.contains("alloy")) {
          const currentValue = element.textContent;
          element.innerHTML = `
          <select name="alloy" id="alloy" class="input">
            ${alloyOptions.map((alloy) => {
              if (alloy.alloy_name === currentValue) {
                return `<option value="${alloy.alloy_name}" selected>${alloy.alloy_name}</option>`;
              } else {
                return `<option value="${alloy.alloy_name}">${alloy.alloy_name}</option>`;
              }
            })}
          </select>
        `;
        } else {
          let currentValue = element.textContent;
          element.innerHTML = `
          <input type="text" value="${currentValue}" class="input" />
          `;
        }
      }
    });
    if (main) {
      this.btn.onclick = () => {
        try {
          this.save("0").then((id: { id: string }) => {
            const country_name = (
              this.country.children[0]! as HTMLSelectElement
            ).value;
            const data = {
              ID: id.id,
              currency: (this.currency.children[0]! as HTMLInputElement).value,
              no: (this.no.children[0]! as HTMLInputElement).value,
              alloy_name: (this.alloy.children[0]! as HTMLSelectElement).value,
              year: (this.year.children[0]! as HTMLInputElement).value,
              country_name,
              country_image: countryOptions.find(
                (country) => country.country_name === country_name
              )!.country_image,
            };
            table.children[0].remove();
            rows.push(new Row(data));
            const header = document.createElement("tr");
            header.classList.add("table-header");
            header.innerHTML = `
              <th>Country</th>
              <th>Currency</th>
              <th>No</th>
              <th>Alloy</th>
              <th>Year</th>
              <th></th>`;
            table.prepend(header);
          });
        } catch (error) {
          console.log(error);
        }
      };
    }
  }
  deactivate(id = "0") {
    this.save(id);

    this.btn.innerText = "X";
    this.elements.forEach((element) => {
      if (element.classList.contains("country")) {
        const select = element.querySelector("select") as HTMLSelectElement;
        const value = select.value;
        console.log(value);
        const img = countryOptions.find(
          (country) => country.country_name === value
        )?.country_image;
        element.innerHTML = `<img src="./assets/${img}" alt="${value}" />`;
      } else if (element.classList.contains("alloy")) {
        const select = element.querySelector("select") as HTMLSelectElement;
        const value = select.value;
        element.innerHTML = value;
      } else {
        let currentValue = (element.querySelector(".input") as HTMLInputElement)
          .value;
        element.textContent = currentValue!;
      }
    });

    this.isActive = false;
  }

  validate() {
    console.log("validate");
    const country = this.country.querySelector("select") as HTMLSelectElement;
    const currency = this.currency.querySelector("input") as HTMLInputElement;
    const no = this.no.querySelector("input") as HTMLInputElement;
    const alloy = this.alloy.querySelector("select") as HTMLSelectElement;
    const year = this.year.querySelector("input") as HTMLInputElement;
    if (
      !country.value ||
      !currency.value ||
      !no.value ||
      !alloy.value ||
      !year.value
    ) {
      throw new Error("All fields are required");
    }
    if (isNaN(Number(year.value))) {
      throw new Error("Year must be a number");
    }
  }

  async save(id: string) {
    try {
      this.validate();
    } catch (error) {
      alert(error);
      throw error;
    }
    const res = fetch("/api/update.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        country: this.country.querySelector("select")?.value,
        currency: this.currency.querySelector("input")?.value,
        no: this.no.querySelector("input")?.value,
        alloy: this.alloy.querySelector("select")?.value,
        year: this.year.querySelector("input")?.value,
      }),
    }).then((res) => res.json());
    return await res;
  }

  delete(id: string) {
    fetch("/api/delete.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
  }
}

const data = [];
let alloyOptions: Alloy[] = [];
let countryOptions: Country[] = [];
let currentActiveRow: Row | null = null;
const rows: Row[] = [];

function start() {
  const table = document.querySelector("table") as HTMLTableElement;
  table.innerHTML = `<tr class="table-row" id="add">
    <td class="country"></td>
    <td class="currency"></td>
    <td class="no"></td>
    <td class="alloy"></td>
    <td class="year"></td>
    <td class="btn"><button class="add">Add</button></td>
  </tr>`;
  fetchData().then((data) => {
    countryOptions = data.countries;
    alloyOptions = data.alloys;
    // sort data by id
    data.data.sort((a: Data, b: Data) => parseInt(b.ID) - parseInt(a.ID));
    console.log(data.data);
    data.data.forEach((row: Data) => {
      rows.push(new Row(row));
    });
    const header = document.createElement("tr");
    header.classList.add("table-header");
    header.innerHTML = `
    <th>Country</th>
        <th>Currency</th>
        <th>No</th>
        <th>Alloy</th>
        <th>Year</th>
        <th></th>`;
    table.prepend(header);
    createMainInput();
  });
}

start();

window.onclick = (e) => {
  // check if click is outside of input
  if (
    currentActiveRow &&
    !(
      currentActiveRow.row!.contains(e.target as Node) ||
      (e.target as HTMLElement).tagName === "IMG"
    )
  ) {
    currentActiveRow.input!.deactivate();
    currentActiveRow = null;
  }
};

// createMainInput();

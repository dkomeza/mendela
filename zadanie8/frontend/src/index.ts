function createMainInput() {
  const input = document.querySelector("add") as HTMLElement;
  const inputReactive = new Input(input);
  inputReactive.activate();
}

class Input {
  element: HTMLElement;
  country: HTMLDivElement;
  currency: HTMLDivElement;
  no: HTMLDivElement;
  alloy: HTMLDivElement;
  year: HTMLDivElement;
  add: HTMLButtonElement;
  elements: HTMLDivElement[];
  constructor(element: HTMLElement) {
    this.element = element;
    this.country = element.querySelector(".country")!;
    this.currency = element.querySelector(".currency")!;
    this.no = element.querySelector(".no")!;
    this.alloy = element.querySelector(".alloy")!;
    this.year = element.querySelector(".year")!;
    this.add = element.querySelector(".add") as HTMLButtonElement;
    this.elements = [
      this.country,
      this.currency,
      this.no,
      this.alloy,
      this.year,
    ];
  }
  activate() {
    this.elements.forEach((element) => {
        let currentValue = element.textContent;
        element.innerHTML = `
        <input type="text" value="${currentValue}" />
        `
    });
    this.add.addEventListener("click", () => console.log("click"));
  }
}

// Import the CSS for styling
import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Kitty Clicker";
document.title = gameName;

interface Item {
  name: string;
  cost: number;
  rate: number;
  description: string;
}

const availableItems: Item[] = [
  { name: "Catnip", cost: 10, rate: 0.1, description: "A bit of catnip increases purrs by 0.1 per second." },
  { name: "Scratching Post", cost: 100, rate: 2, description: "A scratching post increases purrs by 2 per second." },
  { name: "Yarn Ball", cost: 1000, rate: 50, description: "A yarn ball increases purrs by 50 per second." },
  { name: "Orange Cat", cost: 5000, rate: 100, description: "You notice that more cats are beginning to surround you." },
  { name: "Black Cat", cost: 10000, rate: 250, description: "The mystical Black Cat appears, significantly boosting purrs." }
];

const button = document.createElement("button");
button.innerHTML = "Pet Cat 🐱";

let counter: number = 0;
const counterDisplay = document.createElement("div");
const growthRateDisplay = document.createElement("div");

button.addEventListener("click", () => {
  counter += 1;
  counterDisplay.innerHTML = `${Math.round(counter)} purrs`;
  updateShopButtons();
});

counterDisplay.innerHTML = `${counter} purrs`;

let previousTime: number = performance.now();
let isActive: boolean = false;

const upgrades = new Array(availableItems.length).fill(0);

function updateCount() {
  const currentTime = performance.now();
  const increment = (currentTime - previousTime) / 1000;
  availableItems.forEach((item, index) => {
    counter += increment * upgrades[index] * item.rate;
  });
  const growthRate = availableItems.reduce(
    (total, item, index) => total + upgrades[index] * item.rate,
    0,
  );
  growthRateDisplay.innerHTML = `Growth Rate: ${Math.round(growthRate * 10) / 10} purrs/sec`;
  counterDisplay.innerHTML = `${Math.round(counter)} purrs`;
  previousTime = currentTime;
  updateShopButtons();
  requestAnimationFrame(updateCount);
}

function updateShopButtons() {
  availableItems.forEach((item, index) => {
    const shopButton = document.getElementById(`shopButton-${index}`) as HTMLButtonElement;
    shopButton.disabled = Math.round(counter) < item.cost;
  });
}

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);
app.append(button);
app.append(growthRateDisplay);
app.append(counterDisplay);

availableItems.forEach((item, index) => {
  const shopButton = document.createElement("button");
  shopButton.innerHTML = `${item.name}: ${item.cost} purrs`;
  shopButton.id = `shopButton-${index}`;
  shopButton.disabled = true;

  shopButton.addEventListener("click", () => {
    if (!isActive) {
      isActive = true;
      requestAnimationFrame(updateCount);
    }
    counter -= item.cost;
    upgrades[index] += 1;
    const upgradeDiv = document.getElementById(`upgradeDiv-${index}`);
    if (upgradeDiv) {
      upgradeDiv.innerHTML = `Number of ${item.name}: ${upgrades[index]}`;
    }
    item.cost = Math.round(item.cost * 1.15 * 1000) / 1000;
    shopButton.innerHTML = `${item.name}: ${item.cost} purrs`;
  });

  const descriptionDiv = document.createElement("div");
  descriptionDiv.innerHTML = `${item.description}`;
  descriptionDiv.style.fontStyle = "italic";

  const upgradeDiv = document.createElement("div");
  upgradeDiv.id = `upgradeDiv-${index}`;
  upgradeDiv.innerHTML = `Number of ${item.name}: ${upgrades[index]}`;
  app.append(shopButton);
  app.append(descriptionDiv);
  app.append(upgradeDiv);
});
// The following line makes sure your styles are included in the project. Don't remove this.
import "../styles/main.scss";
// Import any additional modules you want to include below \/

// \/ All of your javascript should go here \/

function component() {
  const element = document.createElement("div");

  // Lodash, now imported by this script
  element.innerHTML = "Hello Webpack";
  element.classList.add("test");

  return element;
}

document.body.appendChild(component());

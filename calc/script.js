const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    if (button.classList.contains("clear")) {
      display.value = "";
    } else if (button.classList.contains("backspace")) {
      display.value = display.value.slice(0, -1);
    } else if (button.classList.contains("equals")) {
      try {
        display.value = eval(display.value);
      } catch {
        display.value = "Error";
      }
    } else {
      display.value += value;
    }
  });
});

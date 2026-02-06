const display = document.getElementById("display");
const historyList = document.getElementById("history");

function append(value) {
    display.value += value;
}

function clearAll() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let expression = display.value
            .replace(/÷/g, "/")
            .replace(/×/g, "*")
            .replace(/sin/g, "Math.sin")
            .replace(/cos/g, "Math.cos")
            .replace(/tan/g, "Math.tan");

        const result = Function("return " + expression)();
        addHistory(display.value + " = " + result);
        display.value = result;
    } catch {
        display.value = "Error";
    }
}

function addHistory(entry) {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.prepend(li);
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}

// Keyboard support
document.addEventListener("keydown", e => {
    if ("0123456789+-*/().%".includes(e.key)) append(e.key);
    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") deleteLast();
    if (e.key === "Escape") clearAll();
});



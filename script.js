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

function toRadians(deg) {
    return deg * (Math.PI / 180);
}

function calculate() {
    try {
        let exp = display.value;

        // Basic operators
        exp = exp.replace(/÷/g, "/").replace(/×/g, "*");

        // PI handling
        exp = exp.replace(/(\d)π/g, "$1*Math.PI");
        exp = exp.replace(/π(\d)/g, "Math.PI*$1");
        exp = exp.replace(/π/g, "Math.PI");

        // Trigonometry (degrees)
        exp = exp.replace(/sin\(([^)]+)\)/g, (_, x) =>
            Math.sin(toRadians(Function("return " + x)()))
        );
        exp = exp.replace(/cos\(([^)]+)\)/g, (_, x) =>
            Math.cos(toRadians(Function("return " + x)()))
        );
        exp = exp.replace(/tan\(([^)]+)\)/g, (_, x) =>
            Math.tan(toRadians(Function("return " + x)()))
        );

        // Square root
        exp = exp.replace(/sqrt\(([^)]+)\)/g, (_, x) =>
            Math.sqrt(Function("return " + x)())
        );

        // Square
        exp = exp.replace(/sq\(([^)]+)\)/g, (_, x) =>
            Math.pow(Function("return " + x)(), 2)
        );

        // Percentage with + and -
        exp = exp.replace(
            /(\d+(\.\d+)?)(\s*)([+-])(\s*)(\d+(\.\d+)?)%/g,
            (_, base, __, ___, op, ____, pct) => {
                const value = (base * pct) / 100;
                return op === "+"
                    ? `${base}+${value}`
                    : `${base}-${value}`;
            }
        );

        // Simple percentage
        exp = exp.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

        const result = Function("return " + exp)();
        addHistory(display.value + " = " + result);
        display.value = result;

    } catch (err) {
        console.error(err);
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

function toggleHistory() {
    const history = document.querySelector(".history");
    history.style.display =
        history.style.display === "block" ? "none" : "block";
}

function clearHistory() {
    historyList.innerHTML = "";
}

// Keyboard support
document.addEventListener("keydown", e => {
    if ("0123456789+-*/().%".includes(e.key)) append(e.key);
    if (e.key === "Enter") calculate();
    if (e.key === "Backspace") deleteLast();
    if (e.key === "Escape") clearAll();
});



const PI = Math.PI;

// --- Pestañas ---
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const panelId = tab.dataset.panel;

    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });

    document.querySelectorAll(".panel").forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

// --- Operaciones matemáticas ---
function suma(a, b) {
  return a + b;
}

function resta(a, b) {
  return a - b;
}

function multiplicacion(a, b) {
  return a * b;
}

function division(a, b) {
  if (b === 0) throw new Error("No se puede dividir entre cero.");
  return a / b;
}

const operaciones = {
  suma: { fn: suma, simbolo: "+" },
  resta: { fn: resta, simbolo: "−" },
  multiplicacion: { fn: multiplicacion, simbolo: "×" },
  division: { fn: division, simbolo: "÷" },
};

document.getElementById("form-matematicas").addEventListener("submit", (e) => {
  e.preventDefault();
  const resultadoEl = document.getElementById("resultado-matematicas");
  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);
  const tipo = document.getElementById("operacion").value;

  if (isNaN(num1) || isNaN(num2)) {
    mostrarResultado(resultadoEl, "error", "Error", "Ingresa números válidos.");
    return;
  }

  try {
    const { fn, simbolo } = operaciones[tipo];
    const resultado = fn(num1, num2);
    mostrarResultado(
      resultadoEl,
      "exito",
      "Resultado",
      `${num1} ${simbolo} ${num2} = ${formatear(resultado)}`
    );
  } catch (err) {
    mostrarResultado(resultadoEl, "error", "Error", err.message);
  }
});

// --- Figuras geométricas ---
const camposPorFigura = {
  circulo: [
    { id: "radio", label: "Radio (r)", placeholder: "Ej: 5" },
  ],
  cuadrado: [
    { id: "lado", label: "Lado (l)", placeholder: "Ej: 4" },
  ],
  rectangulo: [
    { id: "base", label: "Base (b)", placeholder: "Ej: 6" },
    { id: "altura", label: "Altura (h)", placeholder: "Ej: 3" },
  ],
  triangulo: [
    { id: "base", label: "Base (b)", placeholder: "Ej: 6" },
    { id: "altura", label: "Altura (h)", placeholder: "Ej: 4" },
    { id: "lado1", label: "Lado 1", placeholder: "Ej: 5" },
    { id: "lado2", label: "Lado 2", placeholder: "Ej: 5" },
    { id: "lado3", label: "Lado 3", placeholder: "Ej: 6" },
  ],
};

const figuraSelect = document.getElementById("figura");
const camposContainer = document.getElementById("campos-geometria");

function renderCamposGeometria() {
  const figura = figuraSelect.value;
  const campos = camposPorFigura[figura];

  camposContainer.innerHTML = campos
    .map(
      (c) => `
    <div class="field-row">
      <label for="${c.id}">${c.label}</label>
      <input type="number" id="${c.id}" step="any" min="0.0001" required placeholder="${c.placeholder}">
    </div>`
    )
    .join("");
}

figuraSelect.addEventListener("change", renderCamposGeometria);
renderCamposGeometria();

function areaPerimetroCirculo(r) {
  return {
    area: PI * r * r,
    perimetro: 2 * PI * r,
    formulas: "Área = π·r²  |  Perímetro = 2·π·r",
  };
}

function areaPerimetroCuadrado(l) {
  return {
    area: l * l,
    perimetro: 4 * l,
    formulas: "Área = l²  |  Perímetro = 4·l",
  };
}

function areaPerimetroRectangulo(b, h) {
  return {
    area: b * h,
    perimetro: 2 * (b + h),
    formulas: "Área = b·h  |  Perímetro = 2·(b + h)",
  };
}

function areaPerimetroTriangulo(b, h, l1, l2, l3) {
  return {
    area: (b * h) / 2,
    perimetro: l1 + l2 + l3,
    formulas: "Área = (b·h)/2  |  Perímetro = l₁ + l₂ + l₃",
  };
}

const calculosGeometricos = {
  circulo: (v) => areaPerimetroCirculo(v.radio),
  cuadrado: (v) => areaPerimetroCuadrado(v.lado),
  rectangulo: (v) => areaPerimetroRectangulo(v.base, v.altura),
  triangulo: (v) => areaPerimetroTriangulo(v.base, v.altura, v.lado1, v.lado2, v.lado3),
};

function leerValoresGeometria(figura) {
  const ids = camposPorFigura[figura].map((c) => c.id);
  const valores = {};
  for (const id of ids) {
    valores[id] = parseFloat(document.getElementById(id).value);
    if (isNaN(valores[id]) || valores[id] <= 0) {
      throw new Error(`El valor de "${id}" debe ser un número positivo.`);
    }
  }
  return valores;
}

document.getElementById("form-geometria").addEventListener("submit", (e) => {
  e.preventDefault();
  const resultadoEl = document.getElementById("resultado-geometria");
  const figura = figuraSelect.value;
  const nombres = {
    circulo: "Círculo",
    cuadrado: "Cuadrado",
    rectangulo: "Rectángulo",
    triangulo: "Triángulo",
  };

  try {
    const valores = leerValoresGeometria(figura);
    const { area, perimetro, formulas } = calculosGeometricos[figura](valores);

    resultadoEl.className = "resultado exito";
    resultadoEl.hidden = false;
    resultadoEl.innerHTML = `
      <h3>${nombres[figura]}</h3>
      <p class="detalle">${formulas}</p>
      <div class="linea">
        <span class="detalle">Área</span>
        <p class="valor">${formatear(area)} u²</p>
      </div>
      <div class="linea">
        <span class="detalle">Perímetro</span>
        <p class="valor">${formatear(perimetro)} u</p>
      </div>`;
  } catch (err) {
    mostrarResultado(resultadoEl, "error", "Error", err.message);
  }
});

// --- Utilidades ---
function formatear(num) {
  const redondeado = Math.round(num * 10000) / 10000;
  return Number.isInteger(redondeado) ? redondeado.toString() : redondeado.toFixed(4).replace(/\.?0+$/, "");
}

function mostrarResultado(el, tipo, titulo, mensaje) {
  el.className = `resultado ${tipo}`;
  el.hidden = false;
  el.innerHTML = `
    <h3>${titulo}</h3>
    <p class="valor">${mensaje}</p>`;
}

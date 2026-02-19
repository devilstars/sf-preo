const imageSrc = (fileName) => encodeURI(`img/${fileName}`);

const RESOURCES = [
  { id: "ironOre", name: "Железная руда", weight: 1, iconSrc: imageSrc("железная.png") },
  { id: "polyElementOre", name: "Полиэлементная руда", weight: 1, iconSrc: imageSrc("полиэлементная.png") },
  { id: "polyOrganicOre", name: "Полиорганическая руда", weight: 1, iconSrc: imageSrc("полиорганическая.png") },
  { id: "uranium", name: "Уран", weight: 2, iconSrc: imageSrc("уран.png") },
  { id: "mitracite", name: "Митрацит", weight: 2, iconSrc: imageSrc("митрацит.png") },
  { id: "iridium", name: "Иридиум", weight: 2, iconSrc: imageSrc("иридиум.png") },
  { id: "crokite", name: "Крокит", weight: 3, iconSrc: imageSrc("крокит.png") },
  { id: "bradium", name: "Брадий", weight: 10, iconSrc: imageSrc("брадий.png") },
  { id: "titanite", name: "Титанит", weight: 20, iconSrc: imageSrc("титанит.png") },
  { id: "noxicum", name: "Ноксикум", weight: 50, iconSrc: imageSrc("ноксикум.png") },
  { id: "isidrite", name: "Изидрит", weight: 50, iconSrc: imageSrc("изидрит.png") },
  { id: "seronium", name: "Сероний", weight: 50, iconSrc: imageSrc("сероний.png") },
  { id: "zucrite", name: "Зукрит", weight: 50, iconSrc: imageSrc("зукрит.png") },
  { id: "milanox", name: "Миланокс", weight: 50, iconSrc: imageSrc("миланокс.png") },
  { id: "orex", name: "Орекс", weight: 50, iconSrc: imageSrc("орекс.png") },
  { id: "zabrosin", name: "Заброзин", weight: 50, iconSrc: imageSrc("заброзин.png") },
  { id: "quantium", name: "Квантиум", weight: 100, iconSrc: imageSrc("квантиум.png") },
  { id: "levium", name: "Левиум", weight: 100, iconSrc: imageSrc("левиум.png") }
];

const MATERIALS = [
  {
    id: "rolledMetal",
    name: "Металлопрокат",
    iconSrc: imageSrc("металлопрокат.png"),
    recipe: { ironOre: 2, polyElementOre: 1 }
  },
  {
    id: "constructionMaterials",
    name: "Строительные материалы",
    iconSrc: imageSrc("строительные материалы.png"),
    recipe: { ironOre: 1, polyElementOre: 2, polyOrganicOre: 1 }
  },
  {
    id: "reinforcedConcrete",
    name: "Железобетон",
    iconSrc: imageSrc("железобетон.png"),
    recipe: { ironOre: 2, polyElementOre: 2 }
  },
  {
    id: "electronicComponents",
    name: "Электронные компоненты",
    iconSrc: imageSrc("электронные компоненты.png"),
    recipe: { ironOre: 1, polyElementOre: 1, crokite: 1 }
  },
  {
    id: "aluminum",
    name: "Алюминий",
    iconSrc: imageSrc("алюминий.png"),
    recipe: { ironOre: 1, polyElementOre: 2, iridium: 1 }
  },
  {
    id: "steel",
    name: "Сталь",
    iconSrc: imageSrc("сталь.png"),
    recipe: { ironOre: 2, polyElementOre: 1, mitracite: 1 }
  },
  {
    id: "titaniumAlloy",
    name: "Титановый сплав",
    iconSrc: imageSrc("титановый сплав.png"),
    recipe: { ironOre: 1, polyElementOre: 1, titanite: 1 }
  },
  {
    id: "nanofiber",
    name: "Нановолокно",
    iconSrc: imageSrc("нановолокно.png"),
    recipe: { ironOre: 1, polyElementOre: 1, bradium: 1 }
  },
  {
    id: "polymers",
    name: "Полимеры",
    iconSrc: imageSrc("полимеры.png"),
    recipe: { polyOrganicOre: 2, polyElementOre: 1 }
  },
  {
    id: "composites",
    name: "Композиты",
    iconSrc: imageSrc("композиты.png"),
    recipe: {
      polyOrganicOre: 2,
      polyElementOre: 1,
      ironOre: 1,
      iridium: 1,
      mitracite: 1
    }
  }
];

const RESOURCE_BY_ID = Object.fromEntries(RESOURCES.map((item) => [item.id, item]));
const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((item) => [item.id, item]));

const tabButtons = [...document.querySelectorAll(".tab")];
const panelMaterials = document.getElementById("panel-materials");
const panelConversion = document.getElementById("panel-conversion");

const materialsList = document.getElementById("materials-list");
const addMaterialBtn = document.getElementById("add-material-btn");
const calcMaterialsBtn = document.getElementById("calc-materials-btn");
const copyMaterialsBtn = document.getElementById("copy-materials-btn");
const materialsResult = document.getElementById("materials-result");
const materialsError = document.getElementById("materials-error");
const materialsEmpty = document.getElementById("materials-empty");

const sourceList = document.getElementById("source-list");
const targetList = document.getElementById("target-list");
const addSourceBtn = document.getElementById("add-source-btn");
const addTargetBtn = document.getElementById("add-target-btn");
const calcConversionBtn = document.getElementById("calc-conversion-btn");
const copyConversionBtn = document.getElementById("copy-conversion-btn");
const conversionResult = document.getElementById("conversion-result");
const conversionError = document.getElementById("conversion-error");
const sourceEmpty = document.getElementById("source-empty");
const targetEmpty = document.getElementById("target-empty");
const kpmInput = document.getElementById("kpm-input");
const taxInput = document.getElementById("tax-input");

let materialsCopyText = "";
let conversionCopyText = "";

function setMode(mode) {
  const materialsActive = mode === "materials";
  panelMaterials.classList.toggle("panel-hidden", !materialsActive);
  panelConversion.classList.toggle("panel-hidden", materialsActive);
  tabButtons.forEach((button) => {
    button.classList.toggle("tab-active", button.dataset.mode === mode);
  });
}

function parseNumber(value) {
  const normalized = String(value).replace(",", ".").trim();
  if (!normalized) {
    return NaN;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 6
  }).format(value);
}

function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function populateUniqueSelect(select, items, usedValues, currentValue) {
  select.innerHTML = "";
  const filtered = items.filter(
    (item) => item.id === currentValue || !usedValues.has(item.id)
  );
  filtered.forEach((item) => {
    select.appendChild(createOption(item.id, item.name));
  });
  if (filtered.length === 0) {
    select.appendChild(createOption("", "Нет доступных вариантов"));
    select.value = "";
    select.disabled = true;
    return;
  }
  select.disabled = false;
  select.value = filtered.some((item) => item.id === currentValue)
    ? currentValue
    : filtered[0].id;
}

function setIcon(imgElement, item) {
  if (!imgElement) {
    return;
  }
  imgElement.src = item?.iconSrc || "";
  imgElement.alt = item?.name || "";
}

function getTargetItem(type, id) {
  if (!id) {
    return null;
  }
  return type === "material" ? MATERIAL_BY_ID[id] : RESOURCE_BY_ID[id];
}

function renderTable(container, headers, rows) {
  container.innerHTML = "";
  if (!rows.length) {
    container.textContent = "Нет данных для отображения.";
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const trHead = document.createElement("tr");

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      if (cell && typeof cell === "object" && "text" in cell) {
        if (cell.iconSrc) {
          const wrapper = document.createElement("span");
          wrapper.className = "name-cell";
          const img = document.createElement("img");
          img.src = cell.iconSrc;
          img.alt = cell.text;
          const text = document.createElement("span");
          text.textContent = cell.text;
          wrapper.append(img, text);
          td.appendChild(wrapper);
        } else {
          td.textContent = cell.text;
        }
      } else {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

async function copyResult(text, button) {
  if (!text) {
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    const previous = button.textContent;
    button.textContent = "Скопировано";
    setTimeout(() => {
      button.textContent = previous;
    }, 1400);
  } catch (error) {
    const previous = button.textContent;
    button.textContent = "Ошибка копирования";
    setTimeout(() => {
      button.textContent = previous;
    }, 1600);
  }
}

function toggleEmptyHint(list, hint) {
  hint.style.display = list.children.length ? "none" : "block";
}

function totalMassFromSource(sourceMap) {
  return RESOURCES.reduce((acc, resource) => {
    const amount = sourceMap[resource.id] || 0;
    return acc + amount * resource.weight;
  }, 0);
}

function canProduceMaterial(amount, recipe, sourceMap, totalMass, kpm) {
  let directMass = 0;
  let deficitMass = 0;

  RESOURCES.forEach((resource) => {
    const required = (recipe[resource.id] || 0) * amount;
    const available = sourceMap[resource.id] || 0;
    const directUsed = Math.min(required, available);
    directMass += directUsed * resource.weight;
    if (required > available) {
      deficitMass += (required - available) * resource.weight;
    }
  });

  const leftoverMass = totalMass - directMass;
  return leftoverMass + 1e-9 >= deficitMass * kpm;
}

function maxMaterialProduction(materialId, sourceMap, kpm) {
  const material = MATERIAL_BY_ID[materialId];
  const recipe = material.recipe;
  const totalMass = totalMassFromSource(sourceMap);
  const recipeMass = RESOURCES.reduce(
    (acc, resource) => acc + (recipe[resource.id] || 0) * resource.weight,
    0
  );

  if (recipeMass <= 0 || totalMass <= 0) {
    return 0;
  }

  let low = 0;
  let high = totalMass / recipeMass;
  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    if (canProduceMaterial(mid, recipe, sourceMap, totalMass, kpm)) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return low;
}

function maxResourceConversion(targetResourceId, sourceMap, kpm) {
  const targetWeight = RESOURCE_BY_ID[targetResourceId].weight;
  const direct = sourceMap[targetResourceId] || 0;
  const otherMass = RESOURCES.reduce((acc, resource) => {
    if (resource.id === targetResourceId) {
      return acc;
    }
    return acc + (sourceMap[resource.id] || 0) * resource.weight;
  }, 0);
  const converted = otherMass / (targetWeight * kpm);
  return {
    max: direct + converted,
    direct,
    converted
  };
}

function updateMaterialsSelectors() {
  const selects = [...materialsList.querySelectorAll(".material-select")];
  const chosen = selects.map((select) => select.value).filter(Boolean);

  selects.forEach((select) => {
    const current = select.value;
    const usedByOthers = new Set(chosen.filter((value) => value !== current));
    populateUniqueSelect(select, MATERIALS, usedByOthers, current);
    const icon = select.closest(".entry")?.querySelector(".entry-icon");
    setIcon(icon, MATERIAL_BY_ID[select.value]);
  });

  addMaterialBtn.disabled = selects.length >= MATERIALS.length;
}

function addMaterialRow() {
  if (materialsList.children.length >= MATERIALS.length) {
    return;
  }
  const row = document.createElement("div");
  row.className = "entry";
  row.innerHTML = `
    <img class="entry-icon" alt="">
    <select class="material-select"></select>
    <input class="material-amount" type="number" min="0" step="0.01" value="1" aria-label="Количество материала в трлн">
    <button class="remove-btn" type="button" aria-label="Удалить материал">✕</button>
  `;
  const select = row.querySelector(".material-select");
  const removeBtn = row.querySelector(".remove-btn");

  select.addEventListener("change", () => {
    updateMaterialsSelectors();
  });
  removeBtn.addEventListener("click", () => {
    row.remove();
    updateMaterialsSelectors();
    toggleEmptyHint(materialsList, materialsEmpty);
  });

  materialsList.appendChild(row);
  updateMaterialsSelectors();
  toggleEmptyHint(materialsList, materialsEmpty);
}

function calculateMaterials() {
  materialsError.textContent = "";
  materialsResult.innerHTML = "";
  copyMaterialsBtn.disabled = true;
  materialsCopyText = "";

  const rows = [...materialsList.querySelectorAll(".entry")];
  if (!rows.length) {
    materialsError.textContent = "Добавьте хотя бы один материал.";
    return;
  }

  const required = Object.fromEntries(RESOURCES.map((resource) => [resource.id, 0]));
  const materialLines = [];

  for (const row of rows) {
    const materialId = row.querySelector(".material-select").value;
    const amountRaw = row.querySelector(".material-amount").value;
    const amount = parseNumber(amountRaw);
    if (!materialId) {
      materialsError.textContent = "Выберите материал в каждой строке.";
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      materialsError.textContent = "Количество материала должно быть больше 0.";
      return;
    }

    const material = MATERIAL_BY_ID[materialId];
    materialLines.push(`${material.name}: ${formatNumber(amount)} трлн`);
    Object.entries(material.recipe).forEach(([resourceId, recipeAmount]) => {
      required[resourceId] += recipeAmount * amount;
    });
  }

  const tableRows = [];
  const resourceLines = [];
  let totalMass = 0;
  RESOURCES.forEach((resource) => {
    const quantity = required[resource.id];
    if (quantity > 0) {
      const mass = quantity * resource.weight;
      totalMass += mass;
      tableRows.push([
        { text: resource.name, iconSrc: resource.iconSrc },
        formatNumber(quantity),
        formatNumber(mass)
      ]);
      resourceLines.push(`${resource.name}: ${formatNumber(quantity)} трлн (масса ${formatNumber(mass)})`);
    }
  });

  renderTable(materialsResult, ["Ресурс", "Количество (трлн)", "Масса"], tableRows);

  const resultLines = [
    "Матоварка",
    ...materialLines,
    "",
    "Требуемые ресурсы:",
    ...resourceLines
  ];
  resultLines.push(`Итого масса: ${formatNumber(totalMass)}`);

  materialsCopyText = resultLines.join("\n");
  copyMaterialsBtn.disabled = false;
}

function updateSourceSelectors() {
  const selects = [...sourceList.querySelectorAll(".source-select")];
  const chosen = selects.map((select) => select.value).filter(Boolean);

  selects.forEach((select) => {
    const current = select.value;
    const usedByOthers = new Set(chosen.filter((value) => value !== current));
    populateUniqueSelect(select, RESOURCES, usedByOthers, current);
    const icon = select.closest(".entry")?.querySelector(".entry-icon");
    setIcon(icon, RESOURCE_BY_ID[select.value]);
  });

  addSourceBtn.disabled = selects.length >= RESOURCES.length;
}

function addSourceRow() {
  if (sourceList.children.length >= RESOURCES.length) {
    return;
  }
  const row = document.createElement("div");
  row.className = "entry";
  row.innerHTML = `
    <img class="entry-icon" alt="">
    <select class="source-select"></select>
    <input class="source-amount" type="number" min="0" step="0.01" value="1" aria-label="Количество ресурса в трлн">
    <button class="remove-btn" type="button" aria-label="Удалить ресурс">✕</button>
  `;

  row.querySelector(".source-select").addEventListener("change", updateSourceSelectors);
  row.querySelector(".remove-btn").addEventListener("click", () => {
    row.remove();
    updateSourceSelectors();
    toggleEmptyHint(sourceList, sourceEmpty);
  });

  sourceList.appendChild(row);
  updateSourceSelectors();
  toggleEmptyHint(sourceList, sourceEmpty);
}

function hasAvailableTarget() {
  const usedKeys = new Set(
    [...targetList.querySelectorAll(".entry-target")].map((row) => {
      const type = row.querySelector(".target-type").value;
      const value = row.querySelector(".target-value").value;
      return value ? `${type}:${value}` : "";
    })
  );

  for (const resource of RESOURCES) {
    if (!usedKeys.has(`resource:${resource.id}`)) {
      return true;
    }
  }
  for (const material of MATERIALS) {
    if (!usedKeys.has(`material:${material.id}`)) {
      return true;
    }
  }
  return false;
}

function updateTargetSelectors() {
  const rows = [...targetList.querySelectorAll(".entry-target")];
  const picked = rows.map((row) => ({
    type: row.querySelector(".target-type").value,
    value: row.querySelector(".target-value").value
  }));

  rows.forEach((row, index) => {
    const typeSelect = row.querySelector(".target-type");
    const valueSelect = row.querySelector(".target-value");
    const currentType = typeSelect.value;
    const currentValue = valueSelect.value;

    const usedByOthers = new Set(
      picked
        .filter((item, itemIndex) => itemIndex !== index && item.type === currentType)
        .map((item) => item.value)
        .filter(Boolean)
    );

    const items = currentType === "resource" ? RESOURCES : MATERIALS;
    populateUniqueSelect(valueSelect, items, usedByOthers, currentValue);
    const icon = row.querySelector(".entry-icon");
    setIcon(icon, getTargetItem(currentType, valueSelect.value));
  });

  addTargetBtn.disabled = !hasAvailableTarget();
}

function addTargetRow() {
  if (!hasAvailableTarget()) {
    return;
  }
  const usedKeys = new Set(
    [...targetList.querySelectorAll(".entry-target")].map((row) => {
      const type = row.querySelector(".target-type").value;
      const value = row.querySelector(".target-value").value;
      return value ? `${type}:${value}` : "";
    })
  );

  let defaultType = "resource";
  if (RESOURCES.every((resource) => usedKeys.has(`resource:${resource.id}`))) {
    defaultType = "material";
  }

  const row = document.createElement("div");
  row.className = "entry entry-target";
  row.innerHTML = `
    <img class="entry-icon" alt="">
    <select class="target-type" aria-label="Тип цели">
      <option value="resource">Ресурс</option>
      <option value="material">Материал</option>
    </select>
    <select class="target-value" aria-label="Желаемая позиция"></select>
    <button class="remove-btn" type="button" aria-label="Удалить цель">✕</button>
  `;

  const typeSelect = row.querySelector(".target-type");
  typeSelect.value = defaultType;
  typeSelect.addEventListener("change", () => {
    updateTargetSelectors();
  });
  row.querySelector(".target-value").addEventListener("change", () => {
    updateTargetSelectors();
  });
  row.querySelector(".remove-btn").addEventListener("click", () => {
    row.remove();
    updateTargetSelectors();
    toggleEmptyHint(targetList, targetEmpty);
  });

  targetList.appendChild(row);
  updateTargetSelectors();
  toggleEmptyHint(targetList, targetEmpty);
}

function readSourceMap() {
  const sourceRows = [...sourceList.querySelectorAll(".entry")];
  const sourceMap = Object.fromEntries(RESOURCES.map((resource) => [resource.id, 0]));

  for (const row of sourceRows) {
    const resourceId = row.querySelector(".source-select").value;
    const amount = parseNumber(row.querySelector(".source-amount").value);
    if (!resourceId) {
      return { error: "Выберите ресурс в каждой строке исходных ресурсов." };
    }
    if (!Number.isFinite(amount) || amount < 0) {
      return { error: "Количество исходных ресурсов должно быть неотрицательным." };
    }
    sourceMap[resourceId] += amount;
  }

  return { sourceMap };
}

function scaleSourceMap(sourceMap, factor) {
  const scaled = {};
  RESOURCES.forEach((resource) => {
    scaled[resource.id] = (sourceMap[resource.id] || 0) * factor;
  });
  return scaled;
}

function calculateConversion() {
  conversionError.textContent = "";
  conversionResult.innerHTML = "";
  copyConversionBtn.disabled = true;
  conversionCopyText = "";

  const kpm = parseNumber(kpmInput.value);
  if (!Number.isFinite(kpm) || kpm < 2) {
    conversionError.textContent = "КПМ должен быть числом и не меньше 2.";
    return;
  }
  const tax = parseNumber(taxInput.value);
  if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
    conversionError.textContent = "Налог должен быть числом от 0 до 100%.";
    return;
  }

  const sourceRows = [...sourceList.querySelectorAll(".entry")];
  const targetRows = [...targetList.querySelectorAll(".entry-target")];
  if (!sourceRows.length) {
    conversionError.textContent = "Добавьте хотя бы один исходный ресурс.";
    return;
  }
  if (!targetRows.length) {
    conversionError.textContent = "Добавьте хотя бы одну целевую позицию.";
    return;
  }

  const readResult = readSourceMap();
  if (readResult.error) {
    conversionError.textContent = readResult.error;
    return;
  }
  const sourceMap = readResult.sourceMap;
  const totalMassBeforeTax = totalMassFromSource(sourceMap);
  if (totalMassBeforeTax <= 0) {
    conversionError.textContent = "Суммарная масса исходных ресурсов должна быть больше 0.";
    return;
  }
  const taxFactor = (100 - tax) / 100;
  const sourceMapAfterTax = scaleSourceMap(sourceMap, taxFactor);
  const totalMassAfterTax = totalMassFromSource(sourceMapAfterTax);

  const targets = [];
  for (const row of targetRows) {
    const targetType = row.querySelector(".target-type").value;
    const targetId = row.querySelector(".target-value").value;
    if (!targetId) {
      conversionError.textContent = "Выберите значение в каждой целевой строке.";
      return;
    }
    targets.push({ targetType, targetId });
  }

  const perTargetFactor = 1 / targets.length;
  const sourceLines = [];
  RESOURCES.forEach((resource) => {
    const amount = sourceMap[resource.id] || 0;
    if (amount > 0) {
      sourceLines.push(`${resource.name}: ${formatNumber(amount)} трлн`);
    }
  });

  const tableRows = [];
  const desiredLines = [];

  for (const target of targets) {
    const targetType = target.targetType;
    const targetId = target.targetId;
    const targetSourceMap = scaleSourceMap(sourceMapAfterTax, perTargetFactor);
    const baseNote = `Доля пула: 1/${targets.length}. Налог: ${formatNumber(tax)}%.`;

    if (targetType === "resource") {
      const resource = RESOURCE_BY_ID[targetId];
      const conversion = maxResourceConversion(targetId, targetSourceMap, kpm);
      const note = `${baseNote} Прямо: ${formatNumber(conversion.direct)}, через преобразование: ${formatNumber(conversion.converted)}`;
      tableRows.push([
        { text: resource.name, iconSrc: resource.iconSrc },
        "Ресурс",
        formatNumber(conversion.max),
        note
      ]);
      desiredLines.push(`${resource.name}: ${formatNumber(conversion.max)} трлн`);
    } else {
      const material = MATERIAL_BY_ID[targetId];
      const maxAmount = maxMaterialProduction(targetId, targetSourceMap, kpm);
      const note = `${baseNote} Максимум при оптимальном использовании прямых ресурсов и конвертации.`;
      tableRows.push([
        { text: material.name, iconSrc: material.iconSrc },
        "Материал",
        formatNumber(maxAmount),
        note
      ]);
      desiredLines.push(`${material.name}: ${formatNumber(maxAmount)} трлн`);
    }
  }

  renderTable(
    conversionResult,
    ["Позиция", "Тип", "Макс. количество (трлн)", "Примечание"],
    tableRows
  );

  conversionCopyText = [
    `КПМ: ${formatNumber(kpm)}`,
    `Налог: ${formatNumber(tax)}%`,
    "",
    "Исходные ресурсы:",
    ...(sourceLines.length ? sourceLines : ["нет"]),
    "",
    "Желаемые позиции:",
    ...(desiredLines.length ? desiredLines : ["нет"])
  ].join("\n");
  copyConversionBtn.disabled = false;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

addMaterialBtn.addEventListener("click", addMaterialRow);
calcMaterialsBtn.addEventListener("click", calculateMaterials);
copyMaterialsBtn.addEventListener("click", () =>
  copyResult(materialsCopyText, copyMaterialsBtn)
);

addSourceBtn.addEventListener("click", addSourceRow);
addTargetBtn.addEventListener("click", addTargetRow);
calcConversionBtn.addEventListener("click", calculateConversion);
copyConversionBtn.addEventListener("click", () =>
  copyResult(conversionCopyText, copyConversionBtn)
);

kpmInput.addEventListener("change", () => {
  const value = parseNumber(kpmInput.value);
  if (!Number.isFinite(value) || value < 2) {
    kpmInput.value = "2.048";
  }
});

taxInput.addEventListener("change", () => {
  let value = parseNumber(taxInput.value);
  if (!Number.isFinite(value) || value < 0) {
    value = 0;
  }
  if (value > 100) {
    value = 100;
  }
  taxInput.value = String(Math.round(value));
});

addMaterialRow();
addSourceRow();
addTargetRow();
setMode("conversion");

let selectedItems = [];
let currentBox = null;
let currentName = "";
let currentPrice = 0;

const githubBaseURL = "https://raw.githubusercontent.com/omar-faroog/Menu/main/";
const filesToCache = ["index.html", "invoice.html", "style.css", "script.js", "logo.png"];

// تحميل الملفات وتخزينها في localStorage
async function cacheFiles() {
  for (const file of filesToCache) {
    try {
      const response = await fetch(githubBaseURL + file);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        localStorage.setItem(file, await response.json());
      } else if (contentType && contentType.includes("image")) {
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem(file, reader.result);
        };
        reader.readAsDataURL(blob);
      } else {
        const text = await response.text();
        localStorage.setItem(file, text);
      }
    } catch (err) {
      console.error(`فشل تحميل ${file}:`, err);
    }
  }
}

// تحميل المحتوى من localStorage أو من الإنترنت
async function loadFile(file) {
  if (isOnline()) {
    // إذا كان متصلاً بالإنترنت، قم بتحميل الملفات من الإنترنت وتخزينها
    try {
      const response = await fetch(githubBaseURL + file);
      const contentType = response.headers.get("content-type");
      let content;
      if (contentType && contentType.includes("application/json")) {
        content = await response.json();
      } else if (contentType && contentType.includes("image")) {
        content = await response.blob();
      } else {
        content = await response.text();
      }
      // تخزين المحتوى في localStorage
      localStorage.setItem(file, content);
      return content;
    } catch (err) {
      console.error(`فشل تحميل ${file}:`, err);
      return loadFromCache(file); // في حال فشل تحميل الملف من الإنترنت، نعرض النسخة المخزنة
    }
  } else {
    // إذا لم يكن متصلاً بالإنترنت، اعرض النسخة المخزنة من localStorage
    return loadFromCache(file);
  }
}

// تحميل المحتوى المخزن في localStorage
function loadFromCache(filename) {
  return localStorage.getItem(filename);
}

// فحص حالة الاتصال بالإنترنت
function isOnline() {
  return window.navigator.onLine;
}

// تحميل وتحديث index.html فقط إذا كان هناك اتصال بالإنترنت
async function updateIndex() {
  const indexContent = await loadFile("index.html");
  if (indexContent) {
    document.getElementById("root").innerHTML = indexContent; // وضع المحتوى في عنصر الـ root
  } else {
    console.log("لم يتم العثور على المحتوى المخزن أو تحميله.");
  }
}

// التحقق من الاتصال بالإنترنت عند دخول الصفحة وتحديث index.html إذا لزم الأمر
if (isOnline()) {
  updateIndex();  // تحقق من التحديث
} else {
  // إذا لم يكن هناك اتصال بالإنترنت، نعرض المحتوى المخزن
  const indexContent = loadFromCache("index.html");
  if (indexContent) {
    document.getElementById("root").innerHTML = indexContent; // وضع المحتوى في عنصر الـ root
  } else {
    console.log("لا يوجد محتوى مخزن.");
  }
}

// ================= كودك الأساسي =================

document.querySelectorAll(".meal-box").forEach(box => {
  let quantity = 0;
  const name = box.dataset.name;
  const price = parseFloat(box.dataset.price);

  box.addEventListener("click", () => {
    if (box.classList.contains("selected")) {
      quantity++;
    } else {
      quantity = 1;
      box.classList.add("selected");
    }

    let closeButton = box.querySelector(".close-btn");
    if (!closeButton) {
      closeButton = document.createElement("button");
      closeButton.innerHTML = "×";
      closeButton.classList.add("close-btn");
      box.appendChild(closeButton);

      closeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        box.classList.remove("selected");
        selectedItems = selectedItems.filter(item => item.name !== name);
        box.querySelector(".quantity-indicator")?.remove();
        closeButton.remove();
      });
    }

    let quantityIndicator = box.querySelector(".quantity-indicator");
    if (!quantityIndicator) {
      quantityIndicator = document.createElement("span");
      quantityIndicator.classList.add("quantity-indicator");
      box.appendChild(quantityIndicator);
    }

    quantityIndicator.textContent = quantity;

    selectedItems = selectedItems.filter(item => item.name !== name);
    selectedItems.push({ name, price, quantity, total: price * quantity });
  });
});

document.getElementById("executeButton").addEventListener("click", () => {
  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  setTimeout(() => {
    window.location.href = "invoice.html";
  }, 100);
});

document.getElementById("confirmQuantity").addEventListener("click", () => {
  const qty = parseInt(document.getElementById("quantityInput").value);
  if (!isNaN(qty) && qty > 0) {
    const total = currentPrice * qty;
    currentBox.classList.add("selected");
    selectedItems = selectedItems.filter(item => item.name !== currentName);
    selectedItems.push({ name: currentName, price: currentPrice, quantity: qty, total });
  }
  document.getElementById("quantityModal").style.display = "none";
});

function closeModal() {
  document.getElementById("quantityModal").style.display = "none";
}

let selectedItems = [];
let currentBox = null;
let currentName = "";
let currentPrice = 0;

const githubBaseURL = 'https://raw.githubusercontent.com/omar-faroog/Menu/main/';
const filesToCache = ['index.html', 'invoice.html', 'style.css', 'script.js', 'logo.png'];

// تحميل الملفات وتخزينها في localStorage
async function cacheFiles() {
  for (const file of filesToCache) {
    try {
      const response = await fetch(githubBaseURL + file);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        localStorage.setItem(file, await response.json());
      } else if (contentType && contentType.includes('image')) {
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

function loadFromCache(filename) {
  return localStorage.getItem(filename);
}

function isOnline() {
  return navigator.onLine;
}

// تحميل الملفات عند فتح التطبيق لأول مرة أو عند الاتصال بالإنترنت
if (isOnline()) {
  cacheFiles();
}

// تحديث index.html عند عودة الاتصال بالإنترنت
window.addEventListener('online', () => {

  // تحديث index.html أيضا
  fetch(githubBaseURL + 'index.html')
    .then(response => response.text())
    .then(text => {
      localStorage.setItem('index.html', text);
      console.log('تم تحديث index.html بنجاح عند فتح التطبيق.');
    })
    .catch(err => {
      console.error('فشل في تحديث index.html عند فتح التطبيق:', err);
    });
}

// ================= كودك الأساسي =================

document.querySelectorAll('.meal-box').forEach(box => {
  let quantity = 0;
  const name = box.dataset.name;
  const price = parseFloat(box.dataset.price);

  box.addEventListener('click', () => {
    if (box.classList.contains('selected')) {
      quantity++;
    } else {
      quantity = 1;
      box.classList.add('selected');
    }

    let closeButton = box.querySelector('.close-btn');
    if (!closeButton) {
      closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.classList.add('close-btn');
      box.appendChild(closeButton);

      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        box.classList.remove('selected');
        selectedItems = selectedItems.filter(item => item.name !== name);
        box.querySelector('.quantity-indicator')?.remove();
        closeButton.remove();
      });
    }

    let quantityIndicator = box.querySelector('.quantity-indicator');
    if (!quantityIndicator) {
      quantityIndicator = document.createElement('span');
      quantityIndicator.classList.add('quantity-indicator');
      box.appendChild(quantityIndicator);
    }

    quantityIndicator.textContent = quantity;

    selectedItems = selectedItems.filter(item => item.name !== name);
    selectedItems.push({ name, price, quantity, total: price * quantity });
  });
});

document.getElementById('executeButton').addEventListener('click', () => {
  localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  setTimeout(() => {
    window.location.href = 'invoice.html';
  }, 100);
});

document.getElementById('confirmQuantity').addEventListener('click', () => {
  const qty = parseInt(document.getElementById('quantityInput').value);
  if (!isNaN(qty) && qty > 0) {
    const total = currentPrice * qty;
    currentBox.classList.add('selected');
    selectedItems = selectedItems.filter(item => item.name !== currentName);
    selectedItems.push({ name: currentName, price: currentPrice, quantity: qty, total });
  }
  document.getElementById('quantityModal').style.display = 'none';
});

function closeModal() {
  document.getElementById('quantityModal').style.display = 'none';
}

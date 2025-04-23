let selectedItems = [];
let currentBox = null;
let currentName = "";
let currentPrice = 0;

// إضافة المربعات للعناصر
document.querySelectorAll('.meal-box').forEach(box => {
  let quantity = 0;
  const name = box.dataset.name;
  const price = parseFloat(box.dataset.price);

  // إضافة مكون العدد
  box.addEventListener('click', () => {
    // إذا كان العنصر محددًا بالفعل، فقط زيادة الكمية
    if (box.classList.contains('selected')) {
      quantity++;
    } else {
      // إذا لم يكن العنصر محددًا، تعيين الكمية إلى 1
      quantity = 1;
      box.classList.add('selected');
    }

    // إضافة العلامة × لإلغاء التحديد فقط عند تحديد العنصر
    let closeButton = box.querySelector('.close-btn');
    if (!closeButton) {
      closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.classList.add('close-btn');
      box.appendChild(closeButton);

      // عند الضغط على علامة × لإلغاء التحديد
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();  // منع تأثير الضغط على المربع
        box.classList.remove('selected');
        selectedItems = selectedItems.filter(item => item.name !== name);
        box.querySelector('.quantity-indicator')?.remove();  // إزالة العدد عند الإلغاء
        closeButton.remove();  // إزالة زر الإغلاق
      });
    }

    let quantityIndicator = box.querySelector('.quantity-indicator');

    if (!quantityIndicator) {
      quantityIndicator = document.createElement('span');
      quantityIndicator.classList.add('quantity-indicator');
      box.appendChild(quantityIndicator);
    }

    quantityIndicator.textContent = quantity;

    // تحديث العناصر المحددة
    selectedItems = selectedItems.filter(item => item.name !== name);
    selectedItems.push({ name, price, quantity, total: price * quantity });
  });
});

// تنفيذ عند الضغط على الزر
document.getElementById('executeButton').addEventListener('click', () => {
  localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  setTimeout(() => {
    window.location.href = 'invoice.html';
  }, 100);
});

// نافذة منبثقة لإدخال الكمية
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

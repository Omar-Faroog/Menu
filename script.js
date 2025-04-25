// ------------------------ الكود الأصلي ------------------------

let selectedItems = [];
let currentBox = null;
let currentName = "";
let currentPrice = 0;

// إضافة المربعات للعناصر
document.addEventListener("DOMContentLoaded", () => {
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
});

function closeModal() {
  document.getElementById('quantityModal').style.display = 'none';
}

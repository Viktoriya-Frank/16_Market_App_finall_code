const stock = {
  items: [
    { name: "milk", price: 5, quantity: 50 },
    { name: "bread", price: 3, quantity: 100 },
    { name: "cheese", price: 25, quantity: 70 },
  ],
  totalCost: 0,
  addItem(item) {
    if (item.price < 0 || item.quantity < 0 || !item.name.trim()) {
      alert("Please, check your input date");
      return;
    }

    const existItem = this.items.find((e) => item.name === e.name);

    if (existItem) {
      existItem.quantity += item.quantity;
      updateProductInDom(existItem);
    } else {
      this.items.push(item);
      addProductToDom(item);
    }

    this.updateTotalCost();
  },
  removeItem(itemName, itemQuantity) {
    if (itemQuantity <= 0 || !itemName.trim()) {
      alert(
        "Please, check the entered information about the number of items to be removed"
      );
      return;
    }
    const existItemIndex = this.items.findIndex((e) => itemName === e.name);
    if (existItemIndex === -1) {
      alert(
        "The product you want to delete is not in stock, or you entered an incorrect quantity of products to delete"
      );
      return;
    } else {
      if (itemQuantity > this.items[existItemIndex].quantity) {
        alert("The item you want to delete is not in stock");
        return;
      } else if (itemQuantity < this.items[existItemIndex].quantity) {
        this.items[existItemIndex].quantity -= itemQuantity;
      } else if (itemQuantity === this.items[existItemIndex].quantity) {
        this.items.splice(existItemIndex, 1);
        deleteProductFromDom(itemName);
      }
    }
    this.updateTotalCost();
  },
  updateTotalCost() {
    this.totalCost = this.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  },
};

stock.updateTotalCost();

const addBtn = document.getElementById("addBtn");
const statsBtn = document.getElementById("statsBtn");

const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productQuantityInput = document.getElementById("productQuantity");

const productsList = document.getElementById("productsList");
const statsList = document.getElementById("statsList");

stock.items.forEach(addProductToDom);

statsBtn.onclick = () => {
  const prices = stock.items.map((e) => e.price);
  console.log(prices);
  const alternativeMaxPrice = Math.max(...prices);
  const alternativeMinPrice = Math.min(...prices);

  let alt2MinPrice = Infinity;
  let alt2AvgPrice = 0;
  let alt2MaxPrice = 0;

  let sumPrices = 0;
  let altTotalQuantity = 0;

  for (const product of stock.items) {
    sumPrices += product.price;
    altTotalQuantity += product.quantity;
    if (alt2MinPrice > product.price) {
      alt2MinPrice = product.price;
    }
    if (alt2MaxPrice < product.price) {
      alt2MaxPrice = product.price;
    }
  }

  alt2AvgPrice = sumPrices / stock.items.length;
  alt2AvgPrice = stock.totalCost / altTotalQuantity;

  const minPrice = stock.items.reduce((acc, item) =>
    acc < item.price ? acc : item.price
  );
  console.log(minPrice);

  const avgPrice =
    stock.items.reduce((acc, item) => acc + item.price, 0) / stock.items.length;
  console.log(avgPrice);

  const avgPrice2 =
    stock.totalCost / stock.items.reduce((acc, item) => acc + item.quantity, 0);
  console.log(avgPrice2);

  const maxPrice = stock.items.reduce((acc, item) =>
    acc > item.price ? acc : item.price
  );
  console.log(maxPrice);

  const itemsLength = stock.items.length;
  const totalCost = stock.totalCost;
  const totalQuantity = stock.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  console.log(totalQuantity);

  statsList.innerHTML = `
    <li class="list-group-item">Минимальная цена товара: ${minPrice}</li>
    <li class="list-group-item">Средняя цена товара: ${avgPrice2.toFixed(
      2
    )}</li>
    <li class="list-group-item">Максимальная цена товара: ${maxPrice}</li>
    <li class="list-group-item">Общее кол-во позиций товаров: ${itemsLength}</li>
    <li class="list-group-item">Общая стоимость товаров: ${totalCost}</li>
    <li class="list-group-item">Общее кол-во товаров: ${totalQuantity}</li>
  `;
};

addBtn.onclick = () => {
  const productName = productNameInput.value.trim();
  const productPrice = +productPriceInput.value;
  const productQuantity = +productQuantityInput.value;

  stock.addItem({
    name: productName,
    price: productPrice,
    quantity: productQuantity,
  });

  productNameInput.value =
    productPriceInput.value =
    productQuantityInput.value =
      "";
};

function addProductToDom(item) {
  const li = document.createElement("li");
  li.id = `product-${item.name}`;
  li.classList.add("list-group-item");

  li.innerHTML = `
    <span>
      <strong>${item.name}</strong> - 
      <strong>${item.price}</strong> 
      <strong id="quantity-${item.name}">(${item.quantity} шт.)</strong>
    </span>
    <button id="deleteBtn-${item.name}" class="btn btn-danger" onclick="stock.removeItem('${item.name}', ${item.quantity})">Delete</button>
  `;

  productsList.appendChild(li);
}

function deleteProductFromDom(itemName) {
  const li = document.getElementById(`product-${itemName}`);
  productsList.removeChild(li);
}

function updateProductInDom(item) {
  const quantityEl = document.getElementById(`quantity-${item.name}`);
  if (quantityEl) {
    quantityEl.textContent = `(${item.quantity} шт.)`;
  }
}

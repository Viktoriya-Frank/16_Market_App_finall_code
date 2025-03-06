// CRUD - Create Read Update Delete
console.log(this);

// function test() {
//     console.log(this);
// }

// test()

const stock = {
  items: [
    { name: "milk", price: 5, quantity: 50 }, // пример внешнего вида одного товара
    { name: "bread", price: 3, quantity: 100 },
    { name: "cheese", price: 25, quantity: 70 },
  ], // массив товаров
  totalCost: 0, // итоговая стоимость товаров
  addItem(item) {
    // При добавлении нового товара возможны два сценария:
    if (item.price < 0 || item.quantity < 0 || !item.name.trim()) {
      alert("Проверьте вводимые данные");
      return;
    }

    const existItem = this.items.find((e) => item.name === e.name);

    if (existItem) {
      // 2. Такой товар на складе есть. Тогда меняем существующую позицию на новое количество
      //      (изменяем элемент с информацией о данной позиции в массиве items)
      existItem.quantity += item.quantity;
      updateProductInDom(existItem);
    } else {
      // 1. Такого товара на складе нет. Тогда добавляем новую позицию на склад
      //      (добавляем новый элемент в массив items)
      this.items.push(item);
      addProductToDom(item);
    }

    this.updateTotalCost();
  },
  removeItem(itemName, itemQuantity) {
    // При удалении товара возможны три сценария:
    // 1. Количество товара на складе больше удаляемого количества. Тогда меняем существующую позицию на новое количество
    //      (изменяем элемент с информацией о данной позиции в массиве items)
    // 2. Количество товара на складе равно удаляемому. Тогда удаляем позицию со склада
    //      (удаляем элемент из массива items)
    // 3. Количество товара на складе меньше удаляемого. Тогда действие не выполняется
    if (itemQuantity <= 0 || !itemName.trim()) {
      alert("Проверьте вводимую информацию про кол-во удаляемых товаров");
      return;
    }
    const existItemIndex = this.items.findIndex((e) => itemName === e.name);
    if (existItemIndex === -1) {
      alert(
        "Товара, который вы хотите удалить, нет на складе, либо вы вводите некорректное кол-во удаляемых товаров"
      );
      return;
    } else {
      if (itemQuantity > this.items[existItemIndex].quantity) {
        alert("Товара, который вы хотите удалить, недостаточно на складе");
        return;
      } else if (itemQuantity < this.items[existItemIndex].quantity) {
        this.items[existItemIndex].quantity -= itemQuantity;
        updateProductInDom(this.items[existItemIndex]);
      } else if (itemQuantity === this.items[existItemIndex].quantity) {
        this.items.splice(existItemIndex, 1);
        // deleteProductFromDom(this.items[existItemIndex].name);
        deleteProductFromDom(itemName);
      }
    }
    this.updateTotalCost();
  },
  updateTotalCost() {
    // 1. На основании информации, хранимой в массиве товаров (stock.items) посчитать итоговую стоимость всех товаров
    // this - ведёт на объект, с которым происходит действие
    // Если this используется внутри метода объекта, оно ссылается на сам объект
    this.totalCost = this.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    // console.log(this);
  },
};

stock.updateTotalCost();
// console.log(stock.totalCost);

const addBtn = document.getElementById("addBtn");
const statsBtn = document.getElementById("statsBtn");

const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productQuantityInput = document.getElementById("productQuantity");

const productsList = document.getElementById("productsList");
const statsList = document.getElementById("statsList");

// Заполняем список продуктов, отображаемый на странице информацией о товарах, имеющихся в магазине изначально
stock.items.forEach(addProductToDom);

statsBtn.onclick = () => {
  // items: [
  // { name: "milk", price: 5, quantity: 50 }, // пример внешнего вида одного товара
  // { name: "bread", price: 3, quantity: 100 },
  // { name: "cheese", price: 25, quantity: 70 },
  // ]    [5, 3, 25]
  const prices = stock.items.map(e => e.price);
  console.log(prices);
  const alternativeMaxPrice = Math.max(...prices);
  const alternativeMinPrice = Math.min(...prices);

  let alt2MinPrice = Infinity;
  let alt2AvgPrice = 0;
  let alt2MaxPrice = 0; // -Infinity
 
  let sumPrices = 0
  let altTotalQuantity = 0

  for (const product of stock.items) {
    sumPrices += product.price;
    altTotalQuantity += product.quantity;
    if (alt2MinPrice > product.price ) {
      alt2MinPrice = product.price;
    }
    if (alt2MaxPrice < product.price ) {
      alt2MaxPrice = product.price;
    }
  }

  alt2AvgPrice = sumPrices / stock.items.length; // A
  alt2AvgPrice = stock.totalCost / altTotalQuantity; // B
  
  //      A. На основании информации о продуктах на складе получить следующие статистические данные:
  // 1. Минимальная цена товара 3
  const minPrice = stock.items.reduce((acc, item) =>
    acc < item.price ? acc : item.price
  );
  // const minPrice = stock.items.reduce((acc, item) => acc > item.price ? item.price : acc, Infinity);
  console.log(minPrice);

  // 2. Средняя цена товара
  // A
  const avgPrice =
    stock.items.reduce((acc, item) => acc + item.price, 0) / stock.items.length;
  console.log(avgPrice);

  // B
  const avgPrice2 = stock.totalCost / stock.items.reduce((acc, item) => acc + item.quantity, 0);
  console.log(avgPrice2);

  // 3. Максимальная цена товара 25
  const maxPrice = stock.items.reduce((acc, item) =>
    acc > item.price ? acc : item.price
  );
  console.log(maxPrice);

  // 4. Общее кол-во позиций товаров 3
  const itemsLength = stock.items.length;
  // 5. Общая стоимость товаров 2300
  const totalCost = stock.totalCost;
  // 6. Общее кол-во товаров 220
  const totalQuantity = stock.items.reduce((acc, item) => acc + item.quantity, 0);
  console.log(totalQuantity);
  
  // \n
  // Метод для чисел toFixed(х) - позволяет ограничить кол-во знаков после запятой до х знаков (0 <= x <= 20)
  //      B. Отобразить полученные статистические данные на странице
  statsList.innerHTML = `
    <li class="list-group-item">Минимальная цена товара: ${minPrice}</li>
    <li class="list-group-item">Средняя цена товара: ${avgPrice2.toFixed(2)}</li>
    <li class="list-group-item">Максимальная цена товара: ${maxPrice}</li>
    <li class="list-group-item">Общее кол-во позиций товаров: ${itemsLength}</li>
    <li class="list-group-item">Общая стоимость товаров: ${totalCost}</li>
    <li class="list-group-item">Общее кол-во товаров: ${totalQuantity}</li>
  `;
};

addBtn.onclick = () => {
  // 1. Получить информацию о добавляемом товаре (имя, цена, кол-во)
  // 2. На основании полученной информации добавить товар на склад
  const productName = productNameInput.value.trim(); // Всегда строка (поэтому смело вызываем метод trim())
  // Number parseInt parseFloat
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
  li.classList.add('list-group-item')
  // HW 18 Реализовать функционал удаления продукта
  // HW Advanced (добавить кнопки plus и minus для изменения кол-ва товара)
  li.innerHTML = `
    <span>
      <strong>${item.name}</strong> - 
      <strong>${item.price}</strong> 
      <strong id="quantity-${item.name}">(${item.quantity} шт.)</strong>
    </span>
    <button class="btn btn-danger" onclick="stock.removeItem('${item.name}', ${1})">-</button>
    <button id="plusBtn-${item.name}" class="btn btn-danger">+</button>
    <button id="deleteBtn-${item.name}" class="btn btn-danger" >Delete</button>
  `;
  // Второй способ решения действия, связанного с удалением элемента списка

  // 1. При создании кнопки добавили id для получения ссылки
  // <button id="deleteBtn-${item.name}" class="btn btn-danger">Delete</button> (Для данного способа вариант 208 строки)

  
  productsList.appendChild(li);

  // 2. Получаем ссылку по id
  const deleteBtn = document.getElementById(`deleteBtn-${item.name}`);
  const plusBtn = document.getElementById(`plusBtn-${item.name}`);
  // 3. С помощью ссылки на элемент обрабатываем событие клика на элемент
  deleteBtn.onclick = () => {
    const actualQuantity = stock.items.find((e) => e.name === item.name).quantity;
    stock.removeItem(item.name, actualQuantity);
    li.remove();
  }
  plusBtn.onclick = () => {
    stock.addItem({ ...item, quantity: 1 })
  }
}

function deleteProductFromDom(itemName) {
  const li = document.getElementById(`product-${itemName}`);
  productsList.removeChild(li); // li.remove() - удаление элемента li из DOM (объектная модель документа)
}

function updateProductInDom(item) {
  const quantityEl = document.getElementById(`quantity-${item.name}`);
  if (quantityEl) {
    quantityEl.textContent = `(${item.quantity} шт.)`;
  }
}

// Алгоритм для работы с приложением:
// 1. Отрисовка HTML
// 2. Логика, которая понадобится для работы приложения
// 3. Соединение логики и HTML
// 4. Добавление стилистики


// git test commit
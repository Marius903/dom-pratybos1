// ======================================
// DUOMENYS IŠ LOCAL STORAGE

let products = JSON.parse(localStorage.getItem("cartList")) || [];

let basket = JSON.parse(localStorage.getItem("basketList")) || [];

// ======================================
// HTML ELEMENTAI

let id = document.getElementById("id");
let name = document.getElementById("name");
let quantity = document.getElementById("quantity");

let table = document.getElementById("table");
let message = document.getElementById("message");

let searchId = document.getElementById("searchId");
let searchTable = document.getElementById("searchTable");
let searchMessage = document.getElementById("searchMessage");

let selectedId = "";

// ======================================
// SPALVOTI PRANEŠIMAI CONSOLE

function showConsole() {
  console.clear();

  console.log(
    "%c PREKIŲ SANDĖLIS ",
    "background: #91dff5; color: #222; font-size: 16px; font-weight: bold; padding: 8px;",
  );

  console.table(products);

  console.log(
    "%c PREKIŲ KREPŠELIS ",
    "background: #ff9999; color: #222; font-size: 16px; font-weight: bold; padding: 8px;",
  );

  console.table(basket);

  console.log(
    "%c DUOMENYS IŠSAUGOTI LOCAL STORAGE ",
    "background: #b9e7bd; color: #222; font-weight: bold; padding: 8px;",
  );
}

function saveData() {
  localStorage.setItem("cartList", JSON.stringify(products));

  localStorage.setItem("basketList", JSON.stringify(basket));

  showConsole();
}

// ======================================
// PARODOME VISAS PREKES

function showProducts() {
  table.innerHTML = "";

  products.forEach(function (product) {
    let row = document.createElement("tr");

    row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
        `;

    table.appendChild(row);
  });
}

// ======================================
// PARODOME PREKES KREPŠELYJE

function showBasket() {
  searchTable.innerHTML = "";

  basket.forEach(function (product) {
    let row = document.createElement("tr");

    row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
        `;

    searchTable.appendChild(row);
  });
}

// ======================================
// PRIDEDAME NAUJĄ PREKĘ

document
  .getElementById("productForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let productId = id.value.trim();
    let productName = name.value.trim();
    let productQuantity = quantity.value.trim();

    // Tikriname laukus

    if (productId === "" || productName === "" || productQuantity === "") {
      message.innerHTML = "Užpildykite visus laukus!";
      return;
    }

    // Tikriname ID

    if (!/^\d+$/.test(productId)) {
      message.innerHTML = "ID turi būti tik skaičiai!";
      return;
    }

    // Tikriname kiekį

    if (!/^\d+$/.test(productQuantity) || Number(productQuantity) < 1) {
      message.innerHTML = "Kiekis turi būti didesnis už 0!";
      return;
    }

    // Tikriname ar ID jau egzistuoja

    let found = products.find(function (product) {
      return product.id === productId;
    });

    if (found) {
      message.innerHTML = "Tokia prekė jau egzistuoja!";
      return;
    }

    // Sukuriame naują prekę

    let newProduct = {
      id: productId,
      name: productName,
      quantity: productQuantity,
    };

    products.push(newProduct);

    saveData();

    showProducts();

    message.innerHTML = "Prekė sėkmingai pridėta!";

    clearForm();
  });

// ======================================
// PASIRENKAME PREKĘ REDAGAVIMUI

table.addEventListener("click", function (event) {
  let row = event.target.closest("tr");

  if (!row) return;

  let productId = row.cells[0].textContent;

  let product = products.find(function (item) {
    return item.id === productId;
  });

  if (product) {
    id.value = product.id;
    name.value = product.name;
    quantity.value = product.quantity;

    selectedId = product.id;

    message.innerHTML = "Prekė pasirinkta redagavimui!";
  }
});

// ======================================
// REDAGUOJAME PREKĘ

document.getElementById("edit").addEventListener("click", function () {
  if (selectedId === "") {
    message.innerHTML = "Pirmiausia pasirinkite prekę!";
    return;
  }

  let newId = id.value.trim();
  let newName = name.value.trim();
  let newQuantity = quantity.value.trim();

  // Tikriname laukus

  if (newId === "" || newName === "" || newQuantity === "") {
    message.innerHTML = "Užpildykite visus laukus!";
    return;
  }

  if (!/^\d+$/.test(newId)) {
    message.innerHTML = "ID turi būti tik skaičiai!";
    return;
  }

  if (!/^\d+$/.test(newQuantity) || Number(newQuantity) < 1) {
    message.innerHTML = "Kiekis turi būti teigiamas skaičius!";
    return;
  }

  // Tikriname ar naujas ID neužimtas

  let found = products.find(function (product) {
    return product.id === newId && product.id !== selectedId;
  });

  if (found) {
    message.innerHTML = "Toks ID jau egzistuoja!";
    return;
  }

  // Randame prekę

  let index = products.findIndex(function (product) {
    return product.id === selectedId;
  });

  if (index === -1) {
    message.innerHTML = "Prekė nerasta!";
    return;
  }

  let oldId = selectedId;

  // Atnaujiname sandėlio prekę

  products[index] = {
    id: newId,
    name: newName,
    quantity: newQuantity,
  };

  // Atnaujiname ir krepšelį

  basket.forEach(function (product) {
    if (product.id === oldId) {
      product.id = newId;
      product.name = newName;
      product.quantity = newQuantity;
    }
  });

  selectedId = "";

  saveData();

  showProducts();

  showBasket();

  message.innerHTML = "Prekė sėkmingai atnaujinta!";

  clearInputs();
});

// ======================================
// IŠTRINAME PREKĘ

document.getElementById("delete").addEventListener("click", function () {
  let productId = id.value.trim();

  if (productId === "") {
    message.innerHTML = "Įveskite prekės ID!";
    return;
  }

  let found = products.find(function (product) {
    return product.id === productId;
  });

  if (!found) {
    message.innerHTML = "Tokios prekės nėra!";
    return;
  }

  // Ištriname iš sandėlio

  products = products.filter(function (product) {
    return product.id !== productId;
  });

  // Ištriname iš krepšelio

  basket = basket.filter(function (product) {
    return product.id !== productId;
  });

  selectedId = "";

  saveData();

  showProducts();

  showBasket();

  message.innerHTML = "Prekė sėkmingai ištrinta!";

  clearInputs();
});

// ======================================
// IŠVALOME FORMĄ

function clearInputs() {
  id.value = "";
  name.value = "";
  quantity.value = "";
}

function clearForm() {
  clearInputs();

  selectedId = "";

  message.innerHTML = "";
}

document.getElementById("clear").addEventListener("click", clearForm);

// ======================================
// IEŠKOME PREKĖS PAGAL ID
// IR DEDAME Į KREPŠELĮ

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let code = searchId.value.trim();

    if (code === "") {
      searchMessage.innerHTML = "Įveskite ID!";
      return;
    }

    if (!/^\d+$/.test(code)) {
      searchMessage.innerHTML = "ID turi būti tik skaičiai!";
      return;
    }

    // Surandame prekę sandėlyje

    let product = products.find(function (item) {
      return item.id === code;
    });

    if (product) {
      // Tikriname ar jau yra krepšelyje

      let found = basket.find(function (item) {
        return item.id === code;
      });

      if (found) {
        searchMessage.innerHTML = "Ši prekė jau yra krepšelyje!";

        return;
      }

      // Įdedame prekę į krepšelį

      basket.push({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
      });

      saveData();

      showBasket();

      searchMessage.innerHTML = "Prekė rasta ir pridėta į krepšelį!";

      searchId.value = "";
    } else {
      searchMessage.innerHTML = "Prekė nerasta!";
    }
  });

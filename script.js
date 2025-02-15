/******************Modal Popup Functionality*****************/
// (Unchanged code for modal popup functionality)
openModal.addEventListener("click", () => {
  overlayBox.style.visibility = "visible";
  overlayBox.classList.add('open-popup');
});

closeModal.addEventListener("click", () => {
  overlayBox.style.visibility = "hidden";
});

window.addEventListener("click", (event) => {
  if (event.target === overlayBox) {
    overlayBox.style.visibility = "hidden";
  }
});
/******************Modal Popup Ends Here*****************/


/******************Cart Functionality*****************/

// Validating the form field
let fullName = document.getElementById('fullName')
const nameError = document.getElementById('nameError')

let emailE = document.getElementById('emailE');
const emailError = document.getElementById('emailError')

let cellNumber = document.getElementById('cellNumber');
const numberError = document.getElementById('numberError')

function nameField(){
  if (fullName.value === ''){
      nameError.style.display = 'block'
      nameError.textContent = '*Your name is required.'
      fullName.style.border = 'solid';
      fullName.style.borderWidth = '2px';
      fullName.style.borderColor = '#ff7a00';
      fullName.style.marginBottom = '0';
  }
  else {
    nameError.textContent = '';
    nameError.style.display = 'none';
    fullName.style.marginBottom = '15px';
    fullName.style.border = 'none';
  }
}
fullName.onblur = nameField;

function emailField(){

  const emailAddress = emailE.value;
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/

  if (emailE.value === ''){
    emailError.style.display = 'block'
    emailError.textContent = '*Your email address is required as well.'
    emailE.style.border = 'solid 2px #ff7a00';
    emailE.style.marginBottom = '0';
  }
  else if(!emailRegex.test(emailAddress)) {
    emailError.style.display = 'block'
    emailError.textContent = '*Invalid email.'
    emailE.style.border = 'solid 2px #ff7a00';
    emailE.style.marginBottom = '0';
  }
  else {
    emailError.textContent = '';
    emailError.style.display = 'none';
    emailE.style.marginBottom = '15px';
    emailE.style.border = 'none';
  }
}
emailE.onblur = emailField;

function numberField(){

  const phoneNumber = cellNumber.value;
  const phoneRegex = /^[0-9]{11}$/;

  if (cellNumber.value === ''){
    numberError.style.display = 'block'
    numberError.textContent = '*You cell number is required for easy reach.'
    cellNumber.style.border = 'solid 2px #ff7a00';
    cellNumber.style.marginBottom = '0';
  }
  else if(!phoneRegex.test(phoneNumber)) {
    numberError.style.display = 'block';
    numberError.textContent = '*Your cell number must be 11 digit long.';
    cellNumber.style.border = 'solid 2px #ff7a00';
  }
  else {
    numberError.textContent = '';
    numberError.style.display = 'none';
    cellNumber.style.border = 'none';
  }
}
cellNumber.onblur = numberField;



// Global array to hold cart items
let cartItems = [];

// Function to update the cart UI in the modal
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = ""; // Clear previous items
  
  cartItems.forEach((item, index) => {
    // --- MODIFIED SECTION START ---
    // Create a row for each item with increment and decrement buttons
    // The total price is now calculated as: unitPrice * quantity
    const itemRow = document.createElement('div');
    itemRow.className = 'cartRow';
    itemRow.innerHTML = `
      <p>${index + 1}</p>
      <p>${item.name}</p>
      <p>${item.unitPrice * item.quantity}</p>
      <p>
        <button class="decrement">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="increment">+</button>
        <img class="delete" data-name="${item.name}" src="${item.imageUrl}" alt="${item.name}">

      </p>`;
    cartItemsContainer.appendChild(itemRow);
    
    // Attach event listeners for decrement, increment and delete buttons
    const decrementButton = itemRow.querySelector('.decrement');
    const incrementButton = itemRow.querySelector('.increment');
    
    // Decrement: decrease quantity only if greater than 1
    decrementButton.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        totalAmount.innerText = item.unitPrice * item.quantity
        updateCartUI(); // Refresh UI (total price updates automatically)
      }
    });
    
    // Increment: increase quantity
    incrementButton.addEventListener('click', () => {
      item.quantity++;
      updateCartUI(); // Refresh UI (total price updates automatically)
    });
    
    //Delete item
    const deleteButton = itemRow.querySelector('.delete');
    deleteButton.addEventListener('click', () => {
      // Get the product name from the delete button's data attribute
      const productName = deleteButton.getAttribute('data-name');
      // Remove the item from the cartItems array
      cartItems = cartItems.filter(item => item.name !== productName);
      updateCartUI();
    
      // Find the product button associated with this item and update its state
      document.querySelectorAll('.cartBtn').forEach(btn => {
        const cardName = btn.parentElement.querySelectorAll('p')[2].innerText;
        if (cardName === productName) {
          btn.innerText = 'ADD TO CART';
          btn.style.backgroundColor = '';
          btn.dataset.added = "false"; // Reset the toggle state
        }
      });
    });

    // --- MODIFIED SECTION END ---
  });

  // Update the number shown on the cart icon
  const cartNum = document.querySelector('.cart-num');
  cartNum.innerText = cartItems.length;

  // Calculate and update total amount ---
  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity);
  }, 0);

  // Find the element showing the total amount (class "secondP") and update its inner HTML.
  const totalAmountElement = document.querySelector('.secondP');
  totalAmountElement.innerHTML = `${totalAmount.toLocaleString()}`;

  // totalAmountElement.innerHTML = `<span>&#x20A6;</span>${totalAmount.toLocaleString()}`;
}

// Loop through all product buttons to add or remove items from the cart
const cartBtns = document.querySelectorAll('.cartBtn');

cartBtns.forEach(button => {
  // Initialize the state on the button
  button.dataset.added = "false";

  button.addEventListener('click', () => {
    const productCard = button.parentElement;
    const pElements = productCard.querySelectorAll("p");
    const rawPrice = pElements[1].innerText;
    const unitPrice = Number(rawPrice.replace(/[^0-9.]+/g, ""));
    const name = pElements[2].innerText;
    const quantity = 1; // Default quantity

    if (button.dataset.added === "false") {
      button.innerText = 'REMOVE FROM CART';
      button.style.backgroundColor = '#ffe9d6';
      button.dataset.added = "true";
      cartItems.push({ name, unitPrice, quantity, imageUrl:'img/icons/delete.png' });
    } else {
      button.innerText = 'ADD TO CART';
      button.style.backgroundColor = '';
      button.dataset.added = "false";
      cartItems = cartItems.filter(item => item.name !== name);
    }
    updateCartUI();
  });
});

/******************End Cart Functionality*****************/

const x_block = document.querySelector('.x-block');
const y_block = document.querySelector('.y-block');
const swap_btn = document.querySelector('.swap-btn');
const block1 = document.querySelector('.item1');
const block2 = document.querySelector('.item2');
const block3 = document.querySelector('.item3');
const block4 = document.querySelector('.item4');
const block5 = document.querySelector('.item5');
const block6 = document.querySelector('.item6');
const colorPicker = document.getElementById('colorInput');
const editLinks = document.querySelectorAll('.edit-link');

document.addEventListener('DOMContentLoaded', () => {
    initializeBlocksFromLocalStorage();
});

//Task 1
swap_btn.addEventListener('click', () => {
    let tempContent = x_block.innerHTML; 
    x_block.innerHTML = y_block.innerHTML; 
    y_block.innerHTML = tempContent;   
});
//Task 2
function calculateCircleArea() {
    const radiusInput = document.querySelector('.radius-input');
    const radius = parseFloat(radiusInput.value);

    if (isNaN(radius) || radius <= 0) {
        alert('Будь ласка, введіть додатне число для радіуса.');
        return;
    }
    if (radius > 10000000){
        alert('Будь ласка, введіть число менше 10000000 для радіуса.');
        return;
    }
    const area = Math.PI * Math.pow(radius, 2);

    const existingArea = block3.querySelector('.circle-area');
    if (existingArea) {
        existingArea.textContent = `Площа кола з радіусом ${radius}: ${area.toFixed(2)}`;
    } else {
        const newArea = document.createElement('p');
        newArea.className = 'circle-area';
        newArea.textContent = `Площа кола з радіусом ${radius}: ${area.toFixed(2)}`;
        block3.appendChild(newArea);
    }
}
//Task 3
function deleteCookies() {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }
}

const cookieData = document.cookie.replace(/(?:(?:^|.*;\s*)maxValues\s*=\s*([^;]*).*$)|^.*$/, "$1");
if (cookieData) {
  const confirmed = confirm('Бажаєте видалити збережені дані?');
  if (confirmed) {
    deleteCookies();
    document.cookie = "maxValues=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.reload();
  } else {
    alert('Дані не видалено. Перезавантажте сторінку');
  }
}

function processNumbers() {
    let numbers = [];
    const form = document.getElementById("maxNumberForm");

    for (let i = 1; i <= 10; i++) {
      const value = form[`num${i}`].value;
      if (value === '' || isNaN(value)) {
        alert("Будь ласка, введіть числа в усі поля форми");
        return;
      }
      numbers.push(parseFloat(value));
    }
  
      const max = Math.max(...numbers);
      const maxCount = numbers.filter(num => num === max).length;
      alert(`Maximum value: ${max}, Count: ${maxCount}`);
      document.cookie = `maxValues=${maxCount}; path=/`;
}

//Task 4
colorPicker.addEventListener('blur', changeColor);
const savedColor = localStorage.getItem('item2Color');
if (savedColor) {
    block2.style.backgroundColor = savedColor;
}

function changeColor() {
    const block = document.querySelector('.item2');
    if (block.classList.contains('editing-item')) {
      alert('Під час редагування не можна змінити колір');
      return;
    }
  
    const color = document.getElementById('colorInput').value;
    block.style.backgroundColor = color;
    localStorage.setItem('item2Color', color);
  }

//Task 5
function initializeBlocksFromLocalStorage() {
    for (let i = 1; i <= 6; i++) {
      const block = document.querySelector(`.item${i}`);
      const savedContent = localStorage.getItem(`item${i}Content`);
      if (savedContent) {
        block.innerHTML = savedContent;
        addResetButton(block, i);
      }
      block.dataset.originalContent = block.innerHTML;
    }

    editLinks.forEach((link, index) => {
        link.addEventListener('dblclick', () => editHTML(index + 1));
    });
  
    const savedColor = localStorage.getItem('item2Color');
    if (savedColor) {
      document.querySelector('.item2').style.backgroundColor = savedColor;
    }
    colorPicker.addEventListener('blur', changeColor);
    colorPicker.disabled = false;
}

function editHTML(itemNum) {
    const block = document.querySelector(`.item${itemNum}`);
    if (block.classList.contains('editing-item')) {
        return
    };
  
    const originalContent = block.dataset.originalContent || block.innerHTML;
  
    block.classList.add('editing-item');
    block.innerHTML = `
      <textarea>${originalContent}</textarea>
      <button id="save${itemNum}">Зберегти</button>
      <button id="cancel${itemNum}">Закрити</button>
    `;
  
    document.getElementById(`save${itemNum}`).addEventListener('click', function () {
      const newContent = block.querySelector('textarea').value;
      block.innerHTML = newContent;
      block.style.backgroundColor = getRandomColor(); 
      localStorage.setItem(`item${itemNum}Content`, newContent);
      block.dataset.originalContent = originalContent;
      block.classList.remove('editing-item');
      addResetButton(block, itemNum);
    });
  
    document.getElementById(`cancel${itemNum}`).addEventListener('click', function () {
      block.innerHTML = originalContent;
      block.style.backgroundColor = '';
      block.classList.remove('editing-item');
    });
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addResetButton(block, itemNum) {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Скинути';
    resetButton.addEventListener('click', () => {
        localStorage.removeItem(`item${itemNum}Content`);
        block.innerHTML = block.dataset.originalContent;
        if (savedColor) {
            block2.style.backgroundColor = savedColor;
        } else {
            block.style.backgroundColor = '';
        }
    });
    block.appendChild(resetButton);
}



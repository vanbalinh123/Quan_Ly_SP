const inputNodes = document.querySelectorAll('.insert-form div input');
const saveButtonNode = document.querySelector('.insert-form button');
const dataListNode = document.querySelector('.data-list');
const tbody = document.querySelector('tbody');
let productLists = JSON.parse(localStorage.getItem('productLists'));
let kt = 0;
if(productLists === null) productLists = [];

if(productLists.length === 0) {
    dataListNode.classList.add('hidden');
}
else {
    productLists.forEach(item => {
        const trNode = document.createElement('tr');
            tbody.appendChild(trNode);
            trNode.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}đ</td>
                <td>
                    <a class="action-button edit-button" href="#">Edit</a>
                    <a class="action-button delete-button" href="#">Delete</a>
                    <button class="save-button hidden">Lưu</button>
                    <button class="cancel-button hidden">Quay Lại</button>
                </td>
            `;
    });
};

function Product(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
};

const checkValid = function(array) {
    kt = 0;
    array.forEach(item => {
        if(item.value === '') kt = 1;
    });
    return kt;
};

const checkExist = function(array) {
    kt = 0;
    array.forEach(item => {
        if(item.id === inputNodes[0].value) kt = 1;
    });
    return kt;
};

const deleteFunction = function(element) {
    let choice = false;
    let idchoice = element.parentElement.parentElement.children[0].textContent;
    choice = confirm(`Bạn có muốn xoá sản phẩm (id =${idchoice})`);
    if(choice === true) {
        productLists = JSON.parse(localStorage.getItem('productLists'));
        for(let i = 0; i < productLists.length; i += 1)
            if(productLists[i].id === idchoice) {
                productLists.splice(i, 1);
                localStorage.setItem('productLists', JSON.stringify(productLists));
                const trNode = element.parentElement.parentElement;
                trNode.remove();
                if(productLists.length === 0) dataListNode.classList.add('hidden');
            }
    }
};

const editFunction = function(element) {
    element.classList.toggle('hidden');
    element.parentElement.children[1].classList.toggle('hidden');
    element.parentElement.children[2].classList.toggle('hidden');
    element.parentElement.children[3].classList.toggle('hidden');
    element.parentElement.parentElement.children[1].innerHTML = `
        <input type="text" name="name"
        value="${element.parentElement.parentElement.children[1].textContent}">
    `;
    element.parentElement.parentElement.children[2].innerHTML = `
        <input type="text" name="price" 
        value="${element.parentElement.parentElement.children[2].textContent.substring(0, element.parentElement.parentElement.children[2].textContent.length - 1)}">
    `
};

const saveFunction = function(element) {
    if(element.parentElement.parentElement.children[1].children[0].value === '' || element.parentElement.parentElement.children[2].children[0].value === '') 
        alert('Vui lòng không để trống');
    else {
        productLists = JSON.parse(localStorage.getItem('productLists'));
        let idChoice = element.parentElement.parentElement.children[0].textContent;
        productLists.forEach(item => {
            if(item.id === idChoice) {
                item.name = element.parentElement.parentElement.children[1].children[0].value;
                item.price = element.parentElement.parentElement.children[2].children[0].value;
                element.parentElement.parentElement.children[1].innerHTML = `${item.name}`;
                element.parentElement.parentElement.children[2].innerHTML = `${item.price}đ`;
            }
        })
        localStorage.setItem('productLists', JSON.stringify(productLists));
        element.classList.toggle('hidden');
        alert('Lưu thành công');
        element.parentElement.children[0].classList.toggle('hidden');
        element.parentElement.children[1].classList.toggle('hidden');
        element.parentElement.children[3].classList.toggle('hidden');
    }
};

const cancelFunction = function(element) {
    element.classList.toggle('hidden');
    element.parentElement.children[0].classList.toggle('hidden');
    element.parentElement.children[1].classList.toggle('hidden');
    element.parentElement.children[2].classList.toggle('hidden');
    let idChoice = element.parentElement.parentElement.children[0].textContent;
    productLists.forEach(item => {
        if(item.id === idChoice) {
            element.parentElement.parentElement.children[1].innerHTML = `${item.name}`;
            element.parentElement.parentElement.children[2].innerHTML = `${item.price}đ`;
        }
    })   
};

let editButtons = document.querySelectorAll('.edit-button');
let deleteButtons = document.querySelectorAll('.delete-button');
let saveButtons = document.querySelectorAll('.save-button');
let cancelButtons = document.querySelectorAll('.cancel-button');
saveButtonNode.addEventListener('click', () => {
    if (checkValid(inputNodes) === 1) {
        alert('Vui lòng không để trống');
    } else {
        if(checkExist(productLists) === 1) alert('Mã sản phẩm đã tồn tại');
        else {
            let product = new Product(inputNodes[0].value, inputNodes[1].value, inputNodes[2].value);
            productLists.push(product);
            localStorage.setItem('productLists',JSON.stringify(productLists));
            alert('Lưu thành công');
            dataListNode.classList.remove('hidden');
            const trNode = document.createElement('tr');
            tbody.appendChild(trNode);
            trNode.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}đ</td>
                <td>
                    <a class="action-button edit-button" href="#">Edit</a>
                    <a class="action-button delete-button" href="#">Delete</a>
                    <button class="save-button hidden">Lưu</button>
                    <button class="cancel-button hidden">Quay Lại</button>
            </td>
            `;
            const elementDelete = trNode.querySelector('.delete-button');
            elementDelete.addEventListener('click', (event) => {
                event.preventDefault(); 
                deleteFunction(elementDelete);
            })

            const elementEdit = trNode.querySelector('.edit-button');
            elementEdit.addEventListener('click', (event) => {
                event.preventDefault();
                editFunction(elementEdit);
            })

            const elementSave = trNode.querySelector('.save-button');
            elementSave.addEventListener('click', () => {
                saveFunction(elementSave);
            })

            const elementCancel = trNode.querySelector('.cancel-button');
            elementSave.addEventListener('click', () => {
                cancelFunction(elementCancel);
            })
            
            inputNodes.forEach(item => {
                item.value = '';
            })
        }
    }
});

deleteButtons.forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); //ngăn chặn sự kiện mặc định
        deleteFunction(item);
    })
});

editButtons.forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        editFunction(item);
    })
});

saveButtons.forEach(item => {
    item.addEventListener('click', () => {
        saveFunction(item);
    })
});

cancelButtons.forEach(item => {
    item.addEventListener('click', () => {
        cancelFunction(item);
    })
});




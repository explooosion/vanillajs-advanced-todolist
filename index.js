// memory data
let list = [];

// view mode
let MODE = 'all';

const table = document.querySelector('.form-list');

// web initial
window.onload = () => {
    // create filter event
    document.querySelectorAll('input[name=filter]')
        .forEach(filter => filter.addEventListener('change', filterItem));
    // create keypress event
    document.querySelector('.form-input')
        .addEventListener('keypress', e => { if (e.keyCode == 13) addItem(); });
};

// add item
function addItem(_item) {
    const input = document.querySelector('.form-input');
    const value = input.value;
    if (value == '') return;

    const id = setId();
    const item = {
        id: id,
        name: value,
        done: false,
    };
    list.push(item);

    const row = table.insertRow(0);
    row.setAttribute('key', item.id);
    row.insertCell(0).innerHTML =
        `
        <input class="form-check" type="checkbox" onclick="updateItem(${item.id})"/>
        <input id="edit-${item.id}" class="form-edit" type="text" value="${item.name}" />
        <label ondblclick="showEditItem(${item.id})">${item.name}</label>
        <button class="form-delete" onclick="removeItem(${item.id})">Delete</button>
        `;

    // create update text
    document.querySelector(`#edit-${item.id}`)
        .addEventListener('change', editItem);

    // clean input text
    input.value = '';
}

// filter
function filterItem() {
    let mode;
    try {
        mode = this.getAttribute('value');
        MODE = mode; // update mode
    } catch (e) {
        mode = MODE;
    }

    const itemsElements = table.querySelectorAll('tr');
    let _list;
    switch (mode) {
        case 'done':
            _list = list.filter(item => item.done == true);
            break;
        case 'todo':
            _list = list.filter(item => item.done == false);
            break;
        case 'all':
        default:
            itemsElements.forEach(itemEl => itemEl.classList.remove('hide'));
            return; // end of filterItem
    }
 
    itemsElements.forEach(itemEl => {
        const key = Number(itemEl.getAttribute('key'));
        const result = _list.find(item => item.id == key);
        if (!result) {
            itemEl.classList.add('hide');
        } else {
            itemEl.classList.remove('hide');
        };
    });
}

// update item
function updateItem(id) {
    const item = list.find(item => item.id == id);
    item.done = !item.done;
    filterItem();
}

// delete item
function removeItem(id) {
    const items = table.querySelectorAll('tr');
    let rowIndex;
    items.forEach((item, index) => {
        if (Number(item.getAttribute('key')) == id) rowIndex = index;
    });

    if (rowIndex != undefined) {
        list = list.filter(item => item.id != id);
        table.deleteRow(rowIndex);
    }
}

// show the edit panel
function showEditItem(id) {
    // 顯示
    document.querySelector(`#edit-${id}`).focus();
}

// edit item
function editItem() {
    if (this.value == '') return;

    const id = Number(this.getAttribute('id').replace('edit-', ''));
    const item = list.find(item => item.id == id);
    item.name = this.value;

    // update table text
    table.querySelector(`#edit-${item.id} + label`).innerHTML = this.value;
}

// random number for id
function setId() {
    return Number(Number(new Date()) + Math.round(Math.random() * 1000));
}


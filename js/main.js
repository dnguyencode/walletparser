import getClipboardUsingPaste from '/js/utils.js';

let myAddresses = [
    {
        value: "0xa6aBFe72665F22D53aB8eE867Bd2AB9331A973C0",
        note: "Tetra Node"
    },
    {
        value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        note: "Uniswap V2 Router"
    },
    {
        value: "0x0000000000000000000000000000000000000000",
        note: "Blackhole"
    }
];
const addressesFromLocalStorage = JSON.parse(localStorage.getItem("myAddresses"));
const inputNote = document.querySelector('.input__note');
const urlParseBtn = document.getElementById('urlParseBtn');
const cbParseBtn = document.getElementById('cbParseBtn');
const downloadBtn = document.getElementById('downloadBtn');
const tablinks = document.querySelectorAll('.output__tablinks');
const outputContent = document.querySelector(".output__content");
const closeBtns = document.getElementsByClassName('close');
// const closeBtns = document.querySelectorAll('.close'); // doesn't work on app
let format = "etherscan";

if (addressesFromLocalStorage) {
    myAddresses = addressesFromLocalStorage;
    render(myAddresses)
}

const stringtoAddress = (str) => {
    let result = '';
    try {
        const addressRegex = /0x[0-9a-f]{40}/i;
        result = str.match(addressRegex)[0]
    } catch (err) { }
    return result;
};

cbParseBtn.addEventListener('click', () => {
    let parsedAddress = stringtoAddress(
        getClipboardUsingPaste()
    )
    if (parsedAddress) {
        addAddress(
            parsedAddress
        )
    }
})

function render(addresses) {
    let listItems = "";
    for (let i = 0; i < addresses.length; i++) {
        listItems += `
            <li class="${addresses[i].value}">
                <a href="https://etherscan.io/address/${addresses[i].value}" target="_blank">
                    <span class="result">${addresses[i].value.slice(0, 5)}...${addresses[i].value.slice(-4)}</span>
                </a>
                <span class="note">${addresses[i].note}</span>
                <span class="close">X</span>
            </li>
        `
    }
    outputContent.innerHTML = listItems;
    for (let i = 0; i < closeBtns.length; i++) {
        console.log(closeBtns[i].parentElement.className)
        closeBtns[i].addEventListener('click', () => {
            removeAddress(closeBtns[i].parentElement.className)
        })
    }
}

function addAddress(address) {
    myAddresses.push(
        {
            value: address,
            note: inputNote.value
        }
    );
    localStorage.setItem('myAddresses', JSON.stringify(myAddresses))
    render(myAddresses);
    inputNote.value = "";
}

function removeAddress(address) {
    let toRemove = address;
    myAddresses = myAddresses.filter(function (address) {
        return address.value !== toRemove
    })
    localStorage.setItem('myAddresses', JSON.stringify(myAddresses))
    render(myAddresses);
}

downloadBtn.addEventListener('click', () => {
    console.log(myAddresses);
})

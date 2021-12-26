import getClipboardUsingPaste from '/js/utils.js';

let myAddresses = [
    {
        value: "0x9c5083dd4838E120Dbeac44C052179692Aa5dAC5",
        note: "Tetra Node"
    },
    {
        value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        note: "Uniswap V2 Router"
    },
    {
        value: "0x5DD596C901987A2b28C38A9C1DfBf86fFFc15d77",
        note: "Sifu"
    },
    {
        value: "0x000000000000000000000000000000000000dEaD",
        note: "Blackhole"
    }
];

let formats = [
    {
        name: 'zapperfi',
        prefix: 'https://zapper.fi/account/',
        suffix: ''
    },
    {
        name: 'etherscan',
        prefix: 'https://etherscan.io/address/',
        suffix: ''
    },
    {
        name: 'debank',
        prefix: 'https://debank.com/profile/',
        suffix: ''
    }
]

const addressesFromLocalStorage = JSON.parse(localStorage.getItem("myAddresses"));
const inputNote = document.querySelector('.input__note');
const urlParseBtn = document.getElementById('urlParseBtn');
const cbParseBtn = document.getElementById('cbParseBtn');
const exportBtn = document.getElementById('exportBtn');
const tablinks = document.querySelectorAll('.output__tablinks');
const outputContent = document.querySelector(".output__content");
const closeBtns = document.getElementsByClassName('close');
// const closeBtns = document.querySelectorAll('.close'); // doesn't work on app
let currentFormat = 0;

if (addressesFromLocalStorage) {
    myAddresses = addressesFromLocalStorage;
    render(myAddresses)
}


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

urlParseBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        addAddress(stringtoAddress(tabs[0].url))
    })
})

exportBtn.addEventListener('click', () => {
    exportStorage()
})

function render(addresses) {
    let listItems = "";
    for (let i = 0; i < addresses.length; i++) {
        let { prefix, suffix } = formats[currentFormat];
        listItems += `
        <li class="${addresses[i].value}">
        <a href="${prefix}${addresses[i].value}${suffix}" target="_blank">
        <span class="result">${addresses[i].value.slice(0, 5)}...${addresses[i].value.slice(-4)}</span>
        </a>
        <span class="note">${addresses[i].note}</span>
        <span class="close">X</span>
        </li>
        `
    }
    outputContent.innerHTML = listItems;
    for (let i = 0; i < closeBtns.length; i++) {
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


for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener('click', () => {
        changeFormat(tablinks[i].id)
    })
}

function changeFormat(newFormatName) {
    tablinks[currentFormat].classList.toggle('active');
    for (let i = 0; i < formats.length; i++) {
        let { name } = formats[i]
        if (newFormatName === name) {
            currentFormat = i;
            render(myAddresses)
            tablinks[i].classList.toggle('active');
        }
    }
}
const stringtoAddress = (str) => {
    let result = '';
    try {
        const addressRegex = /0x[0-9a-f]{40}/i;
        result = str.match(addressRegex)[0]
    } catch (err) { }
    return result;
};

function exportStorage() {
    let result = JSON.parse(localStorage.getItem("myAddresses"));
    exportToJsonFile(result);
}

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = 'myTrackedAddresses.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
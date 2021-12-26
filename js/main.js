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
const inputNote = document.querySelector('.input__note');
const urlParseBtn = document.getElementById('urlParseBtn');
const cbParseBtn = document.getElementById('cbParseBtn');
const downloadBtn = document.getElementById('downloadBtn');
const tablinks = document.querySelectorAll('.output__tablinks');
const outputContent = document.querySelector(".output__content");
let format = "etherscan";

const stringtoAddress = (str) => {
    const addressRegex = /0x[0-9a-f]{40}/i;
    let result = str.match(addressRegex)
    return result[0];
};

cbParseBtn.addEventListener('click', () => {
    addAddress(
        stringtoAddress(
            getClipboardUsingPaste()
        )
    )
})

function render(addresses) {
    let listItems = "";
    for (let i = 0; i < addresses.length; i++) {
        listItems += `
            <li id="${addresses[i].value}">
                <a href="https://etherscan.io/address/${addresses[i].value}">
                    <span class="result">${addresses[i].value.slice(0, 5)}...${addresses[i].value.slice(-4)}</span>
                </a>
                <span class="note">${addresses[i].note}</span>
                <span class="close">X</span>
            </li>
        `
    }
    outputContent.innerHTML = listItems;
}

function addAddress(address) {
    myAddresses.push(
        {
            value: address,
            note: inputNote.value
        }
    );
    render(myAddresses);
    inputNote.value = "";
}

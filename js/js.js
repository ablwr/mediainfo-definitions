const audio = "../data/Audio.csv";
const general = "../data/General.csv";
const image = "../data/Image.csv";
const menu = "../data/Menu.csv";
const other = "../data/Other.csv";
const text = "../data/Text.csv";
const video = "../data/Video.csv";

const files = [audio, general, image, menu, other, text, video];

let allParams = [];

files.forEach((i) => {
  Papa.parse(i, {
    download: true,
    skipEmptyLines: true,
    delimiter: ";",
    error: function () {
      console.log("Parsing error");
    },
    complete: function (data) {
      let categoryName = i.toString().slice(8, -4);
    //   allParams.push({ categoryName: categoryName, data: {fieldName: data.data[0][0], data: data.data[0][6]} });

      allParams.push({ categoryName: categoryName, data: data });
    },
  });
});


const input = document.querySelector("#searchBox");
const submit = document.getElementById('submit');
const results = document.querySelector("#results")
const statusNumber = document.querySelector("#status")
let thead = document.getElementById("head")

input?.addEventListener("keyup", function (e) {
    e.preventDefault();
    if (e.key === "Enter" && input.value.length > 3) {
        getParameters();
    }
});

submit?.addEventListener('click', (e) => {
    if (input.value.length > 3) {
    getParameters();
    }
})

const clear = document.getElementById('clear');
clear?.addEventListener('click', (e) => {
    clearAll()
})

function clearAll() {
    document.getElementById('searchBox').value = ""
    document.getElementById('results').innerHTML = ""
    statusNumber.innerText = ""
    thead.style.display = "none"
}

function getParameters() {
    document.getElementById('results').innerHTML = ""
    allParams.forEach(streamType => {
        streamType.data.data.filter(d => {
            if (d[0].toLowerCase().startsWith(input.value.toLowerCase())) {
                let tr = document.createElement("tr");
                results?.appendChild(tr);
                let td2 = document.createElement("td");
                let td1 = document.createElement("td");
                let td3 = document.createElement("td");
                td1.innerText = streamType.categoryName;
                td2.innerText = d[0];
                td3.innerText = d[6];
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
            }
        });
    });
    thead.style.display = "grid"
    statusNumber.innerText = `${document.getElementsByTagName("tr").length - 1} results found`;
}

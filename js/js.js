const audio = "https://raw.githubusercontent.com/MediaArea/MediaInfoLib/master/Source/Resource/Text/Stream/Audio.csv";
const general = "https://raw.githubusercontent.com/MediaArea/MediaInfoLib/master/Source/Resource/Text/Stream/General.csv";
const image = "https://raw.githubusercontent.com/MediaArea/MediaInfoLib/master/Source/Resource/Text/Stream/Image.csv";
const menu = "https://raw.githubusercontent.com/MediaArea/MediaInfoLib/master/Source/Resource/Text/Stream/Menu.csv";
const other = "https://raw.githubusercontent.com/MediaArea/MediaInfoLib/master/Source/Resource/Text/Stream/Other.csv";
const text = "https://raw.githubusercontent.com/MediaArea/MediaInfoLib/master/Source/Resource/Text/Stream/Text.csv";
const video = "https://raw.githubusercontent.com/MediaArea/MediaInfoLib/master/Source/Resource/Text/Stream/Video.csv";

const files = [audio, general, image, menu, other, text, video];

let allParams = [];

const input = document.querySelector("#searchBox")
const submit = document.getElementById('submit')
const contentArea = document.querySelector("#contentArea")
const statusNumber = document.querySelector("#status")
const category = document.querySelector("#category")
const thead = document.getElementById("head")
const url = new URL(window.location.href);


files.forEach((i) => {
  Papa.parse(i, {
    download: true,
    skipEmptyLines: true,
    delimiter: ";",
    error: function () {
      console.log("Parsing error");
      let sorry = document.createElement("h2")
      contentArea?.appendChild(sorry)
      sorry.innerText = "Sorry, there was a problem loading the data! Site's broken for today"
    },
    complete: function (data) {
      let categoryName = i.toString().slice(92, -4);
      allParams.push({ categoryName: categoryName, data: data });
      if (window.location.search) {
        let params = (new URL(document.location)).searchParams;
        document.getElementById('searchBox').value = params.get("search");
        category.value = params.get("category");
        getParameters()
    }
    },
  });
});

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
    document.getElementById('contentArea').innerHTML = ""
    statusNumber.innerText = ""
    thead.style.display = "none"
}

const browse = document.getElementById('browse');
browse?.addEventListener('click', (e) => {
    clearAll()
    if (browse.value === "Clear all") {
        clearAll()
        browse.value = "Browse all"
    } else {
        browse.value = "Clear all"
        let dataArray = []
        allParams.forEach(streamType => {
                streamType.data.data.filter(d => {
                        let tr = document.createElement("tr");
                        contentArea?.appendChild(tr);
                        let td1 = document.createElement("td");
                        let td2 = document.createElement("td");
                        let td3 = document.createElement("td");
                        td1.innerText = streamType.categoryName;
                        td2.innerText = d[0];
                        td3.innerText = d[6];
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);

                    dataArray.push(`<tr><td>${streamType.categoryName}</td><td>${d[0]}</td><td>${d[6]}</td></tr>`)
                });
            
        });

        return new Clusterize({
            rows: dataArray,
            scrollId: 'scrollArea',
            contentId: 'contentArea'
        });
    }
})


function getParameters() {
    url.searchParams.set('category', category.value);
    url.searchParams.set('search', input.value);
    window.history.replaceState(null, null, url);

    document.getElementById('contentArea').innerHTML = ""

    thead.style.display = "none"
    allParams.forEach(streamType => {
        if (streamType.categoryName.toLowerCase() === category.value || category.value === "all") {
            streamType.data.data.filter(d => {
                if (d[0].toLowerCase().startsWith(input.value.toLowerCase())) {
                    let tr = document.createElement("tr");
                    contentArea?.appendChild(tr);
                    let td1 = document.createElement("td");
                    let td2 = document.createElement("td");
                    let td3 = document.createElement("td");
                    td1.innerText = streamType.categoryName;
                    td2.innerText = d[0];
                    td3.innerText = d[6];
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);

                    if (td3.innerText.startsWith("Deprecated")) {
                        td2.style.color = "rgb(105, 29, 29)"
                        td2.style.textDecoration = "line-through"
                        td3.style.color = "rgb(105, 29, 29)"
                    }
                }
            });
        }
    });
    let trLength = document.getElementsByTagName("tr").length - 1
    if (trLength > 1) {
        thead.style.display = "grid"
    }
    statusNumber.innerText = `${trLength} results found`;
}

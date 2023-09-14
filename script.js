let alternativeAnimation = false;

let menu = document.getElementsByClassName("menu").item(0);
let list = document.createElement("ul");
let loadingGIF = document.getElementById("js-loading");

menu.style.left = "-300px";

loadCannel("SVT 1", "data/SVT 1.json");

function setChannel(channel) {
    clearProgram();
    loadCannel(channel, "data/" + channel + ".json");
}
function clearProgram() {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}
function loadCannel(h1, url) {
    let header = document.getElementById("js-title");
    header.innerHTML = h1;
    fetchData(url).then(data => { renderData(data); hideLoading(); }).catch((error) => console.log("Error"));
}
async function fetchData(url) {
    loadingGIF.classList.remove("hidden");
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
function renderData(program) {
    let showPrevious = document.createElement("li");
    showPrevious.classList.add("list-group-item");
    showPrevious.classList.add("show-previous");
    showPrevious.innerHTML = "Visa tidigare program";
    showPrevious.style.textAlign = "center";
    list.appendChild(showPrevious);
    showPrevious.onmouseover = function () {
        showPrevious.style.backgroundColor = "#666";
    }
    showPrevious.onmouseleave = function () {
        showPrevious.style.backgroundColor = "white";
    }
    showPrevious.onclick = function () {
        clearProgram();
        showPrevious.remove();
        let sortedList = sortList(program);
        printList(sortedList);
    }
    let filterdList = filterList(program);
    printList(filterdList);
}
function sortList(program) {
    const sortedArray = [];
    for (let item of program) {
        let obj = mapFunction(item);
        sortedArray.push(obj);
    }
    sortedArray.sort(sortFunction);
    return sortedArray;
}
function filterList(program) {
    let dateTime = new Date();
    let hour = pad(dateTime.getHours());
    let minute = pad(dateTime.getMinutes());
    let now = "" + hour + minute;
    function pad(unit) {
        return (("0") + unit).length > 2 ? unit : "0" + unit;
    }
    let filteredList = program.filter((item) => filterFunction(item, now));
    let mappedlist = filteredList.map((item) => mapFunction(item));
    mappedlist.sort(sortFunction);
    return mappedlist;
}
function filterFunction(item, now) {
    let time = item.start.charAt(11) + item.start.charAt(12) + item.start.charAt(14) + item.start.charAt(15);
    let timeParsed = parseInt(time);
    if (timeParsed > now) {
        return true;
    }
}
function mapFunction(item) {
    let time = item.start.charAt(11) +
        item.start.charAt(12) +
        item.start.charAt(14) +
        item.start.charAt(15);
    let obj = [];
    obj["0"] = time;
    obj["1"] = item.name;
    return obj;
}
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}
function printList(sortedList) {
    for (let item of sortedList) {
        let listItem = document.createElement("li");
        bold = document.createElement("strong");
        bold.appendChild(document.createTextNode(
            item[0].charAt(0) +
            item[0].charAt(1) +
            ":" +
            item[0].charAt(2) +
            item[0].charAt(3)
        ));
        listItem.appendChild(bold);
        listItem.appendChild(document.createElement("br"));
        listItem.appendChild(document.createTextNode(item[1]));
        listItem.classList.add("list-group-item");
        list.appendChild(listItem);
    }
    let schedule = document.getElementById("js-schedule");
    list.classList.add("list-group");
    list.classList.add("list-group-flush");
    schedule.appendChild(list);
}
function toggleMenu() {
    if (alternativeAnimation == false) {
        menuAnimation1();
    }
    if (alternativeAnimation == true) {
        menuAnimation2();
    }
}
// denna animation använder sig av transition som läggs till i css style. Fördel: mindre kod, lättare att ställa in hastighet på animationen om man använder ms
function menuAnimation1() {
    let menu = document.getElementsByClassName("menu").item(0);
    let button = document.getElementsByClassName("menu-icon").item(0).firstElementChild;
    menu.style.transition = "all 300ms";
    if (menu.style.left == "0px") {
        menu.style.left = "-300px";
        button.classList.replace("fa-times", "fa-bars");
        button.classList.replace("fa", "fas");
    } else if (menu.style.left == "-300px") {
        menu.style.left = "0px";
        button.classList.replace("fa-bars", "fa-times");
        button.classList.replace("fas", "fa");
    }
}
// denna animation använder sig av setInterval i javascript som sedan ändrar värdet på left i css style. Nackdel: mer kod, svårare att bestämma vilken hastighet animationen kommer ha
function menuAnimation2() {
    let menu = document.getElementsByClassName("menu").item(0);
    let button = document.getElementsByClassName("menu-icon").item(0).firstElementChild;
    let s = 10;
    let leftInterval;
    let rightInterval;
    if (menu.style.left == "0px") {
        leftInterval = setInterval(moveLeft, 10);
        button.classList.replace("fa-times", "fa-bars");
        button.classList.replace("fa", "fas");
    } else if (menu.style.left == "-300px") {
        rightInterval = setInterval(moveRight, 10);
        button.classList.replace("fa-bars", "fa-times");
        button.classList.replace("fas", "fa");
    }
    function moveLeft() {
        let leftPos = parseInt(menu.style.left.replace("px", ""));
        console.log(leftPos);
        menu.style.left = (leftPos - s) + "px";
        if (menu.style.left == "-300px") {
            clearInterval(leftInterval);
        }
    }
    function moveRight() {
        let leftPos = parseInt(menu.style.left.replace("px", ""));
        console.log(leftPos);
        menu.style.left = (leftPos + s) + "px";
        if (menu.style.left == "0px") {
            clearInterval(rightInterval);
        }
    }
}
function hideLoading() {
    loadingGIF.classList.add("hidden");
}
const STORAGE_KEY = "BUKU_APPS";

let bukus = [];

function isStorageExist(){
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(bukus);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        bukus = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function composeBukuObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    };
}

function findBuku(bukuId) {
    for (buku of bukus) {
        if (buku.id === bukuId)
            return buku;
    }
    return null;
}


function findBukuIndex(bukuId) {
    let index = 0
    for (buku of bukus) {
        if (buku.id === bukuId)
            return index;

        index++;
    }

    return -1;
}

function refreshDataFromBukus() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BUKU_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BUKU_ID);


    for (buku of bukus) {
        const newBuku = makeBuku(buku.title, buku.author, buku.year, buku.isComplete);
        newBuku[BUKU_ITEMID] = buku.id;


        if (buku.isComplete) {
            listCompleted.append(newBuku);
        } else {
            listUncompleted.append(newBuku);
        }
    }
}






const UNCOMPLETED_LIST_BUKU_ID = "incompleteBukushelfList";
const COMPLETED_LIST_BUKU_ID = "completeBukushelfList";
const BUKU_ITEMID = "itemId";

function addBuku() {
    const uncompletedBUKUList = document.getElementById(UNCOMPLETED_LIST_BUKU_ID);
    const completedBUKUList = document.getElementById(COMPLETED_LIST_BUKU_ID);
    const BukuTitle = document.getElementById("inputBukuTitle").value;
    const BukuAuthor = document.getElementById("inputBukuAuthor").value;
    const BukuYear = document.getElementById("inputBukuYear").value;

    const Buku = makeBuku(BukuTitle, BukuAuthor, BukuYear);
    const selesai = document.getElementById("selesai");

    if (selesai.checked == true) {
        const bukuObject = composeBukuObject(BukuTitle, BukuAuthor, BukuYear, true);
        Buku[BUKU_ITEMID] = bukuObject.id;
        bukus.push(bukuObject);

        completedBUKUList.append(Buku);
        updateDataToStorage();

    } else {
        const bukuObject = composeBukuObject(BukuTitle, BukuAuthor, BukuYear, false);
        Buku[BUKU_ITEMID] = bukuObject.id;
        bukus.push(bukuObject);

        uncompletedBUKUList.append(Buku);
        updateDataToStorage();

    }
}

makeBuku = (title, author, year, isComplete) => {

    const BukuTitle = document.createElement("h1");
    BukuTitle.innerText = title;

    const BukuAuthor = document.createElement("h4");
    BukuAuthor.innerText = author;

    const BukuYear = document.createElement("p");
    BukuYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(BukuTitle, BukuAuthor, BukuYear);

    const container = document.createElement("article");
    container.classList.add("buku_item", "mt-4")
    container.append(textContainer);
    if (isComplete) {
        container.append(
            createUndoButton(),
            createDeleteButton());

    } else {
        container.append(
            createCheckButton(), 
            createDeleteButton());
}

return container;
}

createButton = (buttonTypeClass, kata, id, eventListener) => {
    const button = document.createElement("button");
    button.innerText = kata;
    button.classList.add("btn", buttonTypeClass);
    button.setAttribute("id", id)
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addBukuToCompleted(taskElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BUKU_ID);
    const BukutaskTitle = taskElement.querySelector(".inner > h1").innerText;
    const BukutaskAuthor = taskElement.querySelector(".inner > h4").innerText;
    const BukutaskYear = taskElement.querySelector(".inner > p").innerText;

    const newBuku = makeBuku(BukutaskTitle, BukutaskAuthor, BukutaskYear, true);
    const buku = findBuku(taskElement[BUKU_ITEMID]);
    buku.isComplete = true;
    newBuku[BUKU_ITEMID] = buku.id;

    listCompleted.append(newBuku);
    taskElement.remove();

    updateDataToStorage();

}

function undoTaskFromCompleted(taskElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BUKU_ID);
    const BukutaskTitle = taskElement.querySelector(".inner > h1").innerText;
    const BukutaskAuthor = taskElement.querySelector(".inner > h4").innerText;
    const BukutaskYear = taskElement.querySelector(".inner > p").innerText;

    const newBuku = makeBuku(BukutaskTitle, BukutaskAuthor, BukutaskYear, false);

    const buku = findBuku(taskElement[BUKU_ITEMID]);
    buku.isComplete = false;
    newBuku[BUKU_ITEMID] = buku.id;

    listUncompleted.append(newBuku);
    taskElement.remove();

    updateDataToStorage();
}


function removeTaskFromCompleted(taskElement) {
    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("myModal");
    var btnd = document.getElementById("nodelete");
    var btnv = document.getElementById("vdelete");

    modal.style.display = "block";
    btnv.addEventListener("click", function () {
        modal.style.display = "none";

        const bukuPosition = findBukuIndex(taskElement[BUKU_ITEMID]);
        bukus.splice(bukuPosition, 1);
        taskElement.remove();
        updateDataToStorage();
    })

    btnd.addEventListener("click", function () {
        modal.style.display = "none";
        updateDataToStorage();
    })

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

function createCheckButton() {
    return createButton("btn-outline-success", "Selesai dibaca", "check", function (event) {
        addBukuToCompleted(event.target.parentElement);
    });
}

function createDeleteButton() {
    return createButton("btn-outline-danger", "Hapus Buku", "delete", function (event) {
        removeTaskFromCompleted(event.target.parentElement);
    });
}

function createUndoButton() {
    return createButton("btn-outline-warning", "Belum Selesai dibaca", "undo", function (event) {
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function search() {
    let input, filter, inner, article, h1, i, txtValue;
    input = document.getElementById('inputsearch');
    filter = input.value.toUpperCase();
    inner = document.getElementById("filter");
    article = inner.getElementsByTagName('article');

    for (i = 0; i < article.length; i++) {
        h1 = article[i].getElementsByTagName("h1")[0];
        txtValue = h1.textContent || h1.innerText;
        console.log(h1);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            article[i].style.display = "";
        } else {
            article[i].style.display = "none";
        }
    }

}




let toggle = document.getElementsByClassName('navbar-toggler')[0],
    collapse = document.getElementsByClassName('navbar-collapse')[0],
    dropdowns = document.getElementsByClassName('dropdown');;

function toggleMenu() {
    collapse.classList.toggle('collapse');
    collapse.classList.toggle('in');
}

function closeMenus() {
    for (var j = 0; j < dropdowns.length; j++) {
        dropdowns[j].getElementsByClassName('dropdown-toggle')[0].classList.remove('dropdown-open');
        dropdowns[j].classList.remove('open');
    }
}

for (var i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener('click', function () {
        if (document.body.clientWidth < 768) {
            var open = this.classList.contains('open');
            closeMenus();
            if (!open) {
                this.getElementsByClassName('dropdown-toggle')[0].classList.toggle('dropdown-open');
                this.classList.toggle('open');
            }
        }
    });
}

function closeMenusOnResize() {
    if (document.body.clientWidth >= 768) {
        closeMenus();
        collapse.classList.add('collapse');
        collapse.classList.remove('in');
    }
}

window.addEventListener('resize', closeMenusOnResize, false);
toggle.addEventListener('click', toggleMenu, false);



document.addEventListener("DOMContentLoaded", function () {
    
    const submitForm = document.getElementById("inputBuku");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBuku();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});
   

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFromBukus();
});

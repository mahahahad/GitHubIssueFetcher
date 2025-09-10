// Util library to help render markdown
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const RESULTS_PER_PAGE = 30;

const cardContainer = document.querySelector(".cardContainer");
const prevPageBtn = document.querySelector(".prevPageBtn");
const nextPageBtn = document.querySelector(".nextPageBtn");
const currentPageEl = document.querySelector(".currentPage");
const totalResultsEl = document.querySelector(".totalResults");
const totalPageCountEl = document.querySelector(".pageCount > .totalPages");

function createCard(item) {
    const card = document.createElement("div");
    const cardTitle = document.createElement("h1");
    const cardBody = document.createElement("p");
    const labelWrapper = document.createElement("div");

    card.classList.add("card");
    cardTitle.classList.add("card__title");
    cardBody.classList.add("card__body");
    labelWrapper.classList.add("card__labels");

    item.labels.forEach(labelEl => {
        if (labelEl.name == "good-first-issue") return;
        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = labelEl.name;
        labelWrapper.appendChild(label);
    })

    card.onclick = () => openRepoDialog(item);
    cardTitle.textContent = item.title;
    cardTitle.title = item.title;
    cardBody.innerHTML = marked.parse(item.body);
    card.appendChild(cardTitle);
    card.appendChild(labelWrapper);
    card.appendChild(cardBody);
    return (card);
}

// Creates all of the cards for each issue by retrieving the data using the GitHub API.
async function createCards(pageNum = 0) {
    let responseParsed = await getData(pageNum);
    
    totalPageCountEl.textContent = Math.floor(1000 / RESULTS_PER_PAGE);
    totalResultsEl.textContent = `1000 total results`;
    cardContainer.innerHTML = '';
    responseParsed.items.forEach(item => cardContainer.appendChild(createCard(item)));
}

async function getData(pageNum = 0) {
    let response = await fetch(`https://api.github.com/search/issues?q=label:good-first-issue+state:open&type=issue&per_page=${RESULTS_PER_PAGE}&page=${pageNum}`);
    let responseParsed = await response.json();
    
    // console.log(responseParsed);
    return (responseParsed);
}

function openRepoDialog(repo) {
    const overlay = document.createElement("div");
    const dialog = document.createElement("dialog");
    const repoTitle = document.createElement("h1");
    const repoBodyContainer = document.createElement("div");
    const repoBody = document.createElement("p");
    const repoButton = document.createElement("button");

    overlay.classList.add("overlay");
    repoTitle.classList.add("issue__title");
    repoBodyContainer.classList.add("issue__bodyContainer");
    repoBody.classList.add("issue__bodyContainer__body");
    repoButton.classList.add("issue__button");

    repoTitle.textContent = repo.title;
    repoBody.innerHTML = marked.parse(repo.body);
    repoButton.textContent = "Visit on GitHub";
    repoButton.onclick = () => window.open(repo.html_url, "blank");

    overlay.appendChild(dialog);
    dialog.appendChild(repoTitle);
    repoBodyContainer.appendChild(repoBody);
    dialog.appendChild(repoBodyContainer);
    dialog.appendChild(repoButton);
    document.body.appendChild(overlay);
    dialog.show();
    overlay.addEventListener("keydown", (e) => { e.key == "Escape" && dialog.close(); document.body.removeChild(overlay) });
}

function isPageNumValid(pageNum) {
    return (pageNum > 0 && pageNum <= parseInt(totalPageCountEl.textContent))
}

currentPageEl.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        isPageNumValid(parseInt(currentPageEl.textContent)) && createCards(parseInt(currentPageEl.textContent));
    }
})

prevPageBtn.addEventListener("click", () => {
    let newPageNum = parseInt(currentPageEl.textContent) - 1;
    if (!isPageNumValid(newPageNum)) return;
    currentPageEl.textContent = newPageNum;
    createCards(newPageNum);
})

nextPageBtn.addEventListener("click", () => {
    let newPageNum = parseInt(currentPageEl.textContent) + 1;
    if (!isPageNumValid(newPageNum)) return;
    currentPageEl.textContent = newPageNum;
    createCards(newPageNum);
})

const h1 = document.createElement("h1");
h1.textContent = "Fetching good first issues from GitHub";
document.body.appendChild(h1);
await createCards();
document.body.removeChild(h1);
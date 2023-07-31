const debounce = (fn, debounceTime) => {
  let timer;
  return function debounceFn(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, debounceTime);
  };
};

let repositories;
const searchInput = document.querySelector(".search__input");
const searchList = document.querySelector(".search__list");
const repositoriesList = document.querySelector(".repositories");

const deferredGetRepos = debounce(async function getRepos() {
  try {
    if (searchList.innerHTML.length > 0) {
      searchList.innerHTML = "";
    }
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${searchInput.value}&per_page=5`
    );
    const responseJson = await response.json();
    repositories = responseJson.items;
    if (repositories !== undefined) {
      if (repositories.length !== 0) {
        repositories.forEach((repository, index) => {
          let documentFragment = new DocumentFragment();
          let searchListItem = document.createElement("li");
          searchListItem.innerText = `${repository.name}`;
          searchListItem.classList.add("search__list-item");
          searchListItem.classList.add(`search__list-item${index}`);
          documentFragment.append(searchListItem);
          searchList.append(documentFragment);
        });
      } else {
        alert("none");
        searchInput.value = "";
      }
    }
  } catch (error) {
    alert(error);
  }
}, 500);

searchInput.addEventListener("input", () => {
  //
  try {
    if (
      searchInput.value[0] !== " " &&
      searchInput.value.length !== 0 &&
      !/^([а-яА-ЯёЁ]*)$/.test(searchInput.value)
    ) {
      deferredGetRepos();
    } else if (
      searchInput.value[0] !== " " &&
      searchInput.value.length !== 0 &&
      /^([а-яА-ЯёЁ]*)$/.test(searchInput.value)
    ) {
      alert("Ошибка");
      searchInput.value = "";
    } else {
      searchList.innerHTML = "";
    }
  } catch (error) {
    alert(error);
  }
});

searchList.addEventListener("click", (elem) => {
  try {
    target = elem.target;
    let targetIndex = target.className
      .match(/search__list-item[0-9]$/gim)
      .join("");
    targetIndex = targetIndex[targetIndex.length - 1];
    let currentRepository = repositories[targetIndex];
    searchInput.value = "";
    searchList.innerHTML = "";
    let documentFragment = new DocumentFragment();

    let repositoriesItem = document.createElement("ul");
    repositoriesItem.innerHTML = `<li>Name: ${currentRepository.name}<br>Owner: ${currentRepository.owner.login}<br>Stars: ${currentRepository.stargazers_count}</li>`;
    repositoriesItem.classList.add("repositories__item");

    let repositoriesButton = document.createElement("button");
    repositoriesButton.classList.add("repositories__item-button");
    repositoriesButton.addEventListener("click", () => {
      repositoriesItem.remove();
    });

    documentFragment.append(repositoriesItem);
    repositoriesItem.append(repositoriesButton);
    repositoriesList.append(documentFragment);
  } catch (error) {
    alert(error);
  }
});

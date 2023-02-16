//JSCORE 4-3-7
function debounce(callback, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

class View {
  constructor() {
    this.app = this.createElement("div");
    document.body.appendChild(this.app);

    this.searchLine = this.createElement("div", "search-line");
    this.searchInput = this.createElement("input", "search-input");
    this.searchCounter = this.createElement("span", "counter");

    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.searchCounter);

    this.repsWrapper = this.createElement("div", "reps-wrapper");
    this.repsList = this.createElement("ul", "reps");
    this.repsWrapper.append(this.repsList);

    this.main = this.createElement("div", "main");
    this.main.append(this.repsWrapper);

    this.app.append(this.searchLine);
    this.app.append(this.main);
  }

  createElement(elementTag, elementClass) {
    let element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  deleteElement(el) {
    el.remove();
  }

  createReps(item) {
    const repItem = this.createElement("li", "rep-prev");
    repItem.textContent = item.name;
    this.repsList.append(repItem);

    repItem.addEventListener("click", () => {
      this.searchInput.value = "";
      this.repsList.textContent = "";
      const selectedRepsWrapper = this.createElement("div", "card");
      const selectedRepList = this.createElement("div", "reps-list");

      const repName = this.createElement("div");
      repName.textContent = `Name: ${item.name}`;
      selectedRepList.append(repName);

      const repOwner = this.createElement("div");
      repOwner.textContent = `Owner: ${item.owner["login"]}`;
      selectedRepList.append(repOwner);

      const repStars = this.createElement("div");
      repStars.textContent = `Stars: ${item.stargazers_count}`;
      selectedRepList.append(repStars);

      const escape = this.createElement("div", "escape");
      const escapeImg = this.createElement("img");
      escapeImg.src = "cancel-btn.svg";
      escape.append(escapeImg);

      selectedRepsWrapper.append(selectedRepList);
      selectedRepsWrapper.append(escape);

      this.main.append(selectedRepsWrapper);

      escape.addEventListener(
        "click",
        this.deleteElement.bind(this, selectedRepsWrapper)
      );
    });
  }
}

class Search {
  constructor(view) {
    this.view = view;
    this.view.searchInput.oninput = debounce(this.searchReps.bind(this), 450);
  }

  async searchReps() {
    if (
      this.view.searchInput.value &&
      this.view.searchInput.value.charAt(0) !== " "
    ) {
      return await fetch(
        `https://api.github.com/search/repositories?q=${this.view.searchInput.value}`
      ).then((res) => {
        this.clearRepsList();
        res.json().then((res) => {
          let count = 0;
          do {
            this.view.createReps(res.items[count]);
          } while (++count < 5);
        });
      });
    } else {
      this.clearRepsList();
      this.view.searchInput.value = "";
    }
  }

  clearRepsList() {
    this.view.repsList.textContent = "";
  }
}

document.body.className = "body";
new Search(new View());

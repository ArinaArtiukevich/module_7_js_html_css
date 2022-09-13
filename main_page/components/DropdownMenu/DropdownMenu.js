class DropdownMenu {
    render() {
        const html = `
                       <ul id="dropdownList" class="dropdownList"></ul>
                       <div class="selected">${DEFAULT_VALUE_DROPDOWN}</div>
                  `;
        document.getElementById('search_box').insertAdjacentHTML('beforeend', `<div id="dropdown" class="dropdown">${html}</div>`);
        this.loadDropdown();
    }

    loadDropdown() {
        loadPageTags();
        document.getElementById("dropdownList").addEventListener('scroll', debounce(loadDropdownOnScroll, 100));
    }

    loadDropdownList(tagList) {
        let htmlDropdown = '';
        for (let i = 0; i < tagList.length; i++) {
            htmlDropdown += `
                <li class="option">
                    <div id="tag_name" class="tag_name">
                        ${tagList[i].name}
                    </div>
                </li>
           `;
        }
        document.getElementById('dropdownList').insertAdjacentHTML('beforeend', `${htmlDropdown}`);

        let selected = document.querySelector(".selected");
        let optionList = document.querySelectorAll(".option");
        if (previousList !== undefined) {
            optionList = compareNodeLists(previousList, document.querySelectorAll(".option"));
        }
        optionList.forEach(o => {
            o.addEventListener("click", () => {
                selected.innerHTML = o.innerHTML;
                const searchTag = o.querySelector(".tag_name").innerText;
                couponsPage.render(`tag=${searchTag}`);
            });
        });
        previousList = document.querySelectorAll(".option");
    }
}

let tagPage = 1;
const dropdownMenuPage = new DropdownMenu();
let partlyLoadedCategories = [];
let previousList;

function loadDropdownOnScroll() {
    if (partlyLoadedCategories.length !== 0) {
        const {scrollTop, scrollHeight, clientHeight} = document.getElementById("dropdownList");
        if ((clientHeight + scrollTop) >= (scrollHeight - 40)) {
            loadPageTags();
        }
    }
}

function loadPageTags() {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/json;charset=utf-8');
    customHeaders.append('Authorization', `Bearer_${sessionStorage.getItem("access_token")}`);
    fetch(`http://localhost:8080/tags?page=${tagPage}&size=4`, {
        method: 'GET',
        headers: customHeaders,
    }).then(response => {
        if (response.ok) {
            response.json().then(tags => {
                if (tags !== undefined && Object.keys(tags).length !== 0) {
                    partlyLoadedCategories = tags["_embedded"]["tagRepresentationList"];
                    tagPage++;
                    dropdownMenuPage.loadDropdownList(partlyLoadedCategories);
                } else {
                    tagPage = 1;
                }
            });
        }
    });

}

function compareNodeLists(previous, current) {
    let previousNodeList = [].slice.call(previous, 0),
        currentNodeList = [].slice.call(current, 0),
       updatedNodes = [];

    for (let i = 0; i < currentNodeList.length; i++) {
        if (previousNodeList.indexOf(currentNodeList[i]) === -1) {
            updatedNodes.push(currentNodeList[i]);
        }
    }
    return updatedNodes;
}
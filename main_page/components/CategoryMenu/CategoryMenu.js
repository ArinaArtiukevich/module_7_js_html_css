class Categories {

    handleClear() {
        ROOT_CATEGORY_MENU.innerHTML = '';
    }

    render() {
        ROOT_CATEGORY_MENU.innerHTML = `<div id="tag_message" class="tag_message"></div>`;
        let customHeaders = new Headers();
        customHeaders.append('Content-Type', 'application/json;charset=utf-8');
        customHeaders.append('Authorization', `Bearer_${sessionStorage.getItem("access_token")}`);
        if (customHeaders.get('Authorization').length > 12) {
            document.getElementById("tag_message").innerText = "";
            fetch(`http://localhost:8080/tags?page=${tagPageDefault}&size=6`, {
                method: 'GET',
                headers: customHeaders,
            }).then(response => {
                if (response.ok) {
                    response.json().then(tags => {
                        if (tags !== undefined && Object.keys(tags).length !== 0) {
                            let tagList = tags["_embedded"]["tagRepresentationList"];
                            this.loadCategories(tagList);
                        }
                    });
                } else {
                    document.getElementById("tag_message").innerText = "You are not allowed to see the content.";
                }
            });
        }
    }

    loadCategories(tagList) {
        let htmlCategory = '';
        for (let i = 0; i < tagList.length && i < 6; i++) {
            htmlCategory += ` 
                <li>
                    <div class="category" >
                        <div class="image">
                            <img id="category_image" class="category_image" src="${couponsPage.getImage(tagList[i].imagePath)}" alt="Category">
                        </div>
                        <div class="category_name">
                           <a href="#" onclick="categoriesPage.filterCouponList(this); ">${tagList[i].name}</a>
                        </div>
                    </div>
                </li>`;
        }
        ROOT_CATEGORY_MENU.innerHTML += `<ul>${htmlCategory}</ul>`;

    }

    filterCouponList(categoryName) {
        couponsPage.render(`tag=${categoryName.innerText}`);
    }

}
const tagPageDefault = 1;
const categoriesPage = new Categories();

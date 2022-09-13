class ItemDetails {

    handleClear() {
        ROOT_ITEM_DETAILS.innerHTML = '';
    }

    render(id) {
        fetch(`http://localhost:8080/certificates/${id}`, {
            method: 'GET',
            headers: loadHeader(),
        }).then(response => {
            if (response.ok) {
                response.json().then(item => {
                    if (item !== undefined) {
                        this.setItemDetailsRoot(item["name"], item["description"], item["duration"], item["price"], item["id"], item["imagePath"]);
                    }
                });
            } else {
               // todo console.log("requiredItem");
            }
        });

    }

    setItemDetailsRoot(name, description, expiresIn, price, idCoupon, imagePath) {

        ROOT_ITEM_DETAILS.innerHTML = `
            <div class="container_details">
                <div class="element_details">
                    <div class="parent">
                        <img id="element_image_large" class="element_image_large" src="${couponsPage.getImage(imagePath)}">
                <!-- </div> -->
                <!-- <div class="inline_info"> -->
                        <div class="info_box">
                            <div class="description">
                                <div class="element_title">
                                    <p>${name}</p>
                                </div>
                                <div class="element_full_description">
                                    <p>${description}</p>
                                </div>
                            </div>
                            <div class="time_left">
                                <div class="time_left_titlie">
                                    <p>Time Left To Buy</p>
                                </div>
                                <div class="time_left_in">
                                    <p>${expiresIn}</p>
                                 </div>
                            </div>
                            <div class="inline_footer_box">
                                <div class="price">
                                    <p>$ ${price}</p>
                                </div>
                            </div>
                            <div class="item_actions">
                                <ul class="inline_list" id="item_details_list">
                                    <li>
                                        <a href="#checkout">
                                            <span>Go to cart</span>
                                            <img id="shopping_cart" class="material-icons"
                                                 src="../images/shopping_cart_black_24dp.svg" alt="Shopping cart"  onclick="couponsPage.handleSetLocationStorage(this, ${idCoupon});">
                                        </a>
                                    </li>
                                   
                                </ul>
                            </div>
                           
                        </div>
                </div>
<!--        <div class="element_detailed_info">-->
<!--            <div class="detailed_description_title"><p>Item Detailed Description</p></div>-->
<!--            <div class="detailed_description">-->
<!--                <p>Right-click in an HTML page and select "View Page Source" (in Chrome) or "View Source" (in Edge), or-->
<!--                    similar in other browsers. This will open a window containing the HTML source code of the page.-->

<!--                    Right-click in an HTML page and select "View Page Source" (in Chrome) or "View Source" (in Edge), or-->
<!--                    similar in other browsers. This will open a window containing the HTML source code of the page.-->

<!--                    Right-click in an HTML page and select "View Page Source" (in Chrome) or "View Source" (in Edge), or-->
<!--                    similar in other browsers. This will open a window containing the HTML source code of the page.-->
<!--                </p>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</div>
        `;
        let localRole = sessionStorage.getItem("role");
        if (localRole !== null && localRole === ROLE_ADMIN){
            let updateMenu = `
                <li>
                    <a href="#update_item">
                        <input type="hidden">
                        <span onclick="newItemPage.render(${idCoupon})">
                            <label>Update item</label>
                        </span>
                    </a>
                </li>`
            document.getElementById('item_details_list').insertAdjacentHTML('beforeend', `${updateMenu}`);
        }
    }
}


const itemDetailsPage = new ItemDetails();
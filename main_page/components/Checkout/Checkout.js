class Checkout {

    handleClear() {
        ROOT_CHECKOUT.innerHTML = '';
    }

    setMessage(value) {
        document.getElementById("checkout_message").innerHTML = value;
    }

    getItemRepresentation(id, imagePath, name, description, price) {
        return `<li>
                    <div class="element">
                        <ul>
                            <li class="info_element">
                                <div class="element_image">
                                    <img id="element_image" class="element_image_square" src="${couponsPage.getImage(imagePath)}">
                                </div>
                            </li>
                            <li class="info_element">
                                <div class="element_information">
                                    <div class="element_title">
                                        <p><a href="#item_details" onclick="itemDetailsPage.render(\'${id}\');likedItemsPage.handleClear();">${name}</a></p>
                                    </div>
                                    <div class="element_description">
                                        <p>${description}</p>
                                    </div>
                                </div>
                            </li>
                            <li class="info_element">
                                <div class="element_price"><p>$ ${price}</p></div>
                            </li>
                            <li class="info_element">
                                <div class="delete_item close_image" onclick="localStorageUtil.deleteCoupon('${id}\'); checkoutPage.render(); couponsPage.render();"></div>
                            </li>
                        </ul>
                    </div>
                </li>
        `;
    }

    render() {
        const couponsStore = localStorageUtil.getCoupons();
        let htmlCatalog = "";
        let sumCatalog = 0;

        this.setCheckoutContainer();

        couponsStore.forEach(idCoupon => {
            fetch(`http://localhost:8080/certificates/${idCoupon}`, {
                method: 'GET',
                headers: loadHeader(),
            }).then(response => {
                if (response.ok) {
                    response.json().then(coupon => {
                        if (coupon !== undefined && Object.keys(coupon).length !== 0) {
                            htmlCatalog = this.getItemRepresentation(coupon.id, coupon.imagePath, coupon.name, coupon.description, coupon.price)
                            sumCatalog = parseInt(document.getElementById("checkout_total_price").innerText) + coupon.price;
                            document.getElementById('elements_list').insertAdjacentHTML('afterbegin', `${htmlCatalog}`);
                            document.getElementById('checkout_total_price').innerText = sumCatalog;
                        }
                    });
                }
            });
        });
    }

    setCheckoutContainer() {

        ROOT_CHECKOUT.innerHTML = `
                        <div class="container">
                            <form id="checkout_form" onsubmit="buyAllCoupons(); couponsPage.render();">
                           
                                <div class="head_container">
                                    <div class="head_text"><p>Checkout</p></div>
                                </div>
                                 
                                <div id="checkout_message" class="info_element_message"></div>
                                <div class="border">
                                  
                                    <div class="elements">
                                        <ul class="elements_list" id="elements_list">
                                          
                                        </ul>
                                        <div class="total_elements">
                                            <ul>
                                                <li class="elements_price"><p>Total</p></li> 
                                                <li class="elements_price"><p>$ <span id="checkout_total_price">0<span></p></li> 
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="button_checkout">
                                        <ul>
                                            <li> <a href="#" class="light_button">Back</a></li> 
                                            <li> <button type="submit" class="green_button">Checkout</a></li> 
                                        </ul>
                                    </div>
                                </div>
                            </form>
                      </div>
        `;
    }

}

async function buyAllCoupons() {
    const couponsStore = localStorageUtil.getCoupons();

    let idUser = sessionStorage.getItem("id");
    if (idUser !== null) {

        for (let i = 0; i < couponsStore.length; i++) {
            await fetch(`http://localhost:8080/users/${idUser}`, {
                body: JSON.stringify({"certificates": [{"id": couponsStore[i]}]}), method: 'PATCH',
                headers: loadHeader(),
            }).then(response => {
                if (response.ok) {
                    checkoutPage.setMessage("Operation was completed.");
                } else {
                    checkoutPage.setMessage("Operation was failed. Try again.");
                }
            });
            localStorageUtil.deleteCoupon(couponsStore[i]);
        }
    }
    checkoutPage.render();
}

const checkoutPage = new Checkout();
class LikedItems {

    handleClear() {
        ROOT_LIKED_COUPONS.innerHTML = '';
    }

    render() {
        let htmlCatalog = "";
        let sumCatalog = 0;
        ROOT_LIKED_COUPONS.innerHTML = `
            <div class="liked_items_container">
                <div class="liked_items_close close_image" onclick="likedItemsPage.handleClear();"></div>
                <table id="like_items_list">
                    <tr class="liked_items_price"> 
                        <td class="liked_item_name">Total </td>
                        <td class="liked_item_price">$ <span id="liked_items_total_price">${sumCatalog}</span></td>
                    </tr>
                </table>
            </div>
        `;
        const couponsLikedStore = localStorageUtil.getLikedCoupons();

        couponsLikedStore.forEach(idCoupon => {
            fetch(`http://localhost:8080/certificates/${idCoupon}`, {
                method: 'GET',
                headers: loadHeader(),
            }).then(response => {
                if (response.ok) {
                    response.json().then(coupon => {
                        if (coupon !== undefined && Object.keys(coupon).length !== 0) {
                            htmlCatalog = `
                                <tr> 
                                    <td class="liked_item_name"><a href="#item_details" onclick="itemDetailsPage.render(\'${coupon.id}\');likedItemsPage.handleClear();">${coupon.name}</a></td>
                                    <td class="liked_item_price">$ ${coupon.price.toLocaleString()}</td>
                                </tr>
                            `;
                            sumCatalog = parseInt(document.getElementById("liked_items_total_price").innerText) + coupon.price;
                            document.getElementById('like_items_list').insertAdjacentHTML('afterbegin', `${htmlCatalog}`);
                            document.getElementById('liked_items_total_price').innerText = sumCatalog;
                        }
                    });
                }
            });

        });
    }
}

const likedItemsPage = new LikedItems();
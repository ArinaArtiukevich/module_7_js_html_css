class Coupons {
    constructor() {
        this.labelAdd = "Add to Cart";
        this.labelDelete = "Delete";
        this.classLinkDisabled = "add_to_cart_disabled";

        this.classLinkLikeImg = "../images/favorite_black_24dp.svg";
        this.classLinkLikedImg = "../images/favorite_border_black_24dp.svg";
        this.htmlCatalog = `<div id="coupons_message" class="coupons_message"></div><ul id="coupons_list"></ul><a onclick="toTop()" class="to_top"><img id="top_up_img" class="top_up_img" src="../images/top_up/expand_less_black_24dp.svg" alt="Top up"></a>`;
    }

    handleClear() {
        ROOT_COUPONS.innerHTML = '';
    }

    handleSetLocationStorage(element, idCoupon) {
        const {pushCoupon, coupons} = localStorageUtil.putCoupons(idCoupon);
        if (pushCoupon) {
            element.innerHTML = this.labelDelete;
            element.classList.add(this.classLinkDisabled);
        } else {
            element.innerHTML = this.labelAdd;
            element.classList.remove(this.classLinkDisabled);
        }
    }

    handleSetLikedStorage(element, idCoupon) {
        const {pushLikedCoupon, likedCoupons} = localStorageUtil.putLikedCoupons(idCoupon);
        if (pushLikedCoupon) {
            element.src = this.classLinkLikedImg;
        } else {
            element.src = this.classLinkLikeImg;
        }
    }

    scrollListener() {
        window.addEventListener('scroll', debounce(showToTopElement, 10));
    }

    getImage(imagePath) {
        let image = "../images/grey_image.jpeg";
        if (imagePath !== null) {
            image = "http://127.0.0.1:8082" + imagePath;
        }
        return image;
    }

    loadItem(element) {
        let activeText = "";
        let activeLinkClass = "";
        let activeLike = "";
        let htmlCatalogLocal = "";

        if (couponsStore.indexOf(element.id) === -1) {
            activeText = this.labelAdd;
        } else {
            activeText = this.labelDelete;
            activeLinkClass = " " + this.classLinkDisabled;
        }

        if (couponsLikedStore.indexOf(element.id) === -1) {
            activeLike = this.classLinkLikeImg;
        } else {
            activeLike = this.classLinkLikedImg;
        }


        htmlCatalogLocal = `
           <li>
                <div class="coupon">
                    <div class="image">
                        <img id="coupon_image" class="coupon_image" src="${this.getImage(element.imagePath)}" alt="Coupon" />
                    </div>
                    <div class="coupon_description">
                        
                        <table class="coupon_info_table">
                            <tr>
                                <th>
                                    <div class="coupon_name"> <a href="#item_details" onclick="itemDetailsPage.render(\'${element.id}\');">${element.name}</a></div>
                                </th>
                                <th>
                                    <a href="#"> <img id="img_favorite" class="coupon_favorite" src="${activeLike}" alt="Favorites"  onclick="couponsPage.handleSetLikedStorage(this, ${element.id});"></a>
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    <div class="coupon_brief_description">${element.description}</div>
                                </th>
                                <th>
                                    <div class="expires_in_info">Expites in ${element.duration}</div>
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    <div class="avarage_price">$${element.price}</div>
                                </th>
                                <th>
                                    <div class="add_to_cart_button">
                                        <a href="#" class="add_to_cart${activeLinkClass}" onclick="couponsPage.handleSetLocationStorage(this, ${element.id});">${activeText}</a>
                                    </div>
                                </th>
                            </tr>
                        </table>
                    </div>
                </div>
            </li>
           `;
        document.getElementById('coupons_list').insertAdjacentHTML('beforeend', htmlCatalogLocal);
    }


    render(parameters) {
        index = 0;
        page = 1;
        let url = `http://localhost:8080/certificates?page=${page}&size=5`;
        if (parameters !== undefined) {
            url += `&${parameters}`;
        }
        if (optimizedHandler !== undefined) {
            window.removeEventListener('scroll', optimizedHandler);
        }
        localStorage.setItem('loadFilteredCoupons', false.toString());
        ROOT_COUPONS.innerHTML = `${this.htmlCatalog}`;
        this.scrollListener();

        if (loadHeader().get('Authorization').length > 12) {
            document.getElementById("coupons_message").innerText = "";

            fetch(url, {
                method: 'GET',
                headers: loadHeader(),
            }).then(response => {
                if (response.ok) {
                    response.json().then(coupons => {
                        if (coupons !== undefined && Object.keys(coupons).length !== 0) {
                            partlyLoadedCoupons = coupons["_embedded"]["certificateRepresentationList"];
                            page++;
                            for (; index < partlyLoadedCoupons.length && index < 5; index++) {
                                this.loadItem(partlyLoadedCoupons[index]);
                            }
                            if (partlyLoadedCoupons.length !== 0) {
                                footerPage.render();
                            }
                        } else {
                            footerPage.handleClear();
                        }
                    });
                } else {
                    document.getElementById("coupons_message").innerText = "You are not allowed to see the content.";
                }
            });
        } else {
            document.getElementById("coupons_message").innerText = "Please login or sign up.";
        }
        previousParameters = parameters;
        handler = function () {
            loadOnScroll(previousParameters);
        }

        optimizedHandler = debounce(handler, 25);
        window.addEventListener('scroll', optimizedHandler);
    }


}

let partlyLoadedCoupons = [];
let index = 0;
let page = 1;
let previousParameters;

let optimizedHandler;
let handler;

function loadOnScroll(parameters) {
    // console.log('Scrolling...');
    if (partlyLoadedCoupons.length !== 0 && index !== 0) {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        localStorage.setItem(isLoading, false.toString());
        if ((clientHeight + scrollTop) >= (scrollHeight - 20)) {
            localStorage.setItem(isLoading, true.toString());
            loadCoupons(parameters);
        } else {
            spinnerPage.handleClear();
            localStorage.setItem(isLoading, false.toString());
        }
    }
}

const debounce = (fn, ms) => {
    let timeout;
    return function () {
        const fnCall = () => {
            fn.apply(this, arguments)
        }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms)
    };
}

const couponsPage = new Coupons();

const couponsStore = localStorageUtil.getCoupons();
const couponsLikedStore = localStorageUtil.getLikedCoupons();

function toTop() {
    localStorage.setItem(scrollTop, 0);
}

function showToTopElement() {
    if (document.documentElement.scrollTop > 30) {
        document.querySelector(".to_top").classList.add("active");
    } else {
        document.querySelector(".to_top").classList.remove("active");
    }
}

function loadHeader() {
    let customHeaders = new Headers();
    customHeaders.append('Content-Type', 'application/json;charset=utf-8');
    customHeaders.append('Authorization', `Bearer_${sessionStorage.getItem("access_token")}`);
    return customHeaders;
}

function loadCoupons(parameters) {
    let url = `http://localhost:8080/certificates?page=${page}&size=5`;
    if (parameters !== undefined) {
        url += `&${parameters}`;
    }
    fetch(url, {
        method: 'GET',
        headers: loadHeader(),
    }).then(response => {
        if (response.ok) {
            response.json().then(coupons => {
                if (coupons !== undefined && Object.keys(coupons).length !== 0) {
                    partlyLoadedCoupons = coupons["_embedded"]["certificateRepresentationList"];
                    page++;
                    for (let i = 0; i < 5 && i < partlyLoadedCoupons.length; index++, i++) {
                        couponsPage.loadItem(partlyLoadedCoupons[i]);
                    }
                    spinnerPage.render();
                } else {
                    spinnerPage.handleClear();
                    page = 1;
                    index = 0;
                    localStorage.setItem(isLoading, false.toString());
                }
            });
        } else {
            document.getElementById("coupons_message").innerText = "You are not allowed to see the content.";
        }
    });
}
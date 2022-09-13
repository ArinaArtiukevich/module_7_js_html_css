function render() {
    navbarPage.render();

    categoriesPage.render();

    couponsPage.render();

    dropdownMenuPage.render();
}

spinnerPage.handleClear();

render();

changeHash();

findByTag();

findByItemNameAndDescription();

returnLastScrollPosition();

function findByTag() {
    window.addEventListener('DOMContentLoaded', function alertFunc() {
        setTimeout(() => {
                let searchBox = document.getElementById("dropdown");
                let dropdown = document.getElementById("dropdownList");

                searchBox.addEventListener("click", function () {
                    dropdown.classList.toggle("active");
                });
            }, 50
        )
    });
}

function findByItemNameAndDescription() {
    window.addEventListener('DOMContentLoaded', function alertFunc() {
        setTimeout(() => {
            const searchItemNameBar = document.getElementById('search_item_name_bar');
            searchItemNameBar.addEventListener('keyup', (e) => {
                const searchString = e.target.value;
                let selected = document.querySelector(".selected");
                if (selected.innerText.localeCompare(DEFAULT_VALUE_DROPDOWN) !== 0) {
                    couponsPage.render(`tag=${selected.innerText}&name=${searchString}`);
                } else {
                    couponsPage.render(`name=${searchString}`);
                }

            });

        }, 50)
    });
}

function returnLastScrollPosition() {

    window.addEventListener('scroll', debounce(changeScrollTopStyle, 200));

    window.addEventListener('unload', () => {
        localStorage.setItem(scrollTopUnload, document.documentElement.scrollTop.toString());
    });


    window.addEventListener('load', function alertFunc() {
            setTimeout(() => {
                if (localStorage.hasOwnProperty(scrollTop) && localStorage.hasOwnProperty(scrollTopUnload) && parseInt(localStorage.getItem(scrollTopUnload), 10) !== 0) {
                    localStorage.setItem(changeScrollPosition, true.toString());
                    document.documentElement.scrollTop = parseInt(localStorage.getItem(scrollTopUnload));
                } else {
                    document.documentElement.scrollTop = 0;
                }
            }, 100)
        }
    );

    window.addEventListener('click', function alertFunc() {
            setTimeout(() => {
                if (localStorage.hasOwnProperty(scrollTop)) {
                    window.scrollTo(0, parseInt(localStorage.getItem(scrollTop)));
                } else {
                    document.documentElement.scrollTop = 0;
                }
            }, 10)
        }
    );
}

function changeScrollTopStyle() {
    localStorage.setItem(scrollTop, document.documentElement.scrollTop.toString());

    if (localStorage.hasOwnProperty(changeScrollPosition) && localStorage.getItem(changeScrollPosition) === true.toString()) {

        if (localStorage.getItem(isLoading) === true.toString()) {
            document.documentElement.scrollTop = parseInt(localStorage.getItem(scrollTopUnload));
        }
        if (document.documentElement.scrollTop === parseInt(localStorage.getItem(scrollTopUnload))) {
            localStorage.setItem(changeScrollPosition, false.toString());
        }
    }

}

function changeHash() {
    window.addEventListener('hashchange', (e) => {
        let position = e.oldURL.lastIndexOf('#');
        navigate(e.oldURL.substring(position + 1));
    });

    window.addEventListener('load', (e) => {
        let position = window.location.href.lastIndexOf('#');
        if (position !== -1) {
            navigate(window.location.href.substring(position + 1));

        }
    });
}

function navigate(lastHash) {
    const hashLocation = window.location.hash.substring(1);
    if (hashLocation !== lastHash) {
        cleanPreviousPage(lastHash);
    } else {
        cleanMainPage();
    }
    if (hashLocation.length === 0) {
        ROOT_CATEGORY_MENU.style.display = "block";
        ROOT_FOOTER.style.display = "block";
        ROOT_COUPONS.style.display = "block";
        document.getElementById("coupons_list").style.display = "block";
        if (removedLoadOnScroll) {
            addLoadOnScroll();
        }
    } else {
        if (!removedLoadOnScroll) {
            removeLoadOnScroll();
        }
        switch (hashLocation) {
            case 'checkout':
                navbarPage.handleOpenCheckoutPage();
                ROOT_CHECKOUT.style.display = "block";
                break;
            case 'login':
                navbarPage.handleOpenLoginPage();
                ROOT_LOGIN.style.display = "block";
                break;
            case 'registration':
                navbarPage.handleOpenRegistrationPage();
                ROOT_REGISTRATION.style.display = "block";
                break;
            case 'item_details':
                ROOT_ITEM_DETAILS.style.display = "block";
                break;
            case 'new_item':
                ROOT_NEW_ITEM.style.display = "block";
                newItemPage.render();
                break;
            case 'new_tag':
                ROOT_NEW_TAG.style.display = "block";
                newItemTag.render();
                break;
            case 'user_info':
                ROOT_USER_INFO.style.display = "block";
                userInfoPage.render();
                break;
            default:
                errorPage.render();
        }
    }
}

function cleanPreviousPage(lastHash) {
    if (lastHash.length === 0) {
        cleanMainPage();
    } else {
        switch (lastHash) {
            case 'checkout':
                ROOT_CHECKOUT.style.display = "none";
                break;
            case 'login':
                ROOT_LOGIN.style.display = "none";
                break;
            case 'registration':
                ROOT_REGISTRATION.style.display = "none";
                break;
            case 'item_details':
                ROOT_ITEM_DETAILS.style.display = "none";
                break;
            case 'new_item':
                ROOT_NEW_ITEM.style.display = "none";
                break;
            case 'new_tag':
                ROOT_NEW_TAG.style.display = "none";
                break;
            case 'user_info':
                ROOT_USER_INFO.style.display = "none";
                break;
            default:
                errorPage.handleClear();
        }
    }
}

let removedLoadOnScroll = false;

function cleanMainPage() {
    ROOT_CATEGORY_MENU.style.display = "none";
    ROOT_FOOTER.style.display = "none";
    ROOT_COUPONS.style.display = "none";
    document.getElementById("coupons_list").style.display = "none";
}

function removeLoadOnScroll() {
    if (optimizedHandler !== undefined) {
        window.removeEventListener('scroll', optimizedHandler);
        removedLoadOnScroll = true;
    }
}

function addLoadOnScroll() {
    if (optimizedHandler !== undefined) {
        window.addEventListener('scroll', optimizedHandler);
        removedLoadOnScroll = false;
    }
}
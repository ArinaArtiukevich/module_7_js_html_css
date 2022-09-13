class Navbar {
    handleOpenLikedItemsPage() {
        likedItemsPage.render();
    }

    handleOpenUserInfo() {
        userInfoPage.render();
    }

    handleOpenCheckoutPage() {
        checkoutPage.render();
    }
    handleOpenLoginPage() {
        loginPage.render();
    }
    handleOpenRegistrationPage() {
        registrationPage.render();
    }
    render() {
        ROOT_NAVBAR.innerHTML = `<div class="container">
        <table>
            <th><a class="logo" href="#">Logo</a></th>
            <th>
                <div id="search_box" class="search_box">
                    <div class="search_field">
                        <input type="text" class="input" name="search_item_name_bar" id="search_item_name_bar" placeholder="Search by item name">
                    </div>
                
                </div>
            </th>
            <th>
                <div class="icons">
                    <ul class="inline_list">
                        <li>
                            <a href="#user_info" class><img id="account_circle" class="material-icons" src="../images/account_circle_black_24dp.svg" alt="Account"></a>
                        </li>
                        <li>
                            <a href="#" class><img id="favorite" class="material-icons" src="../images/favorite_black_24dp.svg" alt="Favorites" onclick="navbarPage.handleOpenLikedItemsPage();"></a>
                        </li>
                        <li>
                            <a href="#checkout"><img id="shopping_cart" class="material-icons" src="../images/shopping_cart_black_24dp.svg" alt="Shopping cart" onclick=""></a>
                        </li>
                    </ul>
                </div>
            </th>
            <th>
                <div class="authentication_links">
                    <ul class="inline_list">
                        <li><a class="authentication_link" href="#login">Login</a></li>
                        <li><a class="authentication_link" href="#registration">Sign Up</a></li>
                    </ul>
                </div>
            </th>
        </table>
    </div>`;
    }
}

const navbarPage = new Navbar();


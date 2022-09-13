class UserInfo {

    handleClear() {
        ROOT_USER_INFO.innerHTML = '';
    }

    setMessage(value) {
        document.getElementById("user_info_message").innerHTML = value;
    }

    render() {
        this.setUserInfoContainer();
        if (sessionStorage.getItem("id") !== null) {
            fetch(`http://localhost:8080/users/${sessionStorage.getItem("id")}`, {
                method: 'GET',
                headers: loadHeader(),
            }).then(response => {
                if (response.ok) {
                    response.json().then(user => {
                        if (user !== undefined) {
                            this.setUserDetailsRoot(user["login"], user["budget"], user["certificates"]);
                        }
                    });
                } else {
                    // todo EXCEPTION;
                }
            });
        } else {
            this.setMessage("Can not find user info, please sign in.");
        }
    }

    getItem(id, imagePath, name, description, price) {
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
                        </ul>
                    </div>
                </li>
        `;
    }

    setUserDetailsRoot(login, budget, certificates) {
        document.getElementById('user_fields_list').insertAdjacentHTML('beforeend', `<li id="user_login" class="user_field">Login: <span class="element_title user_detail_info">${login}</span></li>`);
        document.getElementById('user_fields_list').insertAdjacentHTML('beforeend', `<li id="user_budget" class="user_field">Budget: <span class="element_title user_detail_info">${budget}</span></li>`);

        if (sessionStorage.getItem("role") !== null && sessionStorage.getItem("role") === ROLE_ADMIN) {
            document.getElementById('user_fields_list').insertAdjacentHTML('beforeend', `<li id="user_actionns" class="user_field"><ul>Actions: <li><a href="#new_item" class="element_title user_detail_info">Add certificate</a></li> <li><a href="#new_tag" class="element_title user_detail_info">Add tag</a></li> </ul> </li>`);

        }

        if (certificates.length > 0) {
            document.getElementById('user_fields_list').insertAdjacentHTML('beforeend', `<li id="user_certificates" class="user_field user_certificates_border">Certificates: <ul class="elements elements_list user_elements_list" id="user_certificates_list"></ul></li>`);

            certificates.forEach(coupon => {
                if (coupon !== undefined && Object.keys(coupon).length !== 0) {
                    document.getElementById('user_certificates_list').insertAdjacentHTML('afterbegin', `${userInfoPage.getItem(coupon.id, coupon.imagePath, coupon.name, coupon.description, coupon.price)}`);
                }
            });
        }

    }

    setUserInfoContainer() {

        ROOT_USER_INFO.innerHTML = `
            <div class="container">
                <div class="head_container">
                    <div class="head_text"><p>My account</p></div>
                </div>
                <div id="user_info_message" class="info_element_message"></div>
                <div class="border">
                    <ul class="user_fields_list" id="user_fields_list">
                    </ul>
                </div>
            </div>
        `;
    }

}

const userInfoPage = new UserInfo();
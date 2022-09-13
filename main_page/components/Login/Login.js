class Login {

    handleClear() {
        ROOT_LOGIN.innerHTML = '';
    }

    clearFields() {
        document.getElementById("login_input").value = "";
        document.getElementById("password").value = "";
    }

    setMessage(value) {
        document.getElementById("login_message").innerHTML = value;
    }

    login(event) {
        event.preventDefault();
        const formData = new FormData(document.getElementById('login_form'));
        let user = JSON.stringify(Object.fromEntries(formData.entries()));

        let customHeaders = new Headers();
        customHeaders.append('Content-Type', 'application/json;charset=utf-8');

        fetch('http://localhost:8080/auth/signin', {
            body: user, method: 'POST',
            headers: customHeaders,
        }).then(response => {
            if (response.ok) {
                this.clearFields();
                this.setMessage("Authentication was completed.");
                response.json().then(json => {
                    if(json !== undefined) {
                        sessionStorage.setItem("access_token", json["token"]);
                        sessionStorage.setItem("id", json["userRepresentation"]["id"]);
                        sessionStorage.setItem("role", json["userRepresentation"]["role"]);
                    }
                });
            } else {
                this.clearFields();
                this.setMessage("Authentication was failed. Try again.");
            }
        }).catch(() => this.setMessage("Unexpected exception."));
    }

    render() {
        ROOT_LOGIN.innerHTML = `
                                <form id="login_form" onsubmit="loginPage.login(event);" method="post">
                                    <div class="container">
                                        <div class="rectangle">
                                            <div class="circle">
                                                <div class="logo_circle">Logo</div>
                                            </div>
                                            <div class="input_fields">
                                                <ul>
                                                    <li><input type="text" id="login_input" name="login" class="input_field" placeholder="Login" pattern="[A-Za-z0-9_]{1,15}"  required="required"></li>
                                                    <li><input type="password" id="password" name="password" class="input_field" placeholder="Password"></li>
                                                </ul>
                                            </div>
                                            <div id="login_message" class="login_message"></div>
                                            <div class="login_button">
<!--                                                <a href="#login" class="primary-cta">Login</a>-->
                                                <button type="submit" class="primary_cta">Login</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>        
                                `;

    }
}

const loginPage = new Login();
class Registration {
    handleClear() {
        ROOT_REGISTRATION.innerHTML = '';
    }

    checkPassword(input) {
        if (input.value !== document.getElementById('password').value) {
            input.setCustomValidity('Password Must be Matching.');
        } else {
            input.setCustomValidity('');
        }
    }

    setMessage(value) {
        document.getElementById("registration_message").innerHTML = value;
    }

    clearFields() {
        document.getElementById("login_input").value = "";
        document.getElementById("budget").value = "";
        document.getElementById("password").value = "";
        document.getElementById("repeat_password").value = "";
    }

    addNewUser(event) {
        event.preventDefault();
        const formData = new FormData(document.getElementById('register_form'))
        formData.delete("repeat_password");
        let user = JSON.stringify(Object.fromEntries(formData.entries()));

        let customHeaders = new Headers();
        customHeaders.append('Content-Type', 'application/json;charset=utf-8');

        fetch('http://localhost:8080/auth/signup', {
            body: user, method: 'POST',
            headers: customHeaders,
        }).then(response => {
            if (response.ok) {
                this.clearFields();
                this.setMessage("Registration was completed.");
                response.json().then(json => {
                    if(json !== undefined) {
                        sessionStorage.setItem("access_token", json["token"]);
                    }
                });
            } else {
                this.clearFields();
                this.setMessage("Registration was failed. Try again.");
            }
        }).catch(() => this.setMessage("Unexpected exception."));
    }

    render() {
        ROOT_REGISTRATION.innerHTML = `
            <form id="register_form" onsubmit="registrationPage.addNewUser(event);" method="post">
                <div class="container_registration">
                    <div class="rectangle_registration">
                        <div class="head_rectangle_registration">
                            <div class="head_text_registration">Register</div>
                        </div>
                        <div class="input_fields_registration">
                            <div class="left_column_registration">
                                <ul>
                                    <li>
                                        <label for="login_input">Login Name</label>
                                        <input type="text" id="login_input" name="login" class="input_field_long_registration" pattern="[A-Za-z0-9_]{1,15}" required="required">
                                    </li>
                                    
                                    <li> 
                                        <label for="budget">Budget</label>
                                        <input type="text" id="budget" name="budget" class="input_field_long_registration" pattern="[0-9]{1,10}" required="required">
                                    </li>
                                </ul>
                            </div>
                            <div class="right_column_registration">
                                <ul>
                                    <li> 
                                        <label for="password">Password</label>
                                        <input type="password" id="password" name="password" class="input_field_long_registration" required="required">
                                    </li>
                                    <li> 
                                        <label for="repeat_password">Repeat Password</label>
                                        <input type="password" id="repeat_password" name="repeat_password" class="input_field_long_registration" required="required" oninput="registrationPage.checkPassword(this);">
                                    </li>
                                </ul>
                            </div>
                            <div id="registration_message" class="registration_message"></div>
                        </div>
                        <div class="button_registration">
                            <ul>
                                <li> <a href="#" class="light_button_registration">Back</a></li> 
                                <li> <button type="submit" class="green_button_registration">Sign Up</button></li> 
<!--                                <li> <a href="#" class="light_button_registration">Cancel</a></li> -->
<!--                                <li> <a href="#" class="green_button_registration">Sign Up</a></li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }
}

const registrationPage = new Registration();
class NewItem {
    handleClear() {
        ROOT_NEW_ITEM.innerHTML = '';
    }

    clearFields() {
        document.getElementById("expire_in").value = "";
        document.getElementById("price").value = "";
        document.getElementById("coupon_name").value = "";
        document.getElementById("brief_description").value = "";
        document.getElementById("tag_name_input").value = "";
        document.getElementById("image").value = "";
        document.getElementById("output").style.display = "none";

        inputTags = [];
        this.addTagsToForm();
    }

    setMessage(value) {
        document.getElementById("new_item_message").innerHTML = value;
    }

    createFormData(formData, data) {
        for (let key in data) {
            if (Array.isArray(data[key])) {
                data[key].forEach((obj, index) => {
                    let keyList = Object.keys(obj);
                    keyList.forEach((keyItem) => {
                        let keyName = [key, "[", index, "]", ".", keyItem].join("");
                        formData.append(keyName, obj[keyItem]);
                    });
                });
            } else if (typeof data[key] === "object") {
                for (let innerKey in data[key]) {
                    formData.append(`${key}.${innerKey}`, data[key][innerKey]);
                }
            } else {
                formData.append(key, data[key]);
            }
        }
    }

    addNewItem(event, idCoupon) {
        event.preventDefault();
        let formData = new FormData(document.getElementById('new_item_form'));
        let tags = [];
        inputTags.forEach((tag) => {
            tags.push({name: tag});
        });
        formData.delete("tag_name");

        this.createFormData(formData, {tags: tags});
        let file = document.getElementById('image').files[0];
        if(file === undefined) {
            file = new File([""], "");
        }
        formData.append("file", file);

        let customHeaders = new Headers();
        customHeaders.append('Authorization', `Bearer_${sessionStorage.getItem("access_token")}`);
        if (idCoupon === undefined) {
            this.postData(customHeaders, formData);
        } else {
            this.updateData(customHeaders, formData, idCoupon);
        }
    }

    postData(customHeaders, formData) {
        fetch('http://localhost:8080/certificates', {
            headers: customHeaders,
            body: formData, method: 'POST',
        }).then(response => {
            if (response.ok) {
                this.clearFields();
                this.setMessage("New item was added.");

            } else {
                this.clearFields();
                this.setMessage("New item was not added. Try again.");
            }
        });
    }

    updateData(customHeaders, formData, idCoupon) {
        fetch(`http://localhost:8080/certificates/${idCoupon}`, {
            headers: customHeaders,
            body: formData, method: 'PATCH',
        }).then(response => {
            if (response.ok) {
                this.clearFields();
                this.setMessage("Item was updated.");

            } else {
                this.clearFields();
                this.setMessage("Item was not updated. Try again.");
            }
        });
    }

    loadFile() {
        let preview = document.getElementById('output');
        let file = document.getElementById('image').files[0];
        let reader = new FileReader();

        reader.onloadend = function () {
            preview.src = reader.result;
        }
        if (file) {
            preview.style.display = "block";
            reader.readAsDataURL(file);
        } else {
            preview.style.display = "none";
            preview.src = "";
        }
    };

    render(idCoupon) {
        inputTags = [];
        this.createNewItemPage(idCoupon);
        let tagNameInput = document.getElementById("tag_name_input");

        tagNameInput.addEventListener('keyup', function (e) {
            if (e.key === " ") {
                inputTags.push(tagNameInput.value.slice(0, -1));
                newItemPage.addTagsToForm();
                tagNameInput.value = '';
            }
        });

        document.addEventListener('click', function (e) {
            if (e.target.tagName === 'I') {
                const value = e.target.getAttribute('data-item');
                const index = inputTags.indexOf(value);
                inputTags = [...inputTags.slice(0, index), ...inputTags.slice(index + 1)];
                newItemPage.addTagsToForm();
            }
        });

        if (idCoupon !== undefined) {
            fetch(`http://localhost:8080/certificates/${idCoupon}`, {
                method: 'GET',
                headers: loadHeader(),
            }).then(response => {
                if (response.ok) {
                    response.json().then(item => {
                        if (item !== undefined) {
                            this.fillInputFields(item);
                        }
                    });
                } else {
                    // todo console.log("requiredItem");
                }
            });
        }
    }

    fillInputFields(item) {
        item["tags"].forEach(tag => {
            inputTags.push(tag["name"]);
        });
        newItemPage.addTagsToForm();

        document.getElementById('expire_in').value = item["duration"];
        document.getElementById('price').value = item["price"];
        document.getElementById('coupon_name').value = item["name"];
        document.getElementById('brief_description').value = item["description"];

        if (item["imagePath"] !== null) {
            document.getElementById('output').style.display = "block";
            document.getElementById('output').src = couponsPage.getImage(item["imagePath"]);
        }
    }

    createNewItemPage(idCoupon) {
        ROOT_NEW_ITEM.innerHTML =  `
            <form id="new_item_form" onsubmit="newItemPage.addNewItem(event, ${idCoupon});" method="post" enctype="multipart/form-data">
                <div class="container">
                    <div class="head_container">
                        <div class="head_text"><p>Add New Coupon</p></div>
                    </div>
                    <div id="new_item_message" class="new_item_message"></div>
                    <div class="border">
                   
                    
                        <div class="input_fields">
                            <div class="left_column">
                                <ul>
                                    <li><label for="tag_name">Tag name</label>
                                        <div class="input_field_long tag_container" id="tag_container">
                                            <input name="tag_name"  id="tag_name_input" />
                                        </div>
                                    </li>
                                    <li> 
                                      <label for="expire_in">Expires in</label>
                                      <input type="text" id="expire_in" name="duration" class="input_field_long" placeholder="Expires in" pattern="[0-9]{1,10}">
                                    </li>
                                    <li> 
                                        <label for="price">Price</label>
                                        <input type="text" id="price" name="price" class="input_field_long" pattern="[0-9]{1,10}">
                                    </li>
                                   
                                </ul>
                            </div>
                            <div class="right_column">
                                <ul>
                                    <li>
                                        <label for="coupon_name">Item Name</label>
                                        <input type="text" id="coupon_name" name="name" class="input_field_long" required="required">
                                    </li>
                                    <li> 
                                        <label for="brief_description">Description</label>
                                        <input type="text" id="brief_description" name="description" class="input_field_long" required="required">
                                    </li>
                                    <li id="item_image"> 
                                        <label for="image">Upload Image</label>
                                        <input type="file"  accept="image/*" name="image" id="image" class="input_field_long" onchange="newItemPage.loadFile()">
                                        <img id="output" width="200"  alt="Image" style="display: none"/>

                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="button">
                            <ul>
                                <li> <button class="light_button">Back</button></li> 
                                <li> <button type="submit" class="green_button">Save</button></li> 
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        `;

    }

    addTagsToForm() {
        newItemPage.resetTags();
        let tagContainer = document.getElementById("tag_container");
        inputTags.slice().reverse().forEach(function (tag) {
            tagContainer.prepend(newItemPage.createTag(tag));
        })
    }

    resetTags() {
        document.querySelectorAll('.tag').forEach(function (tag) {
            tag.parentElement.removeChild(tag);
        });
    }


    createTag(label) {
        const div = document.createElement('div');
        div.setAttribute('class', 'tag')
        const span = document.createElement('span');
        span.innerHTML = label;
        const closeBtn = document.createElement('i');
        closeBtn.setAttribute('class', 'material-icons');
        closeBtn.setAttribute('data-item', label);
        closeBtn.innerHTML = 'close';

        div.appendChild(span);
        div.appendChild(closeBtn);
        return div;
    }

}

const newItemPage = new NewItem();
let inputTags = [];

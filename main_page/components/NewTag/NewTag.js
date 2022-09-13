class NewTag {
    handleClear() {
        ROOT_NEW_TAG.innerHTML = '';
    }

    clearFields() {
        document.getElementById("new_tag_input_name").value = "";
        document.getElementById("tag_image").value = "";
        document.getElementById("tag_output").style.display = "none";
    }

    setMessage(value) {
        document.getElementById("new_tag_message").innerHTML = value;
    }


    addNewItem(event) {
        event.preventDefault();
        let formData = new FormData(document.getElementById('new_tag_form'));
        let file = document.getElementById('tag_image').files[0];
        if (file === undefined) {
            file = new File([""], "");
        }
        formData.append("file", file);


        let customHeaders = new Headers();
        customHeaders.append('Authorization', `Bearer_${sessionStorage.getItem("access_token")}`);
        this.postData(customHeaders, formData);

    }

    postData(customHeaders, formData) {
        fetch('http://localhost:8080/tags', {
            headers: customHeaders,
            body: formData, method: 'POST',
        }).then(response => {
            if (response.ok) {
                this.clearFields();
                this.setMessage("New tag was added.");

            } else {
                this.clearFields();
                this.setMessage("New tag was not added. Try again.");
            }
        });
    }

    loadFile() {
        let preview = document.getElementById('tag_output');
        let file = document.getElementById('tag_image').files[0];
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

    render() {
        ROOT_NEW_TAG.innerHTML = `
            <form id="new_tag_form" onsubmit="newItemTag.addNewItem(event);" method="post" enctype="multipart/form-data">
                <div class="container">
                    <div class="head_container">
                        <div class="head_text"><p>Add New Tag</p></div>
                    </div>
                    <div id="new_tag_message" class="new_item_message"></div>
                    <div class="border">
                        <div class="input_fields">
                            <div class="left_column">
                                <li> 
                                  <label for="new_tag_input_name">Tag name</label>
                                  <input type="text" name="name" id="new_tag_input_name" class="input_field_long" placeholder="Tag name" required="required">
                                </li>
                            </div>
                            <div class="right_column">
                                <li id="item_image"> 
                                    <label for="tag_image">Upload Image</label>
                                    <input type="file"  accept="image/*" name="image" id="tag_image" class="input_field_long" onchange="newItemTag.loadFile()">
                                    <img id="tag_output" width="200"  alt="Image" style="display: none"/>
                                </li>
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

}

const newItemTag = new NewTag();

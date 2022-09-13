class Error {
    handleClear() {
        ROOT_ERROR.innerHTML = ``;
    }
    render() {
        ROOT_ERROR.innerHTML = `
            <div class="error_container">
                <div class="error_message">
                    <h3>No access.</h3>
                    <p>Try again later.</p>
                </div>
            </div>
        `;
    }
}

const errorPage = new Error();
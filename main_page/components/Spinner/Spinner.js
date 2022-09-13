class Spinner {

    handleClear() {
        ROOT_SPINNER.innerHTML = '';
        footerPage.render();
    }

    render() {
        ROOT_SPINNER.innerHTML = `
            <div class="spinner_container">
                <img class="spinner_img" src="../images/spinner/Spinner-1.6s-201px.svg">
            </div>
        `;
        footerPage.setSmallFooter()
    }
}

const spinnerPage = new Spinner;

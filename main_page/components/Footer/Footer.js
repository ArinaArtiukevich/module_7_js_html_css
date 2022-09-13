class Footer {

    handleClear() {
        ROOT_FOOTER.innerHTML = '';
    }

    setSmallFooter() {
        if (sessionStorage.getItem("access_token").length > 0) {
            ROOT_FOOTER.innerHTML = `
            <div class="footer_small"> </div>
        `;
        }
    }

    render() {
        if (sessionStorage.hasOwnProperty("access_token") && sessionStorage.getItem("access_token").length > 0) {
            ROOT_FOOTER.innerHTML = `
            <div class="footer"> </div>
        `;
        }
    }

}

const footerPage = new Footer();


class LocalStorageUtil {
    constructor() {
        this.keyName = 'coupons';
        this.keyLikedName = 'likedCoupons';
    };

    getCoupons() {
        const couponsLocalStorage = localStorage.getItem(this.keyName);
        if (couponsLocalStorage !== null) {
            return JSON.parse(couponsLocalStorage);
        }
        return [];
    };

    putCoupons(idCoupon) {
        let coupons = this.getCoupons();
        let pushCoupon = false;
        const index = coupons.indexOf(idCoupon);

        if (index === -1) {
            coupons.push(idCoupon);
            pushCoupon = true;
        } else {
            coupons.splice(index, 1);
        }
        localStorage.setItem(this.keyName, JSON.stringify(coupons));
        return {
            pushCoupon,
            coupons
        };
    };

    deleteCoupon(idCoupon) {
        let coupons = this.getCoupons();
        const index = coupons.indexOf(parseInt(idCoupon,10));
        if (index !== -1) {
            coupons.splice(index, 1);
        }
        localStorage.setItem(this.keyName, JSON.stringify(coupons));
    };

    getLikedCoupons() {
        const couponsLikedLocalStorage = localStorage.getItem(this.keyLikedName);
        if (couponsLikedLocalStorage !== null) {
            return JSON.parse(couponsLikedLocalStorage);
        }
        return [];
    };

    putLikedCoupons(idCoupon) {
        let likedCoupons = this.getLikedCoupons();
        let pushLikedCoupon = false;
        const index = likedCoupons.indexOf(idCoupon);

        if (index === -1) {
            likedCoupons.push(idCoupon);
            pushLikedCoupon = true;
        } else {
            likedCoupons.splice(index, 1);
        }
        localStorage.setItem(this.keyLikedName, JSON.stringify(likedCoupons));
        return {
            pushLikedCoupon,
            likedCoupons
        };
    };


}

const localStorageUtil = new LocalStorageUtil();
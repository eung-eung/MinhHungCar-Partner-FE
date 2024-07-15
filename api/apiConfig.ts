export const endpoint = 'https://minhhungcar.xyz';
export const apiAccount = {
    //method: get
    getProfile: `${endpoint}/profile`,

    //method: post
    registerPartner: `${endpoint}/partner/register`,
    verifyOTP: `${endpoint}/user/otp`,
    login: `${endpoint}/login`,
    uploadProfileAvatar: `${endpoint}/user/avatar/upload`,

    //method: put
    updateProfile: `${endpoint}/profile`
};

export const apiCar = {
    // method: get
    getCarMetadata: `${endpoint}/register_car_metadata`,
    getAllCar: `${endpoint}/partner/cars?offset=0&limit=10`,
    getPendingApproval: `${endpoint}/partner/cars?offset=0&limit=10&car_status=pending_approval`,
    getApproved: `${endpoint}/partner/cars?offset=0&limit=10&car_status=approved`,
    getRejected: `${endpoint}/partner/cars?offset=0&limit=10&car_status=rejected`,
    getActive: `${endpoint}/partner/cars?offset=0&limit=10&car_status=active`,
    getWaitingCarDelivery: `${endpoint}/partner/cars?offset=0&limit=10&car_status=waiting_car_delivery`,

    // method: post
    registerCar: `${endpoint}/partner/car`,
    uploadCarDoc: `${endpoint}/partner/car/document`,

    // method: put
    updatePrice: `${endpoint}/partner/car/price`,
}

export const apiPayment = {
    //method: get
    getPaymentInfo: `${endpoint}/payment_info`,
    getBankData: `${endpoint}/banks`,

    //method: post
    uploadQR: `${endpoint}/payment_info/qr`,

    //method: put
    updatePaymentInfo: `${endpoint}/payment_info`,
}

export const apiExpoToken = {
    expoPushToken: `${endpoint}/partner/expo_push_token`,
}

export const apiAvenue = {
    getAvenue: `${endpoint}/partner/revenue`,
}
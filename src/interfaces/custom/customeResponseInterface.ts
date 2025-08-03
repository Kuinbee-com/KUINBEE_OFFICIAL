interface IUnifiedResponse {
    success: boolean;
    message?: string;
    error?: string;
    data?: string | object | object[] | void;
    metadata?: object;
    shouldRedirect?: boolean;

};


export { IUnifiedResponse };
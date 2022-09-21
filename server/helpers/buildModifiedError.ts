
/** Return an object from error properties */

export function buildModifiedError(
    resHeaders: object,
    configHeaders: object,
    url: string,
    method: string,
    data: string,
    status: number,
    message: string
) {
    const modifiedErrorData = {
        resHeaders,
        configHeaders,
        url,
        method,
        data,
        status,
        message
    };

    return modifiedErrorData;
}
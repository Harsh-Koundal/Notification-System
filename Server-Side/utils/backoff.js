export const getBackoffTime = (retryCount) =>{

    const baseDelay = 2000;
    return baseDelay * Math.pow(3, retryCount);

};
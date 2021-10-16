const handelErrors = (error) => {
    if(error.message.includes('duplicate')){
        const message = error.message;
        const idx = message.indexOf('{');
        msg = message.slice(idx + 1 , -1);
        error.message = "Duplicate" + msg;
    }

    return error;
}

module.exports = handelErrors;
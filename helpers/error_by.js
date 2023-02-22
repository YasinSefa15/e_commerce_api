class MyError extends Error {
    constructor() {
        super();
        this.stack = ""
    }

}

module.exports = {
    MyError
}
export function checkUsername(username) {
    return username.length < 3 || username.length > 32
}
export function checkName(name) {
    return name.length < 2 || name.length > 32
}
export function checkQuestion(question) {
    return question.length < 6 || question.length > 350
}
export function checkPassword(password) {
    return password.length < 8 || password.length > 32
}
export function checkEmail(email) {
    return (
        email.length < 6 ||
        email.length > 64 ||
        !email.includes("@") ||
        !email.includes(".") ||
        email.indexOf("@") === 0 ||
        email.lastIndexOf(".") < email.indexOf("@") // There must be "." after "@" sign
    )
}
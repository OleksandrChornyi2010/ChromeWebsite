export function checkUsername(username) {
    // Username: 3-32 characters
    return username.length < 3 || username.length > 32
}
export function checkName(name) {
    // Name: 2-32 characters
    return name.length < 2 || name.length > 32
}
export function checkQuestion(question) {
    // Question: 6-350 characters
    return question.length < 6 || question.length > 350
}
export function checkPassword(password) {
    // Password: 8-32 characters
    return password.length < 8 || password.length > 32
}
export function checkEmail(email) {
    // Email: 6-64 characters
    return (
        email.length < 6 ||
        email.length > 64 ||
        !email.includes("@") ||
        !email.includes(".") ||
        email.indexOf("@") === 0 ||
        email.lastIndexOf(".") < email.indexOf("@") // There must be "." after "@" sign
    )
}
// Get environment variables and enforces they aren't missing
export default (key: string): string => {
    const param = process.env[key]
    if (!param || param === '' || param === '0') {
        throw new Error(
            `${key} is missing from your env file or is invalid.`,
        )
    }
    return param
}
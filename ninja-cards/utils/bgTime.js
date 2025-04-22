export function getTime() {
    // Get the current date and time in UTC
    const now = new Date();

    // Calculate the offset in milliseconds for UTC+3
    const offset = 3 * 60 * 60 * 1000;

    // Create a new date object with the adjusted time
    return new Date(now.getTime() + offset);
}
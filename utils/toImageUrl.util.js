module.exports = (string) => {
    // Convert the string to lowercase
    string = string.toLowerCase();

    // Remove unwanted characters using a regular expression
    string = string.replace(/[^a-z0-9 ]/g, '');

    // Replace spaces with hyphens
    string = string.replace(/\s+/g, '-');

    return string;
};

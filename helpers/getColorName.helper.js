const colorNames = require('color-name-list');

const getColorName = (hexColor) => {
    let closestColor;
    let smallestDiff = Number.POSITIVE_INFINITY;

    colorNames.forEach((color) => {
        const diff = colorDifference(hexColor, color.hex);
        if (diff < smallestDiff) {
            smallestDiff = diff;
            closestColor = color.name;
        }
    });

    return closestColor;
};

const colorDifference = (hex1, hex2) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2)
    );
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
};

module.exports = getColorName;

// const hexColor = '#FF5733';
// console.log(getColorName(hexColor));

export const hexToRgb = (hex: string): string | null => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return (
            '{"r": ' +
            parseInt(result[1], 16) +
            ',"g": ' +
            parseInt(result[2], 16) +
            ',"b": ' +
            parseInt(result[3], 16) +
            '}'
        );
    }
    return null;
};

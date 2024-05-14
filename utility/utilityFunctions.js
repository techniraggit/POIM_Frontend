export const roundToTwoDigits = (number) => {
    return +(Math.round(parseFloat(number) + "e+2")  + "e-2");
}
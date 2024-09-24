export class Pattern {
    public static email = { pattern: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,3}$/, message: 'Enter a valid email address to proceed.' };
    public static mobile = { pattern: /^(?=.{10,10}$)[0-9]\d*$/, message: 'Please enter a valid phone number.' };
    public static alphaWithSpace = { pattern: /^[a-z\s]+$/i, message: 'Alphabets & space are allowed.' };
    public static alphaWithSpaceDot = { pattern: /^([\s.]?[a-zA-Z]+)+$/, message: 'Alphabets, space & dots are allowed.' };
    public static alphaNumeric = { pattern: /^[a-z\d]+$/i, message: 'Only Alphabets & Numerics are allowed.' };
    public static onlyAlpha = { pattern: /^[a-z]+$/, message: 'Only Alphabets are allowed.' };
    public static onlyNumeric = { pattern: /^[\d]+$/i, message: 'Only Numbers are allowed.' };
}

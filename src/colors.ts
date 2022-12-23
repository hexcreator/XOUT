const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";
const Reset = "\x1b[0m";
const Colors = [FgRed, FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan];

function red(input: any)
{
    return `${FgRed}${input}${Reset}`;
}

function green(input: any)
{
    return `${FgGreen}${input}${Reset}`;
}

function yellow(input: any)
{
    return `${FgYellow}${input}${Reset}`;
}

function blue(input: any)
{
    return `${FgBlue}${input}${Reset}`;
}

function magenta(input: any)
{
    return `${FgMagenta}${input}${Reset}`;
}

function cyan(input: any)
{
    return `${FgCyan}${input}${Reset}`;
}

function random(input: any)
{
    return `${random_color()}${input}${Reset}`;
}

function colored(input: any, color: string)
{
    return `${color}${input}${Reset}`;
}

function random_color(excludes: string[] = [])
{
    let copy = [];

    for (var color of Colors)
    {
        if (excludes.includes(color)) continue; // Don't add excluded colors to this array
        copy.push(color);
    }

    let n = Math.floor(Math.random() * (copy.length-1)) + 0;
    let c = copy[n];
    return c;
}

export default 
{
    FgBlack,
    FgRed,
    FgGreen,
    FgYellow,
    FgBlue,
    FgMagenta,
    FgCyan,
    Reset,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    random,
    random_color,
    colored,
    Colors
}
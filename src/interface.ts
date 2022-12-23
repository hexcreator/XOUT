
import logger from "./log";
import colors from "./colors";
import * as fs from 'fs';

//////////////////////////////////////////////////////////////////////////////
// Inits
//////////////////////////////////////////////////////////////////////////////

fs.unlink('out/logs/logs.txt', err => {});

//////////////////////////////////////////////////////////////////////////////
// Funcs
//////////////////////////////////////////////////////////////////////////////

/**
 * Log function, used as a named export. Imported from the log file.
 * @param input The string input.
 * @param status The numeric status of this log. Optional. -1 is an error, 0 is an in progress marker, 1 is success. See the logger docs for more info on the accepted values.
 * @param tabbed Whether this is a tabbed log. Tabbed logs print a tab as the prefix instead of the prefix info.
 * @param headless Whether this log will include the timestamp/caller prefix header info.
 * @returns Nothing.
 */
export let log = (input: any, status: any = null, tabbed: boolean = false, headless: boolean = false) => logger(input, status, tabbed, headless);

/**
 * Converts an input to JSON.
 * @param input Anything.
 * @returns JSON stringified input.
 */
export let toJSON = (input: any) => { return JSON.stringify(input, null, 2); };

/**
 * Object to string. Logs a specially formatted string that displays every key and value of an object in an aesthetic format.
 * @param title The title of the object.
 * @param obj The input object.
 * @param excludes A string array of property names that will be excluded from the output.
 * @param status The numeric status of this log. Optional. -1 is an error, 0 is an in progress marker, 1 is success. See the logger docs for more info on the accepted values.
 * @param tabbed Whether this is a tabbed log. Tabbed logs print a tab as the prefix instead of the prefix info.
 * @param headless Whether this log will include the timestamp/caller prefix header info.
 */
export let olog = (title: string, obj: any, excludes: string[] = [], status: any = null, tabbed: boolean = false, headless: boolean = false) => 
{
    if (obj == null) return;
    let str = `${colors.random(title)}\n\t`;
    let color = (status == -1) ? colors.red : colors.green;
    str += keyvals(obj, color, excludes, 1);        
    logger(str, status, tabbed, headless);
    return str;
}

let keyvals = (obj: object, color: any, excludes: string[] = [], tabs: number = 2) => 
{

    let str = ``;
    let tabsstr = ``;

    for (let i = 0; i < tabs; i++) tabsstr += `\t`;

    for (const key of Object.keys(obj)) 
    {
        if (!excludes.includes(key)) 
        {
            let val = obj[key];
            let output = (typeof val == 'object') ? keyvals(val, color, excludes, tabs + 1) : color(val); // JSON.parse(JSON.stringify(val))
            str += `\n${tabsstr}${key}: ${output}`;
        }
    }
    return str;

}

//////////////////////////////////////////////////////////////////////////////
// Enums
//////////////////////////////////////////////////////////////////////////////

export enum Channels 
{
    RED,
    GREEN,
    BLUE,
    ALPHA
}

//////////////////////////////////////////////////////////////////////////////
// Exports
//////////////////////////////////////////////////////////////////////////////

export default 
{

    red: colors.red,
    blue: colors.blue,
    green: colors.green,
    ran: colors.random,

}
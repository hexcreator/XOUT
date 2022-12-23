
import logger from "./log";
import colors from "./colors";
import ologger from "./olog";
import * as fs from 'fs';

//////////////////////////////////////////////////////////////////////////////
// Inits
//////////////////////////////////////////////////////////////////////////////

fs.unlink('out/logs/logs.txt', err => {});

//////////////////////////////////////////////////////////////////////////////
// Types
//////////////////////////////////////////////////////////////////////////////

enum STATUS 
{
    WARN = -2,
    ERROR = -1,
    BAKING = 0,
    DONE = 1,
    DEBUG = 2
}

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
export let log = (input: any, status: STATUS = null, tabbed: boolean = false, headless: boolean = false) => logger(input, status, tabbed, headless);

/**
 * Converts an input to JSON.
 * @param input Anything.
 * @returns JSON stringified input.
 */
export let toJSON = (input: any) => { return JSON.stringify(input, null, 2); };

/**
 * Object to string. Logs a specially formatted string that displays every key and value of an object in an aesthetic format.
 * @param title The title of the log statement.
 * @param obj The input object.
 * @param excludes A string array of property names that will be excluded from the output.
 * @param status The numeric status of this log. Optional. -1 is an error, 0 is an in progress marker, 1 is success. See the logger docs for more info on the accepted values.
 * @param tabbed Whether this is a tabbed log. Tabbed logs print a tab as the prefix instead of the prefix info.
 * @param headless Whether this log will include the timestamp/caller prefix header info.
 */
export let olog = (title: string, obj: any, excludes: string[] = [], status: STATUS = null, tabbed: boolean = false, headless: boolean = false) => 
{
    if (obj == null) return;
    let str = `${colors.random(title)}\n\t`;
    let color = (status == -1) ? colors.red : colors.green;
    str += ologger(obj, color, excludes, 1);        
    logger(str, status, tabbed, headless);
    return str;
}

/**
 * Logs a specially formatted string that displays every key and value type of an object in an aesthetic format.
 * @param title The title of the log statement.
 * @param input The input object.
 * @param status The numeric status of this log. Optional. -1 is an error, 0 is an in progress marker, 1 is success. See the logger docs for more info on the accepted values.
 * @param tabbed Whether this is a tabbed log. Tabbed logs print a tab as the prefix instead of the prefix info.
 * @param headless Whether this log will include the timestamp/caller prefix header info.
 */
export let types = (title: string, input: object, status: STATUS = null, tabbed: boolean = false, headless: boolean = false) => 
{

    let s = `\n` + colors.random(title);
    for (var key of Object.keys(input)) s += `\n\t${key}: ${colors.blue(typeof input[key])}`;
    logger(s, status, tabbed, headless);

}

/**
 * In-function progress debug line. Always tabbed.
 * @param input Any input.
 * @param status Status number.
 */
export let inf = (input: any, status: STATUS = 0) =>
{
    let color_function = null;
    if (status == 1) color_function = colors.green;
    else if (status == -1) color_function = colors.red;
    let inp = (color_function == null) ? input : color_function(input);
    log(inp, null, true);
}

//////////////////////////////////////////////////////////////////////////////
// Demo
//////////////////////////////////////////////////////////////////////////////

export let demo = () =>
{

    //////////////////////////////////////////////////////////////////////////////
    // log
    log('Default log.');
    log('Warn log.', STATUS.WARN);
    log('Error log.', STATUS.ERROR);
    log('Debug log.', STATUS.DEBUG);
    log('Baking log.', STATUS.BAKING);
    log('Done log.', STATUS.DONE);
    log('Tabbed log.', null, true);
    log('Headless log.', null, false, true);

    //////////////////////////////////////////////////////////////////////////////
    // olog
    let sampl = { name: 'hexcreator', thoughts_on_reader: 'they rock', nested: { child_name: 'none', child_gender: 'none' }  };
    olog('OLOG', sampl);

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
    colors

}
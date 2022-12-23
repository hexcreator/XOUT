// @ts-nocheck

import colors from './colors';
import * as fs from 'fs';

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

const isProd = process.env.NODE_ENV === 'production';

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

let config = 
{
    set: false,
    include_parent: false, // experimental+unstable if true
    file_color: null,
    func_color: null,
    line_color: null,
    output_file_settings: 
    {
        reg: { on: true, path: 'out/logs/logs.txt', stream: null },
        error: { on: true, path: 'out/logs/errors.txt', stream: null },
        debug: { on: true, path: 'out/logs/debug.txt', stream: null },
    },
    formatter: null
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Convenient log.
 * @param input Anything.
 * @param status Status marker. -1 = error, 1 = success, 0 = baking. See status docs for more. Optional. 
 * @param tabbed Tabbed mode. Tab mode prints the line in an indented fashion with no prefixes. Defaults to false.
 * @param headless Print without functions.
 */
export default function log(input: any, status: number = null, tabbed: boolean = false, headless: boolean = false)
{

    if (!config.set) init_config();
    if (tabbed) return tabbedlog(input);

    let caller = stack();
    let time = new Date();
    let time_s = `[${colors.cyan(config.formatter.format(time))}] `;
    let caller_file = colors.colored(caller.file, config.file_color);
    let caller_func = colors.colored(`${caller.function}()`, config.func_color);

    let double_semi = colors.blue('::');
    let semi = colors.blue(':');
    let line = colors.colored(`L_${caller.line}`, config.line_color);

    let status_s = interpret_status(status);
    let caller_s = `[${caller_file}${double_semi}${caller_func}${semi}${line}] `;
    caller_s += status_s;
    let grandcaller_s = `[${colors.green(caller.pfile)}${colors.blue('::')}${colors.magenta(`${caller.pfunction}()${colors.blue(':')}${colors.green(`L_${caller.pline}`)}`)}] `;
    if (caller.pfile?.includes('void')) grandcaller_s = `[${colors.red('void')}] `;
    let header = (headless) ? '' : (config.include_parent) ? `${time_s}${grandcaller_s}${caller_s}\n` : `${time_s}${caller_s}\n`;
    let final_s = (config.include_parent) ? `${header}${input}\n` : `${header}${input}\n`;
    
    let decolored = input.replace( /\u001b[^m]*?m/g, '');
    let stream_string = `[${config.formatter.format(time)}] [${caller.file}::${caller.function}():L_${caller.line}]\n${decolored}\n\n`;
    if (config.include_parent) stream_string = `↓ [${config.formatter.format(time)}] [${caller.pfile}::${caller.pfunction}():L_${caller.pline}] [${caller.file}::${caller.function}():L_${caller.line}]\n${decolored}\n\n`;

    if (!isProd) 
    {
        console.log(final_s);
        append(stream_string, status);
    } else 
    {
        let ds = `${input}\n`;
        console.log(ds)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function append(ins: string, status: number = 0)
{
    if (status == -1) config.output_file_settings.error.stream.write(ins);
    else if (status == 2) config.output_file_settings.debug.stream.write(ins);
    else config.output_file_settings.reg.stream.write(ins);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function init_config()
{
    config.set = true;
    config.file_color = colors.random_color([colors.FgCyan, colors.FgBlue]);
    config.func_color = colors.random_color([colors.FgCyan, colors.FgBlue, config.file_color]);
    config.line_color = colors.random_color([colors.FgCyan, colors.FgBlue, config.file_color, config.func_color]);
    config.formatter = new Intl.DateTimeFormat("en-US" , { timeStyle: "medium", dateStyle: "short"})
    if (!isProd) config.output_file_settings.reg.stream = fs.createWriteStream(config.output_file_settings.reg.path, {flags:'a'});
    if (!isProd) config.output_file_settings.error.stream = fs.createWriteStream(config.output_file_settings.error.path, {flags:'a'});
    if (!isProd) config.output_file_settings.debug.stream = fs.createWriteStream(config.output_file_settings.debug.path, {flags:'a'});
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function tabbedlog(input: any)
{

    let decolored = input.replace( /\u001b[^m]*?m/g, '');
    let tabbed_str = `    ${decolored}`;
    let tabbed_str_colorized = `    ${input}`;
    if (!isProd) 
    {
        // Dev
        console.log(tabbed_str_colorized);
        append(tabbed_str);
    } 
    else console.log(tabbed_str_colorized);
    return;

}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function stack()
{
    Error.stackTraceLimit = (config.include_parent) ? 18 : 5;
    let stack = new Error().stack;
    let frames = stack.split(/\r?\n/).filter(frame => frame);
    // console.log(frames);

    /**
     * Sample frames:
     * 
     * 'Error',
        '    at stack (inventions\\microservices\\mempool_detector\\build\\utils\\debug\\log.js:23:17)',
        '    at log (inventions\\microservices\\mempool_detector\\build\\utils\\debug\\log.js:14:5)',
        '    at log_to_console (inventions\\microservices\\mempool_detector\\build\\globals.js:37:23)',
        '    at Object.BlocksListener [as Blocks] (inventions\\microservices\\mempool_detector\\build\\hooks.js:44:5)'

      Frame 4 has the caller data we need.
     */
    let frame = frames[4];
    let caller = framestr(frame);
    let ret = { function: caller.function, file: caller.file, line: caller.line, pfunction: null, pfile: null, pline: null };
    if (!config.include_parent) return ret;

    // Get the parent of the caller
    let parent_frame = get_parent_frame(frames);
    let caller_parent = framestr(parent_frame);
    return { function: caller.function, file: caller.file, line: caller.line, pfunction: caller_parent.function, pfile: caller_parent.file, pline: caller_parent.line };

}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function get_parent_frame(frames: any[])
{

    let voidf = '    at unknown (C:\\Users\\void.js:1:1)';

    for (var i = 5; i < frames.length; i++)
    {
        let frame = frames[i];
        if (frame.includes('processTicksAndRejections')) continue;
        if (frame.includes('Object.onceWrapper') || frame.includes('listOnTimeout') || frame.includes('WebSocketServer.emit')) return voidf;
        return frame;
    }
    return voidf;

}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function framestr(frame: string)
{

    /**
     * All calls to log() come from the globals export log_to_console. Explanation of the stack:
     *    1. The current function stack() frame
     *    2. The caller function log() frame
     *    3. The export function log_to_console() frame
     *    4. The target caller function that called log_to_console() through an import's frame
     */
    let tokens = frame.trim().split(' ');
    let caller_function = (tokens[1].includes('Object')) ? tokens[1].split('.')[1] : tokens[1];
    if (caller_function.includes('\\')) caller_function = 'anon';
        

    // Getting the caller file requires us to parse through the URI
    let chunks = tokens[tokens.length - 1].split('\\');
    let last_chunk = chunks[chunks.length - 1];
    let caller_file = last_chunk.split('.')[0];
    let caller_line = last_chunk.split(':')[1];

    return { function: caller_function, file: caller_file, line: caller_line };

}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function interpret_status(n: number)
{

    switch (n)
    {
        case -2:
            return `[${colors.yellow('warn')}] `;
        case -1:
            return `[${colors.red('error')}] `;
        case 0:
            return `[${colors.yellow('baking')}] `;
        case 1:
            return `[${colors.green('success')}] `;
        case 2:
            return `[${colors.random('debug')}] `;
        default:
            return '';
    }

}
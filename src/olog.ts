/**
 * Dumps all keys and values of an object recursively with auto intended tabs.
 * @param obj The input object.
 * @param color Color function that will be applied to the output.
 * @param excludes List of key names to exclude.
 * @param tabs Number of tabs to prefix the output.
 * @returns An output string.
 */
export default function DumpObject(obj: object, color: any, excludes: string[] = [], tabs: number = 1) 
{

    let str = ``;
    let tabsstr = ``;

    for (let i = 0; i < tabs; i++) tabsstr += `\t`;

    for (const key of Object.keys(obj)) 
    {
        if (!excludes.includes(key)) 
        {
            let val = obj[key];
            let output = (typeof val == 'object') ? DumpObject(val, color, excludes, tabs + 1) : color(val);
            str += `\n${tabsstr}${key}: ${output}`;
        }
    }
    return str;

}
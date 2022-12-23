![Crreator](https://img.shields.io/static/v1?label=Creator&message=hex&color=black&logo=ethereum&labelColor=black&logoWidth=40&logoColor=white) ![Node](https://img.shields.io/static/v1?label=Node&message=v17.6.0&color=black&logo=nodedotjs&labelColor=black&logoWidth=40&logoColor=white) ![Version](https://img.shields.io/static/v1?label=Version&message=v1.0.0&color=black&labelColor=black&logoWidth=40&logo=vuedotjs&logoColor=white)
# XOUT
`XOUT` is a basic, early-version logger that includes caller context information to help lightweight debug TypeScript programs. Currently, it can:
* Print time locale
* Use coloring
* Identify file, function, and line of the caller
* Set log status types (default, warn, error, debug, success, and baking)
* Log specific statuses to files for further review
It also includes some other utilities.
## Installation

To install, run:
```bash
npm i xout
```

## Import
```typescript
import { log, olog, toJSON, inf, demo } from 'xout';
```
## Usage

### Log
This is the default function.
```typescript
log('Default log.');
log('Warn log.', STATUS.WARN);
log('Error log.', STATUS.ERROR);
log('Debug log.', STATUS.DEBUG);
log('Baking log.', STATUS.BAKING);
log('Done log.', STATUS.DONE);
log('Tabbed log.', null, true);
log('Headless log.', null, false, true);
```
![Log](https://i.imgur.com/qLMviqU.pngg)

---

### Olog

Stands for "Object Logger", which recursively prints every key and their respective associated value for an inputted object.
```typescript
let sampl = { name: 'hexcreator', thoughts_on_reader: 'they rock', nested: { child_name: 'none', child_gender: 'none' }  };
olog('OLOG', sampl);
```
![Olog](https://i.imgur.com/KPO5fGS.png)

---

### Others

The other available functions are:
1. `toJSON`: converts an input to a JSON string.
2. `types`: dumps all property types in non-recursive manner for an object.
3. `inf`: prints an in-function progress line which is always tabbed.

---

## Future Work
The config system could be better and more refined, as well as just a lot more tools that can be added. `log` can also be cleaned up a bit.

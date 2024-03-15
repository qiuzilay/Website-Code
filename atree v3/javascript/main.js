'use strict';

/** @type {['zh-TW', 'en']} */
const languages = ['zh-TW', 'en'];
let using = 0;

/**
 * @typedef {('en' | 'zh-TW')}              Languages
 * @typedef  {("N" | "S" | "E" | "W")}      Direction
 * @typedef  {('normal' | 'traceback')}     Modes
 * @typedef  {(NODE | BRANCH)}              Units
 * @typedef  {('enable' | 'disable' | 'standby' | 'lock')}  States
 * @typedef  {('archer' | 'warrior' | 'mage' | 'assassin' | 'shaman')}  Classes
 * @typedef  {('Boltslinger' | 'Sharpshooter' | 'Trapper' | 'Fallen' | 'Battle Monk' | 'Paladin' | 'Riftwalker' | 'Light Bender' | 'Arcanist' | 'Shadestepper' | 'Trickster' | 'Acrobat' | 'Summoner' | 'Ritualist' | 'Acolyte')}   Archetypes
 * 
 * @typedef {import('./unit.js').Gate} Gate
 * @typedef {import('./unit.js').UNIT} UNIT
 * @typedef {import('./node.js').NODE} NODE
 * @typedef {import('./branch.js').BRANCH} BRANCH
 * @typedef {import('./branch.js').PATH} PATH
 * @typedef {import('./packet.js').Packet} Packet
 * @typedef {import('./tooltip.js').Tooltip} Tooltip
 * @typedef {import('./archetype.js').Archetype} Archetype
 * @typedef {import('./orb.js').Orb} Orb
 **/

function main() {
    Action.buildTree();
    document.addEventListener('DOMContentLoaded', () => {
        Action.renderTree();
        Action.register();

        console.info('routemap:', routemap);
        console.info('routelogs:', routelogs);
        console.info('routedata:', routedata);
        console.info('using:', languages[using]);
    });
}

class Action {

    static buildTree() {

        for (const [clsname, dataset] of Object.entries(database)) {
            const clsmap = routemap[clsname];
            for (const [name, info] of Object.entries(dataset)) {
                console.groupCollapsed(`<${name}>`);

                const[x, y] = info.axis;

                const node = new NODE(clsname, info);

                try {
                    clsmap[y].splice(x, 1, node);
                } catch {
                    clsmap[y] = newline(x, 1, node);
                }

                console.groupEnd();
            }

            for (let y = clsmap.length; clsmap.length % 6; y++) {
                clsmap[y] = newline();
            }
        }

        return this;

    }

    static renderTree() {
        
        for (const/** @type {Classes} */clsname in routedata) {
            const page = document.querySelector(`div#main div#${clsname}.page`);

            /* ------ render footer ------ */
            const f_table = page.querySelector(`.frame.foot table`);
            const f_fragment = document.createDocumentFragment();
            const/** @type {Archetype[]} */atypes = Object.values(routedata[clsname].archetype);
            const/** @type {Orb} */ orb = routedata[clsname].cost;

            for (let row = 0; row < 4; row++) {
                const tr = document.createElement('tr');
                for (let col = 0; col < 9; col++) {
                    const td = document.createElement('td');
                    switch (str([row, col])) {
                        case '[0,3]': {
                            td.appendChild(generateElement(`<img class="misc arrow_up">`));
                            break;
                        }
                        case '[0,5]': {
                            td.appendChild(generateElement(`<img class="misc arrow_down">`));
                            break;
                        }
                        case '[0,4]': {
                            orb.parentElement = td;
                            td.appendChild(orb.html);
                            break;
                        }
                        case '[2,2]':
                        case '[2,4]':
                        case '[2,6]': {
                            const atype = atypes.shift();
                            atype.parentElement = td;
                            td.appendChild(atype.html);
                            break;
                        }
                    }
                    tr.appendChild(td);
                }
                f_fragment.appendChild(tr);
            }
            f_table.appendChild(f_fragment);


            /* ------ render body ------ */
            const table  = page.querySelector(`.frame.body table`);
            const fragment = document.createDocumentFragment();
            
            for (const row of routemap[clsname]) {
                const tr = document.createElement('tr');
                for (const unit of row) {
                    const td = document.createElement('td');
                    
                    if (unit instanceof UNIT) {
                        td.appendChild(unit.html);
                        switch (true) {

                            case unit instanceof PATH:
                                unit.gateway
                                    .map((gate) => [gate.pos, gate.connect_with])
                                    .filter((/** @type {[Direction, Units]} */[pos, obj]) => obj instanceof NODE)
                                    .forEach((/** @type {[Direction, NODE]} */[pos, node]) => {
                                        const family = [node.proto.import, node.proto.export].flat();
                                        node.gates[opposite(pos)].connect_with ??= unit;
                                        node.gates[opposite(pos)].connect = (
                                            unit.gateway.flatMap((_gate) => _gate.connect)
                                                        .filter((_node) => family.includes(_node.name))
                                        );
                                    });

                            case unit instanceof NODE:
                                unit.parentElement = td;
                                
                        }
                    }

                    tr.appendChild(td);
                }
                fragment.appendChild(tr);
            }
            table.appendChild(fragment);
        }

        return this;
    }

    static register() {

        for (const node of $('div#main .frame.body td:has(button)')) {
            node.addEventListener('click', function (event) {
                EventHandler.nodeInteractEvent(event);
            });
        }

        document.getElementById('lang-config').addEventListener('change', function (event) {
            using = parseInt(event.target.value);
            EventHandler.remapToTreeEvent(event);
        });

        return this;
    }
}

class EventHandler {

    /** @param {Event} event*/
    static nodeInteractEvent(event) {

        if (event.target !== event.currentTarget) return;

        /** @type {HTMLTableCellElement} */
        const target = event.target;
        const axis = {
            x: target.cellIndex,
            y: target.parentNode.rowIndex
        };
        
        routemap[page][axis.y][axis.x].click();

    }

    /** @param {Event} event*/
    static remapToTreeEvent(event) {
        
        // re-mapping ability tree main body
        for (const clsmap of Object.values(routemap)) {
            for (const row of clsmap) {
                for (const node of row) {
                    if ((node instanceof NODE)) node.parentElement.replaceChildren(node.html);
                }
            }
        }

        // archetypes & orbs
        for (const clsdata of Object.values(routedata)) {
            clsdata.cost.parentElement.replaceChildren(clsdata.cost.html);
            for (const atype of Object.values(clsdata.archetype)) {
                atype.parentElement.replaceChildren(atype.html);
            }
        }

        // tab buttons
        for (const button of Object.values(tab_buttons)) {
            button.textContent = translate[languages[using]][button.dataset.class];
        }

    }
}

function is_defined(...obj) {
    return obj.every((_) => _ !== undefined);
}

/** 
 * @typedef {(boolean | null)}  bool
 * @typedef {Object}    bool_args
 * @property {bool}     base
 * @param {Array<bool>} arr
 * @param {bool_args}
 * @return {bool}
 **/
function bool(arr, {base}={base: null}) {
    let bin = base;
    for (const elem of arr) {
        switch (elem) {
            case true: bin = true; break;
            case false: bin = false; break;
            case null: continue;
        }
        if (bin) {break}
    }
    return bin;
}

/**
 * @param {Array} arr
 * @return {Array}
 **/
function unique(arr) {
    return Array.from(new Set(arr));
}

function NSEW(arg1, arg2) {
    const seq = {'N': 0, 'S': 1, 'E': 2, 'W': 3};
    [arg1, arg2] = [seq[arg1], seq[arg2]]
    return (arg1 > arg2) ? 1 : ((arg1 < arg2) ? -1 : 0)
}

function opposite(dir) {
    switch (dir) {
        case 'N': return 'S';
        case 'S': return 'N';
        case 'E': return 'W';
        case 'W': return 'E';
        default: throw Error('invalid direction.')
    }
}

function newline(column, delcount, value) {
    const line = new Array(9).fill(null);
    is_defined(column, delcount, value) ? line.splice(column, delcount, value) : undefined;
    return line;
}

/** @param {Packet} packet  */
function readpacket(packet) {
    function string(text) {return ((text === null)||(text === undefined)) ? text : `'${text}'`}
    function unit(obj) {return obj.name ? `<${obj.name}>` : `branch${str(obj.axis)}`}
    return `
    {
        header: {
            send: ${string(packet.header.send)},
            recv: ${string(packet.header.recv)},
            mode: ${string(packet.header.mode)},
            ignore: ${str(packet.header.ignore)}
        },
        payload: {
            task: ${string(packet.payload.task)},
            data: ${packet.payload.data}
        },
        footer: {
            router: ${unit(packet.footer.router)},
            via: ${string(packet.footer.via)}
        }
    }`
}

function readmap(clsname, x, y) {
    const classMap = routemap[clsname];
    while (classMap.length <= y) {classMap[classMap.length] ||= newline()}
    return classMap[y][x];
}

function generateElement(stringHTML) {
    const fragment = document.createDocumentFragment();
    const block = document.createElement('div');
    block.innerHTML = stringHTML;
    for (const child of block.childNodes) {fragment.appendChild(child)}
    return fragment;
}

var globalID = 0;
const $ = (selector) => document.querySelectorAll(selector);
const str = JSON.stringify;
const tab_buttons = document.getElementById('tab').getElementsByClassName('tab_button');
const translate = {
    "zh-TW": {
        cost: "技能點數：",
        rely: "技能需求：",
        lock: "衝突技能：",
        atype: /** @param {String} type */ (type) => `最低 ${type} Archetype 點數需求：`,
        atype_unlocked: "已解鎖技能：",
        apoint: "技能點",
        apoint_descr: "技能點可以用來解鎖新的技能",
        apoint_rmain: "剩餘點數：",
        apoint_info1: "（左鍵點擊複製分享連結）",
        apoint_info2: "（Shift+左鍵重置技能樹）",
        archer: "弓箭手",
        warrior: "戰士",
        mage: "法師",
        assassin: "刺客",
        shaman: "薩滿"
    },
    "en": {
        cost: "Ability Points: ",
        rely: "Required Ability: ",
        lock: "Unlocking will block: ",
        atype: /** @param {String} type */ (type) => `Min ${type} Archetype: `,
        atype_unlocked: "Unlocked Abilities: ",
        apoint: "Ability Points",
        apoint_descr: "Ability Points are used to unlock new abilities",
        apoint_rmain: "Available Points: ",
        apoint_info1: "(Left-Click to copy URL to clipboard)",
        apoint_info2: "(Shift + Left-Click to reset Ability Tree)",
        archer: "Archer",
        warrior: "Warrior",
        mage: "Mage",
        assassin: "Assassin",
        shaman: "Shaman"
    }
};
const regex = {
    reset: new RegExp(/\u00A7r/, 'gus'),
    general: new RegExp(/\u00A7\S/, 'us'),
    text: new RegExp(/\u00A7\S(.+)/, 'us')
};
const routedata = {
    archer: {
        cost: new Orb('archer'),
        /** @type {Object<string, Set<NODE>>} */lock: {},
        /** @type {Object<string, Set<NODE>>} */rely: {},
        archetype: {
            "Boltslinger": new Archetype('Boltslinger', 'archer'),
            "Trapper": new Archetype('Trapper', 'archer'),
            "Sharpshooter": new Archetype('Sharpshooter', 'archer')
        }
    },
    warrior: {
        cost: new Orb('warrior'),
        /** @type {Object<string, Set<NODE>>} */lock: {},
        /** @type {Object<string, Set<NODE>>} */rely: {},
        archetype: {
            "Fallen": new Archetype('Fallen', 'warrior'),
            "Battle Monk": new Archetype('Battle Monk', 'warrior'),
            "Paladin": new Archetype('Paladin', 'warrior')
        }
    },
    mage: {
        cost: new Orb('mage'),
        /** @type {Object<string, Set<NODE>>} */lock: {},
        /** @type {Object<string, Set<NODE>>} */rely: {},
        archetype: {
            "Riftwalker": new Archetype('Riftwalker', 'mage'),
            "Light Bender": new Archetype('Light Bender', 'mage'),
            "Arcanist": new Archetype('Arcanist', 'mage')
        }
    },
    assassin: {
        cost: new Orb('assassin'),
        /** @type {Object<string, Set<NODE>>} */lock: {},
        /** @type {Object<string, Set<NODE>>} */rely: {},
        archetype: {
            "Shadestepper": new Archetype('Shadestepper', 'assassin'),
            "Trickster": new Archetype('Trickster', 'assassin'),
            "Acrobat": new Archetype('Acrobat', 'assassin')
        }
    },
    shaman: {
        cost: new Orb('shaman'),
        /** @type {Object<string, Set<NODE>>} */lock: {},
        /** @type {Object<string, Set<NODE>>} */rely: {},
        archetype: {
            "Summoner": new Archetype('Summoner', 'shaman'),
            "Ritualist": new Archetype('Ritualist', 'shaman'),
            "Acolyte": new Archetype('Acolyte', 'shaman')
        }
    }
}
const routelogs = {
    query: /** @return {boolean} */ function ({gid, task, nodeName}) {try {return this[gid][task][nodeName]} catch {return undefined}},
    write: function ({gid, task, nodeName, value}) {this[gid][task][nodeName] = value; return value;}
};
const routemap = {"archer": [], "warrior": [], "mage": [], "assassin": [], "shaman": []};
const database = {
    "archer": {},
    "warrior": {
        "Bash": {
            "name": "Bash",
            "combo": "RLR",
            "level": 0,
            "import": null,
            "export": ["Spear Proficiency I"],
            "cost": 1,
            "axis": [4, 1],
            "draft": ["S"]
        },
        "Spear Proficiency I": {
            "name": "Spear Proficiency I",
            "level": 1,
            "import": ["Bash"],
            "export": ["Double Bash", "Cheaper Bash I"],
            "cost": 1,
            "axis": [4, 3],
            "draft": ["N", "S", "W"]
        },
        "Cheaper Bash I": {
            "name": "Cheaper Bash I",
            "realname": "Cheaper Bash",
            "level": 1,
            "import": ["Spear Proficiency I"],
            "export": null,
            "cost": 1,
            "axis": [2, 3],
            "draft": ["E"]
        },
        "Double Bash": {
            "name": "Double Bash",
            "level": 2,
            "import": ["Spear Proficiency I"],
            "export": ["Charge"],
            "cost": 1,
            "axis": [4, 5],
            "draft": ["N", "S"]
        },
        "Charge": {
            "name": "Charge",
            "combo": "RRR",
            "level": 0,
            "import": ["Double Bash"],
            "export": ["Vehement", "Tougher Skin"],
            "cost": 1,
            "axis": [4, 7],
            "draft": ["N", "E", "W"]
        },
        "Vehement": {
            "name": "Vehement",
            "level": 1,
            "import": ["Charge"],
            "export": ["Uppercut"],
            "cost": 1,
            "lock": ["Tougher Skin"],
            "rely": null,
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [2, 7],
            "draft": ["E", "S"]
        },
        "Tougher Skin": {
            "name": "Tougher Skin",
            "level": 1,
            "import": ["Charge"],
            "export": ["War Scream"],
            "cost": 1,
            "lock": ["Vehement"],
            "rely": null,
            "archetype": {"name": "Paladin", "req": 0},
            "axis": [6, 7],
            "draft": ["W", "S"]
        },
        "Uppercut": {
            "name": "Uppercut",
            "combo": "RLL",
            "level": 0,
            "import": ["Cheaper Charge", "Vehement"],
            "export": ["Cheaper Charge", "Heavy Impact", "Earth Mastery", "Thunder Mastery"],
            "cost": 1,
            "axis": [2, 9],
            "draft": ["N", "SSS", "E", "WWSSS"]
        },
        "Cheaper Charge": {
            "name": "Cheaper Charge",
            "level": 1,
            "import": ["Uppercut", "War Scream"],
            "export": ["Uppercut", "War Scream", "Thunder Mastery", "Air Mastery", "Water Mastery"],
            "cost": 1,
            "axis": [4, 9],
            "draft": ["SSSSE", "SSSSW", "E", "W"]
        },
        "War Scream": {
            "name": "War Scream",
            "combo": "RRL",
            "level": 0,
            "import": ["Cheaper Charge", "Tougher Skin"],
            "export": ["Cheaper Charge", "Air Mastery", "Fire Mastery"],
            "cost": 1,
            "axis": [6, 9],
            "draft": ["N", "SSS", "EESSS", "W"]
        },
        "Heavy Impact": {
            "name": "Heavy Impact",
            "level": 2,
            "import": ["Uppercut"],
            "export": null,
            "cost": 1,
            "axis": [1, 10],
            "draft": ["N"]
        },
        "Earth Mastery": {
            "name": "Earth Mastery",
            "level": 1,
            "import": ["Uppercut"],
            "export": ["Quadruple Bash"],
            "cost": 1,
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [0, 13],
            "draft": ["NNNNE", "S"]
        },
        "Thunder Mastery": {
            "name": "Thunder Mastery",
            "level": 1,
            "import": ["Cheaper Charge", "Air Mastery", "Uppercut"],
            "export": ["Fireworks", "Air Mastery", "Water Mastery"],
            "cost": 1,
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [2, 13],
            "draft": ["NNN", "S", "EEE", "EENNN"]
        },
        "Air Mastery": {
            "name": "Air Mastery",
            "level": 1,
            "import": ["Cheaper Charge", "Thunder Mastery", "War Scream"],
            "export": ["Flyby Jab", "Thunder Mastery", "Water Mastery"],
            "cost": 1,
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [6, 13],
            "draft": ["NNN", "S", "WWW", "WWNNN"]
        },
        "Fire Mastery": {
            "name": "Fire Mastery",
            "level": 1,
            "import": ["War Scream"],
            "export": ["Flaming Uppercut"],
            "cost": 1,
            "archetype": {"name": "Paladin", "req": 0},
            "axis": [8, 13],
            "draft": ["NNNNW", "S"]
        },
        "Water Mastery": {
            "name": "Water Mastery",
            "level": 1,
            "import": ["Cheaper Charge", "Thunder Mastery", "Air Mastery"],
            "export": ["Half-Moon Swipe"],
            "cost": 1,
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [4, 14],
            "draft": ["NNNN", "NE", "NW", "S"]
        },
        "Quadruple Bash": {
            "name": "Quadruple Bash",
            "level": 2,
            "import": ["Earth Mastery", "Fireworks"],
            "export": ["Bak'al's Grasp", "Fireworks"],
            "cost": 2,
            "rely": "Bash",
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [0, 15],
            "draft": ["N", "ESSSS"]
        },
        "Fireworks": {
            "name": "Fireworks",
            "level": 2,
            "import": ["Thunder Mastery", "Quadruple Bash"],
            "export": ["Bak'al's Grasp", "Quadruple Bash"],
            "cost": 2,
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [2, 15],
            "draft": ["N", "WSSSS"]
        },
        "Flyby Jab": {
            "name": "Flyby Jab",
            "level": 1,
            "import": ["Air Mastery"],
            "export": ["Iron Lungs", "Flaming Uppercut"],
            "cost": 1,
            "axis": [6, 15],
            "draft": ["N", "E"]
        },
        "Flaming Uppercut": {
            "name": "Flaming Uppercut",
            "level": 2,
            "import": ["Fire Mastery"],
            "export": ["Iron Lungs", "Flyby Jab"],
            "cost": 2,
            "axis": [8, 15],
            "draft": ["N", "W"]
        },
        "Half-Moon Swipe": {
            "name": "Half-Moon Swipe",
            "level": 2,
            "import": ["Water Mastery"],
            "export": ["Air Shout"],
            "cost": 2,
            "rely": "Uppercut",
            "archetype": {"name": "Battle Monk", "req": 1},
            "axis": [4, 16],
            "draft": ["N", "SS"]
        },
        "Iron Lungs": {
            "name": "Iron Lungs",
            "level": 1,
            "import": ["Flyby Jab", "Flaming Uppercut"],
            "export": ["Mantle of the Bovemists"],
            "cost": 1,
            "rely": "War Scream",
            "archetype": {"name": "Paladin", "req": 0},
            "axis": [7, 16],
            "draft": ["N", "SS"]
        },
        "Generalist": {
            "name": "Generalist",
            "level": 4,
            "import": ["Air Shout"],
            "export": null,
            "cost": 2,
            "archetype": {"name": "Battle Monk", "req": 3},
            "axis": [2, 19],
            "draft": ["E"]
        },
        "Air Shout": {
            "name": "Air Shout",
            "level": 2,
            "import": ["Half-Moon Swipe"],
            "export": ["Generalist", "Cheaper Uppercut I"],
            "cost": 2,
            "rely": "War Scream",
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [4, 19],
            "draft": ["NN", "W", "WS"]
        },
        "Mantle of the Bovemists": {
            "name": "Mantle of the Bovemists",
            "level": 4,
            "import": ["Iron Lungs"],
            "export": ["Provoke"],
            "cost": 2,
            "rely": "War Scream",
            "archetype": {"name": "Paladin", "req": 3},
            "axis": [7, 19],
            "draft": ["NN", "S"]
        },
        "Bak'al's Grasp": {
            "name": "Bak'al's Grasp",
            "level": 4,
            "import": ["Quadruple Bash", "Fireworks"],
            "export": ["Spear Proficiency II"],
            "cost": 2,
            "rely": "War Scream",
            "archetype": {"name": "Fallen", "req": 2},
            "axis": [1, 20],
            "draft": ["NNNNN", "W"]
        },
        "Spear Proficiency II": {
            "name": "Spear Proficiency II",
            "level": 1,
            "import": ["Bak'al's Grasp", "Cheaper Uppercut I"],
            "export": ["Precise Strikes", "Cheaper Uppercut I", "Enraged Blow"],
            "cost": 1,
            "axis": [0, 21],
            "draft": ["N", "SSS", "EE"]
        },
        "Cheaper Uppercut I": {
            "name": "Cheaper Uppercut I",
            "realname": "Cheaper Uppercut",
            "level": 1,
            "import": ["Spear Proficiency II", "Aerodynamics", "Air Shout"],
            "export": ["Spear Proficiency II", "Aerodynamics", "Precise Strikes", "Counter", "Flying Kick"],
            "cost": 1,
            "rely": "Uppercut",
            "axis": [3, 21],
            "draft": ["NN", "SSS", "E", "WW"]
        },
        "Aerodynamics": {
            "name": "Aerodynamics",
            "level": 2,
            "import": ["Provoke", "Cheaper Uppercut I"],
            "export": ["Provoke", "Cheaper Uppercut I", "Counter", "Manachism"],
            "cost": 2,
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [5, 21],
            "draft": ["E", "W"]
        },
        "Provoke": {
            "name": "Provoke",
            "level": 2,
            "import": ["Mantle of the Bovemists", "Aerodynamics"],
            "export": ["Mantle of the Bovemists", "Aerodynamics", "Manachism", "Sacred Surge"],
            "cost": 2,
            "rely": "War Scream",
            "axis": [7, 21],
            "draft": ["N", "ESSS", "W"]
        },
        "Precise Strikes": {
            "name": "Precise Strikes",
            "level": 1,
            "import": ["Spear Proficiency II", "Cheaper Uppercut I"],
            "export": null,
            "cost": 1,
            "axis": [1, 22],
            "draft": ["NE"]
        },
        "Counter": {
            "name": "Counter",
            "level": 2,
            "import": ["Cheaper Uppercut I", "Aerodynamics", "Manachism"],
            "export": ["Manachism"],
            "cost": 2,
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [4, 22],
            "draft": ["N", "E"]
        },
        "Manachism": {
            "name": "Manachism",
            "level": 3,
            "import": ["Aerodynamics", "Provoke", "Counter"],
            "export": ["Counter"],
            "cost": 2,
            "archetype": {"name": "Paladin", "req": 3},
            "axis": [6, 22],
            "draft": ["N", "W"]
        },
        "Enraged Blow": {
            "name": "Enraged Blow",
            "level": 3,
            "import": ["Spear Proficiency II"],
            "export": ["Intoxicating Blood", "Boiling Blood"],
            "cost": 2,
            "rely": "Bak'al's Grasp",
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [0, 25],
            "draft": ["NNN", "S", "ESS"]
        },
        "Flying Kick": {
            "name": "Flying Kick",
            "level": 2,
            "import": ["Cheaper Uppercut I", "Stronger Mantle"],
            "export": ["Stronger Mantle", "Riposte", "Cheaper War Scream I", "Ragnarokkr"],
            "cost": 2,
            "archetype": {"name": "Battle Monk", "req": 1},
            "axis": [3, 25],
            "draft": ["NNN", "SS", "ES", "EE"]
        },
        "Stronger Mantle": {
            "name": "Stronger Mantle",
            "level": 1,
            "import": ["Flying Kick", "Sacred Surge"],
            "export": ["Flying Kick", "Sacred Surge", "Riposte", "Cheaper War Scream I"],
            "cost": 1,
            "rely": "Mantle of the Bovemists",
            "archetype": {"name": "Paladin", "req": 0},
            "axis": [6, 25],
            "draft": ["E", "WWS"]
        },
        "Sacred Surge": {
            "name": "Sacred Surge",
            "level": 3,
            "import": ["Provoke", "Stronger Mantle"],
            "export": ["Stronger Mantle", "Stronger Bash"],
            "cost": 2,
            "archetype": {"name": "Paladin", "req": 5},
            "axis": [8, 25],
            "draft": ["NNNN", "S", "W"]
        },
        "Riposte": {
            "name": "Riposte",
            "level": 1,
            "import": ["Flying Kick", "Stronger Mantle"],
            "export": null,
            "cost": 1,
            "rely": "Counter",
            "axis": [5, 26],
            "draft": ["NW"]
        },
        "Intoxicating Blood": {
            "name": "Intoxicating Blood",
            "level": 2,
            "import": ["Enraged Blow"],
            "export": null,
            "cost": 2,
            "rely": "Bak'al's Grasp",
            "archetype": {"name": "Fallen", "req": 5},
            "axis": [0, 27],
            "draft": ["N"]
        },
        "Cheaper War Scream I": {
            "name": "Cheaper War Scream I",
            "realname": "Cheaper War Scream",
            "level": 1,
            "import": ["Cleansing Breeze", "Flying Kick", "Stronger Mantle"],
            "export": ["Cleansing Breeze", "Collide" ,"Ragnarokkr", "Whirlwind Strike"],
            "cost": 1,
            "rely": "War Scream",
            "axis": [4, 27],
            "draft": ["NNE", "SSS", "E", "WN"]
        },
        "Cleansing Breeze": {
            "name": "Cleansing Breeze",
            "level": 1,
            "import": ["Stronger Bash", "Cheaper War Scream I"],
            "export": ["Stronger Bash", "Cheaper War Scream I", "Collide", "Rejuvenating Skin"],
            "cost": 1,
            "archetype": {"name": "Paladin", "req": 0},
            "axis": [6, 27],
            "draft": ["E", "W"]
        },
        "Stronger Bash": {
            "name": "Stronger Bash",
            "level": 1,
            "import": ["Cleansing Breeze", "Sacred Surge"],
            "export": ["Cleansing Breeze", "Rejuvenating Skin"],
            "cost": 1,
            "axis": [8, 27],
            "draft": ["N", "W"]
        },
        "Boiling Blood": {
            "name": "Boiling Blood",
            "level": 2,
            "import": ["Ragnarokkr", "Enraged Blow"],
            "export": ["Ragnarokkr", "Comet", "Uncontainable Corruption"],
            "cost": 2,
            "axis": [1, 28],
            "draft": ["NNN", "E", "WSS"]
        },
        "Ragnarokkr": {
            "name": "Ragnarokkr",
            "level": 3,
            "import": ["Boiling Blood", "Cheaper War Scream I", "Flying Kick"],
            "export": ["Boiling Blood", "Comet"],
            "cost": 2,
            "rely": "War Scream",
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [3, 28],
            "draft": ["NN", "W"]
        },
        "Collide": {
            "name": "Collide",
            "level": 2,
            "import": ["Cheaper War Scream I", "Cleansing Breeze"],
            "export": null,
            "cost": 2,
            "rely": "Flying Kick",
            "archetype": {"name": "Battle Monk", "req": 4},
            "axis": [5, 28],
            "draft": ["N"]
        },
        "Rejuvenating Skin": {
            "name": "Rejuvenating Skin",
            "level": 4,
            "import": ["Cleansing Breeze", "Stronger Bash"],
            "export": ["Mythril Skin"],
            "cost": 2,
            "archetype": {"name": "Paladin", "req": 5},
            "axis": [7, 28],
            "draft": ["N", "SS"]
        },
        "Comet": {
            "name": "Comet",
            "level": 2,
            "import": ["Boiling Blood", "Ragnarokkr"],
            "export": null,
            "cost": 2,
            "rely": "Fireworks",
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [2, 29],
            "draft": ["N"]
        },
        "Uncontainable Corruption": {
            "name": "Uncontainable Corruption",
            "level": 1,
            "import": ["Radiant Devotee", "Boiling Blood"],
            "export": ["Radiant Devotee", "Armour Breaker", "Massive Bash"],
            "cost": 1,
            "rely": "Bak'al's Grasp",
            "axis": [0, 31],
            "draft": ["NNN", "S", "E"]
        },
        "Radiant Devotee": {
            "name": "Radiant Devotee",
            "level": 1,
            "import": ["Whirlwind Strike", "Uncontainable Corruption"],
            "export": ["Whirlwind Strike", "Uncontainable Corruption", "Armour Breaker"],
            "cost": 1,
            "archetype": {"name": "Battle Monk", "req": 1},
            "axis": [2, 31],
            "draft": ["E", "W"]
        },
        "Whirlwind Strike": {
            "name": "Whirlwind Strike",
            "level": 4,
            "import": ["Radiant Devotee", "Cheaper War Scream I"],
            "export": ["Radiant Devotee", "Spirit of the Rabbit"],
            "cost": 2,
            "rely": "Uppercut",
            "archetype": {"name": "Battle Monk", "req": 6},
            "axis": [4, 31],
            "draft": ["NNN", "S", "W"]
        },
        "Mythril Skin": {
            "name": "Mythril Skin",
            "level": 2,
            "import": ["Rejuvenating Skin"],
            "export": ["Shield Strike", "Sparkling Hope"],
            "cost": 2,
            "archetype": {"name": "Paladin", "req": 6},
            "axis": [7, 31],
            "draft": ["NN", "E", "W"]
        },
        "Armour Breaker": {
            "name": "Armour Breaker",
            "level": 3,
            "import": ["Uncontainable Corruption", "Radiant Devotee"],
            "export": null,
            "cost": 2,
            "rely": "Bak'al's Grasp",
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [1, 32],
            "draft": ["N"]
        },
        "Shield Strike": {
            "name": "Shield Strike",
            "level": 2,
            "import": ["Mythril Skin"],
            "export": ["Cheaper Bash II"],
            "cost": 2,
            "rely": "Mantle of the Bovemists",
            "archetype": {"name": "Paladin", "req": 0},
            "axis": [6, 32],
            "draft": ["N", "ES"]
        },
        "Sparkling Hope": {
            "name": "Sparkling Hope",
            "level": 3,
            "import": ["Mythril Skin"],
            "export": ["Cheaper Bash II"],
            "cost": 2,
            "rely": "Bak'al's Grasp",
            "archetype": {"name": "Paladin", "req": 0},
            "axis": [8, 32],
            "draft": ["N", "WS"]
        },
        "Massive Bash": {
            "name": "Massive Bash",
            "level": 3,
            "import": ["Tempest", "Uncontainable Corruption"],
            "export": ["Tempest", "Massacre", "Cheaper War Scream II"],
            "cost": 2,
            "archetype": {"name": "Fallen", "req": 7},
            "axis": [0, 33],
            "draft": ["N", "SSS", "E"]
        },
        "Tempest": {
            "name": "Tempest",
            "level": 2,
            "import": ["Massive Bash", "Spirit of the Rabbit"],
            "export": ["Massive Bash", "Spirit of the Rabbit", "Axe Kick", "Massacre"],
            "cost": 2,
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [2, 33],
            "draft": ["E", "W"]
        },
        "Spirit of the Rabbit": {
            "name": "Spirit of the Rabbit",
            "level": 1,
            "import": ["Tempest", "Whirlwind Strike"],
            "export": ["Tempest", "Axe Kick", "Radiance", "Cyclone"],
            "cost": 1,
            "rely": "Charge",
            "archetype": {"name": "Battle Monk", "req": 5},
            "axis": [4, 33],
            "draft": ["N", "SSS", "E", "W"]
        },
        "Massacre": {
            "name": "Massacre",
            "level": 2,
            "import": ["Massive Bash", "Tempest"],
            "export": null,
            "cost": 2,
            "archetype": {"name": "Fallen", "req": 5},
            "axis": [1, 34],
            "draft": ["N"]
        },
        "Axe Kick": {
            "name": "Axe Kick",
            "level": 1,
            "import": ["Tempest", "Spirit of the Rabbit"],
            "export": null,
            "cost": 1,
            "axis": [3, 34],
            "draft": ["N"]
        },
        "Radiance": {
            "name": "Radiance",
            "level": 3,
            "import": ["Spirit of the Rabbit", "Cheaper Bash II"],
            "export": ["Cheaper Bash II"],
            "cost": 2,
            "archetype": {"name": "Paladin", "req": 3},
            "axis": [5, 34],
            "draft": ["N", "E"]
        },
        "Cheaper Bash II": {
            "name": "Cheaper Bash II",
            "realname": "Cheaper Bash",
            "level": 1,
            "import": ["Radiance", "Shield Strike", "Sparkling Hope"],
            "export": ["Radiance", "Stronger Sacred Surge"],
            "cost": 1,
            "rely": "Bash",
            "axis": [7, 34],
            "draft": ["NN", "SS", "W"]
        },
        "Cheaper War Scream II": {
            "name": "Cheaper War Scream II",
            "realname": "Cheaper War Scream",
            "level": 1,
            "import": ["Massive Bash"],
            "export": ["Better Enraged Blow", "Blood Pact"],
            "cost": 1,
            "rely": "War Scream",
            "axis": [0, 37],
            "draft": ["NNN", "S", "E"]
        },
        "Discombobulate": {
            "name": "Discombobulate",
            "level": 4,
            "import": ["Cyclone"],
            "export": null,
            "cost": 2,
            "archetype": {"name": "Battle Monk", "req": 11},
            "axis": [2, 37],
            "draft": ["E"]
        },
        "Cyclone": {
            "name": "Cyclone",
            "level": 2,
            "import": ["Spirit of the Rabbit"],
            "export": ["Discombobulate", "Thunderclap"],
            "cost": 2,
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [4, 37],
            "draft": ["NNN", "W", "E"]
        },
        "Stronger Sacred Surge": {
            "name": "Stronger Sacred Surge",
            "level": 1,
            "import": ["Cheaper Bash II"],
            "export": ["Second Chance"],
            "cost": 1,
            "rely": "Sacred Surge",
            "archetype": {"name": "Paladin", "req": 8},
            "axis": [7, 37],
            "draft": ["NN", "S"]
        },
        "Better Enraged Blood": {
            "name": "Better Enraged Blood",
            "level": 1,
            "import": ["Cheaper War Scream II"],
            "export": null,
            "cost": 1,
            "rely": "Enraged Blow",
            "axis": [1, 38],
            "draft": ["N"]
        },
        "Thunderclap": {
            "name": "Thunderclap",
            "level": 2,
            "import": ["Cyclone"],
            "export": null,
            "cost": 2,
            "rely": "Bash",
            "archetype": {"name": "Battle Monk", "req": 8},
            "axis": [5, 38],
            "draft": ["N"]
        },
        "Blood Pact": {
            "name": "Blood Pact",
            "level": 4,
            "import": ["Cheaper War Scream II"],
            "export": ["Haemorrhage", "Brink of Madness"],
            "cost": 2,
            "archetype": {"name": "Fallen", "req": 10},
            "axis": [0, 39],
            "draft": ["N", "EEEE"]
        },
        "Second Chance": {
            "name": "Second Chance",
            "level": 4,
            "import": ["Stronger Sacred Surge"],
            "export": ["Cheaper Uppercut II", "Martyr"],
            "cost": 2,
            "archetype": {"name": "Paladin", "req": 6},
            "axis": [7, 39],
            "draft": ["N", "E", "W"]
        },
        "Haemorrhage": {
            "name": "Haemorrhage",
            "level": 1,
            "import": ["Blood Pact"],
            "export": null,
            "cost": 1,
            "rely": "Blood Pact",
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [2, 40],
            "draft": ["NW"]
        },
        "Brink of Madness": {
            "name": "Brink of Madness",
            "level": 3,
            "import": ["Blood Pact", "Cheaper Uppercut II"],
            "export": ["Cheaper Uppercut II"],
            "cost": 2,
            "axis": [4, 40],
            "draft": ["NWWW", "E"]
        },
        "Cheaper Uppercut II": {
            "name": "Cheaper Uppercut II",
            "level": 1,
            "import": ["Brink of Madness", "Second Chance"],
            "export": ["Brink of Madness"],
            "cost": 1,
            "rely": "Uppercut",
            "axis": [6, 40],
            "draft": ["N", "W"]
        },
        "Martyr": {
            "name": "Martyr",
            "level": 2,
            "import": ["Second Chance"],
            "export": null,
            "cost": 2,
            "axis": [8, 40],
            "draft": ["N"]
        }
    },
    "mage": {},
    "assassin": {},
    "shaman": {}
};

main();
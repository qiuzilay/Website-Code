'use strict'

function main() {
    EventHandler.buildTree();
    document.addEventListener('DOMContentLoaded', () => {
        EventHandler.renderTree();
        EventHandler.register();
    });
}

class Packet {
    /**
     * @typedef  {("N" | "S" | "E" | "W")}  direction
     * @typedef  {('normal' | 'boardcast' | 'ACK')} modes
     * @typedef  {(NODE | BRANCH)}      unit
     * @typedef  {Object}               params
     * @property {string}               task    Command
     * @property {NODE}                 send    Sender Name
     * @property {NODE}                 recv    Destination
     * @property {modes}                mode    Transmit mode
     * @property {unit}                 router  Transmitter
     * @property {direction}            via     Pass by the gate
     * @property {Object}               data    Attachment
     * @property {Iterable<String>}     ignore  Ignore List
     * @property {number}               ttl     Time To Live
     * 
     * @param {params}
     */
    constructor({task, send, recv=null, mode, router, via, data=null, ignore, ttl=-1}) {
        /**
         * @typedef    {Object}         header
         * @property   {NODE}           send
         * @property   {NODE}           recv
         * @property   {modes}          mode
         * @property   {String[]}       ignore
         * @property   {Set<String>}    __ignore
         * 
         * @typedef    {Object}   payload
         * @property   {String}   task
         * @property   {Object}   data
         * 
         * @typedef    {Object}     footer
         * @property   {unit}       router
         * @property   {direction}  via
         * @property   {number}     ttl
         */
        
        /** @type {header} */
        this.header = {
            send: send,
            recv: recv,
            mode: mode,
            __ignore: new Set(ignore),
            get ignore() {return Array.from(this.__ignore)},
            set ignore(iter) {this.__ignore = new Set(iter)}
        };
        /** @type {payload} */
        this.payload = {
            task: task,
            data: data
        };
        /** @type {footer} */
        this.footer = {
            router: router,
            via: via,
            ttl: ttl
        }
    }

    /** @param {params} */
    config({task, send, recv, mode, router, via, data, ignore, ttl}) {
        if (send !== undefined) {this.header.send = send}
        if (recv !== undefined) {this.header.recv = recv}
        if (mode !== undefined) {this.header.mode = mode}
        if (ignore !== undefined) {this.header.ignore = ignore}
        if (task !== undefined) {this.payload.task = task}
        if (data !== undefined) {this.payload.data = data}
        if (router !== undefined) {this.footer.router = router}
        if (via !== undefined) {this.footer.via = via}
        if (ttl !== undefined) {this.footer.ttl = ttl}
        return this;
    }
}

class Gate {
    constructor(pos) {
        /** @type {direction} */
        this.pos = pos;
        /** @type {Set<NODE>} */
        this._connect = new Set();
        /** @type {unit}} */
        this.connect_with = null;
    }
    get bound() {return this.connect.length ? true : false}
    get connect() {return Array.from(this._connect)}
    set connect(iter) {this._connect = new Set(iter)}
}

class UNIT {

    constructor(axis) {
        this.axis = axis;
        this.gates = {
            N: new Gate('N'),
            S: new Gate('S'),
            E: new Gate('E'),
            W: new Gate('W')
        };
    }

    get gateway() {return Object.values(this.gates).filter((gate) => gate.bound)}

    get usable() {return this.gateway.map((gate) => gate.pos).sort(NSEW).join('')}
    
    get active() {
        const retval = (
            Object.values(this.gates)
                  .filter((gate) => gate.connect.some((node) => node.state === 'enable'))
                  .map((gate) => gate.pos)
                  .sort(NSEW)
                  .join('')
        );
        return (retval.length >= 2) ? retval : ''
    }
    
    /**
     * @param {direction} pos
     * @param {node} node
     * @param {unit} closest
     */
    __bind__(pos, node, closest) {
        const gate = this.gates[pos]
        gate._connect.add(node)
        try {
            if ((gate.connect_with !== null) && (gate.connect_with !== closest)) {
                throw Error(`suspecious rebind the "connect_with" property, occurred at [${this.axis}]`);
            } else {
                gate.connect_with ??= closest;
            }
        } catch {
            console.error(routemap)
        }
    }

}

class NODE extends UNIT{

    /**
     * @typedef     {('archer' | 'warrior' | 'mage' | 'assassin' | 'shaman')}   classes 
     * @typedef     {('enable' | 'disable' | 'standby' | 'lock')} states
     * @typedef     {Object}      ndata
     * @property    {String}      ndata.name
     * @property    {String}      ndata.combo
     * @property    {number}      ndata.level
     * @property    {String[]}    ndata.import
     * @property    {String[]}    ndata.export
     * @property    {number}      ndata.cost
     * @property    {String[]}    ndata.lock
     * @property    {String}      ndata.rely
     * @property    {Object}      ndata.archetype
     * @property    {String}      ndata.archetype.name
     * @property    {number}      ndata.archetype.req
     * @property    {number[]}    ndata.axis
     * @property    {String[]}    ndata.draft
     * 
     * @param {classes} clsname
     * @param {ndata}   info
     */
    constructor(clsname, info) {
        super(info.axis);
        /** @type {ndata} */
        this.proto = info;
        /** @type {String} */
        this.name = info.name;
        /** @type {classes} */
        this.class = clsname;
        /** @type {states} */
        this.state = str(info.axis) == str([4, 1]) ? 'standby' : 'disable';
        this.html = generateElement(`<button class="${this.state}"><img class="${info.level ? `button_${info.level}` : `button_${clsname}`}"></button>`);

        this.#__buildpath__();
    }

    /** @returns {Gate[]} */
    get importGates() {return this.gateway.filter((gate) => gate.connect.some((node) => this.proto.import?.includes(node.name)))}

    /** @returns {Gate[]} */
    get exportGates() {return this.gateway.filter((gate) => gate.connect.some((node) => this.proto.export?.includes(node.name)))}

    #__buildpath__() {

        this.proto.draft.forEach((path) => {

            let [x, y] = this.proto.axis;
            let object = this;
            
            Array.from(path).forEach((dir) => {

                switch (dir) {
                    case 'N': y--; break;
                    case 'S': y++; break;
                    case 'E': x++; break;
                    case 'W': x--; break;
                    default: throw Error(`invalid direction "${dir}" detected in the draft of <${this.name}> under ${this.class}.`);
                }

                const branch = (readmap(this.class, x, y) instanceof PATH) ? routemap[this.class][y][x] : new PATH([x, y]);

                branch.__bind__(opposite(dir), this, object);

                routemap[this.class][y][x] = object = branch;

            });
        });
    }

    /** @param {states} state  */
    set(state) {
        const states = ['enable', 'disable', 'standby', 'lock'];
        if (state !== undefined) {this.state = state}
        if (!states.includes(this.state)) {throw Error(`invalid state of Node was detected at <${this.proto.name}>`)}
        for (const _ of states) {(_ == this.state) ? this.html.classList.add(_) : this.html.classList.remove(_)}
    }
    
    click() {
        switch (this.state) {
            case 'lock': break;
            case 'disable': break;
            case 'enable':
                this.set('standby');
                this.gateway.forEach((gate) => {
                    console.groupCollapsed(`<${this.name}> [${this.state}] start a routing.`);

                    const packet = new Packet({
                        task: 'standby',
                        send: this.name,
                        mode: 'normal',
                        router: this,
                        via: opposite(gate.pos),
                        ignore: [this.name]
                    });
                    console.info(`<${this.name}> send a packet!`, readpacket(packet));
                    gate.connect_with.transmit(packet);

                    console.info(`routing end.`);
                    console.groupEnd();
                });
                break;
            case 'standby':
                this.set('enable');
                this.gateway.forEach((gate) => {
                    console.groupCollapsed(`<${this.name}> [${this.state}] start a routing.`);

                    const packet = new Packet({
                        task: 'enable',
                        send: this.name,
                        mode: 'normal',
                        router: this,
                        via: opposite(gate.pos),
                        ignore: [this.name]
                    });
                    console.info(`<${this.name}> send a packet!`, readpacket(packet));
                    gate.connect_with.transmit(packet);

                    console.info(`routing end.`)
                    console.groupEnd();
                });
                break;
            default: throw Error(`invalid state of Node was detected at <${this.proto.name}>`);
        }
    }

    /**
     * @param {Packet} packet Fan is gay
     */
    transmit(packet) {
        console.info(`<${this.name}> [${this.state}] received packet.`, readpacket(packet));
        let retval;
        const sender = packet.header.send;
        const receiver = packet.header.recv;
        const task = packet.payload.task;
        const fromParent = this.proto.import?.includes(sender) ?? false
        const fromChildren = this.proto.export?.includes(sender) ?? false
        switch (task) {
            case 'enable': {
                if (fromParent) {
                    switch (this.state) {
                        case 'disable': this.set('standby'); break;
                        case 'standby': break;                        
                        case 'enable': break;
                        case 'lock': break;
                    }

                } else if (fromChildren) {
                    /* do nothing */

                } else {
                    console.info(`unexpected packet received.`, this, readpacket(packet));
                }
                
                break;

            }

            case 'disable':
            case 'standby': {

                if (fromParent) {
                    switch (this.state) {
                        case 'disable': break;
                        case 'standby':
                        case 'enable':
                            let fetch = false;
                            for (const gate of this.importGates) {
                                
                                console.groupCollapsed(`<${this.name}> [${this.state}] start a reachable-inspect routing.`);
                                const subpack = new Packet({
                                    task: 'reachable?',
                                    send: this.name,
                                    mode: 'normal',
                                    router: this,
                                    via: opposite(gate.pos),
                                    ignore: [this.name, sender],
                                    ttl: 1
                                });
                                console.info(`<${this.name}> [${this.state}] send a packet for reachable-inspect!`, readpacket(subpack));
                                fetch = gate.connect_with.transmit(subpack);
                                console.info(`route end. fetch: ${fetch}`);
                                console.groupEnd();
                                if (fetch) {break}
                                
                            };

                            if (!fetch) {this.set('disable')}
                            this.exportGates.forEach((gate) => {
                                console.groupCollapsed(`<${this.name}> [${this.state}] start a sub-routing.`);
                                const subpack = new Packet({
                                    task: this.state,
                                    send: this.name,
                                    recv: null,
                                    mode: 'normal',
                                    router: this,
                                    via: opposite(gate.pos),
                                    ignore: packet.header.ignore.concat([this.name])
                                });
                                console.info(`<${this.name}> send a subpack!`, readpacket(subpack));
                                gate.connect_with.transmit(subpack);
                                console.info(`sub-routing end.`);
                                console.groupEnd();
                            })

                            break;

                        case 'lock': break;
                    }


                } else if (fromChildren) {
                    /* do nothing */

                } else {
                    console.info(`unexpected packet received.`, this, packet);

                }

                break;

            }
            case 'reachable?': {

                if (fromParent || fromChildren) {
                    switch (this.state) {
                        case 'lock': break;
                        case 'disable': break;
                        case 'enable':
                        case 'standby':
                            retval = (
                                this.importGates.flatMap((gate) => gate.connect)
                                                .filter((node) => !packet.header.ignore.includes(node.name))
                                                .some((node) => node.state === 'enable')
                            );

                            if ((!--packet.footer.ttl) || retval) {return retval}

                            for (const gate of this.importGates) {
                                console.groupCollapsed(`<${this.name}> [${this.state}] start a sub-reachable-inspect routing.`);
                                packet.config({send: this, router: this, via: opposite(gate.pos), ignore: packet.header.ignore.concat([this.name])})
                                console.info(`<${this.name}> [${this.state}] send packet to keep reachable-inspect working!`, readpacket(packet));
                                
                                retval = gate.connect_with.transmit(packet);
                                
                                console.info(`route end. fetch: ${retval}`);
                                console.groupEnd();

                                if (retval) {break};
                            }
                            
                            break;
                    }

                } else {
                    console.info(`unexpected packet received.`, this, packet);

                }
                console.info(`<${this.name}> return ${retval}!`);

            }
        }
        console.info(`<${this.name}> state: '${this.state}'`);

        return retval;
        /*} else {
            const buffer = [];
            this.gateway.forEach((gate) => {
                if (gate.connect.map((node) => node.name).includes(packet.header.recv)) {
                    buffer.length = 0
                    packet.config({router: this, via: opposite(gate.pos)});
                    console.info(`<${this.name}> send packet.`, readpacket(packet));
                    gate.connect_with.transmit(packet);
                }
                buffer.push([gate, {via: opposite(gate.pos)}]);
            });
            
            for (const [gate, args] of buffer) {
                packet.config({router: this, via: opposite(gate.pos)});
                console.info(`<${this.name}> send packet.`, readpacket(packet));
                gate.connect_with.transmit(packet);
            }
        }*/
    }

}

class BRANCH extends UNIT {

    constructor(axis) {
        super(axis);
        this.html = document.createDocumentFragment();
        this.layer = document.createElement('img');
        this.base = document.createElement('img');
        this.layer.style.zIndex = 1;
        this.base.style.zIndex = 0;
        this.html.appendChild(this.layer)
        this.html.appendChild(this.base)
    }

    /**
     * @param {direction} pos 
     * @param {NODE} node 
     * @param {unit} closest
     */
    __bind__(pos, node, closest) {
        super.__bind__(pos, node, closest);
        this.#update();
    }

    #update() {
        const active = this.active;
        const base = `br_${this.usable}`;
        this.layer.className = `${base} ${active}`;
        this.base.className = base;
    }

    /**
     * @param {Packet} packet 
     */
    transmit(packet) {
        const fetch = [];
        const input_gate = packet.footer.via;
        console.info(`branch[${this.axis}](Gate ${input_gate}) received packet.`);

        this.gateway.forEach((gate) => {
            if (input_gate == gate.pos) {return};
            if ((gate.connect.length === 1) && (packet.header.ignore.includes(gate.connect.at(0).name))) {
                console.info(`Gate '${gate.pos}' blocked this packet depends on ignore list.`)
                return;
            }

            packet.config({router: this, via: opposite(gate.pos)});

            console.info(`branch[${this.axis}](Gate ${gate.pos}) send packet.`);
            fetch.push(gate.connect_with.transmit(packet));

        });
        this.#update();
        return fetch.some((_) => _);
    }

}

class PATH extends BRANCH {}


class EventHandler {

    static buildTree() {

        for (const [clsname, dataset] of Object.entries(database)) {
            for (const [name, info] of Object.entries(dataset)) {
                console.groupCollapsed(`<${name}>`);

                const[x, y] = info.axis;

                const node = new NODE(clsname, info);

                try {
                    routemap[clsname][y].splice(x, 1, node);
                } catch {
                    routemap[clsname][y] = newline(x, 1, node);
                }

                console.groupEnd()
            }
        }

        console.info(routemap);
        return this;

    }

    static renderTree() {
        for (const button of $('div#tab button.tab_button')) {
            const clsname = button.dataset.class;
            const table = document.querySelector(`div#main div#${clsname} .frame.body table`);
            const fragment = document.createDocumentFragment();
            
            for (const row of routemap[clsname]) {
                const tr = document.createElement('tr');
                for (const unit of row) {
                    const td = document.createElement('td');
                    if (unit instanceof UNIT) {
                        td.appendChild(unit.html);
                        unit.html = td.firstChild;
                        if (unit instanceof PATH) {
                            unit.gateway.forEach((/** @type {Gate}*/ gate) => {
                                gate.connect.forEach((/** @type {NODE}*/ node) => {
                                    if (node === gate.connect_with) {
                                        const family = [node.proto.import, node.proto.export].flat();
                                        node.gates[opposite(gate.pos)].connect_with ??= unit;
                                        node.gates[opposite(gate.pos)].connect = (
                                            unit.gateway.flatMap((_gate) => _gate.connect)
                                                        .filter((_node) => family.includes(_node.name))
                                        );
                                    }
                                });
                            });
                        }
                    }
                    tr.appendChild(td);
                }
                fragment.appendChild(tr);
            }

            table.appendChild(fragment);
        }

        return this
    }

    static register() {

        for (const node of $('div#main .frame.body td:has(button)')) {
            node.addEventListener('click', function (event) {
                if (event.target !== event.currentTarget) {return}
                const node = event.target;
                const [x, y] = [node.cellIndex, node.parentNode.rowIndex];
                routemap[page][y][x]?.click();
            });
        }
        return this;
    }
}

function is_defined(...obj) {
    return obj.every((_) => _ !== undefined);
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

const $ = (selector) => document.querySelectorAll(selector)
const str = JSON.stringify
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
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
            "axis": [4, 1],
            "draft": ["S"]
        },
        "Spear Proficiency I": {
            "name": "Spear Proficiency I",
            "level": 1,
            "import": ["Bash"],
            "export": ["Double Bash", "Cheaper Bash"],
            "cost": 1,
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
            "axis": [4, 3],
            "draft": ["N", "S", "W"]
        },
        "Cheaper Bash": {
            "name": "Cheaper Bash",
            "level": 1,
            "import": ["Spear Proficiency I"],
            "export": null,
            "cost": 1,
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
            "axis": [2, 3],
            "draft": ["E"]
        },
        "Double Bash": {
            "name": "Double Bash",
            "level": 2,
            "import": ["Spear Proficiency I"],
            "export": ["Charge"],
            "cost": 1,
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
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
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
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
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
            "axis": [2, 9],
            "draft": ["N", "SSS", "E", "W", "WWSSS"]
        },
        "Cheaper Charge": {
            "name": "Cheaper Charge",
            "level": 1,
            "import": ["Uppercut", "War Scream"],
            "export": ["Uppercut", "War Scream", "Thunder Mastery", "Air Mastery", "Water Mastery"],
            "cost": 1,
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
            "axis": [4, 9],
            "draft": ["SSSS", "SSSSE", "SSSSW", "E", "W"]
        },
        "War Scream": {
            "name": "War Scream",
            "combo": "RRL",
            "level": 0,
            "import": ["Cheaper Charge", "Tougher Skin"],
            "export": ["Cheaper Charge", "Air Mastery", "Fire Mastery"],
            "cost": 1,
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
            "axis": [6, 9],
            "draft": ["N", "SSS", "EESSS", "W"]
        },
        "Heavy Impact": {
            "name": "Heavy Impact",
            "level": 2,
            "import": ["Uppercut"],
            "export": null,
            "cost": 1,
            "lock": null,
            "rely": null,
            "archetype": {"name": null, "req": null},
            "axis": [1, 10],
            "draft": ["N"]
        },
        "Earth Mastery": {
            "name": "Earth Mastery",
            "level": 1,
            "import": ["Uppercut"],
            "export": ["Quadruple Bash"],
            "cost": 1,
            "lock": null,
            "rely": null,
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
            "lock": null,
            "rely": null,
            "archetype": {"name": "Fallen", "req": 0},
            "axis": [2, 13],
            "draft": ["NNN", "S", "EE", "EEE", "EENNN"]
        },
        "Air Mastery": {
            "name": "Air Mastery",
            "level": 1,
            "import": ["Cheaper Charge", "Thunder Mastery", "War Scream"],
            "export": ["Flyby Jab", "Thunder Mastery", "Water Mastery"],
            "cost": 1,
            "lock": null,
            "rely": null,
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [6, 13],
            "draft": ["NNN", "S", "WW", "WWW", "WWNNN"]
        },
        "Fire Mastery": {
            "name": "Fire Mastery",
            "level": 1,
            "import": ["War Scream"],
            "export": ["Flaming Uppercut"],
            "cost": 1,
            "lock": null,
            "rely": null,
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
            "lock": null,
            "rely": null,
            "archetype": {"name": "Battle Monk", "req": 0},
            "axis": [4, 14],
            "draft": ["NNNN", "NE", "NW", "S"]
        }
    },
    "mage": {},
    "assassin": {},
    "shaman": {}
};

main();
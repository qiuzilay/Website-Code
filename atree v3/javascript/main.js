'use strict'

function main() {
    EventHandler.buildTree();
    document.addEventListener('DOMContentLoaded', () => {
        EventHandler.renderTree();
        EventHandler.register();

        console.info('routemap:', routemap);
        console.info('routelogs:', routelogs);
    });
}

class Packet {
    /**
     * @typedef  {("N" | "S" | "E" | "W")}  direction
     * @typedef  {('normal' | 'traceback')} modes
     * @typedef  {(NODE | BRANCH)}  unit        
     * @typedef  {Object}           params      
     * @property {string}           task        Command
     * @property {NODE}             send        Sender Name
     * @property {NODE}             recv        Destination
     * @property {modes}            mode        Transmit mode
     * @property {unit}             router      Transmitter
     * @property {direction}        via         Pass by the gate
     * @property {Object}           data        Attachment
     * @property {String[]}         ignores     Ignore List
     * @property {String}           ignore      Ignore
     * @property {number}           ttl         Time To Live
     * @property {number}           gid         Main-Route ID
     * 
     * @param {params}
     */
    constructor({task, send, recv=null, mode='normal', router, via, data=null, ignores, ttl=-1, gid=globalID}) {
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
         * @property   {number}     gid
         */
        
        /** @type {header} */
        this.header = {
            send: send,
            recv: recv,
            mode: mode,
            __ignore: new Set(ignores),
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
            ttl: ttl,
            gid: gid
        }
    }

    /** @returns {params} */
    get params() {return {
        task: this.payload.task,
        send: this.header.send,
        recv: this.header.recv,
        mode: this.header.mode,
        router: this.footer.router,
        via: this.footer.via,
        data: this.payload.data,
        ignores: this.header.ignore,
        ttl: this.footer.ttl,
        gid: this.footer.gid
    }}

    /** @param {params} */
    config({task, send, recv, mode, router, via, data, ignore, ttl, gid}) {
        if (send !== undefined) {this.header.send = send}
        if (recv !== undefined) {this.header.recv = recv}
        if (mode !== undefined) {this.header.mode = mode}
        if (ignore !== undefined) {this.header.__ignore.add(ignore)}
        if (task !== undefined) {this.payload.task = task}
        if (data !== undefined) {this.payload.data = data}
        if (router !== undefined) {this.footer.router = router}
        if (via !== undefined) {this.footer.via = via}
        if (ttl !== undefined) {this.footer.ttl = ttl}
        if (gid !== undefined) {this.footer.gid = gid}
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
            W: new Gate('W'),
            E: new Gate('E'),
            S: new Gate('S'),
            N: new Gate('N')
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
        this.state = (str(info.axis) === str([4, 1])) ? 'standby' : 'disable';
        this.tooltip = new Tooltip(this);
        this.html = generateElement(`<button class="${this.state}"><img class="${info.level ? `button_${info.level}` : `button_${clsname}`}"></button>`);

        this.#__buildpath__();

        this.html.appendChild(this.tooltip.html[languages[using]]);
    }

    /** @returns {Gate[]} */
    get importGates() {return this.gateway.filter((gate) => gate.connect.some((node) => this.proto.import?.includes(node.name)))}

    /** @returns {Gate[]} */
    get exportGates() {return this.gateway.filter((gate) => gate.connect.some((node) => this.proto.export?.includes(node.name)))}

    /** @returns {NODE[]} */
    get family() {return unique(this.gateway.flatMap((gate) => gate.connect))}

    /** @returns {NODE[]} */
    get importNodes() {return this.family.filter((node) => this.proto.import?.includes(node.name))}

    /** @returns {NODE[]} */
    get exportNodes() {return this.family.filter((node) => this.proto.export?.includes(node.name))}


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
        states.forEach((state) => {(state === this.state) ? this.html.classList.add(state) : this.html.classList.remove(state)});
        return this.state;
    }
    
    click() {
        switch (this.state) {
            case 'lock': break;
            case 'disable': break;
            case 'enable':
                this.set('standby');
                this.#transmitter({
                    gates: this.gateway,
                    packet: new Packet({
                        task: 'standby',
                        send: this.name,
                        gid: globalID++
                    })
                });
                break;
            case 'standby':
                this.set('enable');
                this.#transmitter({
                    gates: this.gateway,
                    packet: new Packet({
                        task: 'enable',
                        send: this.name,
                        gid: globalID++
                    })
                });
                break;
            default: throw Error(`invalid state of Node was detected at <${this.proto.name}>`);
        }
    }

    /**
     * @typedef {object}    host
     * @property {Gate[]}   gates
     * @property {Packet}   packet
     * @property {boolean}  interrupt
     * @property {any}      base        Default return if result collector is empty.
     * @param {host}
     * @returns {boolean | null}
     **/
    #transmitter({gates, packet, interrupt=false, base=null}) {
        
        const collector = [];

        /** @param {Gate} gate */
        const host = (gate) => {
            if (gate.connect.every((node) => packet.header.ignore.includes(node.name))) {return null}
            
            const subpack = new Packet(packet.params).config({
                router: this,
                via: opposite(gate.pos),
                ignore: this.name
            });
            console.groupCollapsed(`<${this.name}> [${this.state}] (Gate ${gate.pos}) Send a packet!`);
            console.info(`packet:`, readpacket(subpack));
            const bin = gate.connect_with.transmit(subpack);
            console.groupEnd();
            console.info(`<${this.name}> [${this.state}] (Gate ${gate.pos}) response: ${bin}`);

            collector.push(bin);
            return bin;
        }

        const GID = packet.footer.gid;
        routelogs[GID] ??= {serial: 0, 'reachable?': {}};
        const SID = routelogs[GID].serial++;
        console.groupCollapsed(`<${this.name}> [${this.state}] Route ${GID}.${SID} start.`, `(task: '${packet.payload.task}')`);
        
        const bin = (interrupt ? gates.some(host) : gates.map(host).some((_) => _)) ? true : bool(collector, {base: base});

        console.groupEnd();
        console.info(`<${this.name}> [${this.state}] Route ${GID}.${SID} end. final: ${bin}, collector: ${str(collector)}`);
        if (!SID) {delete routelogs[GID]};
        return bin;
    }

    /** @param {Packet} packet @returns {(boolean | null)} */
    transmit(packet) {
        console.info(`<${this.name}> [${this.state}] received packet.`, readpacket(packet));
        const router = packet.footer.router;
        const from_parent = this.proto.import?.includes(router.name) ?? false;
        const from_children = this.proto.export?.includes(router.name) ?? false;
        const relative = (from_parent || from_children);
        
        const bin = relative ? this.#manager(packet) : null;
        
        return bin;
    }

    /** @param {Packet} packet @returns {(boolean | null)} */
    #manager(packet) {
        let bin = null;
        const task = packet.payload.task;
        const send = packet.header.send;
        const recv = packet.header.recv;
        console.groupCollapsed(`<${this.name}> [${this.state}] start handling the task '${task}'.`);
        switch (task) {
            case 'disable':
            case 'standby': {
                switch (this.state) {
                    case 'lock': break;
                    case 'disable': break;
                    case 'standby':
                    case 'enable': {
                        const connecting = this.importNodes.filter((node) => !packet.header.ignore.includes(node.name)).some((node) => node.state === 'enable');
                        console.info('connecting:', connecting);
                        if (connecting || !this.proto.import) {
                            const reachable = routelogs.query({
                                gid: packet.footer.gid,
                                task: 'reachable?',
                                nodeName: this.name
                            }) ?? routelogs.write({
                                gid: packet.footer.gid,
                                task: 'reachable?',
                                nodeName: this.name,
                                value: (
                                    this.importGates.length ?
                                    this.#transmitter({
                                        gates: this.importGates,
                                        packet: new Packet({
                                            task: 'reachable?',
                                            send: this.name,
                                            mode: 'traceback',
                                            ignores: Array.from(this.proto.export).filter((name) => !this.proto.import?.includes(name)),
                                            gid: packet.footer.gid
                                        })
                                    }) : true
                                )
                            });
                            if (reachable) {break};
                        }

                        this.set('disable');
                        bin = this.exportGates.length ? this.#transmitter({
                            gates: this.exportGates,
                            packet: packet.config({task: 'disable'})
                        }): null;

                        break;
                    }
                }
                break;
            }
            case 'enable': {
                switch (this.state) {
                    case 'lock': break;
                    case 'disable': {
                        if (this.proto.import?.includes(send)) {
                            this.set('standby');
                        } else {
                            console.info(`enable signal was ignored cause this packet was sent by child node.`)
                        }
                        break;
                    }
                    case 'standby': break;
                    case 'enable': break;
                }
                break;
            }
            case 'reachable?': {
                bin = false;
                switch (this.state) {
                    case 'lock': break;
                    case 'disable': break;
                    case 'standby': break;
                    case 'enable': {
                        bin = routelogs.query({
                            gid: packet.footer.gid,
                            task: 'reachable?',
                            nodeName: this.name
                        }) ?? routelogs.write({
                            gid: packet.footer.gid,
                            task: 'reachable?',
                            nodeName: this.name,
                            value: (
                                this.importGates.length ?
                                this.#transmitter({
                                    gates: this.importGates,
                                    packet: packet,
                                    interrupt: true,
                                    base: false
                                }) : true
                            )
                        });

                        if (!bin) {
                            this.set('disable')
                            this.exportGates.length ? this.#transmitter({
                                gates: this.exportGates,
                                packet: new Packet({
                                    task: 'disable',
                                    send: this.name,
                                    mode: 'normal',
                                    ignores: packet.header.ignore,
                                    gid: packet.footer.gid
                                })
                            }) : null;
                        }
                        break;
                    }
                }
                break;
            }
        }

        
        console.groupEnd();
        console.info(`<${this.name}> [${this.state}] task '${task}' was over.`, `return: ${bin}`);
        return bin;
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

    /** @param {Packet} packet @returns {(boolean | null)} */
    transmit(packet) {
        const input = packet.footer.via;
        console.info(`branch[${this.axis}](Gate ${input}) received packet.`);

        const bin = bool(this.gateway.filter((gate) => gate.pos !== input).map((gate) => {

            if (gate.connect.every((node) => packet.header.ignore.includes(node.name))) {
                console.info(`branch[${this.axis}](Gate ${gate.pos}) blocked the packet.`);
                return null;
            } else {
                console.groupCollapsed(`branch[${this.axis}](Gate ${gate.pos}) send packet.`);
                const bin = gate.connect_with.transmit(
                    packet.config({via: opposite(gate.pos)})
                );
                console.groupEnd();
                console.info(`branch[${this.axis}](Gate ${gate.pos}) got: ${bin}`);
                return bin;
            }

        }));

        this.#update();
        console.info(`branch[${this.axis}](Gate ${input}) return: ${bin}`);
        return bin;
    }

}

class PATH extends BRANCH {}


class Tooltip {

    /**
     * @typedef {('en' | 'zh-TW')} languages
     * @typedef {Object} html
     * @property {HTMLSpanElement} en
     * @property {HTMLSpanElement} zh-TW
     * @param {NODE} node
     **/
    constructor(node) {
        /** @type {NODE} */
        this.master = node;
        /** @type {html} */
        this.html = languages.reduce((object, lang) => ({...object, [lang]: document.createElement('span')}), {});
        languages.forEach(/** @param {languages} lang */(lang) => {
            this.html[lang].classList.add('tooltip');
            Tooltip.#__header__(this, lang);
            Tooltip.#__body__(this, lang);
            Tooltip.#__footer__(this, lang);
        });
    }

    /**
     * @param {Tooltip} tooltip
     * @param {languages} lang
     **/
    static #__header__(tooltip, lang) {
        const info = tooltip.master.proto;
        const header = document.createDocumentFragment();
        const nodeName = document.createElement('span');
        nodeName.appendChild(document.createTextNode(info.name));
        nodeName.className = "style-bold";
        nodeName.style.display = 'block';
        nodeName.style.fontSize = '1.6em';
        nodeName.style.lineHeight = '1.4em';
        switch (info.level) {
            case 0: nodeName.classList.add('color-green'); break;
            case 1: nodeName.classList.add('color-white'); break;
            case 2: nodeName.classList.add('color-gold'); break;
            case 3: nodeName.classList.add('color-pink'); break;
            case 4: nodeName.classList.add('color-red'); break;
        }
        header.appendChild(nodeName);

        if (info.combo) {
            const innerHTML =
                '<span class="color-gray" display="block">' +
                    '<span class="color-gold"> Click Combo: </span>' +
                    Array.from(info.combo).map((btn) => {
                        switch (btn) {
                            case 'L': return '<span class="color-pink">LEFT</span>'
                            case 'R': return '<span class="color-pink">RIGHT</span>'
                        }
                    }).join('-') +
                '</span>';

            header.appendChild(generateElement(innerHTML));
        }

        tooltip.html[lang].appendChild(header);
    }

    /**
     * @param {Tooltip} tooltip
     * @param {languages} lang
     **/
    static async #__body__(tooltip, lang) {
        await window.fetch(`https://raw.githubusercontent.com/qiuzilay/Website-Code/main/atree%20v3/resources/texts/${lang}/${tooltip.master.class}/${tooltip.master.proto.name}.txt`)
                    .catch((error) => console.error(error))
                    .then(/** @param {Response} response */ (response) => response.ok ? response.text() : void(0))
                    .then(/** @param {String}   text     */ (text) => {
                        if (text) {
                            const body = document.createElement('span');
                            body.style.display = 'block';
                            body.style.marginTop = '1em';

                            text.split(regex.reset)
                                .map((subtext) => this.analyst(subtext))
                                .forEach((frag) => {body.appendChild(frag)});

                            tooltip.html[lang].appendChild(body);
                        }
                    });
    }

    /**
     * @param {Tooltip} tooltip
     * @param {languages} lang
     **/
    static #__footer__(tooltip, lang) {}


    /** @param {String} string */
    static analyst(string) {
        const [outer, inner, _] = string.split(regex.text);
        const bin = document.createDocumentFragment();
        if (outer) {bin.appendChild(document.createTextNode(outer))}
        if (inner) {
            const style = this.palette(string.match(regex.general)?.shift());
            style.appendChild(this.analyst(inner));
            bin.appendChild(style);
        }
        return bin;
    }

    /**
     * @param {String} hashtag
     * @return {HTMLSpanElement}
     **/
    static palette(hashtag) {
        const span = document.createElement('span');
        switch (hashtag) {
            case '§0': span.classList.add('color-black'); break;
            case '§1': span.classList.add('color-dark_blue'); break;
            case '§2': span.classList.add('color-dark_green'); break;
            case '§3': span.classList.add('color-dark_aqua'); break;
            case '§4': span.classList.add('color-dark_red'); break;
            case '§5': span.classList.add('color-dark_purple'); break;
            case '§6': span.classList.add('color-gold'); break;
            case '§7': span.classList.add('color-gray'); break;
            case '§8': span.classList.add('color-dark_gray'); break;
            case '§9': span.classList.add('color-blue'); break;
            case '§a': span.classList.add('color-green'); break;
            case '§b': span.classList.add('color-aqua'); break;
            case '§c': span.classList.add('color-red'); break;  
            case '§d': span.classList.add('color-pink'); break;
            case '§e': span.classList.add('color-yellow'); break;
            case '§f': span.classList.add('color-white'); break;
            case '§l': span.classList.add('style-bold'); break;
            case '§n': span.classList.add('style-underline'); break;
            case '§o': span.classList.add('style-smaller'); break;
            case '§h': span.classList.add('style-larger'); break;
            case '§I': span.classList.add('style-oblique'); break;
            case '§B': span.classList.add('style-wrapper'); break;
            case '§U': span.classList.add('symbol-neutral'); break;
            case '§E': span.classList.add('symbol-earth'); break; 
            case '§T': span.classList.add('symbol-thunder'); break; 
            case '§W': span.classList.add('symbol-water'); break; 
            case '§F': span.classList.add('symbol-fire'); break;
            case '§A': span.classList.add('symbol-air'); break;
            case '§M': span.classList.add('symbol-mana'); break;
            case '§Y': span.classList.add('symbol-checkmark'); break;
            case '§N': span.classList.add('symbol-neutral'); break;
            case '§S': span.classList.add('symbol-sword'); break;
            case '§D': span.classList.add('symbol-duration'); break;
            case '§R': span.classList.add('symbol-range'); break;
            case '§O': span.classList.add('symbol-aoe'); break;
            case '§H': span.classList.add('symbol-heart'); break;
            case '§V': span.classList.add('symbol-shield'); break;
            case '§G': span.classList.add('symbol-gap'); break;
        }
        return span;
    }

}

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

/** 
 * @typedef {(boolean | null)}  bool
 * @typedef {Object}    bool_args
 * @property {bool}     base
 * @param {Array<bool>} arr
 * @param {bool_args}
 * @returns {bool}
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

/** @param {Array} arr @returns {Array}  */
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

const languages = ['zh-TW', 'en'];
const using = 0;

var globalID = 0;
const $ = (selector) => document.querySelectorAll(selector);
const str = JSON.stringify;
const regex = {
    reset: new RegExp(/\u00A7r/, 'gus'),
    general: new RegExp(/\u00A7\S/, 'us'),
    text: new RegExp(/\u00A7\S(.+)/, 'us')
}
const routelogs = {
    query: /** @returns {boolean} */ function ({gid, task, nodeName}) {try {return this[gid][task][nodeName]} catch {return undefined}},
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
            "lock": null,
            "rely": null,
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
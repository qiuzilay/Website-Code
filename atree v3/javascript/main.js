'use strict'

/**
 * @typedef {('en' | 'zh-TW')}              Languages
 * @typedef  {("N" | "S" | "E" | "W")}      Direction
 * @typedef  {('normal' | 'traceback')}     Modes
 * @typedef  {(NODE | BRANCH)}              Units
 * @typedef  {('enable' | 'disable' | 'standby' | 'lock')}  States
 * @typedef  {('archer' | 'warrior' | 'mage' | 'assassin' | 'shaman')}  Classes
 * @typedef  {('Boltslinger' | 'Sharpshooter' | 'Trapper' | 'Fallen' | 'Battle Monk' | 'Paladin' | 'Riftwalker' | 'Light Bender' | 'Arcanist' | 'Shadestepper' | 'Trickster' | 'Acrobat' | 'Summoner' | 'Ritualist' | 'Acolyte')}   Archetypes
 */

function main() {
    EventHandler.buildTree();
    document.addEventListener('DOMContentLoaded', () => {
        EventHandler.renderTree();
        EventHandler.register();

        console.info('routemap:', routemap);
        console.info('routelogs:', routelogs);
        console.info('routedata:', routedata);
    });
}

class Packet {
    /**    
     * @typedef  {Object}           params      
     * @property {string}           task        Command
     * @property {NODE}             send        Sender Name
     * @property {NODE}             recv        Destination
     * @property {Modes}            mode        Transmit mode
     * @property {Units}            router      Transmitter
     * @property {Direction}        via         Pass by the gate
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
         * @property   {Modes}          mode
         * @property   {String[]}       ignore
         * @property   {Set<String>}    __ignore
         * 
         * @typedef    {Object}   payload
         * @property   {String}   task
         * @property   {Object}   data
         * 
         * @typedef    {Object}     footer
         * @property   {Units}      router
         * @property   {Direction}  via
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
        /** @type {Direction} */
        this.pos = pos;
        /** @type {Set<NODE>} */
        this._connect = new Set();
        /** @type {Units}} */
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
            W: new Gate('W'),
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
     * @param {Direction}   pos
     * @param {NODE}        node
     * @param {Units}       closest
     */
    __bind__(pos, node, closest) {
        const gate = this.gates[pos]
        gate._connect.add(node)
        try {
            if ((gate.connect_with !== null) && (gate.connect_with !== closest)) {
                throw Error(`Suspecious rebind the "connect_with" property, occurred at [${this.axis}]`);
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
     * @property    {Archetypes}  ndata.archetype.name
     * @property    {number}      ndata.archetype.req
     * @property    {number[]}    ndata.axis
     * @property    {String[]}    ndata.draft
     * 
     * @param {Classes} clsname
     * @param {ndata}   info
     */
    constructor(clsname, info) {
        super(info.axis);
        /** @type {ndata} */
        this.proto = info;
        /** @type {String} */
        this.name = info.name;
        /** @type {Classes} */
        this.class = clsname;
        /** @type {States} */
        this.state = (str(info.axis) === '[4,1]') ? 'standby' : 'disable';
        /** @type {Tooltip} */
        this.tooltip = new Tooltip(this);
        /** @type {HTMLButtonElement} */
        this.buttonElement = document.createElement('button');
        this.buttonElement.classList.add(this.state);
        this.buttonElement.appendChild(generateElement(`<img class="${info.level ? `button_${info.level}` : `button_${clsname}`}">`));

        this.#__buildpath__();
    }

    /** @return {DocumentFragment} */
    get html() {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.buttonElement);
        fragment.appendChild(this.tooltip.html[languages[using]]);
        return fragment;
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
        states.forEach((state) => {(state === this.state) ? this.buttonElement.classList.add(state) : this.buttonElement.classList.remove(state)});
        return this.state;
    }
    
    click() {
        if (!this.buttonElement.classList.contains('lock')) {
            switch (this.state) {
                case 'disable': break;
                case 'enable':
                    this.set('standby');
                    this.#send({
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
                    this.#send({
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
        } else {
            console.warn(`<${this.name}> has been locked.`);
        }
    }

    #update() {}

    /**
     * @typedef {object}    host
     * @property {Gate[]}   gates
     * @property {Packet}   packet
     * @property {boolean}  interrupt
     * @property {any}      base        Default return if result collector is empty.
     * @param {host}
     * @returns {boolean | null}
     **/
    #send({gates, packet, interrupt=false, base=null}) {
        
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
            if (bin && packet.payload.task.endsWith('?')) {
                routelogs.write({
                    gid: subpack.footer.gid,
                    task: subpack.payload.task,
                    nodeName: this.name,
                    value: bin
                })
            }

            return bin;
        }

        const GID = packet.footer.gid;
        routelogs[GID] ??= {serial: 0, 'reachable?': {}};
        const SID = routelogs[GID].serial++;
        console.groupCollapsed(`<${this.name}> [${this.state}] Route ${GID}.${SID} start.`, `(task: '${packet.payload.task}')`);
        
        const bin = (interrupt ? gates.some(host) : gates.map(host).some((_) => _)) ? true : bool(collector, {base: base});

        console.groupEnd();
        console.info(`<${this.name}> [${this.state}] Route ${GID}.${SID} end. collector: ${str(collector)}, final: ${bin}.`);
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
                                    this.#send({
                                        gates: this.importGates,
                                        packet: new Packet({
                                            task: 'reachable?',
                                            send: this.name,
                                            mode: 'traceback',
                                            ignores: this.proto.export?.filter((name) => !this.proto.import?.includes(name)),
                                            gid: packet.footer.gid
                                        })
                                    }) : true
                                )
                            });
                            if (reachable) {break};
                        }

                        this.set('disable');
                        bin = this.exportGates.length ? this.#send({
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
                    case 'disable': break;
                    case 'standby': break;
                    case 'enable': {
                        bin = routelogs.query({
                            gid: packet.footer.gid,
                            task: 'reachable?',
                            nodeName: this.name
                        }) ?? this.proto.import?.some((name) => {
                            return routelogs.query({
                                gid: packet.footer.gid,
                                task: 'reachable?',
                                nodeName: name
                            })
                        }) ? true : routelogs.write({
                            gid: packet.footer.gid,
                            task: 'reachable?',
                            nodeName: this.name,
                            value: (
                                this.importGates.length ?
                                this.#send({
                                    gates: this.importGates,
                                    packet: packet,
                                    interrupt: true,
                                    base: false
                                }) : true
                            )
                        });

                        if (!bin) {
                            this.set('disable')
                            this.exportGates.length ? this.#send({
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
        this.layer = document.createElement('img');
        this.base = document.createElement('img');
        this.layer.style.zIndex = 1;
        this.base.style.zIndex = 0;
    }

    get html() {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.layer);
        fragment.appendChild(this.base);
        return fragment;
    }

    /**
     * @param {Direction} pos 
     * @param {NODE} node 
     * @param {Units} closest
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
        languages.forEach(/** @param {Languages} lang */(lang) => {
            this.html[lang].classList.add('tooltip');
            Tooltip.#__header__(this, lang);
            Tooltip.#__body__(this, lang);
            Tooltip.#__footer__(this, lang);
        });
    }

    /**
     * @param {Tooltip} tooltip
     * @param {Languages} lang
     **/
    static #__header__(tooltip, lang) {
        const info = tooltip.master.proto;
        const header = document.createElement('span');
        const nodeName = document.createElement('span');
        header.classList.add('tooltip-header');
        nodeName.appendChild(document.createTextNode(info.realname ?? info.name));
        nodeName.className = "style-bold";
        nodeName.style.display = 'block';
        nodeName.style.fontSize = '1.5em';
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
     * @param {Languages} lang
     **/
    static #__body__(tooltip, lang) {
        const body = document.createElement('span');
        body.classList.add('tooltip-body');
        body.style.display = 'block';
        body.style.marginTop = '1em';
        tooltip.html[lang].appendChild(body);
        return;
        window.fetch(`https://raw.githubusercontent.com/qiuzilay/Website-Code/main/atree%20v3/resources/texts/${lang}/${tooltip.master.class}/${tooltip.master.proto.name}.txt`)
                    .catch((error) => console.error(error))
                    .then(/** @param {Response} response */ (response) => response.ok ? response.text() : void(0))
                    .then(/** @param {String}   text     */ (text) => {
                        if (text) {
                            text.split(regex.reset)
                                .map((subtext) => this.analyst(subtext))
                                .forEach((frag) => {body.appendChild(frag)});
                        }
                    });
    }

    /**
     * @param {Tooltip} tooltip
     * @param {Languages} lang
     **/
    static #__footer__(tooltip, lang) {
        const info = tooltip.master.proto;
        const footer = document.createElement('span');
        footer.classList.add('tooltip-footer');

        if (info.lock) {
            const lock = document.createElement('span');
            lock.style.display = 'block';
            lock.style.marginTop = '1em';
            lock.appendChild(generateElement(`<span class="color-red">${translate[lang].lock}</span>`));
            info.lock.forEach((name) => {
                lock.appendChild(
                    generateElement(`<span style="display: block;"><span class="color-red">-</span> ${name}</span>`)
                );
            });
            footer.appendChild(lock);

            // add to routedata.<class>.lock
            info.lock.forEach((name) => {
                try {
                    routedata[tooltip.master.class].lock[name].add(tooltip.master);
                } catch {
                    routedata[tooltip.master.class].lock[name] = new Set([tooltip.master]);
                }
            })
        }

        if (info.archetype?.name) {
            const archetype = document.createElement('span');
            archetype.style.display = 'block';
            archetype.style.marginTop = '1em';
            archetype.style.fontSize = '1.25em';
            archetype.classList.add('style-bold');
            switch (info.archetype.name) {
                case 'Boltslinger': archetype.classList.add('color-yellow'); break;
                case 'Sharpshooter': archetype.classList.add('color-pink'); break;
                case 'Trapper': archetype.classList.add('color-dark_green'); break;
                case 'Fallen': archetype.classList.add('color-red'); break;
                case 'Battle Monk': archetype.classList.add('color-yellow'); break;
                case 'Paladin': archetype.classList.add('color-aqua'); break;
                case 'Riftwalker': archetype.classList.add('color-aqua'); break;
                case 'Light Bender': archetype.classList.add('color-white'); break;
                case 'Arcanist': archetype.classList.add('color-dark_purple'); break;
                case 'Shadestepper': archetype.classList.add('color-dark_red'); break;
                case 'Trickster': archetype.classList.add('color-pink'); break;
                case 'Acrobat': archetype.classList.add('color-white'); break;
                case 'Summoner': archetype.classList.add('color-gold'); break;
                case 'Ritualist': archetype.classList.add('color-green'); break;
                case 'Acolyte': archetype.classList.add('color-red'); break;
                default: throw Error('unknown archetype.', tooltip.master.proto);
            }
            archetype.appendChild(document.createTextNode(`${info.archetype.name} Archetype`));
            footer.appendChild(archetype);

            // add to routedata.<class>.archetype
            routedata[tooltip.master.class].archetype[info.archetype.name].add(tooltip.master);
        }
        
        if (info.cost) {
            const cost = document.createElement('span');
            const text = document.createTextNode(translate[lang].cost);
            const value = document.createElement('span');
            cost.classList.add('symbol-checkmark');
            cost.style.display = 'block';
            cost.style.marginTop = '1em';
            value.dataset.update = 'cost';
            value.appendChild(document.createTextNode(info.cost));
            cost.appendChild(text);
            cost.appendChild(value);
            footer.appendChild(cost);
            try {
                routedata[tooltip.master.class].cost[info.cost].add(tooltip.master);
            } catch {
                routedata[tooltip.master.class].cost[info.cost] = new Set([tooltip.master]);
            }
        }

        if (info.rely) {
            const rely = document.createElement('span');
            const name = document.createElement('span');
            rely.style.display = 'block';
            name.dataset.update = 'rely';
            rely.classList.add('symbol-deny');
            name.appendChild(document.createTextNode(info.rely));
            rely.appendChild(document.createTextNode(translate[lang].rely));
            rely.appendChild(name);
            footer.appendChild(rely);
            try {
                routedata[tooltip.master.class].rely[info.rely].add(tooltip.master);
            } catch {
                routedata[tooltip.master.class].rely[info.rely] = new Set([tooltip.master]);
            }
        }

        if (info.archetype?.req) {
            const archetype = document.createElement('span');
            const value = document.createElement('span');
            archetype.classList.add('symbol-deny');
            archetype.style.display = 'block';
            value.dataset.update = 'archetype';
            value.appendChild(document.createTextNode(0));
            archetype.append(translate[lang].archetype(info.archetype.name), value, `/${info.archetype.req}`);
            footer.appendChild(archetype);
        }

        tooltip.html[lang].appendChild(footer);
    }


    /** @param {string} string */
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
     * @param {string} hashtag
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
            case '§N': span.classList.add('symbol-deny'); break;
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

class Archetype extends Set {
    /** @param {Archetypes} name */
    constructor(name) {
        super();
        /** @type {Archetypes} */
        this.name = name;
    }

    get html() {
        const fragment = document.createDocumentFragment();
        const image = document.createElement('img');
        switch (this.name) {
            case 'Boltslinger':
            case 'Battle Monk':
                image.classList.add('archetype-yellow')
                break;
            case 'Sharpshooter':
            case 'Arcanist':
            case 'Trickster':
                image.classList.add('archetype-purple');
                break;
            case 'Trapper':
            case 'Ritualist':
                image.classList.add('archetype-green');
                break;
            case 'Fallen':
            case 'Shadestepper':
            case 'Acolyte':
                image.classList.add('archetype-red');
                break;
            case 'Paladin':
            case 'Riftwalker':
                image.classList.add('archetype-blue');
                break;
            case 'Light Bender':
            case 'Acrobat':
                image.classList.add('archetype-white');
                break;
            case 'Summoner':
                image.classList.add('archetype-gold');
                break;
        }
        fragment.appendChild(image);

        return fragment;
    }
}

class EventHandler {

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

            for (let row = 0; row < 4; row++) {
                const tr = document.createElement('tr');
                for (let col = 0; col < 9; col++) {
                    const td = document.createElement('td');
                    switch (str([row, col])) {
                        case '[2,2]': 
                            td.appendChild(atypes.shift().html);
                            break;
                        case '[2,4]': 
                            td.appendChild(atypes.shift().html);
                            break;
                        case '[2,6]': 
                            td.appendChild(atypes.shift().html);
                            break;
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
                        if (unit instanceof PATH) {
                            unit.gateway.map((gate) => [gate.pos, gate.connect_with])
                                        .filter((/** @type {[Direction, Units]} */[pos, obj]) => obj instanceof NODE)
                                        .forEach((/** @type {[Direction, NODE]} */[pos, node]) => {
                                            const family = [node.proto.import, node.proto.export].flat();
                                            node.gates[opposite(pos)].connect_with ??= unit;
                                            node.gates[opposite(pos)].connect = (
                                                unit.gateway.flatMap((_gate) => _gate.connect)
                                                            .filter((_node) => family.includes(_node.name))
                                            );
                                        });
                            //unit.gateway.forEach((/** @type {Gate}*/ gate) => {
                            //    gate.connect.forEach((/** @type {NODE}*/ node) => {
                            //        if (node === gate.connect_with) {
                            //            const family = [node.proto.import, node.proto.export].flat();
                            //            node.gates[opposite(gate.pos)].connect_with ??= unit;
                            //            node.gates[opposite(gate.pos)].connect = (
                            //                unit.gateway.flatMap((_gate) => _gate.connect)
                            //                            .filter((_node) => family.includes(_node.name))
                            //            );
                            //        }
                            //    });
                            //});
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

/**
 * @param {Array} arr
 * @returns {Array}
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

const languages = ['zh-TW', 'en'];
const using = 0;

var globalID = 0;
const $ = (selector) => document.querySelectorAll(selector);
const str = JSON.stringify;
const translate = {
    "zh-TW": {
        cost: '技能點數：',
        rely: '技能需求：',
        lock: '衝突技能：',
        archetype: /** @param {String} type */ (type) => `最低 ${type} Archetype 點數需求：`,
        archetext: {}
    },
    "en": {
        cost: 'Ability Points: ',
        rely: 'Required Ability: ',
        lock: 'Unlocking will block: ',
        archetype: /** @param {String} type */ (type) => `Min ${type} Archetype: `
    }
};
const regex = {
    reset: new RegExp(/\u00A7r/, 'gus'),
    general: new RegExp(/\u00A7\S/, 'us'),
    text: new RegExp(/\u00A7\S(.+)/, 'us')
};
const routedata = {
    archer: {
        cost: {},
        lock: {},
        rely: {},
        archetype: {
            "Boltslinger": new Archetype('Boltslinger'),
            "Sharpshooter": new Archetype('Sharpshooter'),
            "Trapper": new Archetype('Trapper')
        }
    },
    warrior: {
        cost: {},
        lock: {},
        rely: {},
        archetype: {
            "Fallen": new Archetype('Fallen'),
            "Battle Monk": new Archetype('Battle Monk'),
            "Paladin": new Archetype('Paladin')
        }
    },
    mage: {
        cost: {},
        lock: {},
        rely: {},
        archetype: {
            "Riftwalker": new Archetype('Riftwalker'),
            "Light Bender": new Archetype('Light Bender'),
            "Arcanist": new Archetype('Arcanist')
        }
    },
    assassin: {
        cost: {},
        lock: {},
        rely: {},
        archetype: {
            "Shadestepper": new Archetype('Shadestepper'),
            "Trickster": new Archetype('Trickster'),
            "Acrobat": new Archetype('Acrobat')
        }
    },
    shaman: {
        cost: {},
        lock: {},
        rely: {},
        archetype: {
            "Summoner": new Archetype('Summoner'),
            "Ritualist": new Archetype('Ritualist'),
            "Acolyte": new Archetype('Acolyte')
        }
    }
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
            "import": ["Earth Mastery"],
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
            "import": ["Thunder Mastery"],
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
'use strict';

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
        /** @type {Tooltip} */
        this.tooltip = new Tooltip(this);
        /** @type {HTMLTableCellElement} */
        this.parentElement = undefined;
        /** @type {HTMLButtonElement} */
        this.buttonElement = document.createElement('button');
        /** @type {DOMTokenList} */
        this.state = this.buttonElement.classList;
        this.state.add((str(info.axis) === '[4,1]') ? 'standby' : 'disable');
        this.buttonElement.appendChild(generateElement(`<img class="${info.level ? `button_${info.level}` : `button_${clsname}`}">`));

        this.#__buildpath__();
    }

    /** @return {DocumentFragment} */
    get html() {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.buttonElement);
        fragment.appendChild(this.tooltip.html);
        return fragment;
    }

    get status() {
        return this.buttonElement.className;
    }

    /** @return {Gate[]} */
    get importGates() {return this.gateway.filter((gate) => gate.connect.some((node) => this.proto.import?.includes(node.name)))}

    /** @return {Gate[]} */
    get exportGates() {return this.gateway.filter((gate) => gate.connect.some((node) => this.proto.export?.includes(node.name)))}

    /** @return {NODE[]} */
    get family() {return unique(this.gateway.flatMap((gate) => gate.connect))}

    /** @return {NODE[]} */
    get importNodes() {return this.family.filter((node) => this.proto.import?.includes(node.name))}

    /** @return {NODE[]} */
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

    /** @param {States} state  */
    set(state) {
        const def = ['enable', 'disable', 'standby', 'lock'];

        if (state === undefined) return this.state;
        if (!def.includes(state)) throw Error(`invalid state of Node was detected at <${this.proto.name}>`);

        const history = Array.from(this.state.values());

        def.forEach((name) => {
            switch (name) {
                case 'lock':
                    if (name === state) this.state.toggle('lock');
                    break;
                default:
                    if (name !== state) this.state.remove(name);
                    else this.state.add(name);
            }
        });

        switch (state) {
            case 'enable':
                if (!history.includes('enable')) this.#update('enable');
                break;
            case 'disable':
            case 'standby':
                if (history.includes('enable')) this.#update('disable');
                break;
        }

        return this.state;
    }
    
    click() {
        if (this.#examine()) {
            switch (true) {
                case this.state.contains('enable'):
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
                case this.state.contains('standby'):
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
        }
    }

    #examine() {
        const dataset = routedata[this.class];
        const chain =/** @param {Array<string>} arr */(arr) => {
            const _last = arr.pop();
            return (arr.length > 1) ? [arr.join(', '), _last].join(' and ') : _last;
        };

        switch (true) {
            case this.state.contains('disable'): {
                return false;
            }
            case this.state.contains('lock'): {
                const locker = Array.from(dataset.lock[this.name])
                                    .filter((node) => node.state.contains('enable'))
                                    .map((node) => `<${node.name}>`);
                console.warn(`<${this.name}> This ability was locked by ${chain(locker)}!`);
                return false;
            }
            case this.tooltip.rely?.classList.contains('symbol-deny'): {
                console.warn(`<${this.name}> this ability is dependent on <${this.proto.rely}> !`)
                return false;
            }
            case this.tooltip.cost?.classList.contains('symbol-deny'): {
                console.warn(`<${this.name}> Not enough points to unlock this ability!`)
                return false;
            }
            case this.tooltip.atype?.classList.contains('symbol-deny'): {
                console.warn(`<${this.name}> Not enough "${this.proto.archetype.name}" archetype to unlock this ability!`)
                return false;
            }
        }

        return true;
    }

    /** @param {("enable" | "disable")} state */
    #update(state) {
        const dataset = routedata[this.class];
        const self = this.proto;
        switch (state) {
            case 'enable':
                // update remain apoint value in Orb
                // Orb will handle the part of update the tooltip state all the Nodes have
                dataset.cost.value -= self.cost;

                // update current archetype points in Archetype
                // Archetype will handle the part of update the tooltip state all the Nodes have
                if (self.archetype?.name) dataset.archetype[self.archetype.name].value += 1;
                
                // update tooltip footer "Required Ability" status of all Nodes which rely on this node
                dataset.rely[self.name]?.forEach(/** @param {NODE} node*/(node) => {
                    node.tooltip.rely.className = 'symbol-checkmark';
                });

                // add html 'lock' class to state of all Nodes which is locked by this node
                dataset.lock[self.name]?.forEach(/** @param {NODE} node*/(node) => {
                    node.buttonElement.classList.add('lock');
                });
                break;

            case 'disable':
                // update remain apoint value in Orb
                // Orb will handle the part of update the tooltip state all the Nodes have
                dataset.cost.value += self.cost;

                // update current archetype points in Archetype
                // Archetype will handle the part of update the tooltip state all the Nodes have
                if (self.archetype?.name) dataset.archetype[self.archetype.name].value -= 1;
                
                // update tooltip footer "Required Ability" status of all Nodes which rely on this node
                dataset.rely[self.name]?.forEach(/** @param {NODE} node*/(node) => {
                    node.tooltip.rely.className = 'symbol-deny';
                });

                // remove html 'lock' class to state of all Nodes which is locked by this node
                dataset.lock[self.name]?.forEach(/** @param {NODE} node*/(node) => {
                    node.buttonElement.classList.remove('lock');
                });
                break;

        }
    }

    /**
     * @typedef {object}    host
     * @property {Gate[]}   gates
     * @property {Packet}   packet
     * @property {boolean}  interrupt
     * @property {any}      base        Default return if result collector is empty.
     * @param {host}
     * @return {boolean | null}
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
            console.groupCollapsed(`<${this.name}> [${this.status}] (Gate ${gate.pos}) Send a packet!`);
            console.info(`packet:`, readpacket(subpack));
            const bin = gate.connect_with.transmit(subpack);
            console.groupEnd();
            console.info(`<${this.name}> [${this.status}] (Gate ${gate.pos}) response: ${bin}`);

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
        console.groupCollapsed(`<${this.name}> [${this.status}] Route ${GID}.${SID} start.`, `(task: '${packet.payload.task}')`);
        
        const bin = (interrupt ? gates.some(host) : gates.map(host).some((_) => _)) ? true : bool(collector, {base: base});

        console.groupEnd();
        console.info(`<${this.name}> [${this.status}] Route ${GID}.${SID} end. collector: ${str(collector)}, final: ${bin}.`);
        if (!SID) {delete routelogs[GID]};
        return bin;
    }

    /** @param {Packet} packet @return {(boolean | null)} */
    transmit(packet) {
        console.info(`<${this.name}> [${this.status}] received packet.`, readpacket(packet));
        const router = packet.footer.router;
        const from_parent = this.proto.import?.includes(router.name) ?? false;
        const from_children = this.proto.export?.includes(router.name) ?? false;
        const relative = (from_parent || from_children);
        
        const bin = relative ? this.#manager(packet) : null;
        
        return bin;
    }

    /** @param {Packet} packet @return {(boolean | null)} */
    #manager(packet) {
        let bin = null;
        const task = packet.payload.task;
        const send = packet.header.send;
        const recv = packet.header.recv;
        console.groupCollapsed(`<${this.name}> [${this.status}] start handling the task '${task}'.`);
        switch (task) {
            case 'disable':
            case 'standby': {
                switch (true) {
                    case this.state.contains('disable'): break;
                    case this.state.contains('standby'):
                    case this.state.contains('enable'): {
                        const connecting = this.importNodes.filter((node) => !packet.header.ignore.includes(node.name)).some((node) => node.state.contains('enable'));
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
                switch (true) {
                    case this.state.contains('disable'): {
                        if (this.proto.import?.includes(send)) {
                            this.set('standby');
                        } else {
                            console.info(`enable signal was ignored cause this packet was sent by child node.`)
                        }
                        break;
                    }
                    case this.state.contains('standby'): break;
                    case this.state.contains('enable'): break;
                }
                break;
            }
            case 'reachable?': {
                bin = false;
                switch (true) {
                    case this.state.contains('disable'): break;
                    case this.state.contains('standby'): break;
                    case this.state.contains('enable'): {
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
        console.info(`<${this.name}> [${this.status}] task '${task}' was over.`, `return: ${bin}`);
        return bin;
    }

}
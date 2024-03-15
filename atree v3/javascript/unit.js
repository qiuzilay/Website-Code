'use strict';

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
                  .filter((gate) => gate.connect.some((node) => node.state.contains('enable')))
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
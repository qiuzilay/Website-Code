'use strict';

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

    /** @param {Packet} packet @return {(boolean | null)} */
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
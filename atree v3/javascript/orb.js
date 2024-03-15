'use strict';

class Orb extends Array {
    #image;
    #tooltip;
    #header;
    #descr;
    #suffix;
    #rmain;
    #info;
    #value;
    #_value;

    /** @param {Classes} clsname*/
    constructor(clsname) {
        super();
        
        /** @type {Classes} */
        this.class = clsname;
        /** @type {HTMLTableCellElement} */
        this.parentElement = undefined;
        this.#_value = 45;

        this.#image = document.createElement('img');
        this.#image.className = 'misc orb';
        
        this.#tooltip = document.createElement('span');
        this.#tooltip.className = 'tooltip';
        
        this.#header = document.createElement('span');
        this.#header.className = 'color-dark_aqua style-bold style-larger';
        this.#header.style.display = 'block';
        this.#header.style.lineHeight = '1.4em';

        this.#descr = document.createElement('span');
        this.#descr.className = 'color-gray';
        this.#descr.style.display = 'block';
        
        this.#value = document.createElement('span');
        this.#value.dataset.value = 'apoint';
        this.#value.textContent = this.#_value;

        this.#suffix = document.createElement('span');
        this.#suffix.className = 'color-gray';

        this.#rmain = document.createElement('span');
        this.#rmain.className = 'color-aqua';
        this.#rmain.style.display = 'block';
        this.#rmain.style.marginTop = '1em';
        
        this.#info = document.createElement('span');
        this.#info.className = 'color-dark_gray';
        this.#info.style.display = 'block';
        this.#info.style.lineHeight = 'normal';

        this.#tooltip.appendChild(this.#header);
        this.#tooltip.appendChild(this.#descr);
        this.#tooltip.appendChild(this.#rmain);
        this.#tooltip.appendChild(this.#info);
    }

    /** @return {number} */
    get value() {
        return this.#_value;
    }

    /** @param {number} _val Integer only */
    set value(_val) {
        const incre = this.#_value < _val;
        this.#value.textContent = this.#_value = _val;
        this.filter((_, cost) => incre ? (cost <= _val) : (cost > _val))
            .forEach(
                /** @param {Set<NODE>} group */
                (group, _) => {
                    group.forEach((node) => {
                        node.tooltip.cost.className = incre ? 'symbol-checkmark' : 'symbol-deny';
                    });
                }
            );
    }

    get html() {
        const lang = translate[languages[using]];
        const fragment = document.createDocumentFragment();

        this.#header.textContent = lang.apoint;
        this.#descr.textContent = lang.apoint_descr;
        this.#suffix.replaceChildren(this.#value, '/45');
        this.#rmain.replaceChildren(`\u2726 ${lang.apoint_rmain}`, this.#suffix);
        this.#info.textContent = [lang.apoint_info1, lang.apoint_info2].join('\n');
        
        fragment.appendChild(this.#image);
        fragment.appendChild(this.#tooltip);

        return fragment;
    }
}
'use strict';

class Tooltip {
    /** @type {HTMLSpanElement} */  #tooltip;
    /** @type {HTMLSpanElement} */  #head;
    /** @type {html}            */  #body;
    /** @type {HTMLSpanElement} */  #foot;
    /** @type {HTMLSpanElement} */  #lock;
    /** @type {Text}            */  #lock_prefix;
    /** @type {HTMLSpanElement} */  #cost;
    /** @type {Text}            */  #cost_prefix;
    /** @type {HTMLSpanElement} */  #rely;
    /** @type {Text}            */  #rely_prefix;
    /** @type {HTMLSpanElement} */  #atype;
    /** @type {Text}            */  #atype_prefix;
    /** @type {HTMLSpanElement} */  #atype_value;

    /**
     * @typedef {Object} html
     * @property {HTMLSpanElement} en
     * @property {HTMLSpanElement} zh-TW
     * @param {NODE} node
     **/
    constructor(node) {
        /** @type {NODE} */
        this.master = node;

        this.#tooltip = document.createElement('span');
        this.#tooltip.className = 'tooltip';
        this.#body = languages.reduce((object, lang) => ({...object, [lang]: document.createElement('span')}), {});
        this.#__head__();
        this.#__body__();
        this.#__foot__();        
    }
    
    get cost() {return this.#cost}

    get rely() {return this.#rely}

    get atype() {return this.#atype}

    get atype_value() {
        return this.#atype_value ? parseInt(this.#atype_value.textContent) : undefined;
    }

    /** @param {number} _val */
    set atype_value(_val) {
        this.#atype_value.textContent = _val;
        this.#atype.className = (_val >= this.master.proto.archetype.req) ? 'symbol-checkmark' : 'symbol-deny';
    }

    get html() {
        const lang = translate[languages[using]];
        const node = this.master.proto;

        if (this.#lock_prefix) this.#lock_prefix.textContent = lang.lock;
        if (this.#cost_prefix) this.#cost_prefix.textContent = lang.cost;
        if (this.#rely_prefix) this.#rely_prefix.textContent = lang.rely;
        if (this.#atype_prefix) this.#atype_prefix.textContent = lang.atype(node.archetype.name);
        this.#tooltip.replaceChildren(
            this.#head,
            this.#body[languages[using]],
            this.#foot
        );
        return this.#tooltip;
    }

    #__head__() {
        const node = this.master.proto;

        this.#head = document.createElement('span');
        this.#head.className = 'tooltip-header';

        const name = document.createElement('span');
        name.className = 'style-bold';
        name.textContent = node.realname ?? node.name;
        name.style.display = 'block';
        name.style.fontSize = '1.4em';
        name.style.lineHeight = '1.4em';
        switch (node.level) {
            case 0: name.classList.add('color-green'); break;
            case 1: name.classList.add('color-white'); break;
            case 2: name.classList.add('color-gold'); break;
            case 3: name.classList.add('color-pink'); break;
            case 4: name.classList.add('color-red'); break;
        }
        this.#head.appendChild(name);

        if (node.combo) {
            const combo = document.createElement('span');
            combo.style.display = 'block';

            const descr = document.createElement('span');
            descr.className = 'color-gold';
            descr.textContent = 'Click Combo: ';

            const click = Array.from(node.combo).map((button) => {
                const span = document.createElement('span');
                span.className = 'color-pink';
                switch (button) {
                    case 'L': span.textContent = 'LEFT'; break;
                    case 'R': span.textContent = 'RIGHT'; break;
                }
                return span.outerHTML;
            }).join('-');

            combo.innerHTML = descr.outerHTML + click;
            this.#head.appendChild(combo);
            // const innerHTML =
            //     '<span class="color-gray" display="block">' +
            //         '<span class="color-gold"> Click Combo: </span>' +
            //         Array.from(node.combo).map((button) => {
            //             switch (button) {
            //                 case 'L': return '<span class="color-pink">LEFT</span>'
            //                 case 'R': return '<span class="color-pink">RIGHT</span>'
            //             }
            //         }).join('-') +
            //     '</span>';
            //
            //this.#head.appendChild(generateElement(innerHTML));
        }
    }

    #__body__() {
        const node = this.master;
        languages.forEach(/** @param {Languages} lang */async (lang) => {
            let text;
            try {
                throw new Error(`<${this.master.name}> Fetching was blocked!`);
                text = await window.fetch(`https://raw.githubusercontent.com/qiuzilay/Website-Code/main/atree%20v3/resources/texts/${lang}/${node.class}/${node.name}.txt`)
                                            .catch((error) => console.error(error))
                                            .then(/** @param {Response} response */ (response) => response.ok ? response.text() : void(0));
            } catch (E) {
                console.info(E);
            } finally {
                text?.split(regex.reset)
                     .map((subtext) => Tooltip.analyst(subtext))
                     .forEach((subtext) => this.#body[lang].appendChild(subtext));
                this.#body[lang].className = 'tooltip-body';
                this.#body[lang].style.display = 'block';
                this.#body[lang].style.marginTop = '1em';
            }
        });
    }

    #__foot__() {
        const node = this.master.proto;
        const data = routedata[this.master.class];
        this.#foot = document.createElement('span');
        this.#foot.className = 'tooltip-footer';

        if (node.lock) {
            this.#lock = document.createElement('span');
            this.#lock.className = 'color-red';
            this.#lock.style.display = 'block';
            this.#lock.style.marginTop = '1em';
            
            this.#lock_prefix = document.createTextNode('');

            this.#lock.appendChild(this.#lock_prefix);
            
            node.lock.forEach((name) => {
                this.#lock.appendChild(
                    generateElement(`<span style="display: block;">- <span class="color-gray">${name}</span></span>`)
                );
            });

            this.#foot.appendChild(this.#lock);

            node.lock.forEach((name) => {
                try {
                    data.lock[name].add(this.master);
                } catch {
                    data.lock[name] = new Set([this.master]);
                }
            })
        }

        if (node.archetype?.name) {
            const atype = data.archetype[node.archetype.name];
            const archetype = document.createElement('span');
            archetype.style.display = 'block';
            archetype.style.marginTop = '1em';
            archetype.className = `style-bold style-larger color-${atype.color}`;
            archetype.textContent = `${node.archetype.name} Archetype`;
            this.#foot.appendChild(archetype);

            atype.add(this.master);
        }
        
        if (node.cost) {
            this.#cost = document.createElement('span');
            this.#cost.classList.add('symbol-checkmark');
            this.#cost.style.display = 'block';
            this.#cost.style.marginTop = '1em';
            this.#cost.dataset.update = 'cost';

            this.#cost_prefix = document.createTextNode('');
            
            const value = document.createElement('span');
            value.dataset.value = 'cost';
            value.textContent = node.cost;
            
            this.#cost.append(this.#cost_prefix, value);
            this.#foot.appendChild(this.#cost);
            try {
                data.cost[node.cost].add(this.master);
            } catch {
                data.cost[node.cost] = new Set([this.master]);
            }
        }

        if (node.rely) {
            this.#rely = document.createElement('span');
            this.#rely.style.display = 'block';
            this.#rely.className = 'symbol-deny';
            this.#rely.dataset.update = 'rely';

            this.#rely_prefix = document.createTextNode('');

            const relied = document.createElement('span');
            relied.dataset.value = 'rely';
            relied.textContent = node.rely;
            
            this.#rely.append(this.#rely_prefix, relied);
            this.#foot.appendChild(this.#rely);
            try {
               data.rely[node.rely].add(this.master);
            } catch {
               data.rely[node.rely] = new Set([this.master]);
            }
        }

        if (node.archetype?.req) {
            this.#atype = document.createElement('span');
            this.#atype.className = 'symbol-deny';
            this.#atype.style.display = 'block';
            this.#atype.dataset.update = 'archetype';

            this.#atype_prefix = document.createTextNode('');

            this.#atype_value = document.createElement('span');
            this.#atype_value.dataset.value = 'archetype';
            this.#atype_value.textContent = '0';

            this.#atype.append(this.#atype_prefix, this.#atype_value, `/${node.archetype.req}`);
            this.#foot.appendChild(this.#atype);
        }
    }


    /**
     * @param {string} string
     * @return {string}
     **/
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
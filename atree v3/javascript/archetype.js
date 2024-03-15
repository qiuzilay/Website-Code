'use strict';

class Archetype extends Set {
    /** @type {HTMLSpanElement} */  #image;
    /** @type {HTMLSpanElement} */  #tooltip;
    /** @type {HTMLSpanElement} */  #head;
    /** @type {html} */             #body;
    /** @type {HTMLSpanElement} */  #foot;
    /** @type {HTMLSpanElement} */  #value;
    /** @type {number} */           #_value;
    /** @type {HTMLSpanElement} */  #prefix;
    /** @type {HTMLSpanElement} */  #suffix;

    /**
     * @param {Archetypes}  name
     * @param {Classes}     clsname
     **/
    constructor(name, clsname) {
        super();
        /** @type {Archetypes} */
        this.name = name;
        /** @type {Classes} */
        this.class = clsname;
        /** @type {HTMLTableCellElement} */
        this.parentElement = undefined;
        
        this.#_value = 0;
        this.#tooltip = document.createElement('span');
        this.#body = languages.reduce((object, lang) => ({...object, [lang]: document.createElement('span')}), {});
        this.#image = document.createElement('img');
        switch (this.name) {
            case 'Boltslinger':
            case 'Battle Monk':
                this.color = 'yellow';
                break;
            case 'Sharpshooter':
            case 'Arcanist':
            case 'Trickster':
                this.color = 'pink';
                break;
            case 'Trapper':
            case 'Ritualist':
                this.color = 'green';
                break;
            case 'Fallen':
            case 'Shadestepper':
            case 'Acolyte':
                this.color = 'red';
                break;
            case 'Paladin':
            case 'Riftwalker':
                this.color = 'blue';
                break;
            case 'Light Bender':
            case 'Acrobat':
                this.color = 'white';
                break;
            case 'Summoner':
                this.color = 'gold';
                break;
        }
        this.#tooltip.classList.add('tooltip');
        this.#image.classList.add('archetype');
        this.#image.classList.add(this.color);
        this.#__head__();
        this.#__body__();
        this.#__foot__();
    }

    /** @return {number} */
    get value() {
        return this.#_value;
    }

    /** @param {number} _val Integer only */
    set value(_val) {
        this.#_value = _val;
        this.#value.textContent = _val;
        this.forEach(/** @param {NODE} node*/(node) => {
            if (node.tooltip.atype) node.tooltip.atype_value = _val;
        });
    }

    #__head__() {
        this.#head = document.createElement('span');
        this.#head.className = `color-${this.color} style-bold`;
        this.#head.textContent = `${this.name} Archetype`;
        this.#head.style.display = 'block';
        this.#head.style.fontSize = '1.4em';
        this.#head.style.lineHeight = '1.4em';
        return this;
    }

    #__body__() {
        languages.forEach(/** @param {Languages} lang */async (lang) => {
            const text = await window.fetch(`https://raw.githubusercontent.com/qiuzilay/Website-Code/main/atree%20v3/resources/texts/${lang}/${this.class}/Archetype%20-%20${this.name}.txt`)
                                        .catch((error) => console.error(error))
                                        .then(/** @param {Response} response */ (response) => response.ok ? response.text() : void(0));
            this.#body[lang].style.display = 'block';
            this.#body[lang].style.marginTop = '1em';
            this.#body[lang].appendChild(Tooltip.analyst(text));
        });
    }

    #__foot__() {
        this.#foot = document.createElement('span');
        this.#foot.className = 'symbol-checkmark';
        this.#foot.style.display = 'block';
        this.#foot.style.marginTop = '1em';
        this.#foot.dataset.update = 'atype_unlocked';

        this.#prefix = document.createTextNode('');

        this.#value = document.createElement('span');
        this.#value.dataset.value = 'atype_unlocked';
        this.#value.textContent = 0;

        this.#suffix = document.createTextNode('/');

        this.#foot.replaceChildren(this.#prefix, this.#value, this.#suffix);
    }

    get html() {
        const lang = translate[languages[using]];
        const fragment = document.createDocumentFragment();

        this.#prefix.textContent = lang.atype_unlocked;
        this.#suffix.textContent = `/${this.size}`;
        
        this.#tooltip.replaceChildren(
            this.#head,
            this.#body[languages[using]],
            this.#foot
        );
        
        fragment.appendChild(this.#image);
        fragment.appendChild(this.#tooltip);

        return fragment;
    }
}
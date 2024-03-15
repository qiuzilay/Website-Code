'use strict'
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

    /** @return {params} */
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
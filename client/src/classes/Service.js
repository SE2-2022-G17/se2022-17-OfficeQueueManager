export default class Service {

    /**
     * Constructor function for new Riddle objects
     * @param {number} id
     * @param {string} name
     * @param {string} description
     * @param {string} tag
     * @param {string} time
     */
    constructor(id, name, description, tag, time) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tag = tag;
        this.time = time;
    }
}

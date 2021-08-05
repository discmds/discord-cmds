const { Message } = require('discord.js');
const GInteraction = require('./GInteraction');

/**
 * The MessageComponentInteraction class
 */
class MessageComponentInteraction extends GInteraction {

    /**
     * Creates new MessageComponentInteraction instance
     * @param {Client} client
     * @param {Object} data 
    */
    constructor(client, data) {
        super(client, data)

        /**
         * componentType
         * @type {Number}
         */
        this.componentType = data.data.component_type

        /**
         * selectMenuId
         * @type {string}
         * @deprecated
         */
        this.selectMenuId = data.data.values ? data.data.custom_id : undefined;

        /**
         * valueId
         * @type {Array}
         * @deprecated
         */
        this.valueId = data.data.values ? data.data.values : undefined;

        /**
         * id
         * @type {Number}
         * @deprecated
         */
        this.id = data.data.custom_id;

        /**
         * customId
         * @type {Number}
         */
         this.customId = data.data.custom_id;

        /**
         * clicker
         * @type {InteractionEventClicker}
         * @deprecated
         */
        this.clicker = {
            member: this.member,
            user: this.author,
            id: this.author.id,
        };

        /**
         * message
         * @type {GMessage}
         */
        this.message = new Message(this.client, data.message, this.channel)
    }

  /**
   * The component which was interacted with
   * @type {MessageActionRow}
   * @readonly
   */
   get component() {
    return (
      this.message.components
        .flatMap(row => row.components)
        .find(component => (component.customId ?? component.custom_id) === this.customId) ?? null
    );
  }
}

module.exports = MessageComponentInteraction;
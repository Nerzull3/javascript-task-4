'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    /**
     * Словарь подписок на события
     */
    const subscriptionData = {};

    /**
     * Получить список из дочерних событий и самого события из словаря
     * @param {String} event
     * @returns {Object}
     */
    function getChildrenEvents(event) {
        return Object.keys(subscriptionData).filter(currentEvent =>
            currentEvent.startsWith(event + '.') || currentEvent === event);
    }

    /**
     * Добавить подписку в словарь событий
     * @param {String} event
     * @param {Object} subscription
     */
    function addSubscription(event, subscription) {
        if (subscriptionData[event]) {
            subscriptionData[event].push(subscription);
        } else {
            subscriptionData[event] = [subscription];
        }
    }

    /**
     * Попытаться вызвать обработчик handler
     * @param {Object} person
     */
    function tryToCallHandler(person) {
        if (typeof person.counter === 'undefined' && typeof person.frequency === 'undefined' ||
            checkCounterProperty(person) ||
            checkFrequencyProperty(person)) {
            person.handler.call(person.information);
        }
    }

    /**
     * Проверить условия на свойство counter
     * @param {Object} person
     * @returns {boolean}
     */
    function checkCounterProperty(person) {
        return person.counter && person.counter-- !== 0;
    }

    /**
     * Проверить условия на свойство frequency
     * @param {Object} person
     * @returns {boolean}
     */
    function checkFrequencyProperty(person) {
        return person.frequency && person.eventCounter++ % person.frequency === 0;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            addSubscription(event, { information: context, handler: handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            getChildrenEvents(event).forEach(currentEvent => {
                subscriptionData[currentEvent] = subscriptionData[currentEvent].filter(
                    person => person.information !== context);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            if (Object.keys(subscriptionData).includes(event)) {
                subscriptionData[event].forEach(person => tryToCallHandler(person));
            }
            let eventParent = event.replace(/\.\w+$/, '');
            if (eventParent !== event) {
                this.emit(eventParent);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            addSubscription(event, { information: context, handler: handler, counter: times });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            addSubscription(
                event,
                { information: context, handler: handler, frequency: frequency, eventCounter: 0 }
            );

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};

'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const subscribeData = {};

    function getChildrenEvents(event) {
        return Object.keys(subscribeData).filter(currentEvent =>
            currentEvent.startsWith(event + '.')
        );
    }

    function addSubscribe(event, subscribe) {
        if (subscribeData[event]) {
            subscribeData[event].push(subscribe);
        } else {
            subscribeData[event] = [subscribe];
        }
    }

    function tryToCallHandler(person) {
        if (!person.counter && !person.frequency ||
            checkCounterProperty(person) ||
            checkFrequencyProperty(person)) {
            person.handler.call(person.name);
        }
    }

    function checkCounterProperty(person) {
        return person.counter && person.counter-- !== 0;
    }

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
            addSubscribe(event, { name: context, handler: handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            [event].concat(getChildrenEvents(event)).forEach(currentEvent => {
                subscribeData[currentEvent] =
                    subscribeData[currentEvent].filter(person => person.name !== context);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            if (Object.keys(subscribeData).includes(event)) {
                subscribeData[event].forEach(person => tryToCallHandler(person));
            }
            let eventParent = event.replace(/\.[\w.]+$/, '');
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
            addSubscribe(event, { name: context, handler: handler, counter: times });

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
            addSubscribe(
                event,
                { name: context, handler: handler, frequency: frequency, eventCounter: 0 }
            );

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};

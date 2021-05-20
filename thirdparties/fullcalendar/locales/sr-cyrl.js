(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {}, global.FullCalendarLocales['sr-cyrl'] = factory()));
}(this, (function () { 'use strict';

    var srCyrl = {
        code: "sr-cyrl",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
        },
        buttonText: {
            prev: "Претходна",
            next: "следећи",
            today: "Данас",
            month: "Месец",
            week: "Недеља",
            day: "Дан",
            list: "Планер"
        },
        weekText: "Сед",
        allDayText: "Цео дан",
        moreLinkText: function (n) {
            return "+ још " + n;
        },
        noEventsText: "Нема догађаја за приказ"
    };

    return srCyrl;

})));

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {}, global.FullCalendarLocales.hr = factory()));
}(this, (function () { 'use strict';

    var hr = {
        code: "hr",
        week: {
            dow: 1,
            doy: 7 // The week that contains Jan 1st is the first week of the year.
        },
        buttonText: {
            prev: "Prijašnji",
            next: "Sljedeći",
            today: "Danas",
            month: "Mjesec",
            week: "Tjedan",
            day: "Dan",
            list: "Raspored"
        },
        weekText: "Tje",
        allDayText: "Cijeli dan",
        moreLinkText: function (n) {
            return "+ još " + n;
        },
        noEventsText: "Nema događaja za prikaz"
    };

    return hr;

})));

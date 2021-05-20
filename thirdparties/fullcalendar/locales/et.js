(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {}, global.FullCalendarLocales.et = factory()));
}(this, (function () { 'use strict';

    var et = {
        code: "et",
        week: {
            dow: 1,
            doy: 4 // The week that contains Jan 4th is the first week of the year.
        },
        buttonText: {
            prev: "Eelnev",
            next: "Järgnev",
            today: "Täna",
            month: "Kuu",
            week: "Nädal",
            day: "Päev",
            list: "Päevakord"
        },
        weekText: "näd",
        allDayText: "Kogu päev",
        moreLinkText: function (n) {
            return "+ veel " + n;
        },
        noEventsText: "Kuvamiseks puuduvad sündmused"
    };

    return et;

})));

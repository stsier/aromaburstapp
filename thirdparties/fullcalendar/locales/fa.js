(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.FullCalendarLocales = global.FullCalendarLocales || {}, global.FullCalendarLocales.fa = factory()));
}(this, (function () { 'use strict';

    var fa = {
        code: "fa",
        week: {
            dow: 6,
            doy: 12 // The week that contains Jan 1st is the first week of the year.
        },
        direction: 'rtl',
        buttonText: {
            prev: "قبلی",
            next: "بعدی",
            today: "امروز",
            month: "ماه",
            week: "هفته",
            day: "روز",
            list: "برنامه"
        },
        weekText: "هف",
        allDayText: "تمام روز",
        moreLinkText: function (n) {
            return "بیش از " + n;
        },
        noEventsText: "هیچ رویدادی به نمایش"
    };

    return fa;

})));

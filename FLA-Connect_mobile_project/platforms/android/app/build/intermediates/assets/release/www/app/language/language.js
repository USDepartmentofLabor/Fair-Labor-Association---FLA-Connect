var isLangSelected = window.localStorage['language'];
var lang = window.navigator.language || window.navigator.userLanguage;
var language = 'tr';
if (lang === 'en-US') {
    language = 'en';
} else if (lang === 'tr-TR') {
    language = 'tr';
}
if (!isLangSelected) {
    window.localStorage['language'] = language;
    isLangSelected = language;
}
console.log(isLangSelected);
var $language = {
    code: isLangSelected,
    dictionary: [],
    translate: function(keyword) {
        var translated = $language.dictionary[keyword];

        if (translated === undefined) {
            translated = keyword;
        }
        return translated;
    }
};

$language.dictionary = window[$language.code];
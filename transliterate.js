;(function (global) { 
	'use strict';

	var 
		  obp = Object.prototype
		, toString = obp.toString
	;

	transliterate.log = log;
	global.transliterate = transliterate;

	function transliterate(str, rules, transliterateFn) {
		var log = transliterate.log;

		str = str || '';

		rules = rules || getDefaultRules();
		transliterateFn = isFn(transliterateFn) ? transliterateFn : defaultTransliterate;

		for (var ruleNumber in rules) {
			var 
				  rule = rules[ruleNumber]
				, from = rule[0]
				, to = rule[1]
			;

			str = str.replace(new RegExp(from, 'gi'), replaceMatched);
		}

		log("str=" + str);
		return str;

		function replaceMatched(matched) {
				var 
					replacedTo = transliterateFn(matched, to, rule).split('')
				;

				log("from=" + matched + "matched=" + matched + " replacedTo=" + replacedTo);

				if (from.length === replacedTo.length) {
					
					for(var charNum in from.split('')) {
						replacedTo[charNum] = isUpper(matched[charNum]) ?
								replacedTo[charNum].toUpperCase()
								:
								replacedTo[charNum].toLowerCase();
					}
				}

				return replacedTo.join('');
			}
	}

	function getDefaultRules() {
		var 
			  rules = []

			, russianLetters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

			, softSign = 'Ь'
			, hardSign = 'Ъ'

			, signs = [ softSign, hardSign ]

			, vowels = 'АОУИЫЭЯЕЮ'.split('')
			, softVowels = 'ЯЮЕЁ'.split('')

			, consonants = arrDiff(russianLetters, signs.concat(vowels))

			, consonantsTo = {
				  'Б': 'B'
				, 'В': 'V'
				, 'Г': 'G'
				, 'Д': 'D'
				, 'Ж': 'Ƶ'
				, 'З': 'Z'
				, 'Й': 'J'
				, 'К': 'K'
				, 'Л': 'L'
				, 'М': 'M'
				, 'Н': 'N'
				, 'П': 'P'
				, 'Р': 'R'
				, 'С': 'S'
				, 'Т': 'T'
				, 'Ф': 'F'
				, 'Х': 'H'
				, 'Ц': 'C'
				, 'Ч': 'Č'
				, 'Ш': 'Ş'
				, 'Щ': 'Š'
			}
			, vowelsTo = {
				  'А': 'A'
				, 'О': 'O'
				, 'У': 'U'
				, 'И': 'I'
				, 'Ы': 'Y'
				, 'Э': 'Ē'
				, 'Е': 'E'
				, 'Ё': 'Ö'
				, 'Ю': 'Ü'
				, 'Я': 'Ä'
			}
		;

		consonants.forEach(function (consonant) {
			softVowels.forEach(function (softVowel) {
				var 
					  cyrConsonantSignSoftVowel = consonant + softSign + softVowel
				  	, to = consonantsTo[consonant] + 'í' + vowelsTo[softVowel]
					, rule = [ cyrConsonantSignSoftVowel, to]
				;

				rules.push(rule);	
			});

			rules.push([ consonant + softSign,  consonantsTo[consonant] + 'í' ]);	
			rules.push([ consonant + hardSign,  consonantsTo[consonant]]);
		});

		for (var cyrKey in consonantsTo) {
			rules.push([ cyrKey, consonantsTo[cyrKey] ]);
		}

		for (var cyrVowelKey in vowelsTo) {
			rules.push([ cyrVowelKey, vowelsTo[cyrVowelKey] ]);
		}

		return rules;
	}

	function isFn(fn) {
		return toString.apply(fn) === '[object Function]';
	}

	function defaultTransliterate(from, to) { return to; }

	function arrDiff(b, a) {
	    return b.filter(function(i) {return a.indexOf(i) < 0;});
	}

	function isUpper(str) {
		str = str || '';

		return str === str.toUpperCase();
	}

	function log(str) {
		global.console.log(str);
	}
} (this));
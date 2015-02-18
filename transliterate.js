;(function (global) { 
	'use strict';

	var 
		  obp = Object.prototype
		, toString = obp.toString
	;

	global.transliterate = transliterate;

	function transliterate(str, rules, transliterateFn) {
		str = str || '';

		rules = rules || getDefaultRules();
		transliterateFn = isFn(transliterateFn) ? transliterateFn : defaultTransliterate;

		for (var ruleNumber in rules) {
			var 
				  rule = rules[ruleNumber]
				, from = rule[0]
				, to = rule[1]

				, replacedTo = transliterateFn(from, to)
			;

			if (replacedTo) { 
				str = str.replace(from, replacedTo);
			}
		}

		return str;
	}

	function getDefaultRules() {
		var 
			  rules = []

			, russianLettersUpper = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')
			, russianLettersLower = russianLettersUpper.map(function (letter) { return letter.toLowerCase(); })

			, softSign = 'Ь'
			, hardSign = 'Ъ'

			, signs = [ softSign, hardSign ]

			, vowels = 'АОУИЫЭЯЕЮ'.split('')
			, softVowels = 'ЯЮЕЁ'.split('')

			, consonants = arrDiff(russianLettersUpper, signs.concat(vowels))

			, consonantsTo = {
				  'Б': 'B'
				, 'В': 'V'
				, 'Г': 'G'
				, 'Д': 'D'
				, 'Ж': 'Ż'
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
				, 'Ш': '?'
				, 'Щ': 'Š'

				, 'б': 'b'
				, 'в': 'v'
				, 'г': 'g'
				, 'д': 'd'
				, 'ж': 'ż'
				, 'з': 'z'
				, 'й': 'j'
				, 'к': 'k'
				, 'л': 'l'
				, 'м': 'm'
				, 'н': 'n'
				, 'п': 'p'
				, 'р': 'r'
				, 'с': 's'
				, 'т': 't'
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

				, 'а': 'a'
				, 'о': 'o'
				, 'у': 'u'
				, 'и': 'i'
				, 'ы': 'y'
				, 'э': 'ē'
				, 'е': 'e'
				, 'ё': 'ö'
				, 'ю': 'ü'
				, 'я': 'ä'
			}
		;

		consonants.forEach(function (consonant) {
			softVowels.forEach(function (softVowel) {
				var 
					  cyrConsonantSignSoftVowel = consonant + softSign + softVowel
				  	, to = consonantsTo[consonant] + '´' + vowelsTo[softVowel]
					, rule = [ cyrConsonantSignSoftVowel, to]

					, lowerConsSignVowel = consonant.toLowerCase() + softSign.toLowerCase() + softVowel.toLowerCase()
					, toLower = consonantsTo[consonant.toLowerCase()] + '´' + vowelsTo[softVowel.toLowerCase()]

					, lowerRule = [ lowerConsSignVowel, toLower ]
				;

				rules.push(rule);	
				rules.push(lowerRule);
			});	
		});

		for (var cyrKey in consonantsTo) {
			rules.push([ cyrKey, consonantsTo[cyrKey] ]);
		}

		for (var cyrKey in vowelsTo) {
			rules.push([ cyrKey, vowelsTo[cyrKey] ]);
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
} (this));
;(function (global) { 
	'use strict';

	var 
		  defaultBufferSizeChars = 100

		, ruleFrom = 0
		, ruleTo = 1

		, cachedRules = []
	;

	transliterate.log = log;

	exportGlobal('transliterate', transliterate);
	exportGlobal('transliterateAsync', transliterateAsync);

	function transliterate(str, rules) {
		str = str || '';
		rules = rules || getDefaultRules();
		
		str = replacePartSync(str, rules);

		return str;	
	}

	function transliterateAsync(str, transliterateAsyncFn, bufferSizeChars, rules) {
		var 
			  i = 0
			, buffered = str.substr(0, bufferSizeChars)
		;
		
		str = str || '';
		rules = rules || getDefaultRules();
		bufferSizeChars = bufferSizeChars || defaultBufferSizeChars;

		async(function generateBufferClosure(buffered, i) {
			return function replaceAsync() {
				var 
					  replaced = replacePartSync(buffered, rules)
				;

				transliterateAsyncFn(buffered, replaced, i);

				i = i + bufferSizeChars;
				buffered = str.substr(i, bufferSizeChars);

				if (i < str.length) {
					async(generateBufferClosure(buffered, i));	
				}
			};	
		} (buffered, i));	
	}

	function replacePartSync(str, rules) {
		var 
			  log = getLog()
			, replaced = str
		;

		for (var ruleNumber in rules) {
			var 
				  rule = rules[ruleNumber]
				, from = rule[ruleFrom]
				, to = rule[ruleTo]
			;

			replaced = replaced.replace(new RegExp(from, 'gi'), replaceMatched);
		}

		return replaced;

		function replaceMatched(matched) {
			log("from=" + from + " to=" + to + " matched=" + matched);

			var replaced = to.split('');

			if (from.length !== to.length) {
				return replaced;
			}

			for(var charNum in from.split('')) {

				switch(isUpper(matched[charNum])) {

					case true:
						replaced[charNum] = replaced[charNum].toUpperCase();
						break;

					default:
						replaced[charNum] = replaced[charNum].toLowerCase();
				}
			}

			return replaced.join('');
		}
	}

	function getDefaultRules() {
		if (cachedRules.length) { 
			return cachedRules;
		}

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

			, signsTo = {
				  'Ь': 'í'
				, 'Ъ': ''
			}
		;

		consonants.forEach(function (consonant) {
			
			softVowels.forEach(function (softVowel) {
				var 
					  cyrConsonantSignSoftVowel = consonant + softSign + softVowel
				  	, to = consonantsTo[consonant] + 'í' + vowelsTo[softVowel]
				;

				addRule(cyrConsonantSignSoftVowel, to);
			});

			objForEach(signsTo, function (signTo, signFrom) {
				addRule(consonant + signFrom, consonantsTo[consonant] + signTo);
			});
		});

		[ consonantsTo, vowelsTo, signsTo ].forEach(function (letters) {
			for (var key in letters) {
				addRule(key, letters[key]);	
			}
		});

		cachedRules = rules;

		return rules;

		function addRule(from, to) {
			var rule = [];

			rule[ruleFrom] = from;
			rule[ruleTo] = to;

			rules.push(rule);
		}
	}

	function arrDiff(b, a) {
	    return b.filter(function(i) {return a.indexOf(i) < 0;});
	}

	function isUpper(str) {
		str = str || '';

		return str === str.toUpperCase();
	}

	function log() {}

	function async(fn) {
		setTimeout(fn, 0);
	}

	function objForEach(obj, eachFn) {
		for (var key in obj) {
			eachFn(obj[key], key, obj);
		}
	}

	function getLog() {
		return transliterate.log;
	}

	function exportGlobal(exportName, whatToExport) {
		global[exportName] = whatToExport;
	}

} (this));
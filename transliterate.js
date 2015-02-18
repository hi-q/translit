;(function (global) { 
	'use strict';

	transliterate.log = log;

	/* Export */

	exportGlobal('transliterate', transliterate);
	exportGlobal('transliterateAsync', transliterateAsync);

	function transliterate(str, rules) {
		var transliterator = new Transliterator(rules);

		return transliterator.transliterate(str);
	}

	function transliterateAsync(str, transliterateAsyncFn, bufferSizeChars, rules) {
		var transliterator = new TransliteratorAsync(transliterateAsyncFn, bufferSizeChars, rules);

		return transliterator.transliterate(str);
	}

	/* Export End*/

	function ITransliterator(rules) { 
		this._cachedRules = [];
		this.rules = rules || this._getDefaultRules();
		this.log = transliterate.log;
	}

	ITransliterator.prototype.transliterate = function () { 
		throw new Error('Not implemented!');
	};

	ITransliterator.prototype._getDefaultRules = function () { 
		var _cachedRules = this._cachedRules;

		if (_cachedRules.length) { 
			return _cachedRules;
		}

		var 
			  russianRules = new RussianRules()
			, rules = russianRules.rules
		;

		this._cachedRules = rules;

		return rules;
	};

	ITransliterator.prototype._replaceStringPart = function (str) {
		var log = this.log;

		this.rules.forEach(function (rule) {
			var 
				  from = rule.from
				, to = rule.to
			;

			// TODO: sure, this is slow and should be fixed ASAP
			str = str.replace(new RegExp(from, 'gi'), function (matched) {
				return replaceMatched(matched, from, to);
			});
		});

		return str;

		function replaceMatched(matched, from, to) {
			log("replaceMatched(): from=" + from + " to=" + to + " matched=" + matched);

			var replaced = to.split('');

			if (from.length !== to.length) {
				return replaced.join('');
			}

			from.split('').forEach(function (char, charNum) {
				var 
					  matchedChar = matched[charNum]
					, replacedChar = replaced[charNum]
				;

				replaced[charNum] = isUpper(matchedChar) ? replacedChar.toUpperCase() : replacedChar.toLowerCase();
			});

			return replaced.join('');
		}
	};

	function Transliterator(rules) {
		inherit(ITransliterator, this, rules);	
	}

	Transliterator.prototype = Object.create(ITransliterator.prototype);

	Transliterator.prototype.transliterate = function (str) {
		str = str || '';
		str = this._replaceStringPart(str);

		return str;	
	};

	function TransliteratorAsync(transliterateAsyncFn, bufferSizeChars, rules) {
		var defaultBufferSizeChars = 100;

		inherit(ITransliterator, this, rules);
		this.bufferSizeChars = bufferSizeChars || defaultBufferSizeChars;
		this.transliterateAsyncFn = transliterateAsyncFn;
	}

	TransliteratorAsync.prototype = Object.create(ITransliterator.prototype);

	TransliteratorAsync.prototype.transliterate = function (str) { 
		var 
			
			  transliterator = this
			, bufferSizeChars = transliterator.bufferSizeChars

			, i = 0
			, buffered = str.substr(0, bufferSizeChars)
		;
		
		str = str || '';

		async(function generateBufferClosure(buffered, i) {
			return function replaceAsync() {
				var 
					   replaced = transliterator._replaceStringPart(buffered)
				;

				transliterator.transliterateAsyncFn(buffered, replaced, i);

				i = i + bufferSizeChars;
				buffered = str.substr(i, bufferSizeChars);

				if (i < str.length) {
					async(generateBufferClosure(buffered, i));	
				}
			};	
		} (buffered, i));	
	};

	function Rule(from, to) {
		this.from = from;
		this.to = to;
	}

	/* Russian specific rules */

	function RussianRules() {
		this.letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
		this.signs = 'ЬЪ'.split('');
		this.vowels = 'АОУИЫЭЯЕЁЮ'.split('');
		this.consonants = arrDiff(this.letters, this.signs.concat(this.vowels));

		this.consonantsTo = {
			  'Б': 'B'
			, 'В': 'V'
			, 'Г': 'G'
			, 'Д': 'D'
			, 'Ж': 'Ẓ'
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
			, 'Ч': 'Ç'
			, 'Ш': 'Ṣ'
			, 'Щ': 'Ş'
		};

		this.vowelsTo = {
			  'А': 'A'
			, 'О': 'O'
			, 'У': 'U'
			, 'И': 'I'
			, 'Ы': 'Y'
			, 'Э': 'Ę'
			, 'Е': 'E'
			, 'Ё': 'Ǫ'
			, 'Ю': 'Ų'
			, 'Я': 'Ą'
		};

		this.signsTo = {
			  'Ь': 'Í'
			, 'Ъ': ''
		};

		this.rules = [];

		this.addConsonantSoftSignSoftVowelRules();
		this.addEndSignsRules();
		this.addSeparateLettersRules();
	}

	RussianRules.prototype.addRule = function (from, to) { 
		var rule = new Rule(from, to);
		this.rules.push(rule);
	};

	RussianRules.prototype.addConsonantSoftSignSoftVowelRules = function () {
		var rules = this;

		rules.consonants.forEach(function (consonant) {
			
			rules.vowels.forEach(function (vowel) {
				
				rules.signs.forEach(function (sign) {
					var 
						  cyrConsonantSignSoftVowel = consonant + sign + vowel
					  	, to = rules.consonantsTo[consonant] + rules.signsTo[sign] + rules.vowelsTo[vowel]
					;

					rules.addRule(cyrConsonantSignSoftVowel, to);
				});
			});
		});
	};

	RussianRules.prototype.addEndSignsRules = function () {
		var rules = this;

		rules.consonants.forEach(function (consonant) {
			objForEach(rules.signsTo, function (signTo, signFrom) {
				rules.addRule(consonant + signFrom, rules.consonantsTo[consonant] + signTo);
			});
		});
	};

	RussianRules.prototype.addSeparateLettersRules = function () {
		var rules = this;

		[
			  rules.consonantsTo
			, rules.vowelsTo
			, rules.signsTo 

		].forEach(function (letters) {
			for (var key in letters) {
				rules.addRule(key, letters[key]);	
			}
		});
	};

	/* End russian specific rules */

	/* Private helpers below*/

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

	function exportGlobal(exportName, whatToExport) {
		global[exportName] = whatToExport;
	}

	function inherit(Base, _this) {
		var args = Array.prototype.slice.call(arguments, 2, arguments.length);

		return Base.apply(_this, args);
	}

} (this));
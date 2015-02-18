;(function (global) { 

	var 
		  obp = Object.prototype
		, toString = obp.toString
	;

	global.transliterate = transliterate;

	function transliterate(str, rules, transliterateFn) {
		var rules, transliterateFn;

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
		var rules = [];

		rules.push([ 'Бь', 'B´' ]);

		return rules;
	}

	function isFn(fn) {
		return toString.apply(fn) === '[object Function]';
	}

	function defaultTransliterate(from, to) { return to; }
} (this));
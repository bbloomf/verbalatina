var fs = require('fs'),
    regexEntry = /([a-z-]+)\t((?:\{[^}]*\})+)[\r\n]+/gi,
    regexInner = /\{\d+ [01249] ([a-z_^-]+)(?:,([a-z_^-]+))?\S*\t[^\t]*\t([^}\t]+)[^}]*\}/g,
    regexLatin = /((?:<\w+>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aáā]ns|p[oóō]st|[aáā]d|[oóō]bs|[eéē]x|p[eéēoóō]r|[iíī]n|r[eéē](?:d(?=d|[aeiouyáéëïíóúýǽæœāēīōūȳ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëïíóúýǽæœāēīōūȳ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëïíóúýǽæœāēīōūȳ])(?:[\wáéíóúýǽæœāēīōūȳ]*(?=-)|(?=(?:n[cg]u|sc|s[tp]r?|gn|ps)[aeiouyáéëïíóúýǽæœāēīōūȳ]|[bcdgptf][lrh][\wáéíóúýǽæœāēīōūȳ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëïéíóúýǽæœāēīōūȳ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëïéíóúýǽæœāēīōūȳ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/\w+>)*)/gi,
    analyses = fs.readFileSync('latin-analyses.txt', {encoding:'utf8'}),
    debugging = false;
String.prototype.reverse = function() {
  return this.split('').reverse().join('');
}
String.prototype.handleDiacritics = function() {
  return this.replace(/([aeiouy])\^/gi,'$1').replace(/([aeiouy])_+/ig, function(match,vowel){
    return ({
      'a': 'ā',
      'e': 'ē',
      'i': 'ī',
      'o': 'ō',
      'u': 'ū',
      'y': 'ȳ',
      'A': 'Ā',
      'E': 'Ē',
      'I': 'Ī',
      'O': 'Ō',
      'U': 'Ū',
      'Y': 'Ȳ'
    })[vowel];
  });
}
String.prototype.removeDiacritics = function() {
  return this.replace(/[āēīōūȳáéíóúǽ]/ig, function(vowel){
    return ({
      'ā': 'a',
      'ē': 'e',
      'ī': 'i',
      'ō': 'o',
      'ū': 'u',
      'ȳ': 'y',
      'á': 'a',
      'é': 'e',
      'í': 'i',
      'ó': 'o',
      'ú': 'u',
      'ý': 'y',
      'Ā': 'A',
      'Ē': 'E',
      'Ī': 'I',
      'Ō': 'O',
      'Ū': 'U',
      'Ȳ': 'Y',
      'ǽ': 'æ'
    })[vowel];
  });
}
String.prototype.removeMacrons = function() {
  return this.replace(/[āēīōūȳ]/ig, function(vowel){
    return ({
      'ā': 'a',
      'ē': 'e',
      'ī': 'i',
      'ō': 'o',
      'ū': 'u',
      'ȳ': 'y',
      'Ā': 'A',
      'Ē': 'E',
      'Ī': 'I',
      'Ō': 'O',
      'Ū': 'U',
      'Ȳ': 'Y'
    })[vowel];
  });
}
String.prototype.markAccent = function() {
  //replace only the last vowel in the syllable.
  return this.reverse().replace(/ua|ea|eo|[āēīōūȳæœaeiouy]/i, function(vowel){
    return ({
      'ā': 'á',
      'a': 'á',
      'ē': 'é',
      'e': 'é',
      'ī': 'í',
      'i': 'í',
      'ō': 'ó',
      'o': 'ó',
      'ū': 'ú',
      'u': 'ú',
      'ȳ': 'ý',
      'y': 'ý',
      'Ā': 'Á',
      'A': 'Á',
      'Ē': 'É',
      'E': 'É',
      'Ī': 'Í',
      'I': 'Í',
      'Ō': 'Ó',
      'O': 'Ó',
      'Ū': 'Ú',
      'U': 'Ú',
      'Ȳ': 'Ý',
      'Y': 'Ý',
      'æ': 'ǽ',
      'œ': 'œ',
      'Æ': 'Ǽ',
      'Œ': 'Œ',
      'ea': 'ǽ',
      'eA': 'Ǽ',
      'eo': 'œ',
      'eO': 'Œ',
      'ua': 'uá',
      'uA': 'uÁ'
    })[vowel] || vowel;
  }).reverse();
}
String.prototype.getAccentForm = function() {
  var syllables = this.match(regexLatin).reverse();
  if(syllables.length < 3) return null;
  if(syllables[1].match(/au|ae|oe|[æœǽ]|(?:[aeiouyáéíóúýāēīōūȳ][^aeiouyæœǽáéíóúýāēīōūȳ])/i) || syllables[0].match(/^(?:x|[^aeiouyæœǽáéíóúýāēīōūȳ]{2,})/i)) {
    // penult is long by position...don't bother saving it.
    return null;
  }
  if(syllables[1].match(/[āēīōūȳ]/i)) {
    syllables[1] = syllables[1].markAccent();
  } else {
    syllables[2] = syllables[2].markAccent();
  }
  return syllables.reverse().join('').replace(/oe/g,'œ').replace(/ae/g,'æ').removeMacrons();
}
String.prototype.switchAccentSyllable = function() {
  var syllables = this.match(regexLatin).reverse();
  if(syllables[1].match(/[áéíóúý]/)) {
    syllables[1] = syllables[1].removeDiacritics();
    syllables[2] = syllables[2].markAccent();
  } else if(syllables[2].match(/[áéíóúýæœ]/)) {
    syllables[2] = syllables[2].removeDiacritics();
    syllables[1] = syllables[1].markAccent();
  }
  return syllables.reverse().join('');
}
String.prototype.longestCommonPart = function(that) {
  var i = Math.min(this.length, that.length);
  var thisTest = this.removeDiacritics().replace(/j/g,'i').replace(/v/g,'u');
  var thatTest = that.removeDiacritics().replace(/j/g,'i').replace(/v/g,'u');
  while(i > 0) {
    if(thisTest.slice(0,i) == thatTest.slice(0,i)) return this.slice(0,i) + that.slice(i);
    --i;
  }
  return that;
}
var match, result = {}, wordsLength = {}, ambiguities = {};
function doWork() {
  while((match = regexEntry.exec(analyses))) {
    if(debugging) debugger;
    var word = match[1].replace(/-/g,''),
        syllables = word.match(regexLatin),
        innerMatch, lastNormalized;
    if(!syllables) console.info(word, '(no syllables)');
    var enclitic2 = word.match(/((?:qu|[uvn])e)+$/);
    while(syllables && syllables.length > 2 && (innerMatch = regexInner.exec(match[2]))) {
      var normalized = innerMatch[1].replace(/-/g,'').handleDiacritics();
      var orthography = normalized.longestCommonPart(word);
      var enclitic1 = normalized.removeDiacritics().match(/((?:qu|[uvn])e)+$/);
      var encliticMatch = (!enclitic1 == !enclitic2);
      if(enclitic2 && !encliticMatch) {
        if(normalized.removeMacrons() != word.slice(-enclitic2[0].length)) encliticMatch = true;
      }
      if(!orthography || !encliticMatch) {
        if(lastNormalized != normalized) {
          //console.info(word, innerMatch[1]);
          lastNormalized = normalized;
        }
        continue;
      } else {
        // future active participles (e.g., facturus) do not properly marke the long u
        if(innerMatch[3].match(/fut part act/)) {
          orthography = orthography.reverse().replace(/([aeiouāēīōūȳ])ru/,'$1rū').reverse();
        } else if(innerMatch[3].match(/\bcomp\b/)) {
          // comparitive adjectives don't have the ending ōr- properly marked as long
          orthography = orthography.reverse().replace(/([aeiouāēīōūȳ])ro/,'$1rō').reverse();
        } else if(innerMatch[3].match(/fut ind pass 2nd sg/)) {
          orthography = orthography.reverse().replace('rēb','reb').reverse();
        } else if(innerMatch[3].match(/imperf ind pass 3rd sg/)) {
          orthography = orthography.replace(/batur$/,'bātur');
        } else if(innerMatch[3].match(/perf part pass/) && (innerMatch[2]||innerMatch[1]).match(/fero$/)) {
          // form should be lātus for past participle of fero and any compounds
          orthography = orthography.reverse().replace('tal','tāl').reverse();
        }

        wordsLength[orthography] = true;
        if(word == 'euge') continue;
        var accentForm = orthography.getAccentForm();
        var plainForm;
        if(accentForm && !((plainForm = accentForm.removeDiacritics()) in ambiguities) && !(accentForm in result)) {
          // check for alternate accent form, and if that exists, remove it, and add them both to a list of ambiguities
          var alternateAccentForm = accentForm.switchAccentSyllable();
          if(alternateAccentForm in result) {
            delete result[alternateAccentForm];
            ambiguities[plainForm] = true;
          } else {
            result[accentForm] = true;
          }
        }
      }
    }
  }
}
doWork();
fs.writeFileSync('latin-words-length.txt', Object.keys(wordsLength).join('\n'));
fs.writeFileSync('latin-words.txt', Object.keys(result).join('\n'));
fs.writeFileSync('ambiguities.txt', Object.keys(ambiguities).join('\n'));
console.info('forms',Object.keys(result).length);
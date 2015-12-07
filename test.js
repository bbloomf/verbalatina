var fs = require('fs'),
    regexLatin = /((?:<\w+>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aáā]ns|p[oóō]st|[aáā]d|[oóō]bs|[eéē]x|p[eéēoóō]r|[iíī]n|r[eéē](?:d(?=d|[aeiouyáéëïíóúýǽæœāēīōūȳ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëïíóúýǽæœāēīōūȳ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëïíóúýǽæœāēīōūȳ])(?:[\wáéíóúýǽæœāēīōūȳ]*(?=-)|(?=(?:n[cg]u|sc|s[tp]r?|gn|ps)[aeiouyáéëïíóúýǽæœāēīōūȳ]|[bcdgptf][lrh][\wáéíóúýǽæœāēīōūȳ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëïéíóúýǽæœāēīōūȳ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëïéíóúýǽæœāēīōūȳ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/\w+>)*)/gi,
    latinWords = fs.readFileSync('latin-words.txt', {encoding:'utf8'}).split('\n'),
    ambiguities = fs.readFileSync('ambiguities.txt', {encoding:'utf8'}).split('\n')
String.prototype.reverse = function() {
  return this.split('').reverse().join('');
}
String.prototype.handleDiacritics = function() {
  return this.replace(/([aeiouy])_+/ig, function(match,vowel){
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
  } else if(syllables[2].match(/[áéíóúýæœǽ]/)) {
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
  return '';
}
var latin = {};
latinWords.forEach(function(word){
  var unaccented = word.removeDiacritics();
  latin[unaccented] = word;
  if(word.match(/j/i)) {
    latin[unaccented.replace(/j/g,'i')] = word.replace(/j/g,'i');
  }
});
var psalmDir = fs.readdirSync('psalms');
var count = 0;
var found = 0;
var wrong = 0;
var notFound = 0;
var longByPosition = 0;
var ambiguityCount = 0;
psalmDir.forEach(function(name){
  var text = fs.readFileSync('psalms/'+name, {encoding:'utf8'});
  text = text.split(/[\s\d(-),.!:;'"“”‘’«»*†?]+/);
  text.forEach(function(originalWord) {
    var word = originalWord.toLowerCase();
    var syllables = word.match(regexLatin);
    if(!syllables) {
      return;
    }
    if(syllables.length > 2) {
      if(ambiguities.indexOf(word) >= 0) {
        ambiguityCount++;
        return;
      }
      syllables = syllables.reverse();
      if(syllables[1].match(/au|ae|oe|[æœǽ]|(?:[aeiouyáéíóúýāēīōūȳ][^aeiouyæœǽáéíóúýāēīōūȳ])/i) || syllables[0].match(/^(?:x|[^aeiouyæœǽáéíóúýāēīōūȳ]{2,})/i)) {
        // penult is long by position...don't bother saving it.
        longByPosition++;
        return;
      }
      if(!originalWord.match(/[áéíóúýǽ]/i)) {
        if(originalWord[0].match(/[AEIOUY]/)) {
          syllables[0] = syllables[0].markAccent();
          word = syllables[0][0] + word.slice(1);
        } else if(word.match(/æ/)) {
          word = word.reverse().replace('æ','ǽ').reverse();
        }
      }
      
      var unaccented = word.removeDiacritics();
      if(unaccented in latin) {
        if(latin[unaccented] == word) {
          found++;
        } else {
          wrong++;
          console.info('different accent: expected “' + latin[unaccented] + '” but found “' + word + '”');
        }
      } else {
        notFound++;
        //console.info('word not found: ' + unaccented);
        //console.info(syllables);
      }
    }
  })
})
console.info('count: ', found+wrong+notFound+longByPosition);
console.info('found: ', found);
console.info('wrong: ', wrong);
console.info('notFound: ', notFound);
console.info('longByPosition: ', longByPosition);
console.info('ambiguityCount: ', ambiguityCount);

ArrayParent = function(){};
ArrayParent.prototype.get = function(key){ if(!this[key]) this[key] = []; return this[key]; }

var fs = require('fs');
var regexLatin = /((?:<(?:b|i|sc)>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aá]ns|p[oó]st|[aá]d|[oó]bs|[eé]x|p[eéoó]r|[ií]n|r[eé](?:d(?=d|[aeiouyáéëíóúýǽæœ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëíóúýǽæœ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëíóúýǽæœ])(?:[\wáéíóúýǽæœ]*(?=-)|(?=(?:n[cg]u|sc|[sc][tp]r?|gn|ps)[aeiouyáéëíóúýǽæœ]|[bcdgptf][lrh][\wáéíóúýǽæœ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëéíóúýǽæœ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëéíóúýǽæœ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/(?:b|i|sc)>)*)/gi;
var regexGabc = /<alt>.*?<\/alt>|(((?:<(\w+)>.*?<\/\3>)?([^\(\s,.:;!?*†][^\(\r\n,.:;!?*†]*)[,.:;!?*†]*(?:($)|\())|\()([^\)]*)(?:($)|\))((?:[\s*†]*\([^\)]*\))*(\s*))/g;
var regexAccents = /[áéíóúýǽ]/i;
var regexVowel = /[AEIOUYÆŒ]/;
var accentVowel = {
  'a': 'á',
  'e': 'é',
  'i': 'í',
  'o': 'ó',
  'u': 'ú',
  'y': 'ý',
  'æ': 'ǽ',
  'œ': 'oé'
}
var regexLigatures = /[æœ]/i;
function removeLigatures(text) {
  var replacements = {"Oe":/Œ/g,
            'oe':/œ/g,
            "Aé":/Ǽ/g,
            "aé":/ǽ/g,
            "Ae":/Æ/g,
            "ae":/æ/g
  };
  for(r in replacements) {
    text = text.replace(replacements[r],r);
  }
  return text;
}
function removeAccents(text) {
  var replacements = {"Oe":/Œ/g,
            'oe':/œ/g,
            'a':/[áä]/g,
            'e':/[éë]/g,
            'i':/[íï]/g,
            'o':/[óö]/g,
            'u':/[úü]/g,
            'y':/[ýÿ]/g,
            'A':/[ÁÄ]/g,
            'E':/[ÉË]/g,
            'I':/[ÍÏ]/g,
            'O':/[ÓÖ]/g,
            'U':/[ÚÜ]/g,
            'Y':/Ý/g,
            "Ae":/[ǼÆ]/g,
            "ae":/[ǽæ]/g
  };
  for(r in replacements) {
    text = text.replace(replacements[r],r);
  }
  return text;
}
var gabcDir = '../jgabc/gabc'
var gabcs = fs.readdirSync(gabcDir);
var results = {};
var totalWords = 0;
var ambiguous = [];
var totalAmbiguous = 0;
var syllableLength = [];
for(i in gabcs) {
  regexGabc.exec('');
  var fn = gabcDir+'/'+gabcs[i];
  var text = fs.readFileSync(fn,{encoding:'utf8'});
  //find header...
  var index = text.indexOf('\n%%\n');
  if(index<0) {
    console.info('No GABC header found: ' + fn);
    continue;
  }
  text = text.slice(index+3);
  var curWord = [];
  var match;
  var prevMatch;
  var prevMatch2;
  while(prevMatch2=prevMatch,prevMatch=match, match = regexGabc.exec(text)) {
    if(match[5] === '' || match[7] === '') break;
    if(match[4]) curWord.push(match[4].replace(/<sp>'(?:ae|æ)<\/sp>/g,'ǽ').replace(/<sp>'œ<\/sp>/g,'oé').replace(/v>\\greheightstar<\/v>/g,''));
    if(curWord.length && (match[9] || match[8].indexOf(' ')>=0)) {
      var val = curWord.join('');
      if(val.length) {
        ++totalWords;
        var r;
        var key = removeAccents(val.toLowerCase());
        var hasAccents = regexAccents.exec(val);
        var startsWithVowel = val.match(regexVowel);
        var syllables = val.match(regexLatin);
        val = removeLigatures(val.toLowerCase());
        if(!syllables) {
          curWord = [];
          continue;
        }
        if(syllables.length > 2 && !hasAccents) {
          if(startsWithVowel) {
            val = accentVowel[val[0]] + val.slice(1);
          } else if(!val.match(/œ/i) && !val.match('^eu')) {
            console.info('%s: %s',curWord,fn);
          }
        }
        if(syllables.length <= 2 && hasAccents) {
          //console.info('%s: %s',curWord,fn);
        }
        if(syllables.length <= 2 || !hasAccents) {
          curWord = [];
          continue;
        }
        if(syllables.slice(-1)[0].match(regexAccents) || !(syllables.slice(-2)[0].match(regexAccents) || syllables.slice(-3)[0].match(regexAccents))) {
          console.info('%s: %s',curWord,fn);
        }
        if(key in results) {
          r = results[key];
        } else {
          r = results[key] = new ArrayParent();
        }
        if(syllables.length > 2 && !hasAccents && !startsWithVowel && !val.match(/œ/i) && !val.match('^eu')) {
          r.get('--').push(fn);
        }
        if(!(val in r)) {
          r.get(val).push(fn);
          if(!syllableLength[syllables.length]) {
            syllableLength[syllables.length] = 1;
          } else {
            ++syllableLength[syllables.length];
          }
        }
        r.get(val).push(fn);
      }
      curWord = [];
    }
  }
}
for(w in results) {
  if(Object.keys(results[w]).length > 1) {
    ambiguous.push(results[w]);
    totalAmbiguous += Object.keys(results[w]).length;
  }
}
fs.writeFileSync('wordListFromGabc.json', JSON.stringify(results));

console.info(ambiguous);
console.info('Count total words: ' + totalWords);
console.info('Count disctinct words: ' + Object.keys(results).length);
console.info('Count ambiguous words: ' + ambiguous.length);
console.info('Count ambiguous words: ' + totalAmbiguous);
console.info(syllableLength);
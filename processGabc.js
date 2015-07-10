var fs = require('fs');
var regexLatin = /((?:<(?:b|i|sc)>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aá]ns|p[oó]st|[aá]d|[oó]bs|[eé]x|p[eéoó]r|[ií]n|r[eé](?:d(?=d|[aeiouyáéëíóúýǽæœ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëíóúýǽæœ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëíóúýǽæœ])(?:[\wáéíóúýǽæœ]*(?=-)|(?=(?:n[cg]u|sc|[sc][tp]r?|gn|ps)[aeiouyáéëíóúýǽæœ]|[bcdgptf][lrh][\wáéíóúýǽæœ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëéíóúýǽæœ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëéíóúýǽæœ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/(?:b|i|sc)>)*)/gi;
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
  var fn = gabcDir+'/'+gabcs[i];
  var text = fs.readFileSync(fn,{encoding:'utf8'});
  //find header...
  var index = text.indexOf('\n%%\n');
  if(index<0) {
    console.info(fn);
    continue;
  }
  text = text.slice(index+3);

  continue;
  text = text.split(/[\s\d(-),.!:;'"“”‘’«»*†?]+/);
  text.forEach(function(val,i){
    if(val.length==0) return;
    ++totalWords;
    var r;
    var key = removeAccents(val.toLowerCase());
    var hasAccents = regexAccents.exec(val);
    var startsWithVowel = val.slice(0,1).match(regexVowel);
    var syllables = val.match(regexLatin);
    val = val.toLowerCase();
    if(!syllables) return;
    if(syllables.length > 2 && !hasAccents) {
      if(startsWithVowel) {
        val = accentVowel[val[0]] + val.slice(1);
      } else if(!val.match(/œ/i) && !val.match('^eu')) {
        console.info(val);
      }
    }
    if(syllables.length <= 2 && hasAccents) {
      console.info(val);
    }
    if(syllables.length <= 2 || !hasAccents) {
      return;
    }
    if(syllables.slice(-1)[0].match(regexAccents) || !(syllables.slice(-2)[0].match(regexAccents) || syllables.slice(-3)[0].match(regexAccents))) {
      console.info(val);
    }
    if(key in results) {
      r = results[key];
    } else {
      r = results[key] = [];
    }
    if(syllables.length > 2 && !hasAccents && !startsWithVowel && !val.match(/œ/i) && !val.match('^eu')) {
      r.push('--');
    }
    if(r.indexOf(val)== -1) {
      r.push(val);
      if(!syllableLength[syllables.length]) {
        syllableLength[syllables.length] = 1;
      } else {
        ++syllableLength[syllables.length];
      }
    }
  });
}
for(w in results) {
  if(results[w].length > 1) {
    ambiguous.push(results[w]);
    totalAmbiguous += results[w].length;
  }
}
//fs.writeFileSync('wordListFromGabc.json', JSON.stringify(results));

console.info(ambiguous);
console.info('Count total words: ' + totalWords);
console.info('Count disctinct words: ' + Object.keys(results).length);
console.info('Count ambiguous words: ' + ambiguous.length);
console.info('Count ambiguous words: ' + totalAmbiguous);
console.info(syllableLength);
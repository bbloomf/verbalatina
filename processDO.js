ArrayParent = function(){};
ArrayParent.prototype.get = function(key){ if(!this[key]) this[key] = []; return this[key]; }

var fs = require('fs');
var windows1252 = require('windows-1252');
var regexLatin = /((?:<(?:b|i|sc)>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aá]ns|p[oó]st|[aá]d|[oó]bs|[eé]x|p[eéoó]r|[ií]n|r[eé](?:d(?=d|[aeiouyáéëïíóúýǽæœ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëïíóúýǽæœ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëïíóúýǽæœ])(?:[\wáéíóúýǽæœ]*(?=-)|(?=(?:n[cg]u|sc|[sc][tp]r?|gn|ps)[aeiouyáéëïíóúýǽæœ]|[bcdgptf][lrh][\wáéíóúýǽæœ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëïéíóúýǽæœ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëïéíóúýǽæœ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/(?:b|i|sc)>)*)/gi;
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
var dir = '../divinum-officium/web/www/missa/Latin';  // TODO: get all subdirs.
var wordList = JSON.parse(fs.readFileSync('wordListFromPsalms.json',{encoding:'utf8'}));
var dirs = fs.readdirSync(dir);
var results = {};
var totalWords = 0;
var ambiguous = [];
var totalAmbiguous = 0;
var syllableLength = [];
for(dirI in dirs) {
  var currentDir = dir + '/' + dirs[dirI];
  var texts = fs.readdirSync(currentDir);
  var errorCount = 0;
  for(i in texts) {
    var fn = currentDir+'/'+texts[i];
    var text = fs.readFileSync(fn,{encoding:'utf8'});
    if(!text.match(regexAccents)) {
      text = windows1252.decode(fs.readFileSync(fn,{encoding:'binary'}));
    }
    text = text.replace(/(?:(?:^|\n)(?:~\n|(?:\([^)]+\)\s*)?[!&$@#][^\n]*|\s?\[(?:(?:Rank[^\]]*|Rule|Name)](?=\n)[^[]*|[^\]]+][^\r\n]*)))(?=\n|$)|\s+(?:\w\.|[^a-z]+)(?=\s|$)|[~_-]|&[^;]+;/gi,'');
    text = text.split(/[\s\d(\-)\/,.!:;'"“”‘’«»*†?[\]]+/);
    text.forEach(function(val,i){
      if(val.length==0) return;
      if(val.match(/[^a-záéíóúýǽæœëï]/i)) {
        //console.info('%s: %s',val,fn);
      }
      ++totalWords;
      var curWord = val;
      var r;
      var key = removeAccents(val.toLowerCase());
      var hasAccents = regexAccents.exec(val);
      var startsWithVowel = val.match(regexVowel);
      var syllables = val.match(regexLatin);
      val = removeLigatures(val.toLowerCase());
      if(!syllables) return;
      if(syllables.length > 2 && !hasAccents) {
        if(startsWithVowel) {
          val = accentVowel[val[0]] + val.slice(1);
        } else if(!val.match(/œ/i) && !val.match('^eu')) {
          //console.info('%s: %s',curWord,fn);
          if(!(val in wordList)) console.info('%s: %s',curWord,fn);
          errorCount++;
        }
      }
      if(syllables.length <= 2 && hasAccents) {
        // console.info('%s: %s',curWord,fn);
      }
      if(syllables.length <= 2 || !hasAccents) {
        return;
      }
      if(syllables.slice(-1)[0].match(regexAccents) || !(syllables.slice(-2)[0].match(regexAccents) || syllables.slice(-3)[0].match(regexAccents))) {
        // console.info('%s: %s',curWord,fn);
      } 
      if(key in results) {
        r = results[key];
      } else {
        r = results[key] = new ArrayParent();
      }
      if(syllables.length > 2 && !hasAccents && !startsWithVowel && !val.match(/œ/i) && !val.match(/^eu/i)) {
        r.get('--').push(fn);
        errorCount++;
        console.info('%s: %s',curWord,fn);
      }
      if(!(val in r)) {
        r.get(val).push(fn);
        if(!syllableLength[syllables.length]) {
          syllableLength[syllables.length] = 1;
        } else {
          ++syllableLength[syllables.length];
        }
        return;
      }
      r.get(val).push(fn);
    });
    if(errorCount > 10) {
      break;
    }
  }
}
for(w in results) {
  if(results[w].length > 1) {
    ambiguous.push(results[w]);
    totalAmbiguous += results[w].length;
  }
}
fs.writeFileSync('wordListFromDO.json', JSON.stringify(results));

console.info(ambiguous);
console.info('Count total words: ' + totalWords);
console.info('Count disctinct words: ' + Object.keys(results).length);
console.info('Count ambiguous words: ' + ambiguous.length);
console.info('Count ambiguous words: ' + totalAmbiguous);
console.info(syllableLength);
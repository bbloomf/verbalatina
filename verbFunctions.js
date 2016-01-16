var regexLatin = /((?:<(?:b|i|sc)>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aáā]ns|p[oóō]st|[aáā]d|[oóō]bs|[eéē]x|p[eéēoóō]r|[iíī]n|r[eéē](?:d(?=d|[aeiouyáéëïíóúýǽæœāēīōūȳ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëïíóúýǽæœāēīōūȳ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëïíóúýǽæœāēīōūȳ])(?:[\wáéíóúýǽæœāēīōūȳ]*(?=-)|(?=(?:n[cg]u|sc|[sc][tp]r?|gn|ps)[aeiouyáéëïíóúýǽæœāēīōūȳ]|[bcdgptf][lrh][\wáéíóúýǽæœāēīōūȳ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëïéíóúýǽæœāēīōūȳ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëïéíóúýǽæœāēīōūȳ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/(?:b|i|sc)>)*)/gi;
var regexLatinAccent = /([ao]e|au|[aeiouyāēīōūȳăĕĭŏŭäëïöüÿ])(([^aeiouyāēīōūȳăĕĭŏŭäëïöüÿ]*)((?:qu|ngu)?[aeiouyăĕĭŏŭ]([bcdgkpt][rl]|qu|[bcdfghjklmnprstvy]?)|)([ao]e|au|[aeiouyāēīōūȳăĕĭŏŭäëïöüÿ])[^aeiouyāēīōūȳăĕĭŏŭäëïöüÿ]*)$/i;
var regexBackwardLatinAccent = /^[^aeiouyāēīōūȳăĕĭŏŭäëïöüÿ]*(e[ao]|ua|[aeiouyāēīōūȳăĕĭŏŭäëïöüÿ])(([rl][bcdgkpt]|uq|[bcdfghjklmnprstvy]?)[aeiouyăĕĭŏŭ](?:uq|ugn)?|)([^aeiouyāēīōūȳăĕĭŏŭäëïöüÿ])*(e[ao]|ua|[aeiouyāēīōūȳăĕĭŏŭäëïöüÿ])/i;
var regexLatinSylCount = /((q|ng)u)?([ao]e|au|[aeiouyāēīōūȳăĕĭŏŭäëïöüÿ])/gi;
Array.prototype.addIfNotIn = function(object) {
  if(this.indexOf(object) < 0) this.push(object);
}
Array.prototype.addToIndex = function(index, object) {
  switch(typeof(this[index])) {
    case 'undefined':
      this[index] = [object];
      break;
    case 'object':
      if(Array == this[index].constructor) {
        this[index].addIfNotIn(object);
        break;
      }
    default:
      this[index] = [this[index],object];
      break;
  }
};
String.prototype.reverse = function() {
  return this.split('').reverse().join('');
};
String.prototype.countSyllables = function() {
  return (this.match(regexLatinSylCount)||[]).length;
}
String.prototype.getAccentedForm = function() {
  var tmp = this.replace(/[^aeiouyāēīōūȳăĕĭŏŭäëïöüÿbcdfghjklmnpqrstvxz]+/ig,'');
  if(this.countSyllables()<3) return tmp.removeDiacritics();
  var match = tmp.match(regexLatinAccent);
  return tmp.slice(0, match.index).removeDiacritics() + ({
    "au": "áu",
    "ae": "ǽ",
    "oe": "oé",
    "a": "á",
    "ā": "á",
    "ă": "á",
    "ä": "á",
    "e": "é",
    "ē": "é",
    "ĕ": "é",
    "ë": "é",
    "i": "í",
    "ī": "í",
    "ĭ": "í",
    "ï": "í",
    "o": "ó",
    "ō": "ó",
    "ŏ": "ó",
    "ö": "ó",
    "u": "ú",
    "ū": "ú",
    "ŭ": "ú",
    "ü": "ú",
    "y": "ý",
    "ȳ": "ý",
    "ÿ": "ý",
    "Au": "Áu",
    "Ae": "Ǽ",
    "Oe": "Oé",
    "A": "Á",
    "Ā": "Á",
    "Ă": "Á",
    "Ä": "Á",
    "E": "É",
    "Ē": "É",
    "Ĕ": "É",
    "Ë": "É",
    "I": "Í",
    "Ī": "Í",
    "Ĭ": "Í",
    "Ï": "Í",
    "O": "Ó",
    "Ō": "Ó",
    "Ŏ": "Ó",
    "Ö": "Ó",
    "U": "Ú",
    "Ū": "Ú",
    "Ŭ": "Ú",
    "Ü": "Ú",
    "Y": "Ý",
    "Ȳ": "Ý",
    "Ÿ": "Ý"
  })[match[1]] + match[2].removeDiacritics();
}
String.prototype.removeDiacritics = function() {
  return this.replace(/ae/g,'æ').replace(/oe/g,'œ').replace(/A[Ee]/g,'Æ').replace(/O[Ee]/g,'Œ').replace(/[āēīōūȳăĕĭŏŭäëïöüÿ]/gi, function(match){
    switch(match) {
      case 'ā':
      case 'ă':
      case 'ä':
        return 'a';
      case 'ē':
      case 'ĕ':
      case 'ë':
        return 'e';
      case 'ī':
      case 'ĭ':
      case 'ï':
        return 'i';
      case 'ō':
      case 'ŏ':
      case 'ö':
        return 'o';
      case 'ū':
      case 'ŭ':
      case 'ü':
        return 'u';
      case 'ȳ':
      case 'ÿ':
        return 'y';
      case 'Ā':
      case 'Ă':
      case 'Ä':
        return 'A';
      case 'Ē':
      case 'Ĕ':
      case 'Ë':
        return 'E';
      case 'Ī':
      case 'Ĭ':
      case 'Ï':
        return 'I';
      case 'Ō':
      case 'Ŏ':
      case 'Ö':
        return 'O';
      case 'Ū':
      case 'Ŭ':
      case 'Ü':
        return 'U';
      case 'Ȳ':
      case 'Ÿ':
        return 'Y';
    }
  }).replace(/(a|o)e/g,'$1ë');
}
handleDiacritics = function(string) {
  return string.replace(/([āēīōūȳ])\^|([ăĕĭŏŭ])_/ig, function(match,longVowel,shortVowel){
    return longVowel || ({
      'ă': 'ā',
      'ĕ': 'ē',
      'ĭ': 'ī',
      'ŏ': 'ō',
      'ŭ': 'ū',
      'Ă': 'Ā',
      'Ĕ': 'Ē',
      'Ĭ': 'Ī',
      'Ŏ': 'Ō',
      'Ŭ': 'Ū'
    })[shortVowel];
  });
}
var require = require || null,
  fs = require && require('fs'),
  conjugation = {
    '1': [],
    '2': [],
    '3': [],
    '3io': [],
    '4': [],
    'facio': [],
    'esse': [],
    'ferre': [],
    'perfect': []
  };
if(fs) {
  Object.keys(conjugation).forEach(function(conj){
    var endings = fs.readFileSync('conjugation.'+conj+'.txt',{encoding:'utf8'}).split(/\s*\n\s*/).filter(function(ending){
      return ending.match(/^-/);
    });
    conjugation[conj] = endings.map(function(ending){
      return ending.replace(/^-/,'');
    });
  });
}
function findRootForEnding(root, ending, conj) {
  var endingNoDiacritics = ending.removeDiacritics();
  var rootBackwardsNoDiacritics = root.removeDiacritics().reverse();
  var conjVowel = ['',/a/,/e/,/i/,/i/];
  var temp;
  switch(conj) {
    case 1:
      if(endingNoDiacritics.match(/^a(vi|tum)$/)) return root;
      break;
    case 2:
      if(endingNoDiacritics.match(/^e(vi|tum)$/)) return root;
      break;
    case 3:
      temp = endingNoDiacritics.match(/^([ui])(v?i|tum)$/);
      if(temp && !rootBackwardsNoDiacritics[0] == temp[1]) return root;
      break;
    case 4:
      if(endingNoDiacritics.match(/^i(v?i|tum)$/)) return root;
      break;
  }
  
  var consonantClasses = ['bp', 'cgkqxh', 'dst', 'fp', 'mn', 'vu', 'vs', 'aeiouyæœ', 'xv', 'sr', 'scg'];
  var tightConsonantClasses = ['bp', 'cgkqxh', 'vs', 'ds', 'ts'];
  var regexVowels = /[aeioyæœ]|u(?!q|gn)/g;
  // Algorithm:

  // if the ending starts with a consonant (e.g. xi, ctum), find the last consonant of the same class (e.g., [cgqx], abdiC)
  // if, however, the ending is more than two syllables ('volutum'), ignore the last syllable of the root ('advol[vo]')
      // if such a consonant isn't found, throw a warning
  // if the ending starts with a vowel (-idi, -itum), check if the last vowel is a match. (e.g., -ŭi, -ūtum, for abnuo,)
  // otherwise, check if it is followed by the same consonant (ab-ripio, -eptum)
  // consonant classes: [bp], [cgkqx], [dst], [fp], [ji], [mn], [vu]

  // trickier:    ad-volvo, vi, vŏlūtum
  // 

  var vowelsInRoot = (rootBackwardsNoDiacritics.match(regexVowels)||[]).length;
  var vowelsInEnding = (endingNoDiacritics.reverse().match(regexVowels)||[]).length;
  var regex;
  if(endingNoDiacritics[0].match(regexVowels)) {
    // ending starts with a vowel...
    // check for this vowel, or a different vowel followed by the same consonant that this one is followed by.
    var consonant = endingNoDiacritics.slice(1).match(/([aeiouyæœ]*)([^aeiouyæœ]|$)/);
    var actualConsonant = consonant? consonant[2] : '';
    consonant = consonant? consonant[1].reverse() : '';
    var consonantClass = tightConsonantClasses.filter(function(str){ return str.indexOf(actualConsonant||null) >= 0; }).join('') || actualConsonant;
    if(consonantClass) consonant = '[' + consonantClass + ']' + consonant;
    var vowel = endingNoDiacritics[0];
    var prefix = '';
    // if it starts with the conjugation's vowel
    if(conj && vowelsInEnding == 2 && vowel.match(conjVowel[conj])) prefix = '^|';
    if(vowel == 'u') {
      vowel = '(^v|u)';
      if(rootBackwardsNoDiacritics.match(/^cs[aeiouyæœ]/)) {
        root = root.slice(0, -3);
        rootBackwardsNoDiacritics = root.slice(3);
      }
    }
    regex = new RegExp(prefix + vowel + (consonant? ('|' + consonant + '[aeiouyæœ](?!q|gn)') : ''));
    
  } else {
    // ending starts with consonant...
    // find the last consonant of the same consonant class
    // but prioritize the first letter after the prefix, if that is a match to the consonant class, and there is only a single vowel in the root
    // first priority to an occurence of the first consonants followed by the first vowel of the ending, or if the root ends with those first consonants currently.  Make sure that the vowel matched is also followed/not followed by [rl] the same as the vowel in the ending.
    // if it starts with j[vowel][consonant], look for both that AND i[consonant]
    var firstEndingSyl = endingNoDiacritics.match(/(([^aeiouyæœ]+)([aeiouyæœ])([rl]?))(.|$)/);
    if(firstEndingSyl[2] == 'j') {
      var secondConsonant = firstEndingSyl[4] || firstEndingSyl[5];
      regex = new RegExp(secondConsonant + '([aeiouyæœ]j|i)');
    } else if(firstEndingSyl[2] == 'ct') {
      regex = new RegExp('^(uq|ug(?=n)|[cgkxh]|(?=[aeiouyæœ]))');
    } else if(vowelsInEnding < 2) {
      var lmnr = 'lmnr'.split('');
      if(endingNoDiacritics.match(/^[lmnr]/)) {
        lmnr.splice(lmnr.indexOf(endingNoDiacritics[0]),1);
      }
      regex = new RegExp((firstEndingSyl[2].length == 1? ('^'+firstEndingSyl[2]+'|') : '') + '^(uq|ug(?=n))?[^aeiouyæœ]*?(?=(['+lmnr.join('')+'])?[aeiouyæœ])');
    } else {
      var actualConsonant = firstEndingSyl[5];
      var consonantClass = tightConsonantClasses.filter(function(str){ return str.indexOf(actualConsonant||null) >= 0; }).join('') || actualConsonant;
      regex = new RegExp(firstEndingSyl[2] + '[aeiouyæœ]['+consonantClass+'](?![^-]*-)');

      if(rootBackwardsNoDiacritics.reverse().match(regex)) {
        regex = new RegExp('['+consonantClass+'][aeiouyæœ]'+firstEndingSyl[2].reverse());
      } else {
        regex = new RegExp(
          ((firstEndingSyl[3] == 'i' && firstEndingSyl[1].length == 2)?
            firstEndingSyl[0].reverse() :
            ((firstEndingSyl[4]? '':'(^|[^rl])')+firstEndingSyl[1].reverse())
          )
        );
      }
    }
    if(firstEndingSyl[2].length > 1 && !rootBackwardsNoDiacritics.match(regex)) {
      regex = new RegExp('(^|[aeiouyæœ])' + firstEndingSyl[2].reverse());
    }
    if(!rootBackwardsNoDiacritics.match(regex)) {
      var consonantClass = consonantClasses.filter(function(str){ return str.indexOf(endingNoDiacritics[0]) >= 0; })[0] || endingNoDiacritics[0];
      regex = new RegExp('^[^aeiouyæœ]*[aeiouyæœ][' + consonantClass + ']+(?=-)');
      if(!rootBackwardsNoDiacritics.match(regex)) {
        regex = new RegExp('(^|[aeiouyæœ])[' + consonantClass + ']+');
        if(!rootBackwardsNoDiacritics.match(regex)) {
          consonantClass = consonantClasses.filter(function(str){ return str.indexOf(endingNoDiacritics[0]) >= 0; }).join('') || endingNoDiacritics[0];
          regex = new RegExp('([aeiouyæœ]|^)[' + consonantClass + ']+');
        }
      }
    }
  }
  var match = rootBackwardsNoDiacritics.match(regex);
  if(match) {
    // as long as the number of vowels taken away from the root is within two of what's being added on in the ending...
    var newRoot = root.slice(0, root.length-(match.index + match[0].length));
    var choppedOff = root.slice(newRoot.length);
    var lmnr = 'lmnr'.split('');
    var doubleConsonant = '';
    if(choppedOff.match(/^[^-]+-/)) {
      if(newRoot.length) {
        newRoot = root.slice(0, root.indexOf('-')+1);
        choppedOff = root.slice(root.length - newRoot.length);
      } else {
        // make sure that the new ending starts with the same vowel, if we're chopping off an entire prefix.
        var rootFirstSyl = rootBackwardsNoDiacritics.reverse().match(/^[^aeiouyæœ]*[aeiouyæœ]/)[0];
        var endingFirstSyl = endingNoDiacritics.match(/^[^aeiouyæœ]*[aeiouyæœ]/)[0];
        if(rootFirstSyl != endingFirstSyl) {
          newRoot = root;
          choppedOff = '';
        }
      }
    }
    if(endingNoDiacritics.match(/^[lmnr]/)) {
      lmnr.splice(lmnr.indexOf(endingNoDiacritics[0]),1);
      doubleConsonant = '^'+endingNoDiacritics[0]+'(?='+endingNoDiacritics[0]+')|';
    }
    if(choppedOff.match(new RegExp(doubleConsonant+'^['+lmnr.join('')+'][^aeiouyæœ-]'))) { // if it chopped off an l,m,n, or r follewed by another consonant, put it back
      newRoot += choppedOff[0];
    }
    var vowelsTakenAway = (rootBackwardsNoDiacritics.slice(0, match.index + match[0].length).match(regexVowels)||[]).length;
    var inchoativeAdjuster = rootBackwardsNoDiacritics.match(/^cs[aeiouyæœ]/)? 1 : 0;
    if(endingNoDiacritics[0].match(regexVowels) && vowelsInEnding == 2 && (vowelsTakenAway - inchoativeAdjuster) > 1) {
      // too many vowels taken away...just use the original root
      return root;
    } else if(newRoot && vowelsTakenAway + 2 < vowelsInEnding) {
      // number of syllables is too different.  Try again with the shorter newRoot.
      return findRootForEnding(newRoot, ending, conj);
    } else {
      // verbs -sisto, -stitum become ex-stitum or ex-steti
      if(endingNoDiacritics.match(/^st[ei]t/) && newRoot.match(/si$/)) {
        return newRoot.slice(0,-2);
      } else if(endingNoDiacritics.match(/^ast[ei]t/)) {
        return '';
      }
      return newRoot;
    }
    // TODO: super-sum should not become super-fui
  }
  return root;


  // ab-dico, xi, ctum
      // ab-do, idi, itum
  // ab-eo, ivi or ii, itum
  // ab-horreo, ui, ēre
  // abicio, ĕre, jēci, jēctum
      // ab-ĭgo, ēgi, actum
  // ab-jungo, xi, ctum
  // ab-ligurrio, īvi, ītum
  // ab-lŭo, ŭi, ūtum
  // ab-nuo, ŭi, ŭitum
  // ab-oleo, ēvi (ui), ĭtum
  //     ăb-ŏlĕo</orth>, <itype>ēvi</itype> (ui), <itype>ĭtum, 2</itype>
  // ăb-ōmĭnor, ātus
  // ab-ortio, īre
  // ab-rādo, si, sum
  // ab-ripio, pui, eptum, 3
  // ab-rodo, si, sum
  // ab-rumpo, ūpi, uptum
  // abs-cēdo, cessi, cessum, 3
  // abs-cīdo, cīdi, cīsum, 3
  // ab-scindo, cidi, cissum
  // abs-condo, condi and condidi, conditum and consum
  // ad-volvo, vi, vŏlūtum
  // benefacio, fēci, factum
  // beneplaceo, ŭi, itum, 2
}
conjugateVerb = exports.conjugateVerb = function(parts) {
  var result = [];
  (parts.root || []).forEach(function(root) {
    (parts.conjugation || []).forEach(function(conj) {
      Array.prototype.push.apply(result, conjugation[conj].map(function(ending){
        return root + ending;
      }));
    });
  });
  // TODO: deal with the supine properly
  (parts.supine || []).forEach(function(supine) {
    Array.prototype.push.apply(result, [supine]);
  });
  (parts.perfect || []).forEach(function(perfect) {
    var root = perfect.slice(0, -1);
    Array.prototype.push.apply(result, conjugation.perfect.map(function(ending){
      return root + ending;
    }));
  });
  return result;
}
getVerbParts = exports.getVerbParts = function getVerbParts(orth, verbMatch) {
  if(!verbMatch[1]) {
    console.info('unknown verb:', orth);
    return {};
  }
  var root = null;
  var parts = {root: [], infinitive: [], supine: [], perfect: [], conjugation: []};
  var perfectEnding = (verbMatch[3]||[]).filter(function(ending) {
    return ending.match(/[iīĭï]$/i);
  });
  var supineEnding = (verbMatch[3]||[]).filter(function(ending) {
    return ending.match(/[rstxu][uūŭü][ms]$/i);
  });
  var verbEnding = orth.match(/(?:([eĕ])|([iĭ]))?([oōŏ])(r?)$|(f[eĕ]r[ot]|[aeiāăäĕēëīĭï]t|tur|sum)$|am$/)
  if(!verbEnding) verbEnding = [];
  if(verbEnding[1]) verbEnding.eo = true; else verbEnding[1] = '';
  if(verbEnding[2]) verbEnding.io = true; else verbEnding[2] = '';
  if(verbEnding[3]) verbEnding.firstPerson = true; else verbEnding[3] = '';
  if(verbEnding[4]) verbEnding.deponent = true; else verbEnding[4] = '';
  if(verbEnding[0] == 'am') {
    verbEnding.io = true;
    verbEnding[2] = 'am';
  }
  verbMatch[1].forEach(function(conj) {
    if(conj == '3' && verbEnding.io) {
      parts.conjugation.push('3io');
    } else {
      parts.conjugation.push(conj);
    }
    switch(conj) {
      case 1:
        if(!root && orth.match(/[oōŏ]r?$/)) root = orth.slice(0,-(1+verbEnding[4].length));
        if(!root && orth.match(/[aăāä]t$/)) root = orth.slice(0,-2);
        parts.infinitive.addIfNotIn(root + 'āre');
        if(!supineEnding.length) supineEnding.addIfNotIn('ātum');
        if(!perfectEnding.length) perfectEnding.addIfNotIn('āvi');
        break;
      case 2:
        if(!root) {
          if(!verbEnding.eo) {
            var tempMatch = orth.match(/[eēĕë]t(ur)?$/);
            if(tempMatch) {
              root = orth.slice(0,-(tempMatch[1]||'').length);
            } else {
              console.warn(orth + ' should end with -eo because it is marked as second conjugation (ēre)');
              root = orth.slice(0,-(verbEnding[2].length+verbEnding[3].length+verbEnding[4].length))
            }
          } else {
            root = orth.slice(0,-(verbEnding[1].length+verbEnding[3].length+verbEnding[4].length));
          }
        }
        parts.infinitive.addIfNotIn(root + 'ēre');
        break;
      case 3:
        if(!root) root = orth.slice(0,-(verbEnding[2].length+verbEnding[3].length+verbEnding[4].length));
        parts.infinitive.addIfNotIn(root + 'ĕre');
        break;
      case 4:
        if(!root && !verbEnding.io && !verbEnding.eo) console.warn(orth + ' should end with -eo or -io because it is marked as fourth conjugation (īre)');
        if(!root) root = orth.slice(0,-(verbEnding[1].length+verbEnding[2].length+verbEnding[3].length+verbEnding[4].length));
        if(root.match(/[iīĭ]$/)) root = root.slice(0,-1); // need a way to describe that there are two roots, but this only happens on one verb.
        parts.infinitive.addIfNotIn(root + 'īre');
        if(!supineEnding.length) supineEnding.addIfNotIn('ītum');
        if(!perfectEnding.length) perfectEnding.addIfNotIn('īvi');
        if(verbEnding.eo) conj = 'eo';
        break;
      case 'perfect':
        if(orth.match(/[iīĭï]$/)) {
          root = orth.slice(0,-1);
          parts.perfect.addIfNotIn(root + 'i');
          parts.infinitive.addIfNotIn(root + 'isse');
        } else console.warn(orth, ' does not end with -i but it is marked as a perfect stem verb');
        break;
      case 'esse':
        if(verbEnding[5] == 'sum') {
          root = orth.slice(0,-3);
          parts.infinitive.addIfNotIn(root + (root.match(/s$/)? 'se' : 'esse'));
        }
        break;
      case 'ferre':
        if(verbEnding[5][0] == 'f') {
          root = orth.slice(0,-verbEnding[5].length);
          parts.infinitive.addIfNotIn(root + 'ferre');
        }
        break;
      default:
        console.warn('Unrecognized verb conjugation: ' + conj);
        break;
    }
    if(root == null) {
      console.warn('unknown verb: ' + orth);
      console.info(verbMatch);
      return null;
    }
    perfectEnding.forEach(function(end){
      parts.perfect.addIfNotIn(findRootForEnding(root,end,conj) + end);
    });
    supineEnding.forEach(function(end){
      parts.supine.addIfNotIn(findRootForEnding(root,end,conj) + end);
    })
    if(root) parts.root.addIfNotIn(root);
  });
  return parts;
}
findThirdDeclensionRoot = exports.findThirdDeclensionRoot = function findThirdDeclensionRoot(nom,gen) {
  // nom,gen are, e.g., iter,itineris; ordo,inis; Acherōn, tis; expers, tis; supellex, supellectilis
  // Algorithm:
  // if(gen.startsWith(vowel))
  //   nomRoot = nom (substring to last vowel), e.g., iter=>it, ordo=> ord
  //   start with the last vowel in the gen ending and keep checking if nom+genEnd.endsWith(gen);
  //   e.g., itis? no. iteris? no. itineris? yes. return.
  //         ordis? no.  rdinis? yes. return.
  // 
  //   
  // special case for iens, euntis
  if(gen.match(/[eēĕë][uūŭü]ntis$/) && nom.match(/[iīĭï][eēĕë]ns$/)) {
    return nom.slice(0,-4) + 'eunt';
  }
  for(var x=1; x<3; x++) {
    var match = nom.match('^(.+)([aeiouyœæāēīōūȳăĕĭŏŭäëïöüÿ][^aeiouyœæāēīōūȳăĕĭŏŭäëïöüÿ]*){'+x+'}$');
    if(!match) break;
    var nomRoot = match[1];
    var y = 1;
    while(match = gen.match('(?:[aeiouyœæāēīōūȳăĕĭŏŭäëïöüÿ][^aeiouyœæāēīōūȳăĕĭŏŭäëïöüÿ]*){'+y+'}$')) {
      var candidate = nomRoot + match[0];
      if(candidate.match(gen+'$')) {
        candidate = candidate.slice(0,-2);
        return candidate;
      }
      y++;
    }
  }
  var firstPart;
  if(gen.match(/^tis$/)) firstPart = 's';
  else if(gen.match(/^cis$/)) firstPart = 'x';
  else {
    firstPart = gen.match(/^(.*?)[aeiouyœæāēīōūȳăĕĭŏŭäëïöüÿ]/)[1].slice(0,1);
  }
  var index = nom.lastIndexOf(firstPart);
  gen = gen.slice(0,-2);
  if(index>=0 && index<nom.length) {
    var candidate = nom.slice(0,index) + gen;
    return candidate
  }
  return gen;
}
declineAdjective = exports.declineAdjective = (function(){
  var comparative = ['ior','iōris','ius'];
  var block = {
    'ī': ['a','ae','am','ā','ārum','īs','ās',
           'ī','ō','um','e','ōrum','ōs','ē'],
    'is': ['is','ī','em','e','ēs','um','ium','ibus',
           'a','ia','iter'],
    'ōrum': ['a','ae','ārum','īs','ās',
           'ōrum','ōs']
  }
  return function(nom,itype,skipComparative) {
    var endings,root,result=[nom];
    var match = itype.match(/(?:^|\s)([a-zāăäēĕëīĭïōŏöūŭüȳÿ-]+is)(?:[,;.\s]|$)/i);
    if(match || nom.match(/is$/)) {
      endings = block['is'];
      root = match?
        findThirdDeclensionRoot(nom,handleDiacritics(match[1])) :
        nom.slice(0,-2);
      if(root.match(/t$/i)) {
        endings = endings.slice();
        endings.push('er');
      }
      //console.info(nom + ', ' + root + 'is');
    } else if(nom.match(/[uü]s$/)) {
      endings = block['ī'];
      root = nom.slice(0,-2);
    } else if(nom.match(/er$/)) {
      var fem = itype.match(/\s*(\S*)a[,;.]*(?:\s|$)/i);
      var neu = itype.match(/\s*(\S*)um[,;.]*(?:\s|$)/i);
      var gen = itype.match(/\s*(\S*)ī[,;.]*(?:\s|$)/i);
      if(neu) {
        neu = neu[1] + 'um';
      } else if(fem) {
        neu = fem[1] + 'um';
      } else if(gen) {
        neu = gen[1] + 'um';
      } else {
        console.info('What is this?  %s: %s', nom, itype);
        return;
      }
      neu = handleDiacritics(neu);
      if(neu[0]=='(') console.info('Warning (%s): genitive = ' + neu, nom);
      root = findThirdDeclensionRoot(nom,neu);
      endings = block['ī'];
    } else if(nom.match(/ī$/)) {
      //plurale tantum
      endings = block['ōrum'];
    } else if(nom.match(/ēs$/)) {
      var gen = itype.match(/\s*(\S+)a[,;.]*(?:\s|$)/i);
      if(gen) {
        endings = block['is'];
        root = findThirdDeclensionRoot(nom,gen[1]);
      } else return;
    } else {
      console.info('ERROR determinining declension of adjective: %s: (%s)', nom, itype);
      return;
    } 
    for(var i=0; i < endings.length; ++i) {
      var newWord = root + endings[i];
      if(result.indexOf(newWord)<0) result.push(newWord);
    }
    return result;
  }
})();
declineNoun = exports.declineNoun = (function(){
  var declensions = {
    '1': [['a','ae','am','ā'],['ae','ārum','īs','ās','ābus']],
    '2': [['us','ī','ō','um','e'],['ī','ōrum','īs','ōs','ōbus']],
    '2n':[['um','ī','ō'],['a','ōrum','īs']],
    '3': [['','is','ī','em','e'],['ēs','um','ium','ibus']],
    '3n1':[['','is','ī','e'],['ia','ium','ibus','a','um']],
    '3n2':[['','is','ī','e'],['a','um','ibus','ia','ium']],
    '4': [['us','ūs','ui','um','ū'],['ūs','uum','ibus']],
    '4n':[['ū','ūs'],['ua','uum','ibus']],
    '5': [['ēs','ēī','em','ē','ērum','ēbus']],
    '5a':[['es','eī','em','ē','ēs','ērum','ēbus']]
  }
  return function(nom,gen) {
    if(gen == 'i') gen = 'ī';
    var decl, i, found = false, result = [nom], root;
    for(decl in declensions) {
      var endings = declensions[decl];
      for(i in endings) {
        if(!endings.hasOwnProperty(i)) continue;
        var curEndings = endings[i];
        var j = 0;
        if(found || (nom.endsWith(curEndings[0]) && (gen.endsWith(curEndings[1]) || gen.endsWith(curEndings[1].removeDiacritics())))) {
          found = true;
          if(!root) {
            j = 1;
            root = nom.slice(0,-curEndings[0].length);
            if(!root) {
              if(gen[0]=='(') console.info('Warning (%s): genitive = ' + gen, nom);
              root = findThirdDeclensionRoot(nom,gen);
            }
          }
          for(; j < curEndings.length; ++j) {
            var newWord = root + curEndings[j];
            if(result.indexOf(newWord)<0) result.push(newWord);
          }
        }
      }
      if(found) break;
    }
    return result;
  }
})();
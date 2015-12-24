var regexLatin = /((?:<(?:b|i|sc)>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aáā]ns|p[oóō]st|[aáā]d|[oóō]bs|[eéē]x|p[eéēoóō]r|[iíī]n|r[eéē](?:d(?=d|[aeiouyáéëïíóúýǽæœāēīōūȳ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëïíóúýǽæœāēīōūȳ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëïíóúýǽæœāēīōūȳ])(?:[\wáéíóúýǽæœāēīōūȳ]*(?=-)|(?=(?:n[cg]u|sc|[sc][tp]r?|gn|ps)[aeiouyáéëïíóúýǽæœāēīōūȳ]|[bcdgptf][lrh][\wáéíóúýǽæœāēīōūȳ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëïéíóúýǽæœāēīōūȳ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëïéíóúýǽæœāēīōūȳ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/(?:b|i|sc)>)*)/gi;
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
String.prototype.removeDiacritics = function() {
  return this.toLowerCase().replace(/ae/g,'æ').replace(/oe/g,'œ').replace(/[āēīōūȳăĕĭŏŭäëïöüÿ]/g, function(match){
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
    }
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
      regex = new RegExp(
        ((firstEndingSyl[3] == 'i' && firstEndingSyl[1].length == 2)?
          firstEndingSyl[0].reverse() :
          ((firstEndingSyl[4]? '':'(^|[^rl])')+firstEndingSyl[1].reverse())
        )
      );
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
    var choppedOff = root.slice(root.length-(match.index + match[0].length));
    var lmnr = 'lmnr'.split('');
    var doubleConsonant = '';
    if(endingNoDiacritics.match(/^[lmnr]/)) {
      lmnr.splice(lmnr.indexOf(endingNoDiacritics[0]),1);
      doubleConsonant = '^'+endingNoDiacritics[0]+'(?='+endingNoDiacritics[0]+')|';
    }
    if(choppedOff.match(new RegExp(doubleConsonant+'^['+lmnr.join('')+'][^aeiouyæœ-]'))) { // if it chopped off an l,m,n, or r follewed by another consonant, put the r or l back
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
      }
      return newRoot;
    }
    // TODO: astiti should not become as-sastiti
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
getVerbParts = exports.getVerbParts = function getVerbParts(orth, verbMatch) {
  if(!verbMatch[1]) {
    console.info('unknown verb:', orth);
    return {};
  }
  var root = null;
  var parts = {root: [], infinitive: [], supine: [], perfect: []};
  var perfectEnding = (verbMatch[3]||[]).filter(function(ending) {
    return ending.match(/[iīĭï]$/i);
  });
  var supineEnding = (verbMatch[3]||[]).filter(function(ending) {
    return ending.match(/[rstxu][uūŭü][ms]$/i);
  });
  var verbEnding = orth.match(/(?:([eĕ])|([iĭ]))?([oōŏ])(r?)$|(f[eĕ]r[ot]|[aeiāăäĕēëīĭï]t|tur|sum)$/)
  if(!verbEnding) verbEnding = [];
  if(verbEnding[1]) verbEnding.eo = true; else verbEnding[1] = '';
  if(verbEnding[2]) verbEnding.io = true; else verbEnding[2] = '';
  if(verbEnding[3]) verbEnding.firstPerson = true; else verbEnding[3] = '';
  if(verbEnding[4]) verbEnding.deponent = true; else verbEnding[4] = '';
  verbMatch[1].forEach(function(conj) {
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
        if(verbEnding.eo) conj = 'eo';
        break;
      case 'perfect':
        if(orth.match(/[iīĭï]$/)) {
          root = orth.slice(0,-1);
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
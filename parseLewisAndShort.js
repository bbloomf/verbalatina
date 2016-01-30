var verbFunctions = require('./verbFunctions.js');
var regexLatin = /((?:<(?:b|i|sc)>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aáā]ns|p[oóō]st|[aáā]d|[oóō]bs|[eéē]x|p[eéēoóō]r|[iíī]n|r[eéē](?:d(?=d|[aeiouyáéëïíóúýǽæœāēīōūȳ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëïíóúýǽæœāēīōūȳ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëïíóúýǽæœāēīōūȳ])(?:[\wáéíóúýǽæœāēīōūȳ]*(?=-)|(?=(?:n[cg]u|sc|[sc][tp]r?|gn|ps)[aeiouyáéëïíóúýǽæœāēīōūȳ]|[bcdgptf][lrh][\wáéíóúýǽæœāēīōūȳ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëïéíóúýǽæœāēīōūȳ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëïéíóúýǽæœāēīōūȳ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/(?:b|i|sc)>)*)/gi;
String.prototype.endsWith = function(s){return s.length==0 || this.slice(-s.length)==s;};
String.prototype.reverse = function() { return this.split('').reverse().join(''); };
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
var debug = {
  showThirdDeclensions: false,
  showCrossReferences: false,
  showAllDeclensions: false
};

var verbEndings = {

}
var ambiguousForm = function(string) {
  var longVowels = {
    'a': 'ā',
    'e': 'ē',
    'i': 'ī',
    'o': 'ō',
    'u': 'ū',
    'y': 'ȳ'
  };
  var regex = /[āēīōūȳäëïöüÿ]\^|[ăĕĭŏŭ]_/i;
  var match = string.match(regex);
  if(match) {
    var short = match[0][0].removeDiacritics();
    var long = longVowels[short.toLowerCase()];
    var start = string.slice(0,match.index);
    var end = ambiguousForm(string.slice(match.index+2,string.length));
    var result = [];
    end.forEach(function(end){
      result.push(start + short + end, start + long + end);
    });
    return result;
  }
  return [string];
}
var removeBreves = function(string) {
  return string.replace(/[ăĕĭŏŭ](?!_)/ig, function(shortVowel){
    return ({
      'ă': 'a',
      'ĕ': 'e',
      'ĭ': 'i',
      'ŏ': 'o',
      'ŭ': 'u',
      'Ă': 'A',
      'Ĕ': 'E',
      'Ĭ': 'I',
      'Ŏ': 'O',
      'Ŭ': 'U'
    })[shortVowel];
  });
}

var IndexVerborum = function(){};
IndexVerborum.prototype._add = function(array, root) {
  var verba = this;
  if(typeof array == 'string') {
    root = array;
    array = [root];
  }
  array.reduce(function(a,word){
    [].push.apply(a,ambiguousForm(removeBreves(word.replace(/-/g,''))));
    return a;
  },[]).forEach(function(word) {
    var tmp = verba[word] = verba[word] || [];
    tmp.addIfNotIn(root);
  });
}
var fs = require('fs'),
    xml = fs.readFileSync('lewisAndShort.xml',{encoding:'utf8'}),
    fileIndeclinables = 'output/indeclinables.txt',
    fileNouns = 'output/nouns.json',
    fileVerbs = 'output/verbs.json',
    fileOmniaVerba = 'output/omnia-verba.txt',
    verbs = [],
    nouns = [],
    omniaVerba = new IndexVerborum(),
    fileAdjectives = 'output/adjectives.txt',
    regexParentheses = /\s*[(（][^)）(（]+(?:[)）])\s*/g,
    regexEntry = /<entryFree[^>]*?>(([^`]*?<orth[^>]*?>[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*([a-zāăäēĕëīĭïōŏöūŭüȳÿ_^ -]+)([^<]*)<\/orth>)+?[^`]*?)<\/entryFree>/gi,
    regexOrth = /<orth[^>]*?>[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*([a-zāăäēĕëīĭïōŏöūŭüȳÿ_^ -]+)([^<]*)<\/orth>/i,
    regexGramGen = /<gen>([mfn]|comm?)\.<\/gen>/i,
    regexAdjType = /<\/(?:orth|gen)>(?:[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^<(-]*(?:<[^>]+>)?(?:\([^)]+\))?)*([a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*(?:is|ae|[iī]|[aā]rum|[oō]rum|ūs|um|ius)|a, um|indecl\.)[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]/i,
    regexVerb = / v(?:erb)?\. (?:[n|a]|freq|inch|dep|impers|act|neutral|de(fect|sid))[\.,\s]/,
    regexVerbType = /(?:([1-4])|(d?[āaăäeëēĕīiï]r[eiīï])|([a-zāăäēĕëīĭïōŏöūŭüȳÿ]*(?:i|[rstxu][uūŭü][ms]|ferre|(?:ss|ll)e))(?:\s+(?:sum|est))?|(?:or|no perf|freq|orig))(?:\s?[,;\.]*\s+)+/gi,
    //P. a. == participial adjective
    regexGramPos = /<pos>(P\. a|(?:(?:num|pron)\. )?ad[jv](?:\. num)?|prep|interj|v\. (?:freq|inch\. )?((?:dep|impers|[an])(?:\. )?)+)\.<\/pos>/i,
    regexGramPosFallback = /<hi rend="ital">(P\. a|(?:(?:num|pron)\. )?ad[jv](?:\. num)?|prep|interj|v\. (?:freq|inch\. )?((?:dep|impers|[an])(?:\. )?)+)[^`]*?\.<\/hi>/i,
    declensions = {
      'a': {
        'ae': '1st declension',
        'ōrum': '2nd declension neuter plural',
        'um': '3rd declension neutur plural'
      },
      'ae': {'ārum': '1st declension plural'},
      'um': { 'ī': '2nd declension neuter'},
      'us': {
        'ī': '2nd declension masculine',
        'ūs': '4th declension'
      },
      'ī': {'ōrum': '2nd declension masculine plural'},
      'es': {
        'eī': '5th declension',
        'um': '3rd declension plural'
      },
      '': {'is': '3rd declension'}
    },
    entry, count=0, ignore=0, noGram=0, numGen=0, numAdjType=0, numVerbType=0, numVerb=0, numUnknown=0,
    numPos={
      adj:  0,
      adv:  0,
      dep:  0,
      prep: 0
    };
function getVerbMatch(orth, verbParts) {
  //console.info(orth, verbParts)
  regexVerbType.exec('');
  var match = regexVerbType.exec(verbParts);
  var verbMatch = [];
  while(match) {
    var i=1; for(i = i; i < match.length; ++i) {
      if(match[i]) verbMatch.addToIndex(i, i==1? parseInt(match[i]) : match[i]);
    }
    match = regexVerbType.exec(verbParts);
  }
  var regexInfinitive = /(?:([āaä])|([ëē])|([eĕ])|([īiï]))r[eiīï]$/i;
  var regexPerfect = /[āaä](?:t[uŭüū]s|v[iīĭï])$/i;
  if(verbMatch[2]) {
    verbMatch[2].forEach(function(ending) {
      match = ending.match(regexInfinitive);
      for(var i=1; match && i<5; ++i) {
        if(match[i] && (!verbMatch[1] || verbMatch[1].indexOf(i)<0)) {
          verbMatch.addToIndex(1, i);
        }
      }
    });
  }
  if(verbMatch[3]) {
    verbMatch[3].forEach(function(ending) {
      match = ending.match(regexPerfect);
      if(match && (!verbMatch[1] || verbMatch[1].length == 0)) {
        verbMatch.addToIndex(1, 1);
      }
      var verbClass = null;
      if(!verbMatch[1]) {
        if(ending.match(/(?:tŭli|lātum|ferre)$/) && orth.match(/f[eĕ]r[ot]$/)) {
          verbClass = 'ferre';
        } else if(ending.match(/(?:fui|f[ŭu]tūrus|esse|posse)$/) && orth.match(/s[uūŭ]m$/)) {
          verbClass = 'esse';
        } else if(ending.match(/isse$/)) {
          verbClass = 'perfect';
        } else {
          match = orth.match(/([eĕ]?)o(r?)$/);
          if(match) {
            verbClass = match[1]? 2 : 3;
          }
        }
      }
      if(verbClass && (!verbMatch[1] || verbMatch[1].indexOf(verbClass)<0)) {
        verbMatch.addToIndex(1, verbClass);
      }
    });
  }
  return verbMatch;
}
while( (entry = regexEntry.exec(xml)) ) {
  ++count;
  var orth = handleDiacritics(entry[3]);
  if(entry[3].match(/-\s*$|^\s*-/)) {
    ++ignore;
console.info('prefix/suffix: ' + orth);
    continue;
  } else {
console.info('\north: ' + orth);
  }
  var gen = regexGramGen.exec(entry[1]);
  var adjType = regexAdjType.exec(entry[1]);
  var pos = regexGramPos.exec(entry[1]);
  var fullEntry = entry[1].match(/<\/orth>([^`]*?)(?:$|<\/entryFree>)/);
  var fullText = fullEntry[1].replace(/<(bibl|foreign|cit|quote|etym)[^>]*>.*?<\/\1>;?|<[^>]+>/g,'');
  var fullTextSansParentheses = fullText.replace(regexParentheses,' ').replace(regexParentheses,' ').replace(/\s*\[[^\]]+\]\s*/g,' ');
  var verbMatch = fullTextSansParentheses.match(regexVerb);
  // TODO: fix consulto
  var verbParts;
  if(verbMatch) {
    var useBackupParts = (verbMatch[1] == 'fect');
    verbParts = fullTextSansParentheses.slice(0,verbMatch.index+verbMatch[0].length);
    regexVerbType.exec('');
    verbMatch = regexVerbType.exec(verbParts);
    if(!verbMatch && useBackupParts) {
      verbParts = ', ĕre, 3';
      verbMatch = true;
    }
  }
  //TODO: use other orths, besides the first one; var orths = regexOrth.exec(entry[1]);
  if(!pos) pos = regexGramPosFallback.exec(entry[1]);
  if(gen || pos || adjType || verbMatch) {
    if(gen) {
      gen = gen[1];
      if(fullTextSansParentheses.indexOf(gen) < 0) gen = ''; else
      ++numGen;
      //console.info('gen: ' + gen);
    }
    if(adjType) {
      adjType = adjType[1];
      if(fullTextSansParentheses.indexOf(adjType) < 0) adjType = ''; else
      ++numAdjType;
      //console.info('adjType: ' + adjType);
    }
    if(verbMatch) {
      // if the verb is defective, don't look for parts.
      verbMatch = getVerbMatch(orth,verbParts);
      //verbParts = getVerbParts(orth,verbMatch);
      ++numVerbType;
      //console.info('verbType: ' + verbMatch);
    }
    if(pos) {
      pos = pos[1];
      if(fullTextSansParentheses.indexOf(pos) < 0) pos = ''; else
      ++(numPos[pos]);
      //console.info('pos: ' + pos);
    }
    if(verbMatch && orth.reverse().match(/^([oōŏörmtiīïĭ]|[eēĕë]r)/)) {
      //console.info('verb:', orth);
      numVerb++;
      var verb = {orthography: orth, verbParts: verbParts, parts: verbFunctions.getVerbParts(orth, verbMatch), verbMatch: verbMatch, fullText: fullTextSansParentheses};
      verbs.push(verb);
      omniaVerba._add(conjugateVerb(verb.parts), orth);
    } else if(gen) {
      // noun
      if(adjType) {
        //console.info('noun declension:', declineNoun(orth,adjType));
        numGen++;
        nouns.push({orthography: orth, type: adjType, pos: gen});
        omniaVerba._add(declineNoun(orth, adjType), orth);
      }
      else {
        console.info('no adjType....why?')
      }
    } else if(adjType && adjType != 'indecl.' && (!pos || pos.match(/adj\./))) {
      //console.info('adj declension:', declineAdjective(orth,adjType));
      numAdjType++;
      nouns.push({orthography: orth, type: adjType, pos: 'adj'});
      omniaVerba._add(declineNoun(orth, adjType), orth);
    } else {
      omniaVerba._add(orth);
    }
    continue;
  } else {
    //consider it indeclinable
    console.info('no gender nor pos...indeclinable?');
  }
  //console.info(orth + ': ' + (gramGrp && gramGrp[0]));
}
fs.writeFileSync(fileVerbs,JSON.stringify(verbs, null, '\t'));
fs.writeFileSync(fileNouns,JSON.stringify(nouns, null, '\t'));
fs.writeFileSync(fileOmniaVerba, JSON.stringify(omniaVerba));
fs.writeFileSync('erratapossibilia.json', JSON.stringify(Object.keys(omniaVerba).reduce(function(a,key){
  if(omniaVerba[key].length>3) {
    a[key] = omniaVerba[key];
  }
  return a;
},{})))
console.info('Total: ' + count);
console.info('Ignored: ' + ignore);
console.info('No GramGrp: ' + noGram);
console.info('#Gen: ' + numGen);
console.info('#Adj Type: ' + numAdjType);
console.info('#Verb Type: ' + numVerbType);
console.info('#Verb: ' + numVerb);
console.info('#Unknown: ' + numUnknown);
console.info('#Pos: ' + JSON.stringify(numPos));
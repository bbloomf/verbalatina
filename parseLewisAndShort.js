var regexLatin = /((?:<(?:b|i|sc)>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aáā]ns|p[oóō]st|[aáā]d|[oóō]bs|[eéē]x|p[eéēoóō]r|[iíī]n|r[eéē](?:d(?=d|[aeiouyáéëïíóúýǽæœāēīōūȳ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëïíóúýǽæœāēīōūȳ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëïíóúýǽæœāēīōūȳ])(?:[\wáéíóúýǽæœāēīōūȳ]*(?=-)|(?=(?:n[cg]u|sc|[sc][tp]r?|gn|ps)[aeiouyáéëïíóúýǽæœāēīōūȳ]|[bcdgptf][lrh][\wáéíóúýǽæœāēīōūȳ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëïéíóúýǽæœāēīōūȳ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëïéíóúýǽæœāēīōūȳ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/(?:b|i|sc)>)*)/gi;
String.prototype.endsWith = function(s){return s.length==0 || this.slice(-s.length)==s;}
var debug = {
  showThirdDeclensions: false,
  showCrossReferences: false,
  showAllDeclensions: false
};

var verbEndings = {

}
var handleDiacritics = function(string) {
  return string.replace(/([āēīōūȳ])\^|(ăĕĭŏŭ)_/ig, function(match,longVowel,shortVowel){
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
var findThirdDeclensionRoot = function(nom,gen) {
  // nom,gen are, e.g., iter,itineris; ordo,inis; Acherōn, tis; expers, tis; supellex, supellectilis
  // Algortihm:
  // if(gen.startsWith(vowel))
  //   nomRoot = nom (substring to last vowel), e.g., iter=>it, ordo=> ord
  //   start with the last vowel in the gen ending and keep checking if nom+genEnd.endsWith(gen);
  //   e.g., itis? no. iteris? no. itineris? yes. return.
  //         ordis? no.  rdinis? yes. return.
  // 
  //   
  //
  var showDebug = (nom.match(/Iuppiter/i) || debug.showThirdDeclensions);
  for(var x=1; x<3; x++) {
    var match = nom.match('^(.+)([aeiouyœæāēīōūȳ][^aeiouyœæāēīōūȳ]*){'+x+'}$');
    if(!match) break;
    var nomRoot = match[1];
    var y = 1;
    while(match = gen.match('(?:[aeiouyœæāēīōūȳ][^aeiouyœæāēīōūȳ]*){'+y+'}$')) {
      var candidate = nomRoot + match[0];
      if(candidate.match(gen+'$')) {
        candidate = candidate.slice(0,-2);
        if(showDebug) console.info('%s, %s-',nom,candidate);
        return candidate;
      }
      y++;
    }
  }
  var firstPart;
  if(gen.match(/^tis$/)) firstPart = 's';
  else if(gen.match(/^cis$/)) firstPart = 'x';
  else {
    firstPart = gen.match(/^(.*?)[aeiouyœæāēīōūȳ]/)[1].slice(0,1);
  }
  var index = nom.lastIndexOf(firstPart);
  gen = gen.slice(0,-2);
  if(index>=0 && index<nom.length) {
    var candidate = nom.slice(0,index) + gen;
    if(showDebug) console.info('%s, %s-',nom,candidate);
    return candidate
  }
  if(showDebug) console.info('%s, %s-',nom,gen);
  return gen;
}

var conjugateVerb = function(orth,verbInfo) {
  var root = orth;
  var conj = verbInfo.match(/(?:^|\s)([1-4])(?:$|[,<\s])/);
  if(conj) conj = conj[1];
  if(orth.match(/[oōöŏ]$/)) {
    root = root.slice(0, 
      (conj == 2 || conj == 4 || (conj == 3 && orth.slice(-2)[0].match(/[iïĭ]/i)))? -2 : -1);
  } else if(orth.match(/[aäāēëeiïī]t$/)) {
    root = root.slice(0, -2);
  }
  return root + (['', 'āre', 'ēre', 'ere', 'īre'])[conj];
}

var declineAdjective = (function(){
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

var declineNoun = (function(){
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
        var curEndings = endings[i];
        var j = 0;
        if(found || (nom.endsWith(curEndings[0]) && gen.endsWith(curEndings[1]))) {
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
var fs = require('fs'),
    xml = fs.readFileSync('lewisAndShort.xml',{encoding:'utf8'}),
    fileIndeclinables = 'output/indeclinables.txt',
    fileNouns = 'output/nouns.txt',
    fileVerbs = 'output/verbs.json',
    verbs = [],
    fileAdjectives = 'output/adjectives.txt',
    regexEntry = /<entryFree[^>]*?>(([^`]*?<orth[^>]*?>[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*([a-zāăäēĕëīĭïōŏöūŭüȳÿ_^ -]+)([^<]*)<\/orth>)+?[^`]*?)<\/entryFree>/gi,
    regexOrth = /<orth[^>]*?>[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*([a-zāăäēĕëīĭïōŏöūŭüȳÿ_^ -]+)([^<]*)<\/orth>/i,
    regexGramGen = /<gen>([mfn]|comm?)\.<\/gen>/i,
    regexAdjType = /<\/(?:orth|gen)>(?:[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*(?:<[^>]+>)?(?:\([^)]+\))?)*([a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*(?:is|ae|[iī]|[aā]rum|[oō]rum|ūs|um|ius)|a, um|indecl\.)[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]/i,
// todo: first get rid of tags and parenthetic remarks, then find the verb type. The tags are not reliable enough
    regexVerbType = /<\/(?:orth|gen)>(?:[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*(?:<[^>]+>)?(?:\([^)]+\))?)*((?:(?:\s*\([^)]+\)\s*)?(?:[,]| and| or)?\s*(?:rarely\s*)?(?:([a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]*(?:[āēeĕī]r[eĕiī]|[īi]|u[ms]))|([1-4])|no perf.))+)[^a-zāăäēĕëīĭïōŏöūŭüȳÿ_^-]/i,
    //regexVerbType = /<itype>((?:(?:.*?, )?(1|[āaä]r[eiī])|(2|[ēë]r[eiī])|(3|ere|[iī])|(4|[īiï]r[eiī]))|([^<]+))<\/itype>/i,
    regexVerbParts = /<itype>[a-zāăäēĕëīĭïōŏöūŭüȳÿ-]+[iī],\s+[a-zāăäēĕëīĭïōŏöūŭüȳÿ-]+um(?:, ([1-4]|[a-zāăäēĕëīĭïōŏöūŭüȳÿ-]+re))?<\/itype>/i,
    //P. a. == participial adjective
    regexGramPos = /<pos>(P\. a|(?:(?:num|pron)\. )?ad[jv](?:\. num)?|prep|interj|v\. (?:freq|inch\. )?((?:dep|[an])(?:\. )?)+)\.<\/pos>/i,
    regexGramPosFallback = /<hi rend="ital">(P\. a|(?:(?:num|pron)\. )?ad[jv](?:\. num)?|prep|interj|v\. (?:freq|inch\. )?((?:dep|[an])(?:\. )?)+)[^`]*\.<\/hi>/i,
    //regexVerbParts = /,\s*(?:([āēīae])r(e)|([āēī])?ī)[,;]?\s*/i,
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
  var verbType = regexVerbType.exec(entry[1]);
  var pos = regexGramPos.exec(entry[1]);
  var verbParts = regexVerbParts.exec(entry[1]);
  //TODO: use other orths, besides the first one; var orths = regexOrth.exec(entry[1]);
  if(!pos) pos = regexGramPosFallback.exec(entry[1]);
  if(gen || pos || adjType || verbType) {
    if(gen) {
      ++numGen;
      gen = gen[1];
      console.info('gen: ' + gen);
    }
    if(adjType) {
      adjType = adjType[1];
      ++numAdjType;
      console.info('adjType: ' + adjType);
    }
    if(verbType) {
      verbType = verbType[1];
      ++numVerbType;
      console.info('verbType: ' + verbType);
    }
    if(pos) {
      pos = pos[1];
      ++(numPos[pos]);
      console.info('pos: ' + pos);
    }
    if(gen) {
      // noun
      if(adjType) console.info('noun declension:', declineNoun(orth,adjType));
      else console.info('no adjType....why?')
    } else if(adjType && adjType != 'indecl.' && (!pos || pos.match(/adj\./))) {
      console.info('adj declension:', declineAdjective(orth,adjType));
    } else if(pos && pos.match(/v\./)) {
      //console.info('infinitive:', conjugateVerb(orth,verbType));
      var fullEntry = entry[1].match(/<\/orth>([^`]*?)(?:$|<\/entryFree>)/);
      var fullText = fullEntry[1].replace(/<(bibl|foreign|cit|quote) [^>]+>.*?<\/\1>;?|<[^>]+>/g,'');
      verbs.push({orthography: orth, verbType: verbType, fullText: fullText});
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
      // benefacio, fēci, factum
      // beneplaceo, ŭi, itum, 2

    }
    continue;
    //if(gen && pos) console.info(orth);
    if((type && type.match(regexVerbParts)) || gramGrp.match(regexVerbParts)) {
      //verb
      numVerb++;
    } else if(pos.match(/adj\./)) {
      //adjective...
      declineAdjective(orth,handleDiacritics(type||gramGrp.match(/^<gramGrp(?:\s[^>]*)?>(?:\s*?\([^)]+\)[,;.\s]*(?=[^,.;\s]))?([^]+)<\/gramGrp>/)[1]));
    } else if(pos.match(/P\. a\./)) {
      //TODO: delcine participial adjective
    } else if(pos) {
      //indeclinable
    } else if(gen) {
      //if(!type) console.info('noun w/o type: ' + orth);
      //noun
      
      var genitive = type && type.match(/(?:\s*\([^)]+\))?([^\s,]+)[\s,]+$/);
      if(genitive) {
        genitive = handleDiacritics(genitive[1]);
        if(console.showAllDeclensions) {
          console.info(orth + ':' + genitive + ':' + JSON.stringify(declineNoun(orth,genitive)));
        }
      }
    } else if(emph && emph.match(/(num|pra?ep|conj|pron(?:om)?)\.?/)) {
      //number / prep: indeclinable
    } else if(type && type.match(/^\s*see\s/i)) {
      if(debug.showCrossReferences) {
        console.info('cross reference: ' + type + ' (' + orth + ')');
      }
    } else {
      //unknown...
      if(emph) {
        //console.info('unknown: ' + orth);
       //console.info(' (' + emph + ')');
     }
      ++numUnknown;
    }

  } else {
    //consider it indeclinable
    console.info('no gender nor pos...indeclinable?');
  }
  //console.info(orth + ': ' + (gramGrp && gramGrp[0]));
}
fs.writeFileSync(fileVerbs,JSON.stringify(verbs));
console.info('Total: ' + count);
console.info('Ignored: ' + ignore);
console.info('No GramGrp: ' + noGram);
console.info('#Gen: ' + numGen);
console.info('#Adj Type: ' + numAdjType);
console.info('#Verb Type: ' + numVerbType);
console.info('#Verb: ' + numVerb);
console.info('#Unknown: ' + numUnknown);
console.info('#Pos: ' + JSON.stringify(numPos));
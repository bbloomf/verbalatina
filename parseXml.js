var regexLatin = /((?:<(?:b|i|sc)>)*)(((?:(?:(\s+)|^)(?:s[uú](?:bs?|s(?=[cpqt]))|tr[aáā]ns|p[oóō]st|[aáā]d|[oóō]bs|[eéē]x|p[eéēoóō]r|[iíī]n|r[eéē](?:d(?=d|[aeiouyáéëïíóúýǽæœāēīōūȳ]))))|(?:(?:(\s+)|)(?:(?:i(?!i)|(?:n[cg]|q)u)(?=[aeiouyáéëïíóúýǽæœāēīōūȳ])|[bcdfghjklmnprstvwxz]*)([aá]u|[ao][eé]?|[eiuyáéëïíóúýǽæœāēīōūȳ])(?:[\wáéíóúýǽæœāēīōūȳ]*(?=-)|(?=(?:n[cg]u|sc|[sc][tp]r?|gn|ps)[aeiouyáéëïíóúýǽæœāēīōūȳ]|[bcdgptf][lrh][\wáéíóúýǽæœāēīōūȳ])|(?:[bcdfghjklmnpqrstvwxz]+(?=$|[^\wáëïéíóúýǽæœāēīōūȳ])|[bcdfghjklmnpqrstvwxz](?=[bcdfghjklmnpqrstvwxz]+))?)))(?:([\*-])|([^\w\sáëïéíóúýǽæœāēīōūȳ]*(?:\s[:;†\*\"«»‘’“”„‟‹›‛])*\.?(?=\s|$))?)(?=(\s*|$)))((?:<\/(?:b|i|sc)>)*)/gi;
String.prototype.endsWith = function(s){return s.length==0 || this.slice(-s.length)==s;}
var debug = {
  showThirdDeclensions: false,
  showCrossReferences: false,
  showAllDeclensions: false
};

var handleDiacritics = function(string) {
  return string.replace(/&([aeiouy])(?:(macr)|(uml));/ig, function(match,vowel,macron,umlaut){
    return (macron? ({
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
    }) : ({
      'a': 'ä',
      'e': 'ë',
      'i': 'ï',
      'o': 'ö',
      'u': 'ü',
      'y': 'ÿ',
      'A': 'Ä',
      'E': 'Ë',
      'I': 'Ï',
      'O': 'Ö',
      'U': 'Ü',
      'Y': 'Ÿ'
    }))[vowel];
  });
}
var findThirdDeclensionRoot = function(nom,gen) {
  // nom,gen are, e.g., iter,itineris; ordo,inis; Acherōn, tis; expers, tis;
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
    var match = itype.match(/(?:^|\s)([a-zāēīōūȳ-]+is)(?:[,;.\s]|$)/i);
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
      root = nom.slice(0,-1);
    } else if(nom.match(/er$/)) {
      var fem = itype.match(/\s*(\S+)a[,;.]*(?:\s|$)/i);
      var neu = itype.match(/\s*(\S+)um[,;.]*(?:\s|$)/i);
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
    '1': [['a','ae','am','ā'],['ae','ārum','īs','ās']],
    '2': [['us','ī','ō','um','e'],['ī','ōrum','īs','ōs']],
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
    xml = fs.readFileSync('lewis.xml',{encoding:'utf8'}),
    fileIndeclinables = 'output/indeclinables.txt',
    fileNouns = 'output/nouns.txt',
    fileVerbs = 'output/verbs.txt',
    fileAdjectives = 'output/adjectives.txt',
    regexEntry = /<entry[^>]*?>[^`]*?<orth[^>]*?>[^a-z&-]*([a-z&;-]+)\s*([^<]*)[^`]*?<\/orth>[^`]*?<\/entry>/gi,
    regexGramGrp = /<gramGrp(?:\s[^>]*)?>([^`]*?)<\/gramGrp>/i,
    regexGramGen = /<gen>\s*([mfn])\s*<\/gen>/i,
    regexGramType = /<itype>([^`]*?)<\/itype>/i,
    regexGramPos = /<pos>\s*(ad[jv]|dep|prep)(?:\.?[,;]?)\s*<\/pos>/i,
    regexGramEmph = /<emph>\s*([^`]*?)\s*<\/emph>/i,
    regexVerbParts = /,\s*(?:(&[aei]macr;|[ae])r(e)|(&[aei]macr;)?&imacr;)[,;]?\s*/i,
    declensions = {
      'a': {
        'ae': '1st declension',
        'ōrum': '2nd declension neuter plurale',
        'um': '3rd declension neutur plurale'
      },
      'ae': {'ārum': '1st declension plurale'},
      'um': { 'ī': '2nd declension neuter'},
      'us': {
        'ī': '2nd declension masculine',
        'ūs': '4th declension'
      },
      'ī': {'ōrum': '2nd declension masculine plurale'},
      'es': {
        'eī': '5th declension',
        'um': '3rd declension plurale'
      },
      '': {'is': '3rd declension'}
    },
    entry, count=0, ignore=0, noGram=0, numGen=0, numType=0, numVerb=0, numUnknown=0,
    numPos={
      adj:  0,
      adv:  0,
      dep:  0,
      prep: 0
    };

while( (entry = regexEntry.exec(xml)) ) {
  ++count;
  var orth = handleDiacritics(entry[1]);
  if(entry[1].match(/-\s*$|^\s*-/)) {
    ++ignore;
//console.info('prefix/suffix: ' + orth);
    continue;
  }
  var gramGrp = regexGramGrp.exec(entry[0]);
  if(gramGrp) {
    gramGrp = gramGrp[0];
    var gen = regexGramGen.exec(gramGrp);
    var type = regexGramType.exec(gramGrp);
    var pos = regexGramPos.exec(gramGrp);
    var emph = regexGramEmph.exec(gramGrp);
    if(gen) {
      ++numGen;
      gen = gen[1];
    }
    if(type) {
      type = type[1];
      ++numType;
    }
    if(pos) {
      pos = pos[1];
      ++(numPos[pos]);
    }
    if(emph) emph = emph[1];
    //if(gen && pos) console.info(orth);
    if((type && type.match(regexVerbParts)) || gramGrp.match(regexVerbParts)) {
      //verb
      numVerb++;
    } else if(pos=='adj') {
      //adjective...
      declineAdjective(orth,handleDiacritics(type||gramGrp.match(/^<gramGrp(?:\s[^>]*)?>(?:\s*?\([^)]+\)[,;.\s]*(?=[^,.;\s]))?([^]+)<\/gramGrp>/)[1]));
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
    //console.info('No <gramGrp>: ' + orth);
    ++noGram;
  }
  //console.info(orth + ': ' + (gramGrp && gramGrp[0]));
}
console.info('Total: ' + count);
console.info('Ignored: ' + ignore);
console.info('No GramGrp: ' + noGram);
console.info('#Gen: ' + numGen);
console.info('#Type: ' + numType);
console.info('#Verb: ' + numVerb);
console.info('#Unknown: ' + numUnknown);
console.info('#Pos: ' + JSON.stringify(numPos));
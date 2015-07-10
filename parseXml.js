String.prototype.endsWith = function(s){return s.length==0 || this.slice(-s.length)==s;}

var handleMacrons = function(string) {
  return string.replace(/&([aeiouy])macr;/ig, '^$1');
}
var findThirdDeclensionRoot = function(nom,gen) {
  var nomEnd = nom.match(/^(.*?)(\^?[aeiouy][^aeiouy,;.]*)[,;.\s]*$/)[1];
  var genEnd = gen.match(/(\^?[aeiouy][^,;.]*)[,;.\s]*$/)[1];
  var candidate = (nomEnd + genEnd).slice(0,-2);
  genEnd = gen.slice(0,-2);
  for(var i=1; i<=genEnd.length; ++i) {
    if(genEnd.slice(-i,(1-i)||undefined) != candidate.slice(-i,(1-i)||undefined)) {
      candidate = candidate.slice(0,(1-i)||undefined) + genEnd.slice(-i);
    }
  }
  return candidate;
}

var declineAdjective = (function(){
  var comparative = ['ior','i^oris','ius'];
  var block = {
    '^i': ['a','ae','am','^a','^arum','^is','^as',
           '^i','^o','um','e','^orum','^is','^os','^e'],
    'is': ['is','^i','em','e','^es','um','ium','ibus',
           'a','ia','iter']
  }
  return function(nom,itype,skipComparative) {
    var endings,root,result=[nom];
    var match = itype.match(/(?:^|\s)(\S+is)[,;.]*(?:\s*|$)/);
    if(match || nom.match(/is$/)) {
      endings = block['is'];
      root = match?
        findThirdDeclensionRoot(nom,handleMacrons(match[1])) :
        nom.slice(0,-2);
      if(root.match(/t$/i)) {
        endings = endings.slice();
        endings.push('er');
      }
      //console.info(nom + ', ' + root + 'is');
    } else if(nom.match(/us$/)) {
      endings = block['^i'];
      root = nom.slice(0,-1);
    } else if(nom.match(/er$/)) {
      var fem = itype.match(/\s*(\S+)a[,;.]*(?:\s|$)/i);
      var neu = itype.match(/\s*(\S+)um[,;.]*(?:\s|$)/i);
      var gen = itype.match(/\s*(\S*)\^i[,;.]*(?:\s|$)/i);
      if(neu) {
        neu = neu[1] + 'um';
      } else if(fem) {
        neu = fem[1] + 'um';
      } else if(gen) {
        neu = gen[1] + 'um';
      } else {
        console.info('What is this?  ' + nom + ': ' + itype);
        return;
      }
      neu = handleMacrons(neu);
      root = findThirdDeclensionRoot(nom,neu);
      endings = block['^i'];
    } else {
      console.info('ERROR determinining declension of adjective: ' + nom + ': '+ itype);
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
    '1': [['a','ae','am','^a'],['ae','^arum','^is','^as']],
    '2': [['us','^i','^o','um','e'],['^i','^orum','^is','^os']],
    '2n':[['um','^i','^o'],['a','^orum','^is']],
    '3': [['','is','^i','em','e'],['^es','um','ium','ibus']],
    '3n1':[['','is','^i','e'],['ia','ium','ibus','a','um']],
    '3n2':[['','is','^i','e'],['a','um','ibus','ia','ium']],
    '4': [['us','^us','ui','um','^u'],['^us','uum','ibus']],
    '4n':[['^u','^us'],['ua','uum','ibus']],
    '5': [['^es','^e^i','em','^e','^erum','^ebus']],
    '5a':[['es','e^i','em','^e','^es','^erum','^ebus']]
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
    regexEntry = /<entry[^>]*?>[^`]*?<orth[^>]*?>\s*([^\s<]+)\s*([^<]*)[^`]*?<\/orth>[^`]*?<\/entry>/gi,
    regexGramGrp = /<gramGrp[^>]*?>([^`]*?)<\/gramGrp>/i,
    regexGramGen = /<gen>\s*([mfn])\s*<\/gen>/i,
    regexGramType = /<itype>([^`]*?)<\/itype>/i,
    regexGramPos = /<pos>\s*(ad[jv]|dep|prep)(?:\.?[,;]?)\s*<\/pos>/i,
    regexGramEmph = /<emph>\s*([^`]*?)\s*<\/emph>/i,
    regexVerbParts = /,\s*(?:(&[aei]macr;|[ae])r(e)|(&[aei]macr;)?&imacr;)[,;]?\s*/i,
    declensions = {
      'a': {
        'ae': '1st declension',
        '^orum': '2nd declension neuter plurale',
        'um': '3rd declension neutur plurale'
      },
      'ae': {'^arum': '1st declension plurale'},
      'um': { '^i': '2nd declension neuter'},
      'us': {
        '^i': '2nd declension masculine',
        '^us': '4th declension'
      },
      '^i': {'^orum': '2nd declension masculine plurale'},
      'es': {
        'e^i': '5th declension',
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

var realMacrons = function(string) {
  return string.replace(/[&^](?:([aeiouy])|([AEIOUY]))(?:macr;)?/g,function(match,lower,upper){
    if(upper) lower = upper.toLowerCase();
    var result;
    switch(lower) {
      case 'a':
        result = 'ā';
        break;
      case 'e':
        result = 'ē'
        break;
      case 'i':
        result = 'ī';
        break;
      case 'o':
        result = 'ō';
        break;
      case 'u':
        result = 'ū';
        break;
      case 'y':
        result = 'ӯ'
    }
    if(upper) result = result.toUpperCase();
    return result;
  })
}

while( (entry = regexEntry.exec(xml)) ) {
  ++count;
  var orth = handleMacrons(entry[1]);
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
      declineAdjective(orth,handleMacrons(type||gramGrp));
    } else if(pos) {
      //indeclinable
    } else if(gen) {
      //if(!type) console.info('noun w/o type: ' + orth);
      //noun
      var genitive = type && type.match(/([^\s,]+)[\s,]+$/);
      if(genitive) {
        genitive = handleMacrons(genitive[1]);
          
          //console.info(JSON.stringify(declineNoun(orth,genitive)));

        //if(!foundDeclension) console.info(orth + ', ' + genitive);
      }
    } else if(emph && emph.match(/(num|pra?ep|conj|pron(om)?)\.?/)) {
      //number / prep: indeclinable
    } else if(type && type.match(/^\s*see\s/i)) {
//console.info('cross reference: ' + type + ' (' + orth + ')');
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
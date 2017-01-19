var replaceMap = {
  "&": '`',
  "!": 'ͺ',
  "(": '῾',
  ")": '᾿',
  "+": '¨',
  "/": '´',
  ":": '·',
  ";": '·',
  "=": '῀',
  "?": ';',
  "@": '̣',
  "A": 'Α',
  "B": 'Β',
  "C": 'Ξ',
  "D": 'Δ',
  "E": 'Ε',
  "F": 'Φ',
  "G": 'Γ',
  "H": 'Η',
  "I": 'Ι',
  "J": 'Σ',
  "K": 'Κ',
  "L": 'Λ',
  "M": 'Μ',
  "N": 'Ν',
  "O": 'Ο',
  "P": 'Π',
  "Q": 'Θ',
  "R": 'Ρ',
  "S": 'Σ',
  "T": 'Τ',
  "U": 'Υ',
  "V": 'Ϝ',
  "W": 'Ω',
  "X": 'Χ',
  "Y": 'Ψ',
  "Z": 'Ζ',
  "\\": '`',
  "a": 'α',
  "b": 'β',
  "c": 'ξ',
  "d": 'δ',
  "e": 'ε',
  "f": 'φ',
  "g": 'γ',
  "h": 'η',
  "i": 'ι',
  "j": 'ς',
  "k": 'κ',
  "l": 'λ',
  "m": 'μ',
  "n": 'ν',
  "o": 'ο',
  "p": 'π',
  "q": 'θ',
  "r": 'ρ',
  "s": 'σ',
  "t": 'τ',
  "u": 'υ',
  "v": 'ϝ',
  "w": 'ω',
  "x": 'χ',
  "y": 'ψ',
  "z": 'ζ',
  "|": 'ͺ',
  "*": ''
};

function betaCodeToGreek(betacode) {
  return betacode.replace(/\*?([a-z])[&!()+/:;=?@\\|]*/g, function(match) {
    var replacement = match.replace(/[a-z&!()+/:;=?@\\|*]/g, function(char) {
      return replaceMap[char];
    });
    replacement = combineChars(replacement);
    if(match.match(/\*/)) replacement = replacement.toUpperCase();
    return replacement;
  });
}

function combineChars(greek) {
  var letter = greek.charAt(0);
  if (greek.indexOf('´') != -1) {
    // if the string contains /
    
        if (greek.indexOf('᾿') != -1) {
        // if the string contains )
                            
            if (greek.indexOf('ͺ') != -1) {
            // if the string contains |
                if (letter == "α") { greek = "ᾄ"; }            
                if (letter == "Α") { greek = "ᾌ"; }                            
                if (letter == "η") { greek = "ᾔ"; }            
                if (letter == "Η") { greek = "ᾜ"; } 
                if (letter == "ω") { greek = "ᾤ"; }            
                if (letter == "Ω") { greek = "ᾬ"; }                 
            } else {
                if (letter == "α") { greek = "ἄ"; }
                if (letter == "Α") { greek = "Ἄ"; }   
                if (letter == "η") { greek = "ἤ"; }            
                if (letter == "Η") { greek = "Ἤ"; } 
                if (letter == "ω") { greek = "ὤ"; }            
                if (letter == "Ω") { greek = "Ὤ"; }                                 
                if (letter == "ε") { greek = "ἔ"; }
                if (letter == "Ε") { greek = "Ἔ"; }                
                if (letter == "ι") { greek = "ἴ"; }
                if (letter == "Ι") { greek = "Ἴ"; }                
                if (letter == "ο") { greek = "ὄ"; }
                if (letter == "Ο") { greek = "Ὄ"; }                                
                if (letter == "υ") { greek = "ὔ"; }                
            }
        } else {
            if (greek.indexOf('῾') != -1) {
            // if the string contains (

                if (greek.indexOf('ͺ') != -1) {
                // if the string contains |
                    if (letter == "α") { greek = "ᾅ"; }
                    if (letter == "Α") { greek = "ᾍ"; } 
                    if (letter == "η") { greek = "ᾕ"; }            
                    if (letter == "Η") { greek = "ᾝ"; } 
                    if (letter == "ω") { greek = "ᾥ"; }            
                    if (letter == "Ω") { greek = "ᾭ"; }                     
                } else {
                    if (letter == "α") { greek = "ἅ"; }
                    if (letter == "Α") { greek = "Ἅ"; }
                    if (letter == "η") { greek = "ἥ"; }            
                    if (letter == "Η") { greek = "Ἥ"; } 
                    if (letter == "ω") { greek = "ὥ"; }            
                    if (letter == "Ω") { greek = "Ὥ"; }                     
                    if (letter == "ε") { greek = "ἕ"; }
                    if (letter == "Ε") { greek = "Ἕ"; }                
                    if (letter == "ι") { greek = "ἵ"; }
                    if (letter == "Ι") { greek = "Ἵ"; }                    
                    if (letter == "ο") { greek = "ὅ"; }
                    if (letter == "Ο") { greek = "Ὅ"; }                                    
                    if (letter == "υ") { greek = "ὕ"; }                    
                    if (letter == "Υ") { greek = "Ὕ"; }                    
                }           
            } else {
            // if the string contains no breathing mark

                if (greek.indexOf('ͺ') != -1) {
                // if the string contains a |
                    if (letter == "α") { greek = "ᾴ"; }
                    if (letter == "η") { greek = "ῄ"; }            
                    if (letter == "ω") { greek = "ῴ"; }            
                } else {
                    if (greek.indexOf('¨') != -1) {
                    // if the string contains contains +
                        if (letter == "ι") { greek = "ΐ"; }                       
                        if (letter == "υ") { greek = "ΰ"; }                 
                    } else {
                    // if the string contains no | and no +
                        if (letter == "α") { greek = "ά"; }
                        if (letter == "Α") { greek = "Ά"; }
                        if (letter == "η") { greek = "ή"; }            
                        if (letter == "Η") { greek = "Ή"; } 
                        if (letter == "ω") { greek = "ώ"; }            
                        if (letter == "Ω") { greek = "Ώ"; }                         
                        if (letter == "ε") { greek = "έ"; }
                        if (letter == "Ε") { greek = "Έ"; } 
                        if (letter == "ι") { greek = "ί"; }
                        if (letter == "Ι") { greek = "Ί"; }                        
                        if (letter == "ο") { greek = "ό"; }
                        if (letter == "Ο") { greek = "Ό"; }                         
                        if (letter == "υ") { greek = "ύ"; }                        
                        if (letter == "Υ") { greek = "Ύ"; }                                                
                    }                
                }                
            }
        }
      
    } else {
    
        if (greek.indexOf('`') != -1) {
        // if the string contains a \
        
            if (greek.indexOf('᾿') != -1) {
            // if the string contains a )
            
                if (greek.indexOf('ͺ') != -1) {
                // if the string contains a |
                
                    if (letter == "α") { greek = "ᾂ"; }
                    if (letter == "Α") { greek = "ᾊ"; }    
                    if (letter == "η") { greek = "ᾒ"; }            
                    if (letter == "Η") { greek = "ᾚ"; } 
                    if (letter == "ω") { greek = "ᾢ"; }            
                    if (letter == "Ω") { greek = "ᾪ"; }                                        
                } else {
                  
                    if (letter == "α") { greek = "ἂ"; }
                    if (letter == "Α") { greek = "Ἂ"; }    
                    if (letter == "η") { greek = "ἢ"; }            
                    if (letter == "Η") { greek = "Ἢ"; } 
                    if (letter == "ω") { greek = "ὢ"; }            
                    if (letter == "Ω") { greek = "Ὢ"; }                                                            
                    if (letter == "ε") { greek = "ἒ"; }
                    if (letter == "Ε") { greek = "Ἒ"; }   
                    if (letter == "ι") { greek = "ἲ"; }
                    if (letter == "Ι") { greek = "Ἲ"; }                       
                    if (letter == "ο") { greek = "ὂ"; }
                    if (letter == "Ο") { greek = "Ὂ"; }                      
                    if (letter == "υ") { greek = "ὒ"; }
                }
            
            } else {
              
                if (greek.indexOf('῾') != -1) {
                // if the string contains a (
                 
                    if (greek.indexOf('ͺ') != -1) {
                    // if the string contains a |                      
                    
                        if (letter == "α") { greek = "ᾃ"; }
                        if (letter == "Α") { greek = "ᾋ"; }
                        if (letter == "η") { greek = "ᾓ"; }            
                        if (letter == "Η") { greek = "ᾛ"; } 
                        if (letter == "ω") { greek = "ᾣ"; }            
                        if (letter == "Ω") { greek = "ᾫ"; }                           
                    } else {
                    // if the strings contains no iota
                      
                        if (letter == "α") { greek = "ἃ"; }
                        if (letter == "Α") { greek = "Ἃ"; }
                        if (letter == "η") { greek = "ἣ"; }            
                        if (letter == "Η") { greek = "Ἣ"; } 
                        if (letter == "ω") { greek = "ὣ"; }            
                        if (letter == "Ω") { greek = "Ὣ"; }                        
                        if (letter == "ε") { greek = "ἓ"; }
                        if (letter == "Ε") { greek = "Ἓ"; }                
                        if (letter == "ι") { greek = "ἳ"; }
                        if (letter == "Ι") { greek = "Ἳ"; }                        
                        if (letter == "ο") { greek = "ὃ"; }
                        if (letter == "Ο") { greek = "Ὃ"; }                              
                        if (letter == "υ") { greek = "ὓ"; }   
                        if (letter == "Υ") { greek = "Ὓ"; }   
                    }
                } else {
                // if the string contains no breathing mark

                    if (greek.indexOf('ͺ') != -1) {
                    // if the string contains |
                    
                        if (letter == "α") { greek = "ᾲ"; }
                        if (letter == "η") { greek = "ῂ"; }            
                        if (letter == "ω") { greek = "ῲ"; }            
                    } else {
                    
                        if (greek.indexOf('¨') != -1) {
                        // if the string contains + 
                        
                            if (letter == "ι") { greek = "ῒ"; }   
                            if (letter == "υ") { greek = "ῢ"; }

                        } else {
                        // if the string contains no | or + 
                        
                            if (letter == "α") { greek = "ὰ"; }
                            if (letter == "Α") { greek = "Ὰ"; }  
                            if (letter == "η") { greek = "ὴ"; }            
                            if (letter == "Η") { greek = "Ὴ"; } 
                            if (letter == "ω") { greek = "ὼ"; }            
                            if (letter == "Ω") { greek = "Ὼ"; }                             
                            if (letter == "ε") { greek = "ὲ"; }
                            if (letter == "Ε") { greek = "Ὲ"; }  
                            if (letter == "ι") { greek = "ὶ"; }
                            if (letter == "Ι") { greek = "Ὶ"; }                              
                            if (letter == "ο") { greek = "ὸ"; }
                            if (letter == "Ο") { greek = "Ὸ"; }                                                          
                            if (letter == "υ") { greek = "ὺ"; }
                            if (letter == "Υ") { greek = "Ὺ"; }                            
                        }                    
                    }           
                }
            }  
        } else {
    
            if (greek.indexOf('῀') != -1) {
            // if the string contains a =
            
                if (greek.indexOf('᾿') != -1) {
                // if the string contains a )
                
                    if (greek.indexOf('ͺ') != -1) {
                    // if the string contains a |                      
                        if (letter == "α") { greek = "ᾆ"; }                
                        if (letter == "Α") { greek = "ᾎ"; } 
                        if (letter == "η") { greek = "ᾖ"; }            
                        if (letter == "Η") { greek = "ᾞ"; } 
                        if (letter == "ω") { greek = "ᾦ"; }            
                        if (letter == "Ω") { greek = "ᾮ"; }                                                     
                    } else {
                        if (letter == "α") { greek = "ἆ"; }
                        if (letter == "Α") { greek = "Ἆ"; }                  
                        if (letter == "η") { greek = "ἦ"; }            
                        if (letter == "Η") { greek = "Ἦ"; } 
                        if (letter == "ω") { greek = "ὦ"; }            
                        if (letter == "Ω") { greek = "Ὦ"; }                                                                             
                        if (letter == "ι") { greek = "ἶ"; }
                        if (letter == "Ι") { greek = "Ἶ"; }                                          
                        if (letter == "υ") { greek = "ὖ"; }
                    }
                } else {
                  
                    if (greek.indexOf('῾') != -1) {
                    // if the string contains a (                  
                  
                        if (greek.indexOf('ͺ') != -1) {
                        // if the string contains a |                      

                            if (letter == "α") { greek = "ᾇ"; }
                            if (letter == "Α") { greek = "ᾏ"; }
                            if (letter == "η") { greek = "ᾗ"; }            
                            if (letter == "Η") { greek = "ᾟ"; } 
                            if (letter == "ω") { greek = "ᾧ"; }            
                            if (letter == "Ω") { greek = "ᾯ"; }                             
                        } else {
                            if (letter == "α") { greek = "ἇ"; }
                            if (letter == "Α") { greek = "Ἇ"; } 
                            if (letter == "η") { greek = "ἧ"; }            
                            if (letter == "Η") { greek = "Ἧ"; } 
                            if (letter == "ω") { greek = "ὧ"; }            
                            if (letter == "Ω") { greek = "Ὧ"; }                                                         
                            if (letter == "ι") { greek = "ἷ"; }
                            if (letter == "Ι") { greek = "Ἷ"; }                            
                            if (letter == "υ") { greek = "ὗ"; }                
                            if (letter == "Υ") { greek = "Ὗ"; }                                            
                        } 
                    } else {
                    // if the string contains no breathing marks
                    
                        if (greek.indexOf('ͺ') != -1) {
                        // if the string contains a |                      
                            if (letter == "α") { greek = "ᾷ"; }
                            if (letter == "η") { greek = "ῇ"; }            
                            if (letter == "ω") { greek = "ῷ"; }                              
                        } else {
                          
                            if (greek.indexOf('¨') != -1) {
                            // if the string contains + 

                               if (letter == "ι") { greek = "ῗ"; }
                               if (letter == "υ") { greek = "ῧ"; }
                            } else {
                            // if the string contains no | or +                         
                                if (letter == "α") { greek = "ᾶ"; }
                                if (letter == "η") { greek = "ῆ"; }            
                                if (letter == "ω") { greek = "ῶ"; }      
                                if (letter == "ι") { greek = "ῖ"; }    
                                if (letter == "υ") { greek = "ῦ"; }                
                            }
                        }                     
                    }                
                }
            } else {
            // if the string contains no accent marks
            
                if (greek.indexOf('᾿') != -1) {
                // if the string contains )
            
                    if (greek.indexOf('ͺ') != -1) {
                    // if the string contains a |
                    
                        if (letter == "α") { greek = "ᾀ"; }
                        if (letter == "Α") { greek = "ᾈ"; }
                        if (letter == "η") { greek = "ᾐ"; }            
                        if (letter == "Η") { greek = "ᾘ"; } 
                        if (letter == "ω") { greek = "ᾠ"; }            
                        if (letter == "Ω") { greek = "ᾨ"; }                          
                    } else {
                    // if the string contains no | and no +
                    
                        if (letter == "α") { greek = "ἀ"; }
                        if (letter == "Α") { greek = "Ἀ"; }
                        if (letter == "η") { greek = "ἠ"; }            
                        if (letter == "Η") { greek = "Ἠ"; } 
                        if (letter == "ω") { greek = "ὠ"; }            
                        if (letter == "Ω") { greek = "Ὠ"; }                           
                        if (letter == "ε") { greek = "ἐ"; }
                        if (letter == "Ε") { greek = "Ἐ"; } 
                        if (letter == "ι") { greek = "ἰ"; }
                        if (letter == "Ι") { greek = "Ἰ"; }                        
                        if (letter == "ο") { greek = "ὀ"; }
                        if (letter == "Ο") { greek = "Ὀ"; }                          
                        if (letter == "υ") { greek = "ὐ"; }
                    }        
                } else {
                    if (greek.indexOf('῾') != -1) {
                    // if the string contains (
     
                        if (greek.indexOf('ͺ') != -1) {
                        // if the string contains a |                      
                        
                            if (letter == "α") { greek = "ᾁ"; }
                            if (letter == "Α") { greek = "ᾉ"; }   
                            if (letter == "η") { greek = "ᾑ"; }            
                            if (letter == "Η") { greek = "ᾙ"; } 
                            if (letter == "ω") { greek = "ᾡ"; }            
                            if (letter == "Ω") { greek = "ᾩ"; }                             
                        } else {
                        // if the string contains no iota                      
                        
                            if (letter == "α") { greek = "ἁ"; }
                            if (letter == "Α") { greek = "Ἁ"; }
                            if (letter == "η") { greek = "ἡ"; }            
                            if (letter == "Η") { greek = "Ἡ"; } 
                            if (letter == "ω") { greek = "ὡ"; }            
                            if (letter == "Ω") { greek = "Ὡ"; }                              
                            if (letter == "ε") { greek = "ἑ"; }
                            if (letter == "Ε") { greek = "Ἑ"; } 
                            if (letter == "ι") { greek = "ἱ"; }
                            if (letter == "Ι") { greek = "Ἱ"; }                            
                            if (letter == "ο") { greek = "ὁ"; }
                            if (letter == "Ο") { greek = "Ὁ"; }               
                            if (letter == "Ρ") { greek = "Ῥ"; }                                                        
                            if (letter == "ρ") { greek = "ῥ"; }                
                            if (letter == "υ") { greek = "ὑ"; }                
                            if (letter == "Υ") { greek = "Ὑ"; }
                        }         
                    } else {
                    // if the string contains no breathing marks
                    
                        if (greek.indexOf('ͺ') != -1) {
                        // if the string contains an iota
                        
                            if (letter == "α") { greek = "ᾳ"; }
                            if (letter == "Α") { greek = "ᾼ"; }  
                            if (letter == "η") { greek = "ῃ"; }            
                            if (letter == "Η") { greek = "ῌ"; } 
                            if (letter == "ω") { greek = "ῳ"; }            
                            if (letter == "Ω") { greek = "ῼ"; }                            
                        } else {
                            if (greek.indexOf('¨') != -1) {
                            // if the string contains a dieresis

                                if (letter == "ι") { greek = "ϊ"; }
                                if (letter == "Ι") { greek = "Ϊ"; } 
                                if (letter == "υ") { greek = "ϋ"; }
                                if (letter == "Υ") { greek = "Ϋ"; }    
    
                            } // if there are no marks at all, then do nothing
                        }
                    }
                }
            }
        }
    }
    return greek;
}
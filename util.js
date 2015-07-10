var findThirdDeclensionRoot = function(nom,gen) {
  var nomEnd = nom.match(/^(.*?)(\^?[aeiouy][^aeiouy,;.]*)[,;.\s]*$/)[1];
  var genEnd = gen.match(/(\^?[aeiouy][^,;.]*)[,;.\s]*$/)[1];
  return (nomEnd + genEnd).slice(0,-2);
}
$(function() {
  var indexWords, searchWord, words = {};
  $.getJSON('../lewis-short/_.json', function(data) {
    indexWords = data;
    if(searchWord) search(searchWord);
  });
  $('#search').keyup(function(e){
    var word = $(this).val().toLowerCase();
    if(searchWord === word) return;
    search(searchWord = word);
  });
  if(location.hash) $('#search').val(location.hash.slice(1)).keyup();
  function search(word) {
    if(!indexWords) return;
    var index = lookup(word, indexWords);
    displayWord(word, index);
  }
  function lookup(word, list) {
    if(word != searchWord || !list) return;
    var words = list.slice();
    words.push(word);
    words.sort();
    var index = words.lastIndexOf(word);
    return index - 1;
  }
  function displayWord(word, index) {
    var indexWord = indexWords[index];
    if(indexWord in words) {
      var dictionary = words[indexWord];
      var wordList = Object.keys(dictionary);
      var myIndex = lookup(word, wordList);
      wordList.sort();
      var prev = wordList[myIndex],
          curr = prev,
          next = wordList[myIndex + 1] || indexWords[index + 1] || '';
      if(prev == word && myIndex > 0) {
        prev = wordList[myIndex - 1];
      }
      var entry = words[indexWord][curr];
      if(entry.length > 1) curr += ' (' + entry.length + ' entries)';
      $('#dictionary .entry').text(curr);
      $('#dictionary .previous').text(prev);
      $('#dictionary .next').text(next);
      $('#dictionary .content').html(entry.join('<hr/>'));
    } else {
      $.getJSON('../lewis-short/' + indexWord + '.json', function(data) {
        words[indexWord] = data;
        if(word == searchWord) displayWord(word, index);
      });
    }
  }
})
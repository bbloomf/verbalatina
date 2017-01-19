$(function() {
  var indexWords, searchWord, words = {};
  function setLoading(loading) {
    $('#dictionary .content').text(loading? 'Loading '+loading+'...' : '');
  }
  setLoading('word index');
  $.getJSON('lewis-short/_.json', function(data) {
    indexWords = data;
    setLoading(false);
    if(searchWord) search(searchWord);
  });
  $('#search').keyup(function(e){
    var word = $(this).val().toLowerCase();
    if(word == searchWord) return;
    search(word);
  });
  $(document).on('click', 'a[show-word]', function(e){
    e.preventDefault();
    $('#search').val($(this).text()).keyup();
  })
  function hashChanged() {
    var word = location.hash.slice(1);
    if(word && word != searchWord) {
      $('#search').val(word).keyup();
    }
  }
  $(window).on('hashchange',hashChanged);
  hashChanged();
  hashChanged();
  function search(word) {
    if(!word) return;
    location.hash = searchWord = word;
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
  function getWordIndex(indexWord, word, callback) {
    $.getJSON('lewis-short/' + indexWord + '.json', function(data) {
      words[indexWord] = data;
      if(word == searchWord) callback(data);
    });
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
      if(prev == word) {
        if(myIndex == 0) {
          if(index > 0) {
            getWordIndex(indexWords[index - 1], word, function(data) {
              var keys = Object.keys(data);
              keys.sort();
              $('#navigation a.previous').attr('href','').text(keys.slice(-1)[0]);
            });
            prev = 'Loading...'
          } else {
            prev = '';
          }
        } else { // previous == word, myIndex > 0
          prev = wordList[myIndex - 1];
        }
      }
      var entry = words[indexWord][curr];
      var html = '';
      if(curr == word) {
        if(entry.length > 1) html = '(' + entry.length + ' entries)';  
      } else {
        html = '(<b>' + word + '</b> was not found)';
      }
      $('#search-info').html(html);
      html = '';
      if(prev) html += ' Previous Entry: <a class="previous" '+(prev=='Loading...'?'':'href=""')+' show-word>' + prev + '</a>';
      if(next) html += ', Next Entry: <a class="next" href="" show-word>' + next + '</a>';
      $('#navigation').html(html);
      $('.panel-title').text(curr);
      $('#dictionary .previous').text(prev);
      $('#dictionary .next').text(next);
      $('#dictionary .content').html(entry.join('<hr/>').replace(/v\.\s+(?!irreg\.)([a-z]{2,})\./g, function(match, word){
        return 'v. <a href="" show-word>' + word + '</a>.';
      }).replace(/([āēīōūȳ])\^/gi, function(match, vowel) {
        return vowel + '\u0306'; // combining breve (˘)
      }).replace(/([ăĕĭŏŭ])_/gi, function(match, vowel) {
        return vowel + '\u0304'; // combining macron (¯)
      }));
      $('#dictionary .content foreign[lang=greek]').each(function() {
        var $this = $(this);
        $this.text(betaCodeToGreek($this.text()));
      });
    } else {
      setLoading(indexWord+'-'+(indexWords[index+1]||''));
      getWordIndex(indexWord, word, function() {
        displayWord(word, index);
      });
    }
  }
})
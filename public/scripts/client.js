$(document).ready(() => {
  // error message will be hidden until prompted
  $('#error').hide();

  // refactor. add .empty() to clear the repeat during new tweet
  const loadTweets = function() {
    $.get('/tweets')
      .then((tweets) => {
        $('#tweets-container').empty();
        $('#tweet-text').val();
        renderTweets(tweets);
      });
  };

  loadTweets();

  // Method 2: Use an escape function. Preventing XSS
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = function(tweet) {
    let username = tweet.user.name;
    let handle = tweet.user.handle;
    let content = tweet.content.text;
    let date = tweet['created_at'];

    let $tweet = $(`
  <article class="tweet-container">
  <header>
    <div class="username">
      <i class="fa-solid fa-user-astronaut fa-2xl"></i>${username}</div>
    <div class="userhandle">${handle}</div>
  </header>
  <p>${escape(content)}</p>
  <footer
    <div class="date-ago">${timeago.format(date)}</div>
    <div class="tweet-icon">
      <i class="fa-solid fa-flag tweet-icon-single"></i>
      <i class="fa-solid fa-retweet tweet-icon-single"></i>
      <i class="fa-solid fa-heart tweet-icon-single"></i>
    </div>
  </footer>
  </article>
  `);
    return $tweet;
  };

  // add event listener and prevent default behaviour(refresh)
  $('#new-tweet').on('submit', function(event) {
    event.preventDefault();
    // edge case for form submission
    const input = $('#tweet-text').val();
    const icon = `<i class="fa-solid fa-triangle-exclamation"></i>`;

    // hiding error message
    $('#error').slideUp();

    if (input.length > 140) {
      $('#error').html(`${icon} Too long. Tweet entered exceeds length limit! ${icon}`);
      $('#error').slideDown();
      return;
    }

    if (input === '' || input === null) {
      $('#error').html(`${icon} Please enter something.. anything! ${icon}`);
      $('#error').slideDown();
      return;
    }

    const serializedData = $(this).serialize();
    // submit post request of serializedData. clear form and reset counter to 140.
    $.post('/tweets', serializedData)
      .then(() => {
        $('#tweet-text').val('');
        $('output.counter').text(140);
        loadTweets();
      });
  });

  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const newTweet = createTweetElement(tweet);
      $('#tweets-container').prepend(newTweet);
    }
  };
});


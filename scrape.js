var request = require('request');
var cheerio = require('cheerio');
var user = 'visionmedia';

// basic info
function profile(user, callback){
  request('https://github.com/'+user, function (error, response, html) {
    if (!error && response.statusCode === 200) {

      var $ = cheerio.load(html);
      var s = {};

      // overall stats
      var stats = [];
      $('.vcard-stat-count').each(function(i,elem) {
          var stat = $(this).text();
          // thousands
          if(stat.indexOf('k') > -1){
              stat = parseInt( stat, 10 ) * 1000;
          } else {
              stat = parseInt( stat, 10 );
          }
          stats.push( stat );
      });

      s.followerscount = stats[0];
      s.stared         = stats[1];
      s.followingcount = stats[2];

      // General Info
      s.worksfor = $('.vcard-detail').first().text();      // Works for
      s.location = $('.octicon-location').parent().text(); // Location
      s.fullname = $('.vcard-fullname').text();            // Full Name
      s.email = $('.email').text();                        // email address
      s.url = $('.url').text();                            // Website
      s.joined = $('.join-date').attr('datetime');         // Joined GitHub

      // Contributions to Open Source in the past 12 months
      var contribs = []
      $('.contrib-number').each(function(i,elem){
        contribs.push($(this).text());
      });
      s.contribs = parseInt(contribs[0].replace(' total',''),10);
      s.longest  = parseInt(contribs[1].replace(' days',''),10);
      s.current  = parseInt(contribs[2].replace(' days',''),10);

      callback(s);

    } else {
      callback();
    }
  });
}

profile('pgte', function(s){
  console.log(s);
});


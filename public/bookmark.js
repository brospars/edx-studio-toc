javascript:(function () {
  var baseUrl = window.location.href.replace('studio.fun-mooc.fr/course','fun-mooc.fr/courses')+'/jump_to_id/';
  var $sections = $('.outline-section');
  var expandables = $('.expand');
  var sections = [];
  expandables.click();

  $sections.each(function (i, section) {
    var $subsections = $(section).find('.outline-subsection');
    var subsections = [];

    $subsections.each(function (i, subsection) {
      var $units = $(subsection).find('.unit-title a');
      var units = [];
      $units.each(function (i, unit) {
        units.push({
          title: $(unit).text(),
          locator: $(unit).attr('href').split('@').pop()
        })
      });

      subsections.push({
        title: $(subsection).find('.subsection-title').text(),
        locator: $(subsection).data('locator').split('@').pop(),
        units: units
      })
    });

    sections.push({
      title: $(section).find('.section-title').text(),
      locator: $(section).data('locator').split('@').pop(),
      subsections: subsections
    })

  });
  expandables.click();

  console.log(baseUrl);

  var w = window.open('');
  w.document.write(
    '<!DOCTYPE html><html><body>' +
    '<h1>Plan :</h1>' +
    '<input id="input"/>' +
    '<button id="copy" onclick="copy()">Copy and go to app</button>' +
    '<p>Click the button, if nothing happen please copy the input content and go to the <a href="https://brospars.github.io/edx-studio-toc/dist/?baseUrl=' + encodeURIComponent(baseUrl) + '">app</a></p>' +
    '<script>' +
      'var input = document.getElementById("input");' +
      'input.value = JSON.stringify(' + JSON.stringify(sections) + ');' +
      'input.focus();' +
      'input.select();' +
      'function copy () {input.select(); document.execCommand("copy"); window.open("https://brospars.github.io/edx-studio-toc/dist/?baseUrl=' + encodeURIComponent(baseUrl) + '")}' +
    '</script>' +
    '</body></html>'
  );
  w.stop();
})();

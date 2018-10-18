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

  var w = window.open('');
  w.document.write(
    '<!DOCTYPE html><html><body onclick="copy()">' +
    '<h1>Plan :</h1>' +
    '<p>Please copy this and paste it in the <a href="https://brospars.github.io/edx-studio-toc/dist/">app</a></p>' +
    '<input id="input"/>' +
    '<button id="copy" onclick="copy()">Copy</button>' +
    '<script>' +
      'var input = document.getElementById("input");' +
      'input.value = JSON.stringify(' + JSON.stringify(sections) + ');' +
      'input.focus();' +
      'input.select();' +
      'function copy () {input.select(); document.execCommand("copy");}' +
    '</script>' +
    '</body></html>'
  );
  w.stop();
})();

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

  window.open('https://brospars.github.io/edx-studio-toc/dist/?baseUrl='+encodeURIComponent(baseUrl)+'&plan='+JSON.stringify(sections));
})();

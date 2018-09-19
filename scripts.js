(function() {
    function formatFactory(html) {
      function parse(html, tab = 0) {
        var tab;
        var html = $.parseHTML(html);
        var formatHtml = new String();

        function setTabs() {
          var tabs = new String();

          for (i = 0; i < tab; i++) {
            tabs += '  ';
          }
          return tabs;
        };


        $.each(html, function(i, el) {
          if (el.nodeName == '#text') {
            if (($(el).text().trim()).length) {
              formatHtml += setTabs() + $(el).text().trim() + '\r\n';
            }
          } else {
            var innerHTML = $(el).html().trim();
            $(el).html(innerHTML.replace('\n', '').replace(/ +(?= )/g, ''));


            if ($(el).children().length) {
              $(el).html('\r\n' + parse(innerHTML, (tab + 1)) + setTabs());
              var outerHTML = $(el).prop('outerHTML').trim();
              formatHtml += setTabs() + outerHTML + '\r\n';

            } else {
              var outerHTML = $(el).prop('outerHTML').trim();
              formatHtml += setTabs() + outerHTML + '\r\n';
            }
          }
        });

        return formatHtml;
      };

      return parse(html.replace(/(\r\n|\n|\r)/gm, " ").replace(/ +(?= )/g, ''));
    };
  })();

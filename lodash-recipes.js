(function() {
  var recipes = {
    recipes: [
      {
        header: 'Find array index where the key of "name" has the value of "Dollhouse"',
        input: '_.findIndex(data, ["name","Dollhouse"]);',
      },
      {
        header: 'Sort array of objects by values of key "name"',
        input: '_.sortBy(data,["name"]);',
      },
      {
        header: 'Unique list of networks in alphabetical order',
        input: '_.uniq(_.map(data,"network.name").sort());',
      },
    ]
  };

  var data;
  var jsonAce;
  var templateHtml;
  var template;
  var inputs = [];
  var results = [];

  templateHtml = '{{#each recipes}}';
  templateHtml += '<h4>{{header}}</h4>';
  templateHtml += '<div class="input-ace">{{input}}</div>';
  templateHtml += '<div class="result-ace"></div>';
  templateHtml += '{{/each}}';

  template = Handlebars.compile(templateHtml, {preventIndent: true})(recipes);

  $(document).ready(function(){
    $('.examples-pane').html(template);
    jsonAce = ace.edit($('.data-pane')[0]);

    jsonAce.$blockScrolling = Infinity;
    jsonAce.session.on('change', function() {
      $.each(results, updateResult);
    });
    jsonAce.setOptions({
      theme: "ace/theme/github",
      mode: "ace/mode/json",
      behavioursEnabled: false,
    });

    // AJAX - Request default data
    $.get('tvmaze.json', '',function(res) {
      data = res;
      jsonAce.setValue(JSON.stringify(res, null, 2), -1);
    });

    // Ace-ify inputs
    $('.input-ace').each(function(i, el){
      inputs[i] = ace.edit(el);

      inputs[i].$blockScrolling = Infinity;
      inputs[i].session.on('change', function() {
        updateResult(i);
      });
      inputs[i].setOptions({
        showLineNumbers: false,
        showGutter: false,
        theme: "ace/theme/chrome",
        mode: "ace/mode/javascript",
        behavioursEnabled: false,
        cursorStyle: 'slim'
      });
    });

    // Ace-ify outputs
    $('.result-ace').each(function(i, el){
      results[i] = ace.edit(el);

      results[i].$blockScrolling = Infinity;
      results[i].setOptions({
        showLineNumbers: false,
        showGutter: false,
        readOnly: true,
        displayIndentGuides: false,
        theme: "ace/theme/terminal",
        maxLines: 20,
        minLines: 3
      });
    });
  });

  // on lodash command update
  function updateResult(idx) {
    try {
      var result = eval(inputs[idx].getValue());
      if (_.isUndefined(result)) {
        result = 'Unable to determine results';
        results[idx].setFontSize('0.7rem');
        results[idx].resize();
      } else {
        result = JSON.stringify(result, null, 2);
        results[idx].setFontSize('1rem');
        results[idx].resize();
      }

      results[idx].setValue(result, -1)
    } catch(e) {
      results[idx].setFontSize('0.7rem');
      results[idx].setValue('Unable to determine results', -1);
      results[idx].resize();
    }

    jsonAce.resize();
  }
})();

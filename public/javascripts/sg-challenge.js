$("#submit_code").click(function(btn){
  $btn = $(this);
  $commands_field = $("#commands");

  $btn.removeClass("btn-default");
  $btn.addClass("btn-info");

  commands = $commands_field.val();
  $.ajax({
    type: 'POST',
    url: window.location.pathname + "/submit",
    data: { commands: commands },
    success: function(result){
      showOutput(result.output, !result.success);
      if (result.success) {
        var strlen = commands.length;
        var cmds = (commands.split(";")).length + (commands.split("|")).length;
        showScore(result.score);
        $btn.removeClass("btn-info btn-warning");
        $btn.addClass("btn-success");
      } else {
        $('#panel-score').attr('style', 'display: none;');
        $btn.removeClass("btn-info btn-success");
        $btn.addClass("btn-warning");
      }},
    error: function(xhr, status, error){
      console.log("AJAX ERROR: " + error.message);
    }
  });
});

$('#states-accordion').on('show.bs.collapse', function () {
    $('#states-accordion .in').collapse('hide');
});

function showContents(name, contents) {
  $('#filename_heading').text('File Contents: ' + name);
  $('#file_contents').val(contents);
  $('#contents_area').show();
}

/**
 *  Appends the output of an executed command to the accordion.
 *
 *  @method showOutput
 *  @param {String} output Output returned from the server.
 *  @param {Boolean} popup Whether to open the output panel in the accordion.
 */
function showOutput(output, popup) {
  $('#pre-output').html(output);
  $('#panel-output').removeAttr('style');
  if (popup) $('#collapse-output').collapse('show');
}

/**
 *  Appends the score returned from the server to the accordion.
 *
 *  @method showScore
 *  @param score Score returned from the server.
 */
function showScore(score) {
  $('#score').html('Success!<br />Score: ' + score);
  $('#panel-score').removeAttr('style');
  $('#collapse-score').collapse('show');
}

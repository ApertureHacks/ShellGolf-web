function clearSelections($list, $box) {
  $list.children().each(function () {
    var $this = $(this);
    if ($this.hasClass('selected')) {
      if (! $this.children('input').val()) {
        $this.remove();
      } else {
        $this.data('name', $this.children('input').val());
        $this.html('<p>' + $this.data().name + '</p>');
        $this.data('contents', $box.val());
        $box.val('');
      }
    }
    $this.removeClass('selected');
  });
}

function createListeners(side) {
  $('#add-' + side).click(function() {
    var $list = $('#files-' + side);
    var $box = $('#contents-' + side);
    clearSelections($list, $box);
    var $newFile = $('<li class="list-group-item file selected"><input type=text class="form-control"></input></li>');
    $list.append($newFile);
    $box.val('');
    $newFile.children('input').focus();
    $newFile.click(function() {
      var $this = $(this);
      if ($this.hasClass('selected')) {
        return;
      }
      clearSelections($list, $box);
      var $input = $('<input type=text class="form-control"></input>');
      $this.html($input);
      $input.val($this.data().name);
      $this.addClass('selected');
      $box.val($this.data().contents);
    });
  });
}

createListeners('start');
createListeners('end');

$('#create-challenge').click(function() {
  var start = []
    , end = []
    , challenge = { title: $('#title').val()
                  , description: $('#description').val()
                  , start: start
                  , end: end};

  clearSelections($('#files-start'), $('#contents-start'));
  clearSelections($('#files-end'), $('#contents-end'));

  $('#files-start').children('.file').each(function() {
    $file = $(this).data();
    start.push( { name: $file.name
                      , contents: $file.contents } );
  });

  $('#files-end').children('.file').each(function() {
    $file = $(this).data();
    end.push( { name: $file.name
                    , contents: $file.contents } );
  });

  console.log(challenge);
  $.ajax({
    type: 'POST',
    url: window.location.pathname + "/submit",
    data: {challenge: challenge},
    success: function(data){
      console.log(data);
      if (data.success) {
        alert('Successfully created challenge');
      } else {
        alert('Failed to created challenge');
      }
    },
    error: function(xhr, status, error){
      console.log("AJAX ERROR: " + error.message);
    }
  });
});

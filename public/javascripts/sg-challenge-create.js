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
    var $newFile = $('<li class="list-group-item selected"><input type=text class="form-control"></input></li>');
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

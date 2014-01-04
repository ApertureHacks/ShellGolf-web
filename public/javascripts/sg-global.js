var flashFadeDelay = 500;

$('.tooltipped').each(function(){
  $(this).tooltip();
});

$('.flash-close').each(function(){
  $(this).click(function(){
    $flash = $(this).parent().parent().parent();
    $flash.css({ 'visibility': 'hidden'
               , 'opacity': 0
               , 'transition': 'visibility 0s ' +
                               flashFadeDelay/1000 + 's, opacity ' +
                               flashFadeDelay/1000 + 's linear'
    });
    setTimeout(function(){
      $flash.remove();
    }, 500);
  });
});

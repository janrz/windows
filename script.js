var firefoxData = {};

function restoreWindow(thisWindow) {
	if (thisWindow.width() == thisWindow.parent().width()) {
		thisWindow.css("height", firefoxData.height);
		thisWindow.css("width", firefoxData.width);
		thisWindow.css("top", firefoxData.top);
		thisWindow.css("left", firefoxData.left);
	} else {
		currentHeight = thisWindow.height()
		currentWidth = thisWindow.width()
		currentTop = thisWindow.position().top
		currentLeft = thisWindow.position().left

		firefoxData = {
			height: currentHeight,
			width: currentWidth,
			top: currentTop,
			left: currentLeft
		};

		thisWindow.css("height", "calc(100% - 35px)");
		thisWindow.css("width", "100%");
		thisWindow.css("top", "0");
		thisWindow.css("left", "0");
	}
}

$(document).ready(function(){
	
	$(document).on('click', "#startButton", function() {
		$("#startMenu").toggle();
	});

	$(document).on('click', ".taskbarIcon#firefox", function() {
		$(".window#firefoxWindow").toggle();
	});

	$(document).on('click', "#go", function() {
		url = $("#url").val();
		$('#firefoxFrame').attr('src', "http://" + url)
	});

	$(".button").click(function() {
		action = $(this).attr("id");
		clickedWindow = $(this).parent().parent();
		switch(action) {
			case "restore":
				restoreWindow(clickedWindow);
				break;
			case "minimize":
				clickedWindow.hide();
				break;
			case "close":
				break;
		}
	});

	dragElement($(".window")[0]);

});

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if ($("#firefoxWindow" + " " + "#topBar")) {
    // if present, the header is where you move the DIV from:
    document.getElementById("firefoxWindow").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    restoreWindow(elmnt);
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

$(function() {
    var $container = $('#desktop');
    var $selection = $('<div>').addClass('selection-box');

    $container.on('mousedown', function(e) {
    	clickedElement = e.target.id;
    	if (clickedElement != "desktop") {
    		return;
    	}
        var click_y = e.pageY;
        var click_x = e.pageX;

        $selection.css({
          'top':    click_y,
          'left':   click_x,
          'width':  0,
          'height': 0
        });
        $selection.appendTo($container);

        $(document).on('mousemove', function(e) {
            var move_x = e.pageX,
                move_y = e.pageY,
                width  = Math.abs(move_x - click_x),
                height = Math.abs(move_y - click_y),
                new_x, new_y;

            new_x = (move_x < click_x) ? (click_x - width) : click_x;
            new_y = (move_y < click_y) ? (click_y - height) : click_y;

            desktopHeight = $("#desktop").css("height");
            desktopHeightNum = desktopHeight.substring(0, desktopHeight.length - 2);
            maxSelectionHeight = desktopHeightNum - new_y - 1;

            if (height >= maxSelectionHeight) {
            	var height = maxSelectionHeight;
            }

            $selection.css({
              'width': width,
              'height': height,
              'top': new_y,
              'left': new_x
            });
        }).on('mouseup', function(e) {
            $container.off('mousemove');
            $selection.remove();
        });
    });
});
var WINDOW_RESIZE_ANIMATION_DURATION = 50

var firefoxData = {};
var openWindows = 0;


function restoreWindow(thisWindow) {
	if (thisWindow.width() == thisWindow.parent().width()) {

		thisWindow.animate({
			height: firefoxData.height,
			width: firefoxData.width,
			top: firefoxData.top,
			left: firefoxData.left
		}, WINDOW_RESIZE_ANIMATION_DURATION);
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

		thisWindow.animate({
			height: "100%",
			width: "100%",
			top: 0,
			left: 0
		}, WINDOW_RESIZE_ANIMATION_DURATION);
	}
}

function closeWindow(thisWindow) {
	thisWindow.remove();
}

function minimizeWindow(thisWindow) {
	thisWindow.hide();
}

function newFirefoxWindow() {
	$(".window.active").removeClass("active");
	newWindow = $("<div></div>").addClass("window active");
	topBar = $("<div></div>").addClass("topBar");
	closeButton = $("<div>x</div>").addClass("button close");
	restoreButton = $("<div>o</div>").addClass("button restore");
	minimizeButton = $("<div>-</div>").addClass("button minimize");
	closeButton.appendTo(topBar);
	restoreButton.appendTo(topBar);
	minimizeButton.appendTo(topBar);
	topBar.appendTo(newWindow);
	newWindow.css("top", (10 + openWindows * 2) + "%");
	newWindow.css("left", (10 + openWindows * 2) + "%");
	newWindow.appendTo("#desktop");
	openWindows++;
}

$(document).ready(function(){
	
	$(document).on('click', "#startButton", function() {
		$("#startMenu").toggle();
	});

	$(document).on('mousedown', ".window", function() {
		$(".window.active").removeClass("active");
		$(this).addClass("active");
	});

	$(document).on('click', ".taskbarIcon#firefox", function() {
		$(".window#firefoxWindow").toggle();
	});

	$(document).on('click', ".taskbarIcon#explorer", function() {
		newFirefoxWindow();
	});

	$(document).on('click', "#go", function() {
		url = $("#url").val();
		$('#firefoxFrame').attr('src', "http://" + url)
	});

	$(document).on('click', ".button", function() {
		action = $(this).attr("class").split(" ")[1];
		clickedWindow = $(this).parent().parent();
		switch(action) {
			case "restore":
				restoreWindow(clickedWindow);
				break;
			case "minimize":
				minimizeWindow(clickedWindow);
				break;
			case "close":
				closeWindow(clickedWindow);
				break;
		}
	});

	$(".topBar").dblclick(function() {
		restoreWindow($(this).parent());
	});

	$(document).on('mousedown', ".topBar", function() {
		dragElement($(this).parent()[0]);
	});

	$("#desktop").on('mousedown', function(e) {
		if (e.target.id == "desktop") {
			$(".window.active").removeClass("active");
		}
	});
});

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

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
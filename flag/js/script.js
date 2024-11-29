

var DEFAULTFILTER = "#star";
//#s_vertical,#c_blue,

/*jshint browser:true, undef: true, unused: true, jquery: true */
var $container;
var filters = {};
var isotopeNewItems = null;

// On Document Ready
$(function(){

	$container = $('#container');

	// Make headline responsive
	$("#headline").html(
		$("#headline").text().split("").map(function(letter){return "<span>"+letter+"</span>"})
	);

	// do stuff when checkbox change
	$('#options').on( 'change', function( jQEvent )
	{
		doSortingLogic();
		var $checkbox = $( jQEvent.target );
		manageCheckbox( $checkbox );

		var comboFilter = getComboFilter( filters );
			$container.isotope({ filter: comboFilter, onLayout: function( $elems, instance ){}});
    });

	$container.isotope({ onLayout: function( $elems, instance ) { } });

	$(DEFAULTFILTER).trigger('click');
});


function getComboFilter( filters ) {
	var i = 0;
	var comboFilters = [];
	var message = [];

	for ( var prop in filters ) {
		message.push( filters[ prop ].join(' ') );
		var filterGroup = filters[ prop ];
		// skip to next filter group if it doesn't have any values
		if ( !filterGroup.length ) {
			continue;
		}
		if ( i === 0 ) {
			// copy to new array
			comboFilters = filterGroup.slice(0);
		} else {
			var filterSelectors = [];

			// copy to fresh array
			var groupCombo = comboFilters.slice(0); // [ A, B ]

			// merge filter Groups
			for (var k = 0, len3 = filterGroup.length; k < len3; k++) {
				for (var j = 0, len2 = groupCombo.length; j < len2; j++) {
					filterSelectors.push( groupCombo[j] + filterGroup[k] ); // [ 1, 2 ]
				}
			}

			// apply filter selectors to combo filters for next group
			comboFilters = filterSelectors;
		}
    i++;
  }

  var comboFilter = comboFilters.join(', ');
  return comboFilter;
}

function manageCheckbox( $checkbox ) {
  var checkbox = $checkbox[0];

  var group = $checkbox.parents('.option-set').attr('data-group');
  // create array for filter group, if not there yet
  var filterGroup = filters[ group ];
  if ( !filterGroup ) {
    filterGroup = filters[ group ] = [];
  }

  var isAll = $checkbox.hasClass('all');
  // reset filter group if the all box was checked
  if ( isAll ) {
    delete filters[ group ];
    if ( !checkbox.checked ) {
      checkbox.checked = 'checked';
    }
  }
  // index of
  var index = $.inArray( checkbox.value, filterGroup );

  if ( checkbox.checked ) {
    var selector = isAll ? 'input' : 'input.all';
    $checkbox.siblings( selector ).removeAttr('checked');


    if ( !isAll && index === -1 ) {
      // add filter to group
      filters[ group ].push( checkbox.value );
    }

  } else if ( !isAll ) {
    // remove filter from group
    filters[ group ].splice( index, 1 );
    // if unchecked the last box, check the all
    if ( !$checkbox.siblings('[checked]').length ) {
      $checkbox.siblings('input.all').attr('checked', 'checked');
    }
  }

}


function initMultiplier()
{
	$('.dynamic').remove();
	if(isotopeNewItems!=null)
	{
		$('#container').isotope( 'remove', isotopeNewItems);
	}

	var vals = new Array();

	$('.option-set input').each(function(i,e)
	{
		if($(e)[0].checked)
		{
			vals.push($(e).val());
		}
	});

	var elems = new Array();
	$('#container .sidsimg').each(function(i,e)
	{
		var valid = true;
		for(var i in vals)
		{
			//console.log(vals[i].replace('.',''));
			if(!$(e).parent().hasClass(vals[i].replace('.',''))) valid = false;
		}
		if(valid) elems.push($(e).parent());
	});

	var numClones = 0;
	if(elems.length!=0)
	{
		numClones = Math.ceil(100/elems.length);
	}

	var newItems = new Array();
	if(numClones > 1)
	{
		for(var w = 0; w < numClones; w++)
		{
			for(var t in elems)
			{
				var cl = elems[t].clone();
				$('#container').append(cl);
				newItems.push($('<div>').append($(cl).clone()).html());
			}
		}
	}
}

function doSortingLogic()
{
	$('.dynamic').remove();
	if(isotopeNewItems!=null)
	{
		$('#container').isotope( 'remove', isotopeNewItems);
	}

	var vals = new Array();
	$('.option-set input').each(function(i,e)
	{
		if($(e)[0].checked)
		{
			vals.push($(e).val());
		}
	});

	var elems = new Array();
	$('#container .sidsimg').each(function(i,e) {
		var valid = true;
		for(var i in vals){
			//console.log(vals[i].replace('.',''));
			if(!$(e).parent().hasClass(vals[i].replace('.',''))) valid = false;
		}
		if(valid) elems.push($(e).parent());
	});

	//document.title = elems.length;

	var numClones = 0;
	if(elems.length != 0) {
		numClones = Math.ceil(100/elems.length);
	}

	var newItems = new Array();

	if(numClones > 1) {
		for(var w=0;w<numClones;w++) {
			for(var t in elems) {
				var cl = elems[t].clone();
				$(cl).addClass('dynamic');
				newItems.push($('<div>').append($(cl).clone()).html());
			}
		}
	}

	isotopeNewItems = $(newItems.join(''));
    $('#container').isotope( 'insert', isotopeNewItems );

}

function ReDraw(){
	// Get the window dimensions
	var $window = $(window);
	var wWidth  = $window.width();
	var wHeight = $window.height();

	console.log("resize change Width: " + wWidth + ", Height: "+wHeight);

	var container_width = wWidth - 270;
	//var container_height = wHeight - 40;
	var element_width = container_width / 10 - 0.5;
	var element_height = element_width / 1.3375;

	var elements = document.getElementsByClassName("element");
	var element_imgs = document.getElementsByTagName("img");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.width = (element_width + "px");
		elements[i].style.height = (element_height + "px");
		element_imgs[i].style.width = (element_width + "px");
		element_imgs[i].style.height = (element_height + "px");
    }

	document.getElementById("container").style.width = container_width + "px";
	document.getElementById("container").style.height = element_height * 10 + "px";
	// document.getElementsByClassName("titlebox")[0].style.marginLeft = (wWidth-224) / 2 + 135 + "px";

	setTimeout(element_init_layout, 1000);
}

function element_init_layout(){
	$container.isotope({ onLayout: function( $elems, instance ) { } });
}

window.onload = function() {
	ReDraw();
};

var id;
$(window).resize(function() {
    clearTimeout(id);
    id = setTimeout(doneResizing, 500);

});

function doneResizing(){
  ReDraw();
}










$(document).ready(function() {	

	//select all the a tag with name equal to modal
	$('a[name=modal]').click(function(e) {
		//Cancel the link behavior
		e.preventDefault();
		
		//Get the A tag
		var id = $(this).attr('href');
	
		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
	
		//Set heigth and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});
		
		//transition effect		
		$('#mask')
		$('#mask').fadeTo("fast",0.8);	
	
		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();
              
		//Set the popup window to center
		$(id).css('top',  winH/2-$(id).height()/2);
		$(id).css('left', winW/2-$(id).width()/2);
	
		//transition effect
		$(id).fadeIn(100); 
	
	});
	
	//if close button is clicked
	$('.window .close').click(function (e) {
		//Cancel the link behavior
		e.preventDefault();
		
		$('#mask').hide();
		$('.window').hide();
	});		
	
	
});





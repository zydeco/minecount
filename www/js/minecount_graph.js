minecount_graph_inited = 0

function minecount_graph() {
  if (!minecount_graph_inited) {
    minecount_graph_inited = 1;
    nonBlocks = [0, 5, 6, 17, 18, 24, 34, 35, 36, 43, 44, 55, 62, 63, 68, 74, 75, 83, 93, 98, 126, 123, 125, 149, 171, 263, 324, 330, 351, 354, 355, 356, 372, 379, 380, 383, 390, 397, 404];
    for (var i=0; i < nonBlocks.length; i++) nonBlocks[i] = String(nonBlocks[i]);
    var list = $('#itemlist');
    graphBlockIds = [];
    for (var key in blockNames) {
      if (blockNames.hasOwnProperty(key) && nonBlocks.indexOf(key) == -1) {
        var blockName = blockNames[key];
        var values = key.split('.');
        var blockId = parseInt(values[0]);
        var blockVal = values.length==2?parseInt(values[1]):NaN;
        var blockIdName = block_list_id(blockId, blockVal);
        list.append(block_list_html(blockId, blockVal, blockIdName, blockName));
        graphBlockIds.push(blockIdName.replace('.','_'));
      }
    }
    
    $('#graph_ui').dialog({
      autoOpen: false,
      closeOnEscape: false,
      height: 400, width: 280,
      resizable: false,
      open: function() {
        $('#from').datepicker('enable');
        $('#to').datepicker('enable');
        $('#listfilter').removeAttr('disabled');
      },
      close: function() {
        $('#from').datepicker('disable');
        $('#to').datepicker('disable');
        $('#listfilter').attr('disabled','disabled');
      }
    });
  }
  
  // check function
  $('#itemlist input[type=checkbox]').click(function () {
    update_graph(true);
  });
  
  // show
  if ($('#graph').css('display') == 'none') {
    $('body').css('overflow','hidden');
    $('#graph').css('display','block');
    graphData = [[[]]];
    graphSettings = {};
    uncheck_all_blocks();
    filter_block_list('');
    $.jqplot('graph_graph', graphData, graphSettings).redraw(true);
  }
  
  // show graph settings dialog
  $('#graph_ui').dialog('open');
}

function block_list_id(blockId, blockVal) {
  var idVal = isNaN(blockVal)?String(blockId):String(blockId)+'.'+String(blockVal);
  if (!(idVal in blockNames)) idVal = String(blockId);
  return idVal;
}

function block_list_html(blockId, blockVal, blockIdName, blockName) {
  var imgSize = (blockId < 256)?18:16;
  var imgName = (blockIdName in blockAlias)?blockAlias[blockIdName]:blockIdName;
  return $('<li><input type="checkbox" id="chk_'+blockIdName.replace('.','_')+'"/><img src="images/blocks/'+imgName+'_s.png" width="'+imgSize+'"/> '+blockName+'</li>');
}

function uncheck_all_blocks() {
  for (var i=0; i < graphBlockIds.length; i++) {
    $('#chk_'+graphBlockIds[i]).prop('checked', false);
  }
}

function selected_blocks() {
  var selBlocks = [];
  for (var i=0; i < graphBlockIds.length; i++) {
    if ($('#chk_'+graphBlockIds[i]).prop('checked')) selBlocks.push(graphBlockIds[i].replace('_','.'))
  }
  return selBlocks;
}

function update_graph(newData) {
  var selBlocks = selected_blocks();
  var maxBlocks = 16;
  
  // cut out the last
  if (selBlocks.length > maxBlocks) {
    selBlocks.splice(maxBlocks, selBlocks.length-maxBlocks)
  }
  
  if (newData) {
    // request
    var reqParams = {from: $('#from').val(), to: $('#to').val(), blocks: selBlocks.join(','), world: selectedWorld};
    $.getJSON('graph.php', reqParams, function(data) {
        // parse results
        var series = [];
        graphData = [];
        for (var i=0; i < selBlocks.length; i++) {
          var blockId = selBlocks[i];
          var blockCount = data.count[blockId];
          var line = [];
          for (var j=0; j < blockCount.length; j++) {
            line.push([data.dates[j], blockCount[j]])
          }
          graphData.push(line);
          series.push({label: blockNames[blockId]});
        }
        
        graphSettings = {
          axes:{
            xaxis:{
              renderer:$.jqplot.DateAxisRenderer, 
              tickOptions: {formatString:'%b %#d'},
              min: data.dates[0],
              pad: 0,
            }
          },
          highlighter: {
            show: true,
            sizeAdjust: 7.5
          },
          cursor: {
            show: false
          },
          legend: {
            show: true
          },
          series: series
        }
        $.jqplot('graph_graph', graphData, graphSettings).redraw(true);
      }
    )
  } else {
    $.jqplot('graph_graph', graphData, graphSettings).redraw(true);
  }
}

function filter_block_list(filter) {
  filter = filter.toLowerCase();
  var list = $('#itemlist li');
  var odd = true;
  for(var i=0; i < list.length; i++) {
    var item = $(list[i]);
    var hidden = (item.text().toLowerCase().indexOf(filter) == -1);
    item.css('display', hidden?'none':'block');
    if (!hidden) {
      item.css('background-color', odd?'transparent':'#d5d7d7');
      odd = !odd;
    }
  }
}
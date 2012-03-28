fileList = 'filelist.php';
defaultWorld = 'world';
numFeatured = 3;
blockNames = {
  "0":"Air",
  "1":"Stone",
  "2":"Grass",
  "3":"Dirt",
  "4":"Cobblestone",
  "5":"Wooden Plank",
  "5.0":"Oak plank",
  "5.1":"Pine Plank",
  "5.2":"Birch Plank",
  "5.3":"Jungle Wood Plank",
  "6":"Sapling",
  "6.0":"Oak Sapling",
  "6.1":"Pine Sapling",
  "6.2":"Birch Sapling",
  "7":"Bedrock",
  "8":"Water",
  "9":"Stationary water",
  "10":"Lava",
  "11":"Stationary lava",
  "12":"Sand",
  "13":"Gravel",
  "14":"Gold Ore",
  "15":"Iron Ore",
  "16":"Coal Ore",
  "17":"Wood",
  "17.0":"Oak Wood",
  "17.1":"Pine Wood",
  "17.2":"Birch Wood",
  "17.3":"Jungle Wood",
  "18":"Leaves",
  "18.0":"Oak Leaves",
  "18.1":"Pine Leaves",
  "18.2":"Birch Leaves",
  "18.3":"Jungle Leaves",
  "19":"Sponge",
  "20":"Glass",
  "21":"Lapis Lazuli Ore",
  "22":"Lapis Lazuli Block",
  "23":"Dispenser",
  "24":"Sandstone",
  "24.0":"Sandstone",
  "24.1":"Hieroglyphic Sandstone",
  "24.2":"Smooth Sandstone",
  "25":"Note Block",
  "26":"Bed",
  "27":"Powered Rail",
  "28":"Detector Rail",
  "29":"Sticky Piston",
  "30":"Cobweb",
  "31":"Tall Grass",
  "31.0":"Dead Shrub",
  "31.1":"Tall Grass",
  "31.2":"Fern",
  "32":"Dead Shrub",
  "33":"Piston",
  "34":"Piston Head",
  "35":"Wool",
  "35.0":"White Wool",
  "35.1":"Orange Wool",
  "35.2":"Magenta Wool",
  "35.3":"Light Blue Wool",
  "35.4":"Yellow Wool",
  "35.5":"Light Green Wool",
  "35.6":"Pink Wool",
  "35.7":"Gray Wool",
  "35.8":"Light Gray Wool",
  "35.9":"Cyan Wool",
  "35.10":"Purple Wool",
  "35.11":"Blue Wool",
  "35.12":"Brown Wool",
  "35.13":"Dark Green Wool",
  "35.14":"Red Wool",
  "35.15":"Black Wool",
  "36":"Piston Moving Piece",
  "37":"Dandelion",
  "38":"Rose",
  "39":"Brown Mushroom",
  "40":"Red Mushroom",
  "41":"Gold Block",
  "42":"Iron Block",
  "43":"Double Slab",
  "43.0":"Stone Double Slab",
  "43.1":"Sandstone Double Slab",
  "43.2":"Wood Double Slab",
  "43.3":"Cobblestone Double Slab",
  "43.4":"Brick Double Slab",
  "43.5":"Stone Brick Double Slab",
  "43.6":"Stone Double Slab",
  "44":"Slab",
  "44.0":"Stone Slab",
  "44.1":"Sandstone Slab",
  "44.2":"Wood Slab",
  "44.3":"Cobblestone Slab",
  "44.4":"Brick Slab",
  "44.5":"Stone Brick Slab",
  "44.6":"Stone Slab",
  "45":"Brick Block",
  "46":"TNT",
  "47":"Bookshelf",
  "48":"Moss Stone",
  "49":"Obsidian",
  "50":"Torch",
  "51":"Fire",
  "52":"Monster Spawner",
  "53":"Wooden Stairs",
  "54":"Chest",
  "55":"Redstone Wire",
  "56":"Diamond Ore",
  "57":"Diamond Block",
  "58":"Crafting Table",
  "59":"Crops",
  "60":"Farmland",
  "61":"Furnace",
  "62":"Burning Furnace",
  "63":"Sign Post",
  "64":"Wooden Door",
  "65":"Ladder",
  "66":"Rails",
  "67":"Cobblestone Stairs",
  "68":"Wall Sign",
  "69":"Lever",
  "70":"Stone Pressure Plate",
  "71":"Iron Door",
  "72":"Wooden Pressure Plate",
  "73":"Redstone Ore",
  "74":"Glowing Redstone Ore",
  "75":"Redstone Torch", // off
  "76":"Redstone Torch", // on
  "77":"StoneButton",
  "78":"Snow",
  "79":"Ice",
  "80":"Snow Block",
  "81":"Cactus",
  "82":"Clay Block",
  "83":"Sugar Cane",
  "84":"Jukebox",
  "85":"Fence",
  "86":"Pumpkin",
  "87":"Netherrack",
  "88":"SoulSand",
  "89":"Glowstone Block",
  "90":"Portal",
  "91":"Jack-O-Lantern",
  "92":"Cake",
  "93":"Redstone Repeater",
  "94":"Redstone Repeater",
  "95":"Locked Chest",
  "96":"Trapdoor",
  "97":"Stone with Silverfish",
  "98":"Stone Brick",
  "98.0":"Stone Brick",
  "98.1":"Mossy Stone Brick",
  "98.2":"Cracked Stone Brick",
  "98.3":"Circle Stone Brick",
  "99":"Huge brown mushroom",
  "100":"Huge red mushroom",
  "101":"Iron Bars",
  "102":"Glass Pane",
  "103":"Melon",
  "104":"Pumpkin Stem",
  "105":"Melon Stem",
  "106":"Vines",
  "107":"Fence Gate",
  "108":"Brick Stairs",
  "109":"Stone Brick Stairs",
  "110":"Mycelium",
  "111":"Lily Pad",
  "112":"Nether Brick",
  "113":"Nether Brick Fence",
  "114":"Nether Brick Stairs",
  "115":"Nether Wart",
  "116":"Enchantment Table",
  "117":"Brewing Stand",
  "118":"Cauldron",
  "119":"End Portal",
  "120":"End Portal Frame",
  "121":"White Stone",
  "122":"Dragon Egg",
  "123":"Redstone Lamp (off)",
  "124":"Redstone Lamp (on)",
  "256":"Iron Shovel",
  "257":"Iron Pickaxe",
  "258":"Iron Axe",
  "259":"Flint and Steel",
  "260":"Apple",
  "261":"Bow",
  "262":"Arrow",
  "263":"Coal",
  "263.0":"Coal",
  "263.1":"Charcoal",
  "264":"Diamond",
  "265":"Iron Ingot",
  "266":"Gold Ingot",
  "267":"Iron Sword",
  "268":"Wooden Sword",
  "269":"Wooden Shovel",
  "270":"Wooden Pickaxe",
  "271":"Wooden Axe",
  "272":"Stone Sword",
  "273":"Stone Shovel",
  "274":"Stone Pickaxe",
  "275":"Stone Axe",
  "276":"Diamond Sword",
  "277":"Diamond Shovel",
  "278":"Diamond Pickaxe",
  "279":"Diamond Axe",
  "280":"Stick",
  "281":"Bowl",
  "282":"Mushroom Soup",
  "283":"Gold Sword",
  "284":"Gold Shovel",
  "285":"Gold Pickaxe",
  "286":"Gold Axe",
  "287":"String",
  "288":"Feather",
  "289":"Gunpowder",
  "290":"Wooden Hoe",
  "291":"Stone Hoe",
  "292":"Iron Hoe",
  "293":"Diamond Hoe",
  "294":"Gold Hoe",
  "295":"Seeds",
  "296":"Wheat",
  "297":"Bread",
  "298":"Leather Cap",
  "299":"Leather Tunic",
  "300":"Leather Pants",
  "301":"Leather Boots",
  "302":"Chain Helmet",
  "303":"Chain Chestplate",
  "304":"Chain Leggings",
  "305":"Chain Boots",
  "306":"Iron Helmet",
  "307":"Iron Chestplate",
  "308":"Iron Leggings",
  "309":"Iron Boots",
  "310":"Diamond Helmet",
  "311":"Diamond Chestplate",
  "312":"Diamond Leggings",
  "313":"Diamond Boots",
  "314":"Gold Helmet",
  "315":"Gold Chestplate",
  "316":"Gold Leggings",
  "317":"Gold Boots",
  "318":"Flint",
  "319":"Raw Porkchop",
  "320":"Cooked Porkchop",
  "321":"Paintings",
  "322":"Golden Apple",
  "323":"Sign",
  "324":"Wooden Door",
  "325":"Bucket",
  "326":"Water bucket",
  "327":"Lava bucket",
  "328":"Minecart",
  "329":"Saddle",
  "330":"Iron Door",
  "331":"Redstone",
  "332":"Snowball",
  "333":"Boat",
  "334":"Leather",
  "335":"Milk",
  "336":"Clay Brick",
  "337":"Clay",
  "338":"Sugar Cane",
  "339":"Paper",
  "340":"Book",
  "341":"Slimeball",
  "342":"Storage Minecart",
  "343":"Powered Minecart",
  "344":"Egg",
  "345":"Compass",
  "346":"Fishing Rod",
  "347":"Clock",
  "348":"Glowstone Dust",
  "349":"Raw Fish",
  "350":"Cooked Fish",
  "351":"Dye",
  "351.0":"Ink Sac",
  "351.1":"Rose Red",
  "351.2":"Cactus Green",
  "351.3":"Cocoa Beans",
  "351.4":"Lapis Lazuli",
  "351.5":"Purple Dye",
  "351.6":"Cyan Dye",
  "351.7":"Light Gray Dye",
  "351.8":"Gray Dye",
  "351.9":"Pink Dye",
  "351.10":"Lime Dye",
  "351.11":"Dandelion Yellow",
  "351.12":"Light Blue Dye",
  "351.13":"Magenta Dye",
  "351.14":"Orange Dye",
  "351.15":"Bone Meal",
  "352":"Bone",
  "353":"Sugar",
  "354":"Cake",
  "355":"Bed",
  "356":"Redstone Repeater",
  "357":"Cookie",
  "358":"Map",
  "359":"Shears",
  "360":"Melon Slice",
  "361":"Pumpkin Seeds",
  "362":"Melon Seeds",
  "363":"Raw Beef",
  "364":"Steak",
  "365":"Raw Chicken",
  "366":"Cooked Chicken",
  "367":"Rotten Flesh",
  "368":"Ender Pearl",
  "369":"Blaze Rod",
  "370":"Ghast Tear",
  "371":"Gold Nugget",
  "372":"Nether Wart",
  "373":"Potion",
  "374":"Glass Bottle",
  "375":"Spider Eye",
  "376":"Fermented Spider Eye",
  "377":"Blaze Powder",
  "378":"Magma Cream",
  "379":"Brewing Stand",
  "380":"Cauldron",
  "381":"Eye of Ender",
  "382":"Glistering Melon",
  "383":"Spawn Egg",
  "383.1":"Spawn Dropped Item",
  "383.2":"Spawn Experience Orb",
  "383.10":"Spawn Shot Arrow",
  "383.11":"Spawn Thrown Snowball",
  "383.12":"Spawn Ghast Fireball",
  "383.13":"Spawn Blaze Fireball",
  "383.14":"Spawn Thrown Ender Pearl",
  "383.15":"Spawn Thrown Eye of Ender",
  "383.20":"Spawn Primed TNT",
  "383.21":"Spawn Falling Block",
  "383.40":"Spawn Minecart",
  "383.41":"Spawn Boat",
  "383.50":"Spawn Creeper",
  "383.51":"Spawn Skeleton",
  "383.52":"Spawn Spider",
  "383.53":"Spawn Giant",
  "383.54":"Spawn Zombie",
  "383.55":"Spawn Slime",
  "383.56":"Spawn Ghast",
  "383.57":"Spawn Zombie Pigman",
  "383.58":"Spawn Enderman",
  "383.59":"Spawn Cave Spider",
  "383.60":"Spawn Silverfish",
  "383.61":"Spawn Blaze",
  "383.62":"Spawn Magma Cube",
  "383.63":"Spawn Enderdragon",
  "383.90":"Spawn Pig",
  "383.91":"Spawn Sheep",
  "383.92":"Spawn Cow",
  "383.93":"Spawn Chicken",
  "383.94":"Spawn Squid",
  "383.95":"Spawn Wolf",
  "383.96":"Spawn Mooshroom",
  "383.97":"Spawn Snow Golem",
  "383.98":"Spawn Ocelot",
  "383.99":"Spawn Iron Golem",
  "383.120":"Spawn Villager",
  "383.200":"Spawn Ender Crystal",
  "384":"Bottle o'Enchanting",
  "2256":"13 Disc",
  "2257":"Cat Disc",
  "2258":"Blocks Disc",
  "2259":"Chirp Disc",
  "2260":"Far Disc",
  "2261":"Mall Disc",
  "2262":"Mellohi Disc",
  "2263":"Stal Disc",
  "2264":"Strad Disc",
  "2265":"Ward Disc",
  "2266":"11 Disc"
};

blockAlias = {
    "5.0":"5",
    "24.0":"24",
    "383.1":"383",
    "383.2":"383",
    "383.10":"383",
    "383.11":"383",
    "383.12":"383",
    "383.13":"383",
    "383.14":"383",
    "383.15":"383",
    "383.20":"383",
    "383.21":"383",
    "383.40":"383",
    "383.41":"383",
    "383.53":"383",
    "383.63":"383",
    "383.97":"383",
    "383.99":"383",
    "383.200":"383",
};

//////////////////////////////////
// * * * Here be The Code * * * //
//////////////////////////////////

$(document).ready(function pageready() {
  parse_url();
  minecount_main();
});

function isDateAvailable(w,y,m,d) {
  if (worlds == null) return false;
  var dates = worlds[w].dates;
  if (!(y in dates)) return false;
  if (m == -1 && d == -1) return true;
  if (!(m in dates[y])) return false;
  if (d == -1) return true;
  return dates[y][m].indexOf(d) != -1;
}

function hashChanged() {
  if (document.location.hash == lastHash) return;
  minecount_load(document.location.hash.substring(1));
}

function parse_url() {
  var vars = [];
  var start = document.location.href.indexOf('?');
  var end = document.location.href.indexOf('#');
  if (end == -1) end = document.location.href.length;
  if (start > -1) {
    var args =  document.location.href.slice(start + 1, end).split('&');
    for (var i in args) {
      if (args[i].indexOf('=') == -1) continue;
      var name = args[i].slice(0, args[i].indexOf('='));
      var val = args[i].slice(args[i].indexOf('=')+1);
      vars[name] = val;
    }
  }
  
  if ('file' in vars)
    document.location.href = document.location.href.slice(0, start) + '#' + vars.file;
}

function minecount_main() {
  // listen for hash changes
  if ("onhashchange" in window) { // event supported?
    window.onhashchange = function () {
      hashChanged();
    }
  } else { // event not supported:
    var storedHash = document.location.hash;
    window.setInterval(function () {
      if (document.location.hash == storedHash) return;
      storedHash = document.location.hash;
      hashChanged();
    }
    , 100);
  }
  lastHash = document.location.hash;

  // load filelist
  if (typeof(fileList) == 'object') {
    loadFileList(fileList);
    minecount_load(document.location.hash.substring(1));
  } else if (typeof(fileList) == 'string') {
    $.ajax({
      url: fileList,
      dataType: 'json',
      success: function(res, status, jqXHR) {
        loadFileList(res);
        minecount_load(document.location.hash.substring(1));
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#status').text('could not load file list');
      }
    });
  }
}

function loadFileList(res) {
  worlds = res.worlds;
  for(var w in worlds) computeDates(worlds[w]);
  fileBase = res.base;
  setupCalendar();
}

function setupCalendar() {
  var worldNames = [];
  for(k in worlds) worldNames.push(k);
  cal = $("#calendar").calendarPicker({
    maps: worldNames,
    defaultMap: defaultWorld,
    months: 'fixed',
    years: 2,
    days: 'fixed',
    availableDateCallback: function(w,y,m,d) {
      return isDateAvailable(w,y,m,d);
    },
    callback: function(cal, type) {
      var d = cal.currentDate;
      if (type == 'month' && isDateAvailable(cal.map, d.getFullYear(), d.getMonth()+1, -1) && !isDateAvailable(cal.map, d.getFullYear(), d.getMonth()+1, d.getDate())) {
        // pick an available date in the month
        for(var i=1; i <= 31; i++) {
          d.setDate(i);
          if (isDateAvailable(cal.map, d.getFullYear(), d.getMonth()+1, d.getDate())) break;
        }
      }
      
      var m = d.getMonth()+1 < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
      var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      var p = cal.map + '/' + d.getFullYear() + '-' + m + '-' + day;
      
      if (type == 'map' && cal.map == selectedWorld) p = cal.map;
      
      minecount_load(p);
    },
    callbackDelay: 200,

  });
}
function computeDates(w) {
  var dates = {};
  for(var i in w.files) {
    var d = parseMyDate(w.files[i]);
    if (!(d.getFullYear() in dates)) dates[d.getFullYear()] = {};
    if (!(d.getMonth()+1 in dates[d.getFullYear()])) dates[d.getFullYear()][d.getMonth()+1] = [];
    dates[d.getFullYear()][d.getMonth()+1].push(d.getDate());
  }
  w.dates = dates;
}

function minecount_load(path) {
  if (path.length == 0) return minecount_load_last(defaultWorld);

  // check path
  var pc = path.split('/');
  if (pc.length >= 1 && !(pc[0] in worlds)) return minecount_load_last(defaultWorld); 
  if (pc.length == 1) return minecount_load_last(pc[0]);
  if (pc.length != 2) return minecount_load_last(defaultWorld);
  var idx = worlds[pc[0]]['files'].indexOf(pc[1]);
  if (idx == -1) return minecount_load_last(pc[0]);

  // load file from path
  var realPath = fileBase + '/' + path + '.json';
  $('#status').text('Loading ' + path + '…');

  $.ajax({
    url: realPath,
    dataType: 'json',
    success: function(res, status, jqXHR) {
      if (idx > 0) {
        // get previous world
        var prev = pc[0] + '/' + worlds[pc[0]]['files'][idx-1];
        var prevPath = fileBase + '/' + prev + '.json';
        $('#status').text('Loading ' + prev + '…');
        $.ajax({
          url: prevPath,
          dataType: 'json',
          success: function(prevRes, status, jqXHR) {
            minecount_show(pc[0], pc[1], res, prevRes);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            minecount_show(pc[0], pc[1], res, null);
          }
        });

      } else {
        minecount_show(pc[0], pc[1], res, null);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#status').text('Could not load ' + path);
    }
  });
}

function adjust_count(count) {
  if (count == null) return;
  // remove piston stuff
  delete count['0'];
  delete count['34'];
  delete count['36'];

  // furnace += burning furnace
  if ('62' in count) {
    count['61'] += count['62'];
    delete count['62'];
  }

  // redstone torch on += off
  if ('75' in count) {
    count['76'] += count['75'];
    delete count['75'];
  }
}

function minecount_show(world, file, count, prevCount) {
  adjust_count(count);
  adjust_count(prevCount);
  selectedWorld = world;
  var d = parseMyDate(file);
  cal.changeDate(d, d, world);

  // remove hidden blocks
  var hide = worlds[world]['hide'];
  for (var i in hide) delete count[hide[i]];
  totalBlocks = 0;
  for (var blockId in count) totalBlocks += count[blockId];

  // status
  $('#status').html('A summary of blocks on <span class="highlight">' + world + '/' + file + '</span></br>from a grand total of <span class="highlight">' + totalBlocks +'</span> blocks');

  // sort count
  countSorted = [];
  for (var blockId in count) {
    var blk = {'id': blockId, 'count':count[blockId]};
    if (prevCount != null) blk.prevCount = prevCount[blockId];
    countSorted.push(blk);
  }

  countSorted.sort(function(a,b){return b.count-a.count});

  // make htmls
  featuredHtml = '';
  var showChange = (prevCount != null);
  for (var i=0; i < numFeatured; i++) featuredHtml += featured_html(countSorted[i], showChange);
  $('#featured').html(featuredHtml);
  blocksHtml = '';
  for (var i=numFeatured; i < countSorted.length; i++) blocksHtml += block_html(countSorted[i], showChange);
  $('#blocks').html(blocksHtml);

  worldData = count;

  // update hash without triggering a hash change event
  document.location.hash = lastHash = '#'+world+'/'+file;
}

function parseMyDate(text) {
  var y = parseInt(text.substring(0,4),10);
  var m = parseInt(text.substring(5,7),10);
  var d = parseInt(text.substring(8,10),10);
  return new Date(y,m-1,d);
}

function minecount_load_last(world) {
  var dirFiles = worlds[world].files;
  minecount_load(world + '/' + dirFiles[dirFiles.length-1]);
}

function format_percent(count) {
  n = Math.round(count/totalBlocks*100000)/1000;
  if (n == 0) return false;
  return n + '%';
}

function block_img(block, sz) {
  if (block in blockAlias) block = blockAlias[block];
  return block + '_' + sz + '.png';
}

function featured_html(block,showChange) {
  var blockName = blockNames[block.id];
  var blockPercent = format_percent(block.count);
  var change = showChange?change_html(block.count, block.prevCount):'';
  return '<img src="images/blocks/'+block_img(block.id, 'l')+'" alt="'+blockName+'" />' +
  '<h4>'+blockName+'</h4>' +
  (blockPercent?'<span class="percent">'+blockPercent+'</span>':'') +
  '<span class="count">'+block.count+' blocks</span>'+change+'<br/><br/><br/><br/>';
}

function block_html(block, showChange) {
  var blockName = blockNames[block.id];
  var blockPercent = format_percent(block.count);
  var change = showChange?change_html(block.count, block.prevCount):'';
  return '<div class="block">' +
  '<img src="images/blocks/'+block_img(block.id, 's')+'" alt="'+blockName+'" /><div>'+
  '<h4>'+blockName+'</h4>'+
  '<span class="count">'+block.count+'</span>'+change+'<br/>'+
  (blockPercent?'<span class="percent">'+blockPercent+'</span>':'')
  +'</div></div>';
}

function change_html(newCount, oldCount) {
  if (newCount == oldCount) return '';
  if (oldCount == null) oldCount = 0;
  var changeDir = (newCount>oldCount)?'up':'down';
  var changeSign = (newCount>oldCount)?'▴':'▾';
  var changeDiff = Math.abs(newCount-oldCount);
  return '<span class="change_'+changeDir+'"> '+changeSign+changeDiff+'</span>'
}
<?php
header('Content-type: text/javascrpt');
$basedir = 'count';

$world = isset($_GET['world'])?$_GET['world']:'world';
$from = $_GET['from'];
$to = $_GET['to'];
$blocks = explode(',',$_GET['blocks']);

function get_dates($from, $to, $interval=0) {
    date_default_timezone_set('UTC');
    sscanf($to, '%4d-%2d-%2d', $y, $m, $d);
    $to_sec = mktime(0, 0, 0, $m, $d, $y);
    sscanf($from, '%4d-%2d-%2d', $y, $m, $d);
    $from_sec = mktime(0, 0, 0, $m, $d, $y);
    
    // limit
    $days = ($to_sec - $from_sec) / 86400;
    if ($interval == 0) {
        if ($days < 93) $interval = 1;
        elseif ($days < 186) $interval = 2;
        elseif ($days < 365) $interval = 3;
        else $interval = 4;
    }
    
    // get dates
    $dates = Array();
    if ($from_sec > $to_sec) return $dates;
    for($ts = $from_sec; $ts < $to_sec; $ts += $interval*86400) {
        $dates[] = date('Y-m-d', $ts);
    }
    $dates[] = date('Y-m-d', $to_sec);
    return $dates;
}

function merge_count(&$count, $merge) {
    foreach($merge as $b => $a) {
        if (!isset($count[$a])) $count[$a] = 0;
        $count[$a] += $count[$b];
        unset($count[$b]);
    }
}

function count_for_date($date, $blocks) {
    global $basedir, $world;
    $path = "$basedir/$world/$date.json";
    if (!file_exists($path)) return Array();
    $count = json_decode(file_get_contents($path), TRUE);
    $res = Array();
    
    // merge
    merge_count($count, Array('62'=>'61', // furnace += burning furnace
    '75'=>'76', // redstone torch on += off
    '93'=>'94', // redstone repeater on += off
    '356'=>'94', // redstone repeater on += item
    '123'=>'124', // redstone lamp on += off
    '55'=>'331', // redstone wire += redstone
    '324'=>'64', // wooden door += item
    '330'=>'71', // iron door += item
    '354'=>'92', // cake block += item
    '355'=>'26', // bed block += item
    '379'=>'117', // brewing stand block += item
    '83'=>'338', // sugar cane += block
    '380'=>'118', // cauldron block += item
    '372'=>'115', // nether wart += item
    '397'=>'144', // head += item
    '390'=>'140', // flower pot += item
    '74'=>'73', // redstone ore += glowing
    '63'=>'323', // sign post + item
    '68'=>'323', // wall sign + item
    '149'=>'150', // redstone comparator on += off
    '404'=>'150', // redstone comparator block += item
    )); 
    
    // filter results
    foreach($blocks as $b) {
        $bcount = 0;
        if (isset($count[$b])) $bcount += $count[$b];
        if (isset($count["$b.0"])) $bcount += $count["$b.0"];
        if ($b == 'all') $bcount = array_sum($count);
        $res[$b] = $bcount;
    }
    
    return $res;
}

$dates = get_dates($from, $to);
$data = Array();
foreach($dates as $date) {
    $data[] = count_for_date($date, $blocks);
}

// count by blocks
$count = Array();
foreach($blocks as $b) {
    $count[$b] = Array();
    foreach($data as $d) {
        $count[$b][] = $d[$b];
    }
    
}
echo json_encode(Array(
    'dates' => $dates,
    'blocks' => $blocks,
    'count' => $count));
?>
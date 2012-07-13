<?php
header('Content-type: text/javascrpt');
$basedir = 'count';


function filename_is_json($fn) {
    return (strrchr($fn, '.') === '.json' && substr($fn, 0, 2) !== '._' && strlen($fn) == 15);
}

function remove_extension(&$value, $key) {
    $value = substr($value, 0, -5);
}

function set_intval(&$value, $key) {
    $value = intval($value);
}

$data = Array('base' => $basedir);

$worlds = Array();
$worldDirs = scandir($basedir);
foreach ($worldDirs as $d) {
    if ($d{0} == '.' || $d == 'disabled') continue;
    $dir = $basedir . '/' . $d;
    if (!is_dir($dir)) continue;
    
    // json files in directory
    $worlds[$d] = Array();
    $worlds[$d]['files'] = array_values(array_filter(scandir($dir), 'filename_is_json'));
    array_walk($worlds[$d]['files'], 'remove_extension');
    
    // hidden blocks
    $hiddenfile = $dir . '/hidden';
    if (file_exists($hiddenfile)) {
        $worlds[$d]['hide'] = explode(',', file_get_contents($hiddenfile));
        array_walk($worlds[$d]['hide'], 'set_intval');
    }
    
}
$data['worlds'] = $worlds;

echo json_encode($data);
?>
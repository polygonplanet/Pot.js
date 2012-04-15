<?php
//
// Pot.js / PotLite.js
// JavaScript code minifier
//
// Usage:
//   Run server.
//   Access http://localhost/{this-directory}/minify.php?type=full
//   Parameters:
//     - type:
//         "lite" or "full"
//         Minify "PotLite.js" if "type" is "lite".
//         Minify "Pot.js" if "type" is "full".
//

pot_minify();

class Pot_Minifier {

  const MINIFIER = '../../yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar';

  private $dir;
  private $fileName;
  private $trapName;

  private $parameters = array(
    'line-break' => 160,
    'type'       => 'js',
    'charset'    => 'UTF-8'
  );

  function __construct() {
    $this->init();
    if (empty($_GET)) {
      die('Bad Request');
    }
    $this->dir = dirname(__FILE__);
    $type = null;
    if (isset($_GET['type'])) {
      $type = $_GET['type'];
    }
    switch (strtolower(trim($type))) {
      case 'full':
          $this->fileName    = 'pot.js';
          $this->minName     = 'pot.min.js';
          $this->trapName    = '@-trap-pot.js';
          $this->trapMinName = '@-trap-pot.min.js';
          break;
      case 'lite':
          $this->fileName    = 'potlite.js';
          $this->minName     = 'potlite.min.js';
          $this->trapName    = '@-trap-potlite.js';
          $this->trapMinName = '@-trap-potlite.min.js';
          break;
      default:
          die('Invalid type');
    }
  }

  function init() {
    error_reporting(E_ALL);
    @ini_set('display_errors', 1);
    @ini_set('log_errors', false);
    @ini_set('track_errors', false);
    @ini_set('default_charset', 'UTF-8');
    if (function_exists('date_default_timezone_set') &&
        function_exists('date_default_timezone_get')) {
      @date_default_timezone_set(@date_default_timezone_get());
    }
    header('Content-Type: application/javascript');
  }

  function minify() {
    $this->trap();
    $command = sprintf('java -jar "%s"', $this->fullPath(self::MINIFIER));
    $params = array();
    foreach ($this->parameters as $name => $val) {
      $params[] = sprintf('--%s %s', $name, $val);
    }
    $parameter = sprintf(
      '%s -o "%s/%s" -v "%s/%s"',
      implode(' ', $params),
      $this->dir,
      $this->trapMinName,
      $this->dir,
      $this->trapName
    );
    $cmd = strtr(sprintf('%s %s', $command, $parameter), '\\', '/');
    $output = $this->runExternal($cmd, true);
    printf("%s\n", $output);
    sleep(5);
    $this->untrap();
    printf("Minify SIZE: %s", number_format(filesize($this->minName)));
  }

  function trap() {
    $code = file_get_contents($this->dir . '/' . $this->fileName);
    $code = preg_replace('<^(.*?)([(]function\b\s*\w*\s*[(])>s', '$1(function(){$2', $code, 1);
    $code = preg_replace('<([)]\s*;?\s*)$>s', '$1})();', $code, 1);
    file_put_contents($this->dir . '/' . $this->trapName, $code);
  }

  function untrap() {
    $code = file_get_contents($this->dir . '/' . $this->trapMinName);
    $code = preg_replace('<
      ^ (.*?)
        [(]function[(][)][{]
        ([(]function\b\s*\w*\s*[(][^)]*[)]\s*[{])
    >sx', '$1$2"use strict";', $code);
    $code = preg_replace('<([();])\s*[}][)][(][)]\s*;?\s*$>', '$1', $code);
    $code = rtrim(trim($code), ';') . ";\x0A";
    file_put_contents($this->dir . '/' . $this->minName, $code);
    unlink($this->dir . '/' . $this->trapName);
    unlink($this->dir . '/' . $this->trapMinName);
  }

  function runExternal($command, $as_is = false) {
    $result = null;
    $specs = array(
      0 => array('pipe', 'r'),
      1 => array('pipe', 'w'),
      2 => array('pipe', 'w')
    );
    $process = proc_open($command, $specs, $pipes);
    if (is_resource($process)) {
      fclose($pipes[0]);
      if (function_exists('stream_set_blocking')) {
        stream_set_blocking($pipes[1], 0);
        stream_set_blocking($pipes[2], 0);
      } else if (function_exists('socket_set_blocking')) {
        socket_set_blocking($pipes[1], 0);
        socket_set_blocking($pipes[2], 0);
      }
      $outputs = array();
      while (!feof($pipes[1])) {
        $outputs[] = fgets($pipes[1]);
      }
      $outputs[] = "\n";
      while (!feof($pipes[2])) {
        $outputs[] = fgets($pipes[2]);
      }
      fclose($pipes[1]);
      fclose($pipes[2]);
      proc_close($process);
      if ($as_is) {
        $result = implode('', $outputs);
      } else {
        $outputs = array_filter(array_map('trim', $outputs), 'strlen');
        $result = array_pop($outputs);
      }
    }
    return $result;
  }

  function fullPath($path, $check_exists = false) {
    static $backslash = '\\', $slash = '/', $colon = ':', $is_win = null;
    if ($is_win === null) {
      $is_win = (0 === strncasecmp(PHP_OS, 'win', 3));
    }
    $result = '';
    $fullpath = $path;
    $pre0 = substr($path, 0, 1);
    $pre1 = substr($path, 1, 1);
    if ((!$is_win && $pre0 !== $slash)
      || ($is_win && $pre1 !== $colon)) {
      $fullpath = getcwd() . $slash . $path;
    }
    $fullpath = strtr($fullpath, $backslash, $slash);
    $items = explode($slash, $fullpath);
    $new_items = array();
    foreach ($items as $item) {
      if ($item == null || strpos($item, '.') === 0) {
        if ($item === '..') {
          array_pop($new_items);
        }
        continue;
      }
      $new_items[] = $item;
    }
    $fullpath = implode($slash, $new_items);
    if (!$is_win) {
      $fullpath = $slash . $fullpath;
    }
    $result = $fullpath;
    if ($check_exists) {
      clearstatcache();
      if (!@file_exists($result)) {
        $result = false;
      }
    }
    return $result;
  }
}

function pot_minify() {
  $pm = new Pot_Minifier();
  $pm->minify();
  $pm = null;
  unset($pm);
}


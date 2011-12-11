<?php
//
// Pot.js / PotLite.js
// Simple script compiler
//

pot_build();

class Pot_Builder {

  const POT_SETTINGS     = 'pot.package.json';
  const POTLITE_SETTINGS = 'potlite.package.json';
  const SOURCE_DIR       = '../src/';

  private $debug;
  private $version;
  private $date;
  private $year;
  private $type;
  private $settings;
  private $code;
  private $enclosureCode;
  private $fileName;

  function __construct() {
    $this->init();
    if (empty($_GET)) {
      die('Error: Need to access with HTTP GET.');
    }
    $this->type = isset($_GET['type']) ? strtolower($_GET['type']) : 'full';
    if ($this->type === 'lite') {
      $path = self::POTLITE_SETTINGS;
      define('POTLITE', true, true);
      define('POT', false, true);
    } else {
      $this->type = 'full';
      $path = self::POT_SETTINGS;
      define('POTLITE', false, true);
      define('POT', true, true);
    }
    $this->settings = json_decode(file_get_contents($path));
    $this->fileName = $this->settings->fileName;
    if (isset($_GET['debug'])) {
      $this->debug = (bool)preg_match('{^(?:true|1|on|yes)$}i', $_GET['debug']);
    } else if (isset($this->settings->debug)) {
      $this->debug = (bool)$this->settings->debug;
    } else {
      $this->debug = false;
    }
    if (!empty($_GET['version'])) {
      $this->version = $_GET['version'];
    } else if (isset($this->settings->version)) {
      $this->version = (string)$this->settings->version;
    } else {
      $this->version = '$Version$';
    }
    $this->code = '';
    $this->date = date('Y-m-d');
    $this->year = date('Y');
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

  function build() {
    $this->load();
    $this->flush();
  }

  function load() {
    $codes = array();
    foreach ($this->settings->files as $file) {
      $code = file_get_contents(self::SOURCE_DIR . $file);
      $codes[] = $this->assign($code);
    }
    if ($this->debug) {
      $this->code = implode("\x0A", $codes);
      $wrap = file_get_contents(self::SOURCE_DIR . $this->settings->enclosure);
      $enclosure = $this->evaluate($this->assign($wrap));
      file_put_contents(sprintf('%s-~obj.js', $this->fileName), $enclosure);
      unset($wrap, $enclosure);
    }
    $this->code = $this->evaluate(implode("\x0A", $codes));
    $code = file_get_contents(self::SOURCE_DIR . $this->settings->enclosure);
    $this->enclosureCode = $this->assign($code);
    $this->code = $this->evaluate($this->enclosureCode);
    file_put_contents($this->fileName, $this->code);
  }

  function flush() {
    echo $this->code;
    flush();
  }

  function evaluate($code) {
    ob_start();
    echo eval(sprintf('?>%s', $code));
    $code = ob_get_contents();
    ob_end_clean();
    return $this->normalize($code);
  }

  function normalize($code) {
    return preg_replace('{(\x0D\x0A|\x0A|\x0D)}', "\x0A", $code);
  }

  function assign($code) {
    if (preg_match('{<[?]|[?]>}', $code)) {
      die('Error: Invalid code');
    }
    $code = preg_replace_callback(
      '<
          (?:/(?:/[\x09\x20]*|[*])|)
          \{\#\s*(\$|)(\w+)\s*([^\}]*)\s*\}
          (?:[*]/|)
          (\x0D\x0A|\x0A|\x0D|)
      >sx',
      array($this, 'assignCallback'),
      $code
    );
    return $code;
  }

  function assignCallback($matches) {
    $result = 'throw new Error("error!")';
    $nl = "\x0A";
    if ($matches[1] === '$') {
      $result = sprintf('<?php echo $this->%s ?>%s%s', $matches[2], $nl, $matches[4]);
    } else {
      $expr = '';
      switch (strtolower($matches[2])) {
        case 'if':
            $expr = sprintf('if(%s):', $matches[3]);
            break;
        case 'else':
            $expr = sprintf('else:');
            break;
        case 'elseif':
            $expr = sprintf('elseif(%s):', $matches[3]);
            break;
        case 'end':
        case 'endif':
            $expr = sprintf('endif;');
            break;
        case 'code':
            $expr = sprintf('echo $this->code');
            break;
        default:
            $expr = sprintf('%s', $matches[3]);
            break;
      }
      $result = sprintf('<?php %s ?>%s%s', $expr, $nl, $matches[4]);
    }
    return $result;
  }
}

function pot_build() {
  $pb = new Pot_Builder();
  $pb->build();
  $pb = null;
  unset($pb);
}


<?php

namespace RocketChat;

/**
 * Class RocketChat.
 *
 * Created by PhpStorm.
 * User: Sysosmaster
 * Date: 02/01/17
 * Time: 15:19.
 *
 * @package RocketChat
 */
class RocketChat {

  /**
   * Checks if given path is in this path setting.
   *
   * @param string $path
   *   Path from setting.
   * @param string $target
   *   Current path to check.
   *
   * @return bool
   *   current path is in setting.
   */
  private static function checkIfTargetIsInPath($path, $target) {
    $star = strpos($path, '*');
    if ($star === FALSE) {
      // No star handling.
      return ($path == $target);
    }
    else {
      // Star handling.
      $subStar = substr($path, 0, $star);
      $length = strlen($subStar);
      return (substr($target, 0, $length) === $subStar);
    }
  }

  /**
   * Check if path is in the config to render this element on.
   *
   * @param array $paths
   *   Array of Paths to show the Widget on.
   * @param string $target
   *   The current Path to check for.
   *
   * @return bool
   *   True if this target should have the widget, false if not.
   */
  private static function checkIfTargetIsRocketChatPath(array &$paths, $target) {
    $ret = FALSE;
    foreach ($paths as $path) {
      if (RocketChat::checkIfTargetIsInPath($path, $target)) {
        $ret = TRUE;
      }
    }
    return $ret;
  }

  /**
   * Implements hook_page_alter().
   */
  public static function hookPageAlter(&$page) {
    $path = request_path();
    if (empty($path)) {
      $path = "<front>";
    }
    $paths_raw = variable_get('rocket_chat_route', "");
    $paths = explode("\r\n", $paths_raw);
    foreach ($paths as $key => $value) {
      if (empty($value)) {
        unset($paths[$key]);
      }
    }
    if (empty($paths)) {
      $paths[] = $path;
    }
    if (RocketChat::checkIfTargetIsRocketChatPath($paths, $path)) {
      $url = variable_get('rocket_chat_url', "http://localhost");
      $javascript = <<<JAVASCRIPT
(function ($) {
    'use strict';
    // The embed javascript livechat code.
    (function (w, d, s, u) {
        w.RocketChat = function (c) { w.RocketChat._.push(c); }; w.RocketChat._ = []; w.RocketChat.url = u;
        var h;
        var j;
        h = d.getElementsByTagName(s)[0];
        j = d.createElement(s);
        j.async = true;
        j.src = '$url/packages/rocketchat_livechat/assets/rocket-livechat.js';
        h.parentNode.insertBefore(j, h);
    })(window, document, 'script', '$url/livechat');
})(jQuery);
JAVASCRIPT;
      drupal_add_js($javascript, array(
        'type' => 'inline',
        'scope' => 'footer',
        'weight' => 0,
      ));
    }
  }

  /**
   * Renders the Admin page.
   *
   * @return array
   *   The Structured Drupal Render Array for this Admin page.
   */
  public static function renderAdminPage() {
    $form['rocket_chat_url'] = array(
      '#type' => 'textfield',
      '#title' => t('Rocket.Chat Server'),
      '#default_value' => variable_get('rocket_chat_url', "http://localhost"),
      '#size' => 64,
      '#maxlength' => 128,
      '#description' => t("The URL of the Rocket.Chat server."),
      '#required' => TRUE,
    );
    $form['rocket_chat_route'] = array(
      '#type' => 'textarea',
      '#title' => t('Paths to show the chat widget on.'),
      '#default_value' => variable_get('rocket_chat_route', ""),
      '#cols' => 20,
      '#rows' => 15,
      '#description' => t("use '&lt;front&gt;' to signify the front page. clear this field to make it show on all pages."),
      '#required' => FALSE,
    );
    return system_settings_form($form);
  }

  /**
   * Implements hook_help().
   */
  public static function renderHelpPage(&$path, &$arg) {
    $output = array();
    $extensions = array();
    switch ($path) {
      case 'admin/config/services/rocket_chat':
        $output[] = <<<settingsPageHelp
Here you set the Settigns for the Rocket.Chat module.<br>
<ul>
<li>In the <mark>Rocket.Chat Server</mark> setting you put the base Rocket.Chat url you use to contact the Rocket,chat server.</li>
<li>In the <mark>Paths to show the chat widget on</mark>. you put the drupal url's to show the widget on. With the following Special cases:
  <ul>
  <li>Leave the Textfield empty, this will make the widget show on all pages.</li>
  <li>use the special '<front>' to specify the front page, so the widget is shown on the front page.</li>
  <li>use a '*' at the end of an URL to signify all Url's below a certain path. like 'node/*' to make the widget shown on all nodes.</li>
</li>
</ul>
settingsPageHelp;
        break;

      case 'admin/help#rocket_chat':
        $output[] = <<<helpPage
<h1 id="_rocket-chat_-module-for-drupal-7-"><em>Rocket.Chat</em> Module for Drupal 7.</h1>
<h2 id="introduction">INTRODUCTION</h2>
<p>The Rocket.Chat Module enables a drupal site to integrate Rocket.Chat.<br>it is currently in its <strong><em>7.x-1.0</em></strong> release.
The following Features of rocket chat are imiplemented. </p>
<ul>
<li>A page with the <a href="@rocketchat-livechat">Livechat</a> widget.
This widget offer you the ability to communicate with
your website &#39;guests&#39;.</li>
</ul>
<h2 id="requirements">Requirements</h2>
<p>This module is designed for:</p>
<ul>
<li><a href="@drupal">Drupal 7.35+</a></li>
<li><a href="@rocketchat">Rocket.Chat 0.48.1+</a></li>
</ul>
<p>It is tested with:</p>
<ul>
<li>Drupal 7.35</li>
<li>Rocket.Chat 0.48.1</li>
</ul>
<p>It needs the following Rocket.Chat modules enabled and configured.</p>
<ul>
<li>Livechat</li>
</ul>
<h2 id="recommendations">Recommendations</h2>
<p>We strongly recommand you run your Drupal and your Rocket.Chat behind a TLS/SSL proxy or webserver.
Currently it will only work when both the website and the webapp are in the same type of connection.
(so the drupal and Rocket.Chat are both reachable either over HTTP or HTTPS not one with HTTP and the other with HTTPS)</p>
<p>Furthermre we recommand you configure the Livechat to use Agents, and have some agents in the User mangement section of Livechat.</p>
<h2 id="installation">Installation</h2>
<ul>
<li>Install the module in your modules folder, then clear cache</li>
<li>Submit installation on your website configuration, clear cache</li>
<li>Switch to [web-site-url]/admin/config/services/rocket_chat and fill the config form,
then clear cache (one more time)</li>
<li>Visit [web-site-url]/[path-chosen] then the widget will appear </li>
</ul>
<h2 id="configuration">Configuration</h2>
<p>in the Configuration of the module (located under the &#39;Web services&#39; in the configuration tab.)
 you set the address of the Rocket.Chat server and the Patch on the drupal where the widget is enabled.</p>
<h2 id="troubleshooting">Troubleshooting</h2>
<p>Leave a detailed report of your issue in the <a href="@drupal-issue">issue queue</a> and the maintainers will add it to the task list.</p>
<h2 id="maintainers">Maintainers</h2>
<ul>
<li><a href="@gabriel">Gabriel Engel</a> (Creator Rocket.Chat)</li>
<li><a href="@idevit">idevit</a> (Community Plumbing)</li>
<li><a href="@sysosmaster">sysosmaster</a> (Original Module creator)</li>
</ul>
helpPage;

        $extensions['@drupal'] = 'https://www.drupal.org/project/drupal';
        $extensions['@drupal-issue'] = 'https://www.drupal.org/project/issues/search/2649818';
        $extensions['@rocketchat'] = 'https://rocket.chat';
        $extensions['@rocketchat-livechat'] = 'https://rocket.chat/docs/administrator-guides/livechat';
        $extensions['@gabriel'] = 'https://www.drupal.org/u/gabriel-engel';
        $extensions['@idevit'] = 'https://www.drupal.org/u/idevit';
        $extensions['@sysosmaster'] = 'https://www.drupal.org/u/sysosmaster';
        break;

    }
    $ret = "";
    foreach ($output as $line) {
      $ret .= '<p>' . t($line, $extensions) . '</p>';
    }
    return $ret;
  }

}

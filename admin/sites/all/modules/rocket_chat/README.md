#_Rocket.Chat_ Module for Drupal 7.


CONTENTS OF THIS FILE
---------------------
   
 * Introduction
 * Requirements
 * Recommendations
 * Installation
 * Configuration
 * Troubleshooting
 * Maintainers


INTRODUCTION
------------

The Rocket.Chat Module enables a drupal site to integrate Rocket.Chat.  
This is the 7.x-1.0 Release.
The following Features of rocket chat are imiplemented. 

 * A page with the Livechat widget.
   This widget offer you the ability to communicate with
   your website 'guests'.


Requirements
------------

This module is designed for:
 - [Drupal 7.35+](https://www.drupal.org/project/drupal)
 - [Rocket.Chat 0.48.1+](https://rocket.chat/)

It is tested with:
 - Drupal 7.35
 - Rocket.Chat 0.48.1
 
It needs the following Rocket.Chat modules enabled and configured.
 - Livechat


Recommendations
---------------

We strongly recommand you run your Drupal and your Rocket.Chat behind a TLS/SSL 
proxy or webserver.  
Currently it will only work when both the website and the webapp are in the same
 type of connection.  
(so the drupal and Rocket.Chat are both reachable either over HTTP or HTTPS not 
one with HTTP and the other with HTTPS)

Further more we recommend you configure the Livechat to use Agents, and have 
some agents in the User mangement section of Livechat.


Installation
------------

- Install the module in your modules folder, then clear cache
- Submit installation on your website configuration, clear cache
- Switch to [web-site-url]/admin/config/services/rocket_chat and fill the config
  form, then clear cache (one more time)
- Visit [web-site-url]/[path-chosen] then the widget will appear 


Configuration
-------------

in the Configuration of the module (located under the 'Web services' in the 
configuration tab.)  
 you set the address of the Rocket.Chat server and the Patch on the drupal where
 the widget is enabled.

 
Troubleshooting
---------------
 
Leave a detailed report of your issue in the 
[issue queue](https://www.drupal.org/project/issues/search/2649818) 
and the maintainers will add it to the task list.
 
  
Maintainers
-----------
 
 - [Gabriel Engel](https://www.drupal.org/u/gabriel-engel) (Creator Rocket.Chat)
 - [idevit](https://www.drupal.org/u/idevit) (Community Plumbing)
 - [sysosmaster](https://www.drupal.org/u/sysosmaster) (Original Module creator)

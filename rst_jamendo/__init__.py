#!/usr/bin/env python
# -*- coding: utf-8 -*- #

"""
Jamendo player for reStructuredText
===================================

Directives
----------

::

    .. album:: <id>
       [autoplay]
   
        
    .. playlist:: <id>
       [autoplay]


The `id` is the last componement of the URL of your album (or playlist).
For example, if you playlist URL is ``http://www.jamendo.com/fr/playlist/182840``, so the id of this playlist is ``182840`` ...



Examples
--------

::

    .. album:: 69778
   

    .. playlist:: 182840


    .. album:: 76732
       autoplay

License:
--------


::

    Copyright (C) 2011 Mickaël RAYBAUD (aka Skami18)
    http://github.com/Skami18/

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


Notes:
------

-   This plugin is just a couple of reStructuredText directives for jWidget_.

    The widget you can see on your web pages is not a part of this plugin, it's jWidget_, an HTML/JavaScript based Jamendo player widget licensied under the GNU General Public License version3.

    You can find jWidget_ at https://bitbucket.org/lord_blackfox/jwidget/.

-   This plugin will not work if the variable ``SITEURL`` is not set in the config file, and it will probably not work in local (you must upload it on your webserver).

.. _jWidget: https://bitbucket.org/lord_blackfox/jwidget/

"""

import os
import shutil
from docutils import nodes
from docutils.parsers.rst import directives
from docutils.parsers.rst import Directive
from blinker import signal

from pelican import log

__docformat__ = "restructuredtext"



class JWidget(Directive):
    type = None
    widget_path = None

    required_arguments = 1
    optional_arguments = 1
    final_argument_whitespace = True
    has_content = True
    content = True

    html = """
    <object class="jwidget" type="text/html" data="{path}/widget.html?{autoplay}type={type}&id={id}" 
        style="overflow:hidden; margin:0px; padding:0px; border: 0 none; width:300px; height:130px;">
    </object>   
    """

    def run(self):
        id = directives.nonnegative_int(self.arguments.pop(0))
        log.debug(self.arguments)
        return [
            nodes.raw(
                '', 
                self.html.format(
                    path=self.widget_path,
                    id=id,
                    type=self.type,
                    autoplay=('autoplay&' if 'autoplay' in self.arguments else '')
                ), 
                format='html'
            )
        ]


class AlbumWidget(JWidget):
    type = 'album'

class PlaylistWidget(JWidget):
    type = 'playlist'



def setup(pelican):
    dest = os.path.join(
        pelican.output_path,
        'static',
        'jwidget',
        ''
    )
    data_path = os.path.join(
        os.path.abspath(os.path.dirname(__file__)),
        'data'
    )

    if not os.path.isdir(dest):
        try:
            log.info('copying {s} to {d}'.format(
                s=data_path,
                d=dest
                )
            )
            shutil.copytree(data_path, dest)
        except Exception, e:
            log.error('Cannot copy "{s}" to "{d}"'.format(
                s=data_path,
                d=dest
                )
            )
            log.error('The Jamendo plugin will be disabled...')
            return None

    siteurl = pelican.settings.get('SITEURL')

    JWidget.widget_path = ( siteurl or '') + './static/jwidget'
    directives.register_directive('album', AlbumWidget)
    directives.register_directive('playlist', PlaylistWidget)

signal('pelican_initialized').connect(setup)

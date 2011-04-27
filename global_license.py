# -*- coding: utf-8 -*-
# Copyright(C) 2011 Nicolas Duhamel
#
# global_license plugin for Pelican is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# global_license plugin for Pelican is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with global_license plugin for Pelican. If not, see <http://www.gnu.org/licenses/>.

from docutils import core

from blinker import signal

"""
License plugin for Pelican
==========================

Simply add license variable in article's context, which contain 
the license text.

Settings:
---------

Add  to your settings:

    LICENSE = "`CC BY-NC-SA <http://creativecommons.org/licenses/by-nc-sa/2.0/fr/>`__" # Support rst syntax
"""

def add_license(generator, metadatas):
    if 'license' not in metadatas.keys()\
        and 'LICENSE' in generator.settings.keys():
            metadatas['license'] = generator.settings['LICENSE']
    
    if 'license' in metadatas.keys():
        metadatas['license'] = \
            core.publish_parts(metadatas['license'], writer_name='html').get('body').strip()[3:-4]

signal('pelican_article_generate_context').connect(add_license)

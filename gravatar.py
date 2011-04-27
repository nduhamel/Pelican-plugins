# -*- coding: utf-8 -*-
# Copyright(C) 2011 Nicolas Duhamel
#
# gravatar plugin for Pelican is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# gravatar plugin for Pelican is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with gravatar plugin for Pelican. If not, see <http://www.gnu.org/licenses/>.

import hashlib

from blinker import signal

"""
Gravata plugin for Pelican
==========================

Simply add author_gravatar variable in article's context, which contain 
the gravatar url.

Settings:
---------

Add AUTHOR_EMAIL to your settings file to define default author email

Article metadatas:
------------------

:email:  article's author email

If one of them are defined the author_gravatar variable is added to 
article's context.
"""

def add_gravatar(generator, metadatas):
    
    #first check email
    if 'email' not in metadatas.keys()\
        and 'AUTHOR_EMAIL' in generator.settings.keys():
            metadatas['email'] = generator.settings['AUTHOR_EMAIL']
            
    #then add gravatar url
    if 'email' in metadatas.keys():
        gravatar_url = "http://www.gravatar.com/avatar/" + \
                        hashlib.md5(metadatas['email'].lower()).hexdigest()
        metadatas["author_gravatar"] = gravatar_url
    
    
signal('pelican_article_generate_context').connect(add_gravatar)

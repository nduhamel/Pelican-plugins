from docutils import nodes
from docutils.parsers.rst import directives

"""
HTML5 audio and video directive for reStructuredText
====================================================

Directive
---------

.. video:: <url>
        width= int
        height= int
        autoplay= bool
        preload= bool
        controls= bool
        

.. audio:: <url>
        autoplay= bool
        preload= bool
        controls= bool
        

License
-------

The Python source code is under the terms of the MIT License <http://www.opensource.org/licenses/mit-license.php>.
From original source code: <https://github.com/nduhamel/Pelican-plugins/blob/master/rst_youtube.py>
"""

VIDEO = """
<video
    src="{src}"
    width="{width}"
    height="{height}"
    {autoplay}
    {controls}
    {preload}>

    <p>
        If you can't see this video, try with Frefox:<br />
        <a 
        href="http://www.mozilla-europe.org/"><img 
        border="0" alt="Get Firefox" title="Get Firefox" 
        src="http://sfx-images.mozilla.org/affiliates/Buttons/180x60/trust.gif" /></a>
    </p>

</video>
"""

AUDIO = """
<audio
    src="{src}"
    {autoplay}
    {controls}
    {preload}>

    <p>
        If you can't heard this sound, try with Firefox:<br />
        <a 
        href="http://www.mozilla-europe.org/"><img 
        border="0" alt="Get Firefox" title="Get Firefox" 
        src="http://sfx-images.mozilla.org/affiliates/Buttons/180x60/trust.gif" /></a>
    </p>
</audio>
"""

def video(name, args, options, content, lineno,
            contentOffset, blockText, state, stateMachine):
    """ Restructured text extension for inserting html5 videos """
    opts = {
        'src': content[0],
        'width': 400,
        'height': 300,
        'controls': 'controls',
        'preload': 'preload'
        }
   
    
    opts.update(
        dict(
            [ 
                (
                    i.split('=')[0].lower(), 
                    i.split('=')[-1].lower()
                )   for i in content[1:]
            ]
        )
    )

    opts['autoplay'] = 'autoplay="autoplay"' if opts.get('autoplay') else ''
    opts['controls'] = 'controls="controls"' if opts.get('controls') else ''
    opts['preload'] = 'preload="preload"' if opts.get('preload') else ''

    return [nodes.raw('', VIDEO.format(**opts), format='html')]

video.content = True
directives.register_directive('video', video)



def audio(name, args, options, content, lineno,
            contentOffset, blockText, state, stateMachine):
    """ Restructured text extension for inserting html5 audio """
    opts = {
        'src': content[0],
        'controls': 'controls',
        'preload': 'preload'
        }
   
    
    opts.update(
        dict(
            [ 
                (
                    i.split('=')[0].lower(), 
                    i.split('=')[-1].lower()
                )   for i in content[1:]
            ]
        )
    )

    opts['autoplay'] = 'autoplay="autoplay"' if opts.get('autoplay') else ''
    opts['controls'] = 'controls="controls"' if opts.get('controls') else ''
    opts['preload'] = 'preload="preload"' if opts.get('preload') else ''

    return [nodes.raw('', AUDIO.format(**opts), format='html')]

audio.content = True
directives.register_directive('audio', audio)


url = "https://developers.mural.co/public/reference/getmuralwidgets"
out_file_name = "read-widgets_MURAL";

#url = "https://developers.mural.co/public/reference/createstickynote"
#out_file_name = "create-sticky-note_MURAL";

#url = "http://localhost:8080/?topic_id=read-widgets"
#out_file_name = "read-widgets_mine";

#url = "http://localhost:8080/?topic_id=create-sticky-note"
#out_file_name = "create-sticky-note_mine";

import requests
print( url )
response = requests.get( url )
html = response.text

import codecs
import sys
sys.stdout.reconfigure( encoding="utf-8" )
file = codecs.open( out_file_name + ".html", "w", "utf-8" )
file.write( html )
file.close()

import html2text # Set BODY_WIDTH to 0 in config.py
h = html2text.HTML2Text()
txt = h.handle( html )
import re
txt = re.sub( r'\:\s+([^\s\*])', r': \1', txt )
txt = re.sub( r'\n\n', r'\n', txt )
txt = re.sub( r'\s*\n+\s*\#', r'\n\n#', txt )

file = codecs.open( out_file_name + ".txt", "w", "utf-8" )
file.write( txt )
file.close()





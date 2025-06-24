# 04_ffmpeg

## Background
When I record how-to or "explainer" videos, there are often pauses as I assemble my words (even when I write out scripts ahead of time.)  So, I manually edit the video to remove the pauses so my sentences flow smoothly. 

### Example
Here's a snippet of the original recording of the demo video for the 01_simple-HTML experiment:<br/>
https://youtu.be/VlWuwCacBb8 (Length: 32 seconds)

Here's what the audio track looks like in the editing tool, TechSmith Camtasia:<br/>
<img src="images/audio-track-with-pauses.png" width="800" alt="Audio of original video"/>

Here's that same video snippet with the pauses removed:<br/>
https://youtu.be/NWX_KS105sA (Length: 23 seconds)

Here's what the audio track looks like with the pauses removed:<br/>
<img src="images/audio-track-final_human.png" width="700" alt="Audio after pauses are removed"/>

The following image shows where the silences were removed:<br/>
<img src="images/audio-track-comparison_human.png" width="830" alt="Audio before and after" />

## Pain point
Manually editing the video to trim out the silences is really tedious.

## Objective
Use the [ffmpeg library](https://www.ffmpeg.org/ffmpeg.html) to process video in different ways:
- Extract audio from video
- Identify silences in the audio
- Edit the video to trim out the silences

The ffmpeg library is a popular library for working with video and audio.  But it can be difficult to learn and confusing to use even with experience.  Can AI  use this library correctly??

<p>&nbsp;</p>


## Extracting audio from .mp4 file
Extracting audio from a video is a very common task and not too tricky, so that's a good place to start.

Here's the human-written version:<br/>
[extract-audio_human.js](extract-audio_human.js)

Here's a video stepping through generating code to do the same thing:<br/>
https://youtu.be/4aeILWoy07E

### Detailed prompt
At first, I assumed the AI would need a lot of hand-holding:
- Prompt 1:
   ```
   In this node.js file, create a method with the following properties:
    - The method is named extractAudio
    - The method takes one parameter, called "video_filename"
    - The method sets a local variable, called "audio_filename", with the same base name as video_filename, but with an .mp3 extension
    - A local variable, called "cmd", is the system command to call the ffmpeg library to extract audio from the file named by video_filename and save that audio in the file named by audio_filename
    - The method uses console.log to print the cmd and the ffmpeg output
     ```
- Prompt 2:
   ```
   create a global variable, called "g_video_filename", set to the value: "sample-video.mp4"
   ```
- Prompt 3:
   ```
   Call extractAudio, passing g_video_filename as the parameter
   ```

Running the generated file failed because `ffmpeg.exe` isn't in the `PATH` environment variable (which I knew ahead of time.)  So I asked the AI to help troubleshoot the problem with this prompt:
```
When I run this program, I get the error: "'ffmpeg' is not recognized as an internal or external command"
```

The generated response was this:
```
No code changes are needed. The error message indicates that `ffmpeg` is not installed or not in your system's PATH.
To fix this:
1. Install ffmpeg from https://ffmpeg.org/download.html.
2. Add the ffmpeg executable directory to your system's PATH environment variable.
3. Restart your terminal or command prompt.\n\nAfter these steps, rerun your program.
```

That suggestion isn't totally wrong.  But installing `ffmpeg` can sometimes be a challenge.  Trying to follow those instrucations could send you down a frustrating rabbit hole that sucks up a lot of time with no successful outcome.

I like to use the [Node.js package manager (NPM)](https://www.npmjs.com) to install ffmpeg and the handy component [`@ffmpeg-installer/ffmpeg`](https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg) to handle the path at run time.  So I prompted the AI to also do that with this prompt:
```
use @ffmpeg-installer/ffmpeg to get the path to ffmpeg at run time
```

Here's the file that was generated:</br>
[extract-audio_copilot_full-instructions.js](extract-audio_copilot_full-instructions.js)

Running that generated file successfully extracted the audio from the video into an .mp3 file.  Hooray!

### Short, high-level prompt
I wondered if the AI would think to use `ffmpeg` if I hadn't been so fussy with my prompt.  So I tried a very high-level prompt:
```
Create a node.js script that extracts audio from an .mp4 file
```

The generated file was surprisingly similar to what was generated from the previous, fussy prompting.  I used the same `@ffmpeg-installer/ffmpeg` as before to handle the path, and then tried running the generated file.

When I ran the generated file, there was a problem: 

Here's the file that was generated:</br>
[extract-audio_copilot_less-instructions.js](extract-audio_copilot_less-instructions.js)

<p>&nbsp;</p>


## Identify silences
Before trimming pauses or silences out of a video, you first need to identify them.

Here's the human-created solution:<br/>
[detect-silence_human.js](detect-silence_human.js)

Here's a video stepping through generating code to do the same thing:<br/>
https://youtu.be/Yl6YRygJanM

Based on the experience with the extract-audio sample, when I prompted the AI to generate a solution, I gave this high-level prompt:
```
Create a node.js program to detect the periods of silence in a given .mp4 video file.
Print the silences out in an array of JSON structures like this:
[ { \"silence_start\" : <start-time>, \"silence_end\" : <end-time> }, ... ]
```

Then I used the same prompt as before to get the `ffmpeg` path.

When I ran the generated script, there was a problem: No silences were detected!  (For a decription of what was wrong, watch the video above or see [Root cause of the problem](#root-cause-of-the-problem) below.)

So I use this prompt to get the AI to fix the problem:<br/>
```
This implementation didn't find all the silences
```

The regenerated code did successfully find the silences.  (But the solution sure wasn't intuitive.)

Here's the file that was generated:</br>
[detect-silence_copilot.js](detect-silence_copilot.js)

### Root cause of the problem
The reason no silences were captured is because the `parseFfmpegOutput` routine was expecting to receive the entire output from the `ffmpeg` call at once:
```
function parseFfmpegOutput( data )
{
    var lines = data.toString().split( "\n" );
    var silence_start = null;

    for( var i = 0; i < lines.length; i++ )
    {
```
But the `detectSilence` routine was calling `parseFfmpegOutput` every time a bit of data was returned from the `ffmpeg` call:
```
var ffmpeg = spawn( ffmpegPath, ffmpeg_args );

    ffmpeg.stderr.on( "data", function( data )
    {
        console.log( "data\n" + data ); // <-- I added this to debug the problem
        parseFfmpegOutput( data );

    } );
```
When I added that debugging line, this is what I saw:
```
.
.
.
data
[silencedetect @ 0000024232e6d400] silence_start: 20.0005

data
[silencedetect @ 0000024232e6d400] silence_end: 20.7635 | silence_duration: 0.763016

data
[silencedetect @ 0000024232e6d400] silence_start: 21.5215
[silencedetect @ 0000024232e6d400] silence_end: 22.1046 | silence_duration: 0.583107

data
[silencedetect @ 0000024232e6d400] silence_start: 23.9035
.
.
.
```

<p>&nbsp;</p>

### Error handling
When you specify an output file that already exists, the default `ffmpeg` behavior is to print the following message and wait for user input:
```
File 'sample-video.mp3' already exists. Overwrite ? [y/N]
```

My human-written script just fails in this case.  That's not great, but the AI-generated solution is worse: it just hangs!

<p>&nbsp;</p>


## Trim silences
The big finale.

Here's the human-created solution:<br/>
[trim-silence_human.js](trim-silence_human.js)

Here's a video stepping through generating code to do the same thing:<br/>
_working..._

This case turned out to be too hard for a one-line prompt.
Initial prompt:
```
Create a node.js script that trims silent parts from an .mp4 file
```
(Then I used the same prompt as before to get the `ffmpeg` path.)

The ~one-line prompt didn't result in a successful solution.  So I generated 7 tries with the same simple prompt to see what would happen.  The 7 solutions were surprisingly different from one another.  And they all had different problems to troubleshoot.  The table below summarizes my effort to get them all working.

<table>
<tr>
<td>Trial</td>
<td>Notes</td>
</tr>
<tr>
<td valign="top">
<p>01</p>
<p>[ SUCCESS ]</p>
<ul>
<li><a href="trim-silence/trim-silence_copilot_01_01.js">First&nbsp;try</a></li>
<li><a href="trim-silence/trim-silence_copilot_01_final.js">Final&nbsp;try</a></li>
</ul>
</td>
<td valign="top">
<p>Troubleshooting:</p>
<ul>
<li>The first line tries to import the library <code>fluent-ffmpeg</code> is depracated, so I submitted the following prompt:<br/>
<code>The package called "fluent-ffmpeg" is deprecated., so don't use that library.</code></li>
</ul>
<p>After that, the generated solution worked.</p>
</td>
</tr>
<tr>
<td valign="top">
<p>02</p>
<p>[ SUCCESS ]</p>
<ul>
<li><a href="trim-silence/trim-silence_copilot_02_01.js">First&nbsp;try</a></li>
<li><a href="trim-silence/trim-silence_copilot_02_final.js">Final&nbsp;try</a></li>
</ul>
</td>
<td valign="top">
<p>Troubleshooting:</p>
<ul>
<li>The generated solution used <code>ffprobe</code> to determine the total length of the original video (for some reason.)  
But because of the install problems mentioned above, and because there is a simple solution without using it, I submitted the following prompt:<br/>
<code>Rework this solution so it doesn't use ffprobe.</code></li>
<li>Then, when I ran the generated script, it threw errors, so I submitted the following prompt:<br/>
<code>This implentation has a bug in it. When I run this script, I get the following error: "[concat @ 000001dea4de99c0] DTS 167700 < 170036 out of order
[mp4 @ 000001dea4df4ec0] Non-monotonous DTS in output stream 0:0; previous: 170036, current: 167700; changing to 170037. This may result in incorrect timestamps in the output file."</code></li>
</ul>
<p>After that, the generated solution worked.</p>
</td>
</tr>
<tr>
<td valign="top">
<p>03</p>
<p>[ FAIL ]</p>
<ul>
<li><a href="trim-silence/trim-silence_copilot_03_01.js">First&nbsp;try</a></li>
<li><a href="trim-silence/trim-silence_copilot_03_final.js">Final&nbsp;try</a></li>
</ul>
</td>
<td valign="top">
<p>Troubleshooting:</p>
<ul>
<li>The generated solution used <code>ffprobe</code> to determine the total length of the original video, like solution 01.  
I used the same prompt to rework the solution to not use <code>ffprobe</code>.</li>
<li>In a few places, there was simply this placeholder:<br/>
<code>// ...existing code...</code><br/>
So I submitted the following prompt:<br/>
<code>You have to put code where it says "...existing code..."</code></li>
<li>Running the script returned an error, so I submitted this prompt:<br/>
<code>Running this script gets the following error: "Error: Command failed: "ffmpeg.exe" -i "video-with-silences.mp4" 2>&1"</code></li>
<li>Now, the script was running into the "Non-monotonous DTS in output stream" error that 02 hit.  I submitted the same prompt again for 03.</li>
<li>That didn't fix the prolem, so I submitted this prompt: <code>The previous change did not fi the problem</code></li>
</ul>
<p>These troubleshooting efforts still didn't make the solution work, so I gave up.</p>
</td>
</tr>
<tr>
<td valign="top">
<p>04</p>
<p>[ FAIL ]</p>
<ul>
<li><a href="trim-silence/trim-silence_copilot_04_01.js">First&nbsp;try</a></li>
<li><a href="trim-silence/trim-silence_copilot_04_final.js">Final&nbsp;try</a></li>
</ul>
</td>
<td valign="top">
<p>Troubleshooting:</p>
<ul>
<li>The generated solution used <code>ffprobe</code> to determine the total length of the original video, like solution 01.  
I used the same prompt to rework the solution to not use <code>ffprobe</code>.</li>
<li>In a few places, there was simply this placeholder:<br/>
<code>// ...existing code...</code><br/>
So I submitted the following prompt:<br/>
<code>You have to put code where it says "...existing code..."</code></li>
<li>Running the script returned an error, so I submitted this prompt:<br/>
<code>Running this script gets the following error: "Error: Command failed: "ffmpeg.exe" -i "video-with-silences.mp4" 2>&1"</code></li>
<li>Now, the script was running into the "Non-monotonous DTS in output stream" error that 02 hit.  I submitted the same prompt again for 03.</li>
<li>That didn't fix the prolem, so I submitted this prompt: <code>The previous change did not fix the problem</code></li>
</ul>
<p>These troubleshooting efforts still didn't make the solution work, so I gave up.</p>
</td>
</tr>
<tr>
<td valign="top">
<p>05</p>
<p>[ FAIL ]</p>
<ul>
<li><a href="trim-silence/trim-silence_copilot_05_01.js">First&nbsp;try</a></li>
<li><a href="trim-silence/trim-silence_copilot_05_final.js">Final&nbsp;try</a></li>
</ul>
</td>
<td valign="top">
<p>Troubleshooting:</p>
<ul>
<li>Running the generated script returned and error, so I submitted this prompt:<br/>
<code>Running this script returns the following error: "Error: Command failed: ffmpeg -i "video-with-silences.mp4" -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1"</code></li>
<li>The updates made that error go away, but the script didn't work.  So I submitted this prompt:<br/>
<code>This script has a bug. When I run this script, it doesn't detect any silences.</code></li>
<li>The next change added the use of `ffprobe`, so I sumitted this prompt:<br/>
<code>Change this solution do it doesn't use ffprobe</code></li>
<li>The updated script didn't detect any silences, so I prompted:<br/>
<code>When I run this script, it doesn't detect any silences</code></li>
</ul>
<p>After these troubleshooting steps, the script still didn't trim any silences, so I gave up.</p>
</td>
</tr>
<tr>
<td valign="top">
<p>06</p>
<p>[ FAIL ]</p>
<ul>
<li><a href="trim-silence/trim-silence_copilot_06_01.js">First&nbsp;try</a></li>
<li><a href="trim-silence/trim-silence_copilot_06_final.js">Final&nbsp;try</a></li>
</ul>
</td>
<td valign="top">
<p>Troubleshooting:</p>
<ul>
<li>The script tried to require the deprecated package <code>fluent-ffmpeg</code>, so I submitted this prompt:<br/>
<code>The package called "fluent-ffmpeg" is deprecated. Change the solution so it doesn't use fluent-ffmpeg.</code></li>
<li>The updated script tried to use <code>ffprobe</code>, so I submitted this prompt:<br/>
<code>Change the solution so it doesn't use ffprobe</code></li>
<li>The updated script then tried to call <code>ffmpeg</code> improperly, so I sumitted this prompt:<br/>
<code>Use @ffmpeg-installer/ffmpeg to get the path for ffmeg at run time</code></li>
<li>The updated script returned an error, so I prompted:<br/>
<code>When I run this script, I get the following error: "Error: Command failed: "ffmpeg.exe" -i "video-with-silences.mp4" 2>&1"</code></li>
<li>The updated script didn't remove any silences, so I prompted:<br/>
<code>This script doesn't remove any of the silences. The output file still has all the silences, but it's supposed to have the silences removed.</code></li>
</ul>
<p>After these troubleshooting steps, the script still didn't trim any silences, so I gave up.</p>
</td>
</tr>
<tr>
<td valign="top">
<p>07</p>
<p>[ SUCCESS ]</p>
<ul>
<li><a href="trim-silence/trim-silence_copilot_07_01.js">First&nbsp;try</a></li>
<li><a href="trim-silence/trim-silence_copilot_07_final.js">Final&nbsp;try</a></li>
</ul>
</td>
<td valign="top">
<p>Troubleshooting:</p>
<ul>
<li>The script tried to use <code>ffprobe</code>, so I submitted this prompt:<br/>
<code>Change the solution so it doesn't use ffprobe</code></li>
</ul>
<p>After this one extra prompt, the script worked.</p>
</td>
</tr>
</table>


<p>&nbsp;</p>


## Analysis, remarks

### UX-breaking extension update
The way files are included as context was changed in a recent update to the GitHub Copilot VS Code extension:<br/>
https://youtu.be/JQRytAkPh7g

In a nutshell: VC Code creates a new file every time you submit a prompt, unless you click the name of the file you already have open in the editor.

### Confusion about content pulled into prompts as context
There are other fishy things about how files are included as context too:
- For example, sometimes it looks like the same instruction file is being pulled in multiple times.
- Also, I started to wonder if VS Code was reading the contents of the directory in which my current file is located and then including the contents of those other files in the directory as context too.  The thing that made me wonder this is that I was seeing spooky similarities between generated code and what's in other files in the working directory (I have no proof of this.)  This cunfusion and lack-of-trust is a result of the lack of transparency and obfuscation around what VS Code does, what Copilot does, and what OpenAI does between the prompt text you write and the LLM that is generating output.

### Human factors: I'm not checking the code like I should be
For some of the messier implementations, as I was prompting the AI to fix bugs, I stopped even trying to understand what the generated was doing.  I found myself not even reading the code.  I just ran the solution and then prompted the AI with "Running this script returned this error: <error-message>".  That's not the way to work on customer-facing, production code!  But when I forced my eyeballs to scan the offending, messy, bizarre code, my brain was screaming in agony.  It sounds extreme even to me.  And this is just one, small file.  I cannot stress strongly enough how unlikely it is that developers will thoroughly review AI-generated code like they should.  This means "have a review process in place" is not a good way to mitigate the risk of AI-generated code having serious security, privacy, accessibility, and performance problems.

### Human-factors: Slot machine
When generating a script didn't work, and as I got frustrated debugging increasingly bizarre and messy generated refactored code, it was so much easier to just throw the current attempt in the garbage and start from scratch.  I thought: "Maybe this time, it will generate a successful solution!"  Mayb this time.  Maybe this time.  Maybe this time.  And the intermittent success rate was the perfect reward to keep me pulling that metaphrical slot-machine arm.  I got bogged down and spent way too long on an imperfect approach (the attempt at generating a solution from one, high-level prompt) because it was so easy to just regenerate, and because _maybe this time will be the charm._

<p>&nbsp;</p>


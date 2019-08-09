# Dominant Colour Video Map Generator

This is a node.js app that while take a video, break it up into individual frames, find the dominant colour on every frame and then generate a HTML file that you can render the colour map out in the browser


### Setup

First you need to make sure you have Homebrew installed 

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Make sure you have ffmpeg installed on your system

```bash
brew install ffmpeg
```

If you dont already have Node.js installed run

```bash 
brew install nodejs
```

Clone this repo

```bash 
git clone https://github.com/SamMalcolm/dominant-video-colour.git
```

Move to the directory

```bash
cd dominant-video-colour
```

Install the dependancies

```bash
npm install
```

Then when you are ready to go, simply run:

```bash
node index /path/to/video.mp4
```

### Important

The process will be much quicker if the video is heavily compressed, currently the app does not handle this for you.
You can use the tool Handbrake to compress the video. Results should not change if the video quality is heavily reduced.
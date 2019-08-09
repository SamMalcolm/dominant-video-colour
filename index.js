const ColorThief = require('colorthief');
const extractFrames = require('ffmpeg-extract-frames');
const _cliProgress = require('cli-progress');
const fs = require('fs');
const colors = require('colors');
const bar1 = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

let colours = [];
let fileName = process.argv[2];

const processData = async (fileName) => {
	return new Promise(async (resolve, reject) => {
		console.log("BREAKING VIDEO INTO FRAMES".cyan);
		await extractFrames({
			input: fileName,
			output: './output/frames/frame-%d.png'
		}).catch((err) => { console.log(colors.red(err)) })
		fs.readdir('./output/frames', async (err, files) => {
			if (err) {
				console.log(colors.red(err));
			}
			var attempts = 0;
			console.log("GENERATING COLOURS".cyan);
			bar1.start(files.length, attempts);
			for (let i = 0; i < files.length; i++) {
				fs.exists('output/frames/' + files[i], async (exists) => {
					if (exists) {
						let color = "";
						try {
							color = await ColorThief.getColor('output/frames/' + files[i]);
							attempts++;
							bar1.update(attempts);
							if (typeof color == "object") {
								let frameColour = {};
								frameColour.index = files[i].indexOf('-');
								frameColour.index = files[i].slice(frameColour.index + 1, files[i].indexOf('.'));
								frameColour.index = parseInt(frameColour.index);
								frameColour.colour = color;
								colours.push(frameColour);
								fs.unlink('output/frames/' + files[i], (err) => {
									if (err) { console.log(colors.red(err)); }
									if (attempts == files.length) {
										colours = colours.sort((a, b) => { return a.index - b.index })
										resolve(colours);
										fs.writeFileSync('output/json/colours.json', JSON.stringify(colours));
									}
								})

							}
						}
						catch (e) {
							attempts++;
							bar1.update(attempts);
							if (attempts == files.length) {
								colours = colours.sort((a, b) => { return a.index - b.index })
								resolve(colours);
								fs.writeFileSync('output/json/colours.json', JSON.stringify(colours));
							}
						}
					}
				});
			}
		});

	});
}

const generateMarkup = (coloursArr) => {
	bar1.stop();
	// calc(100% / ${coloursArr.length})
	console.log("GENERATING MARKUP".cyan);
	let colourMarkup = "";
	for (let i = 0; i < coloursArr.length; i++) {
		colourMarkup += `
		<div style="width:100%; background-color:rgb(${coloursArr[i].colour[0]},${coloursArr[i].colour[1]},${coloursArr[i].colour[2]});"></div>`;
	}
	fileName = fileName.split('/');
	fileName = fileName[fileName.length - 1];
	fileName = fileName.split('.')[0];
	let markup = `
	<html>
		<head>
			<title>${fileName}</title>
		</head>
		<body style="display:flex; flex-direction:row; position:absolute; margin:0; padding:0; width:100%; height:100%">
		<div style="position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-items: stretch;">
			${colourMarkup}
			</div>
		</body>
	</html>
	`;

	fs.writeFile('output/html/' + fileName + '.html', markup, (err) => {
		if (err) { console.log(colors.red(err)); }
		console.log("DONE!".green)
	})
}

// fs.readFile('output/json/colours.json', (err, data) => {
// 	let colours = JSON.parse(data);
// 	generateMarkup(colours);
// })
processData(fileName).then((coloursArr) => {

	generateMarkup(coloursArr);

});

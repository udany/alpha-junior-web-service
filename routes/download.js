import express from 'express'
import axios from 'axios'
import m3u8Parser from 'm3u8-parser'
import Ffmpeg from 'fluent-ffmpeg'
import chalk from 'chalk'

let router = express.Router();

let cookies = '__cfduid=d17589c1136102b381b5745c5e55faa801502577527; PHPSESSID=mrktunlqleai5j4jp0vmm8a7g4; video-binge=true; umbel1-q0=2017-08-12T22%253A39%253A26.906Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522RWBY%2520Chibi%2522%255D%257D%262017-08-12T22%253A39%253A26.908Z%3D%257B%2522name%2522%253A%2522app.user_agent%2522%252C%2522value%2522%253A%2522Mozilla%252F5.0%2520%28Windows%2520NT%252010.0%253B%2520Win64%253B%2520x64%29%2520AppleWebKit%252F537.36%2520%28KHTML%252C%2520like%2520Gecko%29%2520Chrome%252F62.0.3178.0%2520Safari%252F537.36%2522%257D%262017-08-15T07%253A04%253A54.640Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A30.526Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A31.412Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A34.130Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A34.734Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A35.821Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A36.327Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A36.534Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A37.295Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-15T07%253A06%253A40.205Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522Camp%2520Camp%2522%255D%257D%262017-08-19T19%253A41%253A01.269Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522RWBY%2520Chibi%2522%255D%257D%262017-08-26T19%253A03%253A13.205Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522RWBY%2520Chibi%2522%255D%257D%262017-08-26T19%253A03%253A13.209Z%3D%257B%2522name%2522%253A%2522app.user_agent%2522%252C%2522value%2522%253A%2522Mozilla%252F5.0%2520%28Windows%2520NT%252010.0%253B%2520Win64%253B%2520x64%29%2520AppleWebKit%252F537.36%2520%28KHTML%252C%2520like%2520Gecko%29%2520Chrome%252F62.0.3188.4%2520Safari%252F537.36%2522%257D%262017-09-02T04%253A50%253A10.738Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522RWBY%2522%255D%257D%262017-09-02T04%253A50%253A10.745Z%3D%257B%2522name%2522%253A%2522app.user_agent%2522%252C%2522value%2522%253A%2522Mozilla%252F5.0%2520%28Windows%2520NT%252010.0%253B%2520Win64%253B%2520x64%29%2520AppleWebKit%252F537.36%2520%28KHTML%252C%2520like%2520Gecko%29%2520Chrome%252F62.0.3198.0%2520Safari%252F537.36%2522%257D%262017-09-02T04%253A50%253A10.746Z%3D%257B%2522name%2522%253A%2522action.referrer%2522%252C%2522value%2522%253A%2522reddit.com%2522%257D%262017-09-02T04%253A55%253A08.615Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522RWBY%2522%255D%257D%262017-09-02T05%253A00%253A01.451Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522RWBY%2522%255D%257D%262017-09-02T05%253A00%253A47.862Z%3D%257B%2522name%2522%253A%2522action.tag%2522%252C%2522value%2522%253A%255B%2522Consuming%2522%252C%2522RWBY%2522%255D%257D; umbel_browser_id=24a1aa58-20ed-4a8d-9c66-1fec9cfc97f0; _ga=GA1.2.530194839.1502519254; optimizelyEndUserId=oeu1508317544752r0.1628453221880528; optimizelyBuckets=%7B%7D; _isuid=4BE420E5-780F-4883-B792-90BFBB4CC23D; _gac_UA-2631020-20=1.1508461267.CKG-kKz0_dYCFVtMDQodYGYA9w; video-volume=1; optimizelySegments=%7B%228605722630%22%3A%22false%22%2C%228610970160%22%3A%22referral%22%2C%228596053393%22%3A%22gc%22%2C%228610142209%22%3A%22store%2520mcbeard%22%7D; umbel1-v0=app.user_agent%3DMozilla%252F5.0%2520%28Windows%2520NT%252010.0%253B%2520Win64%253B%2520x64%29%2520AppleWebKit%252F537.36%2520%28KHTML%252C%2520like%2520Gecko%29%2520Chrome%252F65.0.3298.3%2520Safari%252F537.36%26action.referrer%3Dreddit.com; video-quality=1080; video-fullscreen=true; _gid=GA1.2.1639878655.1515207335; note-disabled=true; rt_production_session=eyJpdiI6Ik9PZE4yNGdrZitOemZIdDliUWpFNjN5ckw5SVVUdzlxQ0xnXC84Wk8yUG13PSIsInZhbHVlIjoiZGhEbVwveDBmSTBvQzVrZkVwNWd4emFJQWhabjBiSEw1ZXdLeWcyazV2SzhNMnY3a3MzNGx2eHVwMGhqSnZjdVc1RTZkM2J5ek9FNzdyZ2dcL1dSU3hcL3c9PSIsIm1hYyI6IjFlMTY1MzI2YmQ4ZjAwNWNhZjI1YWRkZGI3YzE3NzQ3OWQ2ZjYyYzU1NjYwYjRiOWIxZWQ2ZDdiNzM1MWRlMzAifQ%3D%3D';

let regex = /file: '(.*\.m3u8)'/;

router.post('/test', async function (req, res, next) {

    res.send(path);
});

router.post('/', async function (req, res, next) {
    let {body: params} = req;
    let result;
    try {
        result = await axios.get(params.url, {
            headers: {
                Cookie: cookies
            }
        });
        if (result) {
            result = result.data;
        }
    } catch (e) {
        console.log(chalk.redBright(`Error: ${e.message}`));
        res.send(e);
        return;
    }

    console.log(chalk.blueBright(`Url feched: ${params.url}`));

    if (!result) {
        console.log(chalk.redBright(`No data`));
        return;
    }

    let matches = regex.exec(result);

    if (matches.length !== 2) {
        console.log(chalk.redBright(`No matches`));
        return;
    }

    let file = matches[1];
    console.log(chalk.blueBright(`Base m3u8: ${file}`));


    let {data: m3u8} = await axios.get(file);

    let parser = new m3u8Parser.Parser();
    parser.push(m3u8);
    parser.end();

    let {manifest} = parser;

    let {uri: m3u8Uri} = manifest.playlists[0];

    m3u8Uri = file.replace('index.m3u8', '') + m3u8Uri;

    console.log(chalk.blueBright(`1080p m3u8: ${m3u8Uri}`));

    let ffcommand = new Ffmpeg();
    ffcommand
        .input(m3u8Uri)
        .outputOptions([
            '-c copy',
            '-bsf:a aac_adtstoasc'
        ])
        // Events
        .on('start', function (commandLine) {
            console.log(chalk.blueBright('Spawned Ffmpeg with command: ' + commandLine));
        })
        .on('codecData', function (data) {
            console.log('Input is ' + data.audio + ' audio ' +
                'with ' + data.video + ' video');
        })
        .on('progress', function (progress) {

            let percent = progress.percent;
            percent = Math.floor(percent * 100) / 100;
            percent = percent.pad(2, 2)

            let fps = progress.currentFps.pad(2, 2);
            let kbps = progress.currentKbps.pad(4, 2);
            let time = progress.timemark;

            let str = `${fps} fps / ${kbps} kbps / ${time}`;

            console.log(chalk.greenBright(percent + ' / ') + chalk.yellow(str));
        })
        .on('end', () => {
            console.log(chalk.greenBright('== Downloaded!'));
        })
        .on('error', function (err) {
            console.log(chalk.redBright('== An error occurred:'));
            console.log(chalk.redBright(err.message));
        });

    let {pattern, name} = params;
    let path = pattern.replace(/\{0\}/g, name);

    console.log(chalk.greenBright(`File path: ${path}`));

    ffcommand.save(path);

    res.send(m3u8Uri);
});

module.exports.path = '/download';
module.exports.router = router;


const cheerio = require("cheerio");
// const request = require("request");s
const axios = require("axios");
const fs = require("fs");



const euripidesPlays = [
    "alcestis",
    "andromache",
    "bacchan",
    "cyclops",
    "electra_eur",
    "hecuba",
    "helen",
    "heracleidae",
    "heracles",
    "hippolytus",
    "ion",
    "iphi_aul",
    "iph_taur",
    "medea",
    "orestes",
    "phoenissae",
    "rhesus",
    "suppliants",
    "troj_women"
];

const sophoclesPlays = [
    "ajax",
    "antigone",
    "electra",
    "colonus",
    "oedipus",
    "philoct",
    "trachinae"
];


run2();

// run();

// async function run() {
//     const play = "bacchan";
//     const r = await getText(play);
//     // const scene = JSON.stringify(r);

//     const json = [{
//         title: "bacchan",
//         play: "bacchan",
//         lines: r
//     }];

//     const file = JSON.stringify(json);

//     console.log("writing....", play);
//     fs.writeFileSync(`./public/plays/${play}.json`, file);
//     // console.log("r", r);
// }


async function run2() {
    const allPlays = await Promise.all(euripidesPlays.map(p => getText(p)));
    // console.log('data', allPlays);

    allPlays.forEach(play => {
        const json = [{
            title: play.play,
            play: play.play,
            lines: play.lines
        }];
        const file = JSON.stringify(json);

        console.log('writing..', play.play)
        fs.writeFileSync(`./public/plays/euripides/${play.play}.json`, file);
    });
}



async function getText(play) {
    const baseUrl = "http://classics.mit.edu/Euripides/";
    const url = `${baseUrl}/${play}.html`;
    const resp = await axios.get(url);
    const $ = cheerio.load(resp.data);

    const res = [];

    let speaker = "";

    $("a").each((i, el) => {
        const next = $(el).next().text();
        // @ts-ignore
        const tag = $(el).next()['0']?.name;
        const text = next;
        let type = "text";

        if (tag === "b") {
            type = "speech";
            speaker = next;
        }

        if (text) {
            res.push({ type, value: text, speaker })
        }

        // NOTE: Counts a huge chunk  of text as one line because  of the markup...
        // Might need to count words for these

        // Also an issue with stage directions (get two versions  of a speaker)

        // And the trash at beginning (nav stuff)


        // console.log(next, tag);
        // console.log("==============")
    });

    return {
        lines: res,
        play
    }
}
export const plays = [
    { value: "macbeth", label: "Macbeth" },
    { value: "merchant", label: "Merchant of Venice" },
    { value: "asyoulikeit", label: "As You Like It" },
];

export const emojiRelationships = {
    "murders": "🔫",
    "loves": "💖",
    "scorns": "",
    "hates": "",
    "serves": "",
    "commands": "", // redundant?
    "parents": "",
    "childs": "" // redundant?
}


export const getSceneBreakdown = (scene: any) => {
    if (!scene.lines) return { numLines: 0, speakerAmts: [] };
    const numLines = scene.lines.filter((l: any) => l.type === "text").length;
    const speakers: any = {};
    // speakers items look like:
    // macbeth: 30
    scene.lines
        .filter((l: any) => l.type === "text")
        .forEach((line: any) => {
            if (!speakers.hasOwnProperty(line.speaker)) {
                speakers[line.speaker] = 0;
            }
            speakers[line.speaker]++;
        });

    // return speakers;

    const speakerAmts = Object.keys(speakers)
        .map((speaker) => {
            return { speaker, value: speakers[speaker] / numLines };
        })
        .sort((a, b) => b.value - a.value);

    return {
        numLines,
        speakerAmts,
    };
};


// TODOO: refacator to use getScenebrekadown
export const getPlayBreakdown = (scenes: any) => {
    let numLines = 0;
    const speakers: any = {};
    // speakers items look like:
    // macbeth: 30

    scenes.forEach((scene: any) => {
        scene.lines
            .filter((l: any) => l.type === "text")
            .forEach((line: any) => {
                // console.log('line....', line.speaker);
                if (!speakers.hasOwnProperty(line.speaker)) {
                    speakers[line.speaker] = 0;
                }
                numLines++;
                speakers[line.speaker]++;
            });
    });


    // console.log("spkrs", speakers);

    const speakerAmts = Object.keys(speakers)
        .map((speaker) => {
            return { speaker, value: speakers[speaker] / numLines };
        })
        .sort((a, b) => b.value - a.value);

    return {
        numLines,
        speakerAmts,
    };
};

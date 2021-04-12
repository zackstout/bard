// import * as d3 from "d3";
import d3 from "@/assets/d3";


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


export const getSceneBreakdown = (scene) => {
  if (!scene.lines) return { numLines: 0, speakerAmts: [] };
  const numLines = scene.lines.filter((l) => l.type === "text").length;
  const speakers = {};
  // speakers items look like:
  // macbeth: 30
  scene.lines
    .filter((l) => l.type === "text")
    .forEach((line) => {
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
export const getPlayBreakdown = (scenes) => {
  let numLines = 0;
  const speakers = {};
  // speakers items look like:
  // macbeth: 30

  scenes.forEach((scene) => {
    scene.lines
      .filter((l) => l.type === "text")
      .forEach((line) => {
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



export const getLinesBySpeakerByChunk = (scenes, chunkSize = 10) => {
  const res = [];
  const speakers = getSpeakers(scenes);

  speakers.forEach((speaker) => {
    let chunkIdx = 0;
    let lineNo = 0;
    let numLines = 0;

    scenes.forEach((scene, sceneIdx) => {
      scene.lines.forEach((line) => {
        if (line.type === "text") lineNo++;

        if (line.type === "text" && line.speaker === speaker) numLines++;

        if (lineNo % chunkSize === 0 && lineNo > 0) {
          // save chunk, start new one
          res.push({
            speaker,
            chunkIdx,
            value: numLines,
          });
          lineNo = 0;
          numLines = 0;
          chunkIdx++;
        }
      });
    });
  });

  return res;
};




function getSpeakers(scenes) {
  const res = [];
  scenes.forEach((scene) => {
    scene.lines.forEach((line) => {
      if (line.type === "speech" && !res.includes(line.value)) {
        res.push(line.value);
      }
    });
  });

  return res;
}


// function getCharColor(idx) {
//     // console.log("get fill", idx);
//     if (idx < CHAR_COLORS.length) return CHAR_COLORS[idx];
//     return "gray";
//   }

function slug(name) {
  return name.replace(/\s/g, "_");
}

//   function getSpeeches(scene) {
//     const speeches = [];

//     let speech = {
//       speaker: "",
//       lines: [],
//     };
//     // console.log(scene);

//     scene.lines.forEach((line, idx) => {
//       if (idx === scene.lines.length - 1) {
//         // last line: push speech
//         speech.lines.push(line.value);
//         speeches.push(speech);
//         return;
//       }
//       if (line.type === "speech") {
//         // skip first speaker line:
//         if (speech.lines.length > 0) {
//           speeches.push(speech);
//           speech = {};
//           speech.lines = [];
//         }
//         speech.speaker = line.value;
//       } else {
//         speech.lines.push(line.value);
//       }
//     });

//     return speeches;
//   }

//   /*
//   Idea here is to naively assume that when person B speaks directly after person A, they are interacting.s

//   Hmm...we could alternatively try to weight interactions by num of lines
//   */
//   function getCharacterInteractions(scenes) {
//     const interactions = {};

//     scenes.forEach((scene) => {
//       const speeches = getSpeeches(scene);
//       let prevSpeaker = speeches[0].speaker;
//       speeches.slice(1).forEach((speech) => {
//         if (!interactions.hasOwnProperty(prevSpeaker)) {
//           interactions[prevSpeaker] = {};
//         }
//         if (!interactions[prevSpeaker].hasOwnProperty(speech.speaker)) {
//           interactions[prevSpeaker][speech.speaker] = 0;
//         }
//         interactions[prevSpeaker][speech.speaker]++;
//         prevSpeaker = speech.speaker;
//       });
//     });

//     return interactions;
//   }

//   function getInteractionTotals(interactions) {
//     const res = {};

//     Object.keys(interactions).forEach((speaker) => {
//       Object.keys(interactions[speaker]).forEach((otherSpeaker) => {
//         const pairRep = [speaker, otherSpeaker].sort().join("_");
//         if (!res.hasOwnProperty(pairRep)) {
//           res[pairRep] = 0;
//         }
//         res[pairRep] += interactions[speaker][otherSpeaker];
//       });
//     });

//     // res is an object like {"Banquo_Macbeth": 42, ...}

//     return Object.keys(res)
//       .map((pair) => {
//         return { pair, value: res[pair] };
//       })
//       .sort((a, b) => b.value - a.value);
//     // return res;
//   }







// var margin = { top: 30, right: 20, bottom: 100, left: 180 },
//   width = window.innerWidth - margin.left - margin.right,
//   height = window.innerHeight - margin.top - margin.bottom;




export const runRidgelines = (playData, chunkSize = 10, width = 500, height = 300, overlap = 0.6) => {

  // Percent two area charts can overlap

  // TODO: This affects the top one weirdly...add margin top?
  // var overlap = 0.6;

  // NOTE: To change from scene/line, change this fn, and hcange spkrs/spkrs2
  var x = function (d) {
    // return d.sceneIdx;
    // console.log("d..", d);

    return d.chunkIdx;
    // return d.lineNo;
  },
    xScale = d3.scaleLinear().range([0, width]),
    // xScale = d3.range([0, width]),
    xValue = function (d) {
      return xScale(x(d));
    },
    xAxis = d3.axisBottom(xScale);

  var y = function (d) {
    // console.log("d...", d);
    return d.value;
  },
    yScale = d3.scaleLinear(),
    yValue = function (d) {
      return yScale(y(d));
    };

  var speaker = function (d) {
    // console.log("get sp..", d);
    return d[0];
  },
    speakerScale = d3.scaleBand().range([0, height]),
    speakerValue = function (d) {
      // console.log("sprkcl", speaker(d));
      return speakerScale(speaker(d));
    },
    speakerAxis = d3.axisLeft(speakerScale);

  // Try  different  curve types!
  var area = d3.area().x(xValue).y1(yValue);
  // .curve(d3.curveCardinal);

  var line = area.lineY1();



  d3.selectAll(".ridges").remove();

  const margin = { left: 75, top: 0, bottom: 0, right: 0 };

  var svg = d3
    .select(".ridges-container")
    .append("svg")
    .attr("class", "ridges")
    .attr("width", width - margin.left)
    .attr("height", height - margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // d3.json(`./assets/${playName}.json`, function (error, dataFlat) {
  // if (error) throw error;

  const dataFlat = playData;

  const spkrs3 = getLinesBySpeakerByChunk(dataFlat, chunkSize);

  // console.log("got it", spkrs3);

  var data = d3
    .group(spkrs3, d => d.speaker)
  // .nest()
  // .key(function (d) {
  //   return d.speaker;
  // })
  // .entries(spkrs3);

  // console.log("group", data, data.size, data.keys());

  xScale.domain(d3.extent(spkrs3, x));

  speakerScale.domain(
    // [0, data.size - 1]
    data.keys()
  );

  var areaChartHeight = (1 + overlap) * (height / speakerScale.domain().length);
  // console.log("hgt", areaChartHeight);
  yScale.domain(d3.extent(spkrs3, y)).range([areaChartHeight, 0]);

  area.y0(yScale(0));

  svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g").attr("class", "axis axis--activity").call(speakerAxis);

  svg
    .selectAll(".axis--activity .tick")
    .on("mouseover", function (d, i) {
      d3.selectAll(".area").attr("class", "area");
      d3.selectAll(".axis--activity .tick").attr("font-weight", "normal");
      d3.select(this).attr("font-weight", "bold");
      // console.log("hover...", d);
      const area = d3.select(`#area-${slug(d.target.innerHTML)}`);
      area.attr("class", "area active");
    })
    .on("mouseout", function (d) {
      d3.selectAll(".area").attr("class", "area");
      d3.selectAll(".axis--activity .tick").attr("font-weight", "normal");
    })
    .on("click", function (d) {
      // runSpeaker(d);
      console.log("speaker click", d.target.innerHTML);
    });

  var gSpeaker = svg
    .append("g")
    .attr("class", "activities")
    .selectAll(".activity")
    .data(data)
    .enter()
    .append("g")
    .attr("class", function (d) {
      return "activity activity--" + d[0];
    })
    .attr("transform", function (d) {
      var ty = speakerValue(d) - speakerScale.bandwidth() + 5;
      return "translate(0," + ty + ")";
    });

  gSpeaker
    .append("path")
    .attr("class", "area")
    .attr("id", function (d, i) {
      return `area-${slug(d[0])}`;
    })
    .datum(function (d) {
      const x = d[1];
      return x;
    })
    .attr("d", area);

  gSpeaker
    .append("path")
    .attr("class", "line")
    .datum(function (d) {
      // return d.values;
      return d[1];
    })
    .attr("d", line);
};


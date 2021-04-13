
import d3 from "@/assets/d3";
import { EVENTS, EventBus } from "@/EventBus";


export const plays = [
  { value: "macbeth", label: "Macbeth" },
  { value: "merchant", label: "Merchant of Venice" },
  { value: "asyoulikeit", label: "As You Like It" },
  { value: "1henryiv", label: "Henvry IV, Part 1" },
  { value: "cleopatra", label: "Cleopatra" },
  { value: "coriolanus", label: "Coriolanus" },
  { value: "hamlet", label: "Hamlet" },
  { value: "julius_caesar", label: "Julius Caesar" },
  { value: "lear", label: "King Lear" },
  { value: "measure", label: "Measure for Measure" },
  { value: "midsummer", label: "Midummer Night's Dream" },
  { value: "much_ado", label: "Much Ado About Nothing" },
  { value: "othello", label: "Othello" },
  { value: "richardii", label: "Richard II" },
  { value: "richardiii", label: "Richard III" },
  { value: "romeo_juliet", label: "Romeo & Juliet" },
  { value: "tempest", label: "The Tempest" },
  { value: "titus", label: "Titus Andronicus" },
  { value: "troilus_cressida", label: "Troilus & Cressida" },
  { value: "twelfth_night", label: "Twelfth Night" },
]
  .sort((a, b) => a.label > b.label ? 1 : -1);

console.log("plays", plays);


export const emojiRelationships = {
  "murders": "🔫",
  "loves": "💖",
  "scorns": "",
  "hates": "",
  "serves": "",
  "commands": "", // redundant?
  "parents": "",
  "childs": "" // redundant?
};


export const CHAR_COLORS = [
  "#6495ED",
  "#40E0D0",
  "#DE3163",
  "#CCCCFF",
  "#9FE2BF",
  "#FFBF00",
  "navy",
  "maroon",
  "teal",
  "black",
  // "white",
  // "pink",
  // "coral",
];


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


// TODO: refacator to use getScenebrekadown
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



function slug(name) {
  return name.replace(/\s/g, "_");
}




export const getSpeeches = (scene) => {
  const speeches = [];

  let speech = {
    speaker: "",
    lines: [],
  };
  // console.log(scene);

  scene.lines.forEach((line, idx) => {
    if (idx === scene.lines.length - 1) {
      // last line: push speech
      speech.lines.push(line.value);
      speeches.push(speech);
      return;
    }
    if (line.type === "speech") {
      // skip first speaker line:
      if (speech.lines.length > 0) {
        speeches.push(speech);
        speech = {};
        speech.lines = [];
      }
      speech.speaker = line.value;
    } else {
      speech.lines.push(line.value);
    }
  });

  return speeches;
};




//   /*
//   Idea here is to naively assume that when person B speaks directly after person A, they are interacting.s

//   Hmm...we could alternatively try to weight interactions by num of lines
//   */
export const getCharacterInteractions = (scenes) => {
  const interactions = {};

  scenes.forEach((scene) => {
    const speeches = getSpeeches(scene);
    let prevSpeaker = speeches[0].speaker;
    speeches.slice(1).forEach((speech) => {
      if (!interactions.hasOwnProperty(prevSpeaker)) {
        interactions[prevSpeaker] = {};
      }
      if (!interactions[prevSpeaker].hasOwnProperty(speech.speaker)) {
        interactions[prevSpeaker][speech.speaker] = 0;
      }
      interactions[prevSpeaker][speech.speaker]++;
      prevSpeaker = speech.speaker;
    });
  });

  return interactions;
};




export const getInteractionTotals = (interactions) => {
  const res = {};

  Object.keys(interactions).forEach((speaker) => {
    Object.keys(interactions[speaker]).forEach((otherSpeaker) => {
      const pairRep = [speaker, otherSpeaker].sort().join("_");
      if (!res.hasOwnProperty(pairRep)) {
        res[pairRep] = 0;
      }
      res[pairRep] += interactions[speaker][otherSpeaker];
    });
  });

  // res is an object like {"Banquo_Macbeth": 42, ...}
  return Object.keys(res)
    .map((pair) => {
      return { pair, value: res[pair] };
    })
    .sort((a, b) => b.value - a.value);
  // return res;
};



export const getCharColor = (idx) => {
  // console.log("get fill", idx);
  if (idx < CHAR_COLORS.length) return CHAR_COLORS[idx];
  return "gray";
};


export const getTotalMarks = (scenes, target) => {
  let total = 0;
  let allChars = 0;

  scenes.forEach(scene => {
    scene.lines.forEach(line => {
      line.value.split("").forEach(char => {
        if (char === target) total++;
        allChars++;
      });
    });
  });

  return { total, allChars };
};



export const groupLinesByNumber = (scenes) => {
  // should be of form {1:10,2:20,3:12,4:0,....}
  let res = {};
  let maxLen = 0;

  scenes.forEach(scene => {
    const speeches = getSpeeches(scene);
    speeches.forEach(speech => {
      const len = speech.lines.length;
      if (len > maxLen) maxLen = len;
      if (!res.hasOwnProperty(len)) {
        res[len] = 0;
      }
      res[len]++
    })
  });

  const arr = [];
  for (let i = 0; i < maxLen; i++)arr.push(i);

  return arr.map(i => {
    return {
      lineLength: i,
      value: res[i] ? res[i] : 0
    }
  });
};


// returns {total, prev, scene}, all numbers of lines
const getSceneStats = (playData, sceneTitle) => {
  // console.log('get stats', sceneTitle)
  let total = 0;
  let inScene = 0;
  let prev = 0;

  let seenTarget = false;

  playData.forEach(scene => {
    const len = scene.lines.length;

    // console.log('seen', scene.title)
    if (scene.title === sceneTitle) {
      inScene = len;
      seenTarget = true;
    }
    if (!seenTarget) {
      prev += len;
    }
    total += len;
  })

  return { total, scene: inScene, prev };
};




// =================================================================================
// CHARTS
// =================================================================================

export const runScenePie = (playData, sceneTitle, width = 200, height = 200) => {
  // Switching ideas here...this time, we'll shape the data here instead of passing it it

  const { total, prev, scene } = getSceneStats(playData, sceneTitle);

  // console.log(total, prev, scene);

  // Need to know start and end angles....
  // sum of all lines that have come already,
  // and then num of lines in scene,
  // and total in play

  const startAngle = (360 * prev / total) * Math.PI / 180;
  const endAngle = startAngle + (360 * scene / total) * Math.PI / 180;

  // console.log(startAngle, endAngle);

  d3.selectAll(".scenepie").remove();

  var svg = d3
    .select(".scenepie-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "scenepie")
    .append("g");

  var generator = d3.arc()
    .innerRadius(0)
    .outerRadius(width / 2)
    .startAngle(startAngle)
    .endAngle(endAngle);

  svg.append('circle')
    .attr('r', width / 2)
    .attr('cx', width / 2)
    .attr('cy', width / 2)
    .attr('fill', 'gray')
  // .attr('stroke', 'black')

  svg.append('path')
    .attr("d", generator)
    .attr("fill", "cyan")
    // .attr("stroke", "black")
    .attr("transform", `translate(${width / 2},${width / 2})`)
  // .attrs({
  //   d: generator,
  //   transform: 'translate(65, 65)',
  //   fill: 'cyan',
  //   stroke: 'black'
  // });
};

export const runPiecharts = (playData, speakerAmts = [], width = 500, height = 350) => {
  const margin = { left: 80, top: 0, bottom: 0, right: 0 };
  const w = width + margin.left + margin.right;
  const h = height + margin.top + margin.bottom;

  d3.selectAll(".pie").remove();

  var svg = d3
    .select(".pie-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "pie")
    .append("g");

  // console.log('running piecharts', svg)

  const scenesPerAct = {};
  playData.forEach(scene => {
    const [actNum, sceneNum] = scene.title.split(".").map((x) => parseInt(x) - 1);
    if (!scenesPerAct.hasOwnProperty(actNum)) {
      scenesPerAct[actNum] = 0;
    }
    scenesPerAct[actNum]++;
  });

  const maxScenesPerAct = Math.max(...Object.keys(scenesPerAct).map(key => scenesPerAct[key]));
  // console.log("max..", maxScenesPerAct);

  playData.forEach((scene) => {
    const bd = getSceneBreakdown(scene);

    const treeData = {
      children: bd.speakerAmts.map((amt, i) => {
        // TODO: index must be index in playBreeakdown.speakerAmts
        // const i
        const charName = amt.speaker;
        const charIdx = speakerAmts.findIndex((x) => x.speaker === charName);
        // return getCharColor(charIdx);
        return { ...amt, ...{ fill: getCharColor(charIdx), title: scene.title } };
      }),
    };

    // console.log(scene);

    const [actNum, sceneNum] = scene.title.split(".").map((x) => parseInt(x) - 1);

    var root = d3.hierarchy(treeData).sum(function (d) {
      return d.value;
    });

    // const WIDTH_SCL = 0.17;

    // TODO: Not correct.....
    const WIDTH_SCL = 1 / (maxScenesPerAct + 1);
    const HEIGHT_SCL = 0.17;
    const PADDING = 10;

    d3
      .treemap()
      // .size([(width * scene.lines.length) / avgNumLines, (height * scene.lines.length) / avgNumLines])
      .size([(width - margin.left - PADDING * maxScenesPerAct) * WIDTH_SCL, height * HEIGHT_SCL])
      .padding(2)(root);

    svg
      .selectAll("any_text_here_doesnt_matter")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return d.x0;
      })
      .attr("y", function (d) {
        return d.y0;
      })
      .attr("width", function (d) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d) {
        return d.y1 - d.y0;
      })
      .attr("cursor", "pointer")
      .style("stroke", "black")
      .attr("data-title", function (d) {
        // console.log("d", d);
        return d.data.title;
      })
      .style("fill", function (d) {
        // console.log("f", d.data.fill);
        return d.data.fill;
        // return "blue";
      })
      .attr("transform", function (d) {
        return `translate(${margin.left + sceneNum * (width * WIDTH_SCL + PADDING)}, ${PADDING + actNum * (height * HEIGHT_SCL + PADDING)})`;
      })
      .on("click", (ev) => {
        // console.log("click", ev.target.dataset.title)
        EventBus.$emit(EVENTS.CLICK_SCENE, ev.target.dataset.title);
      })
  });

  // Y axis
  var y = d3.scaleBand()
    .range([0, height])
    .domain([0, 1, 2, 3, 4].map(n => `Act ${n + 1}`))
    .padding(.1);
  svg.append("g")
    .attr("transform", `translate(${margin.left - 10},0)`)
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("fill", "black")
};




// data looks like [{lineLength:1,value:10},...]
export const runLinegroups = (data = [], width = 500, height = 300) => {
  const margin = { left: 80, top: 0, bottom: 30, right: 0 };
  const w = width + margin.left + margin.right;
  const h = height + margin.top + margin.bottom;

  d3.selectAll(".linegroups").remove();

  console.log("data..linegroup", data);

  var svg = d3.select(".linegroups-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "linegroups")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  const max = Math.max(...data.map(d => d.value));
  console.log("max linegroup", max);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, max])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d.lineLength))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function (d) { return y(d.lineLength); })
    .attr("width", function (d) { return x(d.value); })
    .attr("height", y.bandwidth())
    .attr("fill", function (d) {
      // const idx = speakerAmts.findIndex(s => s.speaker === d.speaker);
      // return getCharColor(idx);
      return "steelblue"
    });
};






export const runCharacters = (data = {}, width = 500, height = 300) => {
  const margin = { left: 80, top: 0, bottom: 30, right: 0 };
  const w = width + margin.left + margin.right;
  const h = height + margin.top + margin.bottom;

  d3.selectAll(".characters").remove();

  // const data = speakerAmts;
  const { numLines, speakerAmts } = data;
  // console.log(data);

  var svg = d3.select(".characters-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "characters")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  const max = Math.max(...speakerAmts.map(s => s.value)) * numLines;
  // console.log("max", max);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, max])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([0, height])
    .domain(speakerAmts.map(function (d) { return d.speaker; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(speakerAmts)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function (d) { return y(d.speaker); })
    .attr("width", function (d) { return x(d.value * numLines); })
    .attr("height", y.bandwidth())
    .attr("fill", function (d) {
      const idx = speakerAmts.findIndex(s => s.speaker === d.speaker);
      return getCharColor(idx);
    });
};




export const runInteractions = (data, speakerAmts = [], width = 500, height = 300) => {
  const margin = { left: 150, top: 0, bottom: 30, right: 30 };
  const w = width + margin.left + margin.right;
  const h = height + margin.top + margin.bottom;

  d3.selectAll(".interactions").remove();

  var svg = d3.select(".interactions-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "interactions")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  const max = Math.max(...data.map(s => s.value));

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, max])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(function (d) { return d.pair; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function (d) { return y(d.pair); })
    .attr("width", function (d) { return x(d.value) / 2; })
    .attr("height", y.bandwidth())
    .attr("fill", function (d) {
      // console.log('get fill', d);
      const names = d.pair.split("_");
      const idxs = names.map(name => speakerAmts.findIndex(s => s.speaker === name));
      const fills = idxs.map(i => getCharColor(i));
      // const fill = getCharColor()
      return fills[0];
      // return "green";
      // return `linear-gradient(to right, blue, red)`;
    })

  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.value) / 2; })
    .attr("y", function (d) { return y(d.pair); })
    .attr("width", function (d) { return x(d.value) / 2; })
    .attr("height", y.bandwidth())
    .attr("fill", function (d) {
      const names = d.pair.split("_");
      const idxs = names.map(name => speakerAmts.findIndex(s => s.speaker === name));
      const fills = idxs.map(i => getCharColor(i));
      return fills[1];
    })
};





export const runRidgelines = (playData, chunkSize = 10, width = 500, height = 300, overlap = 0.6, speakerAmts = []) => {
  const margin = { left: 100, top: 30, bottom: 30, right: 200 };
  const w = width + margin.left + margin.right;
  const h = height + margin.top + margin.bottom;

  // TODO: This affects the top one weirdly...add margin top? Yeah...need more for fewer speakers
  // Basicaclly areaChartHeightshould control marginTOp
  // var overlap = 0.6;

  var x = function (d) {
    return d.chunkIdx;
  },
    xScale = d3.scaleLinear().range([0, width]),
    xValue = function (d) {
      return xScale(x(d));
    },
    xAxis = d3.axisBottom(xScale);

  var y = function (d) {
    return d.value;
  },
    yScale = d3.scaleLinear(),
    yValue = function (d) {
      return yScale(y(d));
    };

  var speaker = function (d) {
    return d[0];
  },
    speakerScale = d3.scaleBand().range([0, height]),
    speakerValue = function (d) {
      return speakerScale(speaker(d));
    },
    speakerAxis = d3.axisLeft(speakerScale);

  // Try  different  curve types!
  var area = d3.area().x(xValue).y1(yValue).curve(d3.curveCardinal);

  var line = area.lineY1();


  // ==================

  d3.selectAll(".ridges").remove();

  var svg = d3
    .select(".ridges-container")
    .append("svg")
    .attr("class", "ridges")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const dataFlat = playData;
  const spkrs3 = getLinesBySpeakerByChunk(dataFlat, chunkSize);
  // console.log("got it", spkrs3);

  var data = d3
    .group(spkrs3, d => d.speaker)

  xScale.domain(d3.extent(spkrs3, x));

  speakerScale.domain(
    // [0, data.size - 1]
    data.keys()
  );

  var areaChartHeight = (1 + overlap) * (h / speakerScale.domain().length);
  // console.log("hgt", areaChartHeight);
  yScale.domain(d3.extent(spkrs3, y)).range([areaChartHeight, 0]);

  area.y0(yScale(0));

  svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + h + ")")
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
      // console.log("speaker click", d.target.innerHTML);
      EventBus.$emit(EVENTS.CLICK_SPEAKER, d.target.innerHTML);
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
    .attr("fill", function (d) {
      const idx = speakerAmts.findIndex(s => s.speaker === d[0]);
      return getCharColor(idx);
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


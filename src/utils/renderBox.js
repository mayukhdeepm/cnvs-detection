import labels from "./labels.json";

// /**
//  * Render prediction boxes
//  * @param {HTMLCanvasElement} canvas canvas tag reference
//  * @param {Array[Object]} boxes boxes array
//  */

// export const renderBoxes = (canvas, boxes) => {
//   const ctx = canvas.getContext("2d");
//   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas

//   const colors = new Colors();

//   // font configs
//   const font = `${Math.max(
//     Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
//     14
//   )}px Arial`;
//   ctx.font = font;
//   ctx.textBaseline = "top";

  // boxes.forEach((box) => {
  //   const klass = labels[box.label];
  //   const color = colors.get(box.label);
  //   const score = (box.probability * 100).toFixed(1);
  //   const [x1, y1, width, height] = box.bounding;

  //   // draw box.
  //   ctx.fillStyle = Colors.hexToRgba(color, 0.2);
  //   ctx.fillRect(x1, y1, width, height);
  //   // draw border box
  //   ctx.strokeStyle = color;
  //   ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
  //   ctx.strokeRect(x1, y1, width, height);

  //   // draw the label background.
  //   ctx.fillStyle = color;
  //   const textWidth = ctx.measureText(klass + " - " + score + "%").width;
  //   const textHeight = parseInt(font, 10); // base 10
  //   const yText = y1 - (textHeight + ctx.lineWidth);
  //   ctx.fillRect(
  //     x1 - 1,
  //     yText < 0 ? 0 : yText,
  //     textWidth + ctx.lineWidth,
  //     textHeight + ctx.lineWidth
  //   );

  //   // Draw labels
  //   ctx.fillStyle = "#ffffff";
  //   ctx.fillText(klass + " - " + score + "%", x1 - 1, yText < 0 ? 1 : yText + 1);
  // });
  const numbers = [
    15, 14, 13.3, 12.8, 12.6, 12.3, 12, 11.8, 11.6, 11.2,
    10.8, 10.65, 10.5, 10.37, 10.1, 9.7, 9.55, 9.4, 9.35,
    9.15, 8.9, 8.6, 8.3, 8.18, 8.05, 7.8, 7.58, 7.35, 7.19, 6.8
];
const mold = ["1 to 4",
    "2 to 5",
    "3 to 6",
    "4 to 7",
    "5 to 8",
    "6 to 9",
    "7 to 10",
    "8 to 11",
    "9 to 12",
    "10 to 13",
    "11 to 14",
    "12 to 15",
    "13 to 16",
    "14 to 17",
    "15 to 18",
    "16 to 19",
    "17 to 20",
    "18 to 21",
    "19 to 22",
    "20 to 23",
    "21 to 24",
    "22 to 25",
    "23 to 26",
    "24 to 27",
    "25 to 28",
    "26 to 29",
    "27 to 30",]


  // boxes.forEach((box) => {
  //   let distance = 1.1;
  //   const klass = labels[box.label];
  //   const color = colors.get(box.label);
  //   const score = (box.probability * 100).toFixed(1);
  //   const [x1, y1, width, height] = box.bounding;
  //   const c = `${klass}`
  //   const w = (width * distance / 11.5).toFixed(1);

    
  //   let closeWidth = null;
  //   let difference = Infinity;
  //   let closestMold = null;
  
  //   // loop over the numbers 
  //   for (let i = 0; i < numbers.length; i++) {
  //     // calculate the difference between the current width and the values in the above array
  //     const currentDifference = Math.abs(numbers[i] - w);
  
  //     // Update the closest width
  //     if (currentDifference < difference) {
  //       closeWidth = numbers[i];
  //       closestMold = mold[i]
  //       difference = currentDifference;
  //     }
  //   }

    // Create an image object
    // const imagee = new Image();
    // imagee.src = 'https://cdn.glitch.global/b5968d84-2873-460f-bd3c-4dffa532138f/hairdss.png'; 

    // // Draw the image
    // imagee.onload = function () {
    //   ctx.drawImage(imagee, x1, y1, width, height);
    // };

    // Draw the label background
//     ctx.fillStyle = color;
//     const textWidth = ctx.measureText(klass + " - " + score + "%").width;
//     const textHeight = parseInt(font, 10); // base 10
//     const yText = y1 - (textHeight + ctx.lineWidth);
//     ctx.fillRect(
//       x1 - 1,
//       yText < 0 ? 0 : yText,
//       textWidth + ctx.lineWidth,
//       textHeight + ctx.lineWidth
//     );

//     // Draw labels
//     ctx.fillStyle = "#ffffff";
//     ctx.fillText(klass + " - " + score + "%", x1 - 1, yText < 0 ? 1 : yText + 1, closeWidth, closestMold);

//   });
// };

export let wValues = [];

export const renderBoxes = (canvas, boxes) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas

  const colors = new Colors();

  // font configs
  const font = `${Math.max(
    Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
    14
  )}px Arial`;
  ctx.font = font;
  ctx.textBaseline = "top";

  boxes.forEach((box) => {
    let distance = 1.1;
    const klass = labels[box.label];
    const color = colors.get(box.label);
    const score = (box.probability * 100).toFixed(1);
    const [x1, y1, width, height] = box.bounding;
    const c = `${klass}`
    const w = (width * distance / 4.77).toFixed(1);
    // const w = (width * distance / 2.70).toFixed(1);

    wValues.push(parseFloat(w));

    let closeWidth = null;
    let difference = Infinity;
    let closestMold = null;

    // draw box.
    ctx.fillStyle = Colors.hexToRgba(color, 0.2);
    ctx.fillRect(x1, y1, width, height);
    // draw border box
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
    ctx.strokeRect(x1, y1, width, height);

    // loop over the numbers 
    for (let i = 0; i < numbers.length; i++) {
      // calculate the difference between the current width and the values in the above array
      const currentDifference = Math.abs(numbers[i] - w);

      // Update the closest width
      if (currentDifference < difference) {
        closeWidth = numbers[i];
        closestMold = mold[i]
        difference = currentDifference;
      }
    }

    ctx.fillStyle = color;
    const textWidth = ctx.measureText(klass + " - " + score + "%").width;
    const textHeight = parseInt(font, 10); // base 10
    const yText = y1 - (textHeight + ctx.lineWidth);
    ctx.fillRect(
      x1 - 1,
      yText < 0 ? 0 : yText,
      textWidth + ctx.lineWidth,
      textHeight + ctx.lineWidth
    );

    ctx.fillStyle = "black"; // set fillStyle to black
    ctx.fillText(klass + " - " + score + "%", x1 - 1, yText < 0 ? 1 : yText + 1);
    ctx.fillText(w, x1 - 0, yText < 0 ? 1 : yText - 25)
    ctx.fillText(closestMold, x1 - 0, yText < 0 ? 1 : yText - 50)
    console.log(wValues);
  });
};

class Colors {
  // ultralytics color palette https://ultralytics.com/
  constructor() {
    this.palette = [
      "#FF3838",
      "#FF9D97",
      "#FF701F",
      "#FFB21D",
      "#CFD231",
      "#48F90A",
      "#92CC17",
      "#3DDB86",
      "#1A9334",
      "#00D4BB",
      "#2C99A8",
      "#00C2FF",
      "#344593",
      "#6473FF",
      "#0018EC",
      "#8438FF",
      "#520085",
      "#CB38FF",
      "#FF95C8",
      "#FF37C7",
    ];
    this.n = this.palette.length;
  }

  get = (i) => this.palette[Math.floor(i) % this.n];

  static hexToRgba = (hex, alpha) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${[parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)].join(
        ", "
      )}, ${alpha})`
      : null;
  };
}

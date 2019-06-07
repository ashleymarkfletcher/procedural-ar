// require your Spark modules normally
const Scene = require('Scene')
const Diagnostics = require('Diagnostics')
const TouchGestures = require('TouchGestures')
const Materials = require('Materials')
const Time = require('Time')
// const DeviceMotion = require('DeviceMotion')
// const deviceWorldTransform = DeviceMotion.worldTransform

// add in your external modules either above or the es6 way below
import * as rangeMap from 'range-map'
import * as SimplexNoise from 'simplex-noise'

// all the materials for different heights
const blueMat = Materials.get('blue')
const greenMat = Materials.get('green')
const yellowMat = Materials.get('yellow')
const redMat = Materials.get('red')
const brownMat = Materials.get('brown')
const greyMat = Materials.get('grey')

const mats = [blueMat, yellowMat, greyMat, brownMat, greenMat, redMat]

// const mats = [blueMat, blueMat, yellowMat, yellowMat, yellowMat, greyMat, greyMat, greyMat, bownMat, greenMat, redMat]

// function to grab all the blocks upto a given number
const getBlocks = numBlocks => {
  let blocks = []

  for (let i = 0; i < numBlocks; i++) {
    blocks.push(Scene.root.find('block' + i))
  }
  return blocks
}

const blocksContainer = Scene.root.find('blocks')

// blocksContainer.transform.x = deviceWorldTransform.x.div(2)
// blocksContainer.transform.z = deviceWorldTransform.z.div(2)

// get all the blocks
const numBlocks = 100
let blocks = getBlocks(numBlocks)

// specify the shape of the grid
const numRows = 10
const numColumns = 10

// an initial hieght to offset the cubes so they aren't going through the floor
const floorHeight = 5
const boxSize = 10

const round10 = x => Math.floor(x / 10) * 10

const stepFactor = 0.1

// init the noise
const simplex = new SimplexNoise(Math.random)

// the amount to step each loop
const step = 0.01
// the current position in the noise
let currentStep = 0 + step

// loop over the grid and move the blocks to their positions
const randomMap = (numRows, numColumns, stepFactor) => {
  //   loop the cols and rows
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numColumns; col++) {
      // get the current block from the array
      const blockIndex = row * numRows + col
      const block = blocks[blockIndex]

      // use the grid position as the position in the noise
      // reduce it down to a smaller number for less wild variations
      // add the step to keep moving forward through the noise wave
      const noise2D = simplex.noise2D(row * stepFactor + currentStep, col * stepFactor + currentStep)

      // noise ranges from -1 to 1 so map it to another range
      const mapped = rangeMap(noise2D, -1, 1, 0, 50)

      // round it down to the nearest 10
      // this will give us a uniform grid vertically as well
      const rounded = round10(mapped)

      const x = col * boxSize
      const y = floorHeight + rounded
      const z = row * boxSize

      // set the position of the block
      block.transform.x = x
      block.transform.y = y
      block.transform.z = z

      // get an index for a material
      const mat = mats[rounded * 0.1]

      // set material based on the height
      block.child('Cube').material = mat
    }
  }
  // step through the noise
  currentStep += step
}

// create the initial level
const levelMap = randomMap(numRows, numColumns, stepFactor)

// create the level on an interval
Time.setInterval(() => {
  const levelMap = randomMap(numRows, numColumns, stepFactor)
}, 100)

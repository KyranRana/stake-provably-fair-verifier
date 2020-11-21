import { getFloatsForGameSeedStartingFromOffset } from "./generator/FloatGenerator"

import { MultipleResultGameEvent } from "./model/GameEvent"
import { GameSeed } from "./model/GameSeed"
import { Symbol } from "./model/ScarabSpin/Symbol"

import ScarabSlotReels from "./resources/ScarabSlotReels.json"

const NUMBER_OF_FLOATS_PER_ROUND = 5
const OUTCOMES_FOR_REELS = [30, 30, 30, 30, 41]

export default function verifyScarabSpin(
  gameSeed: GameSeed, 
  fromRound: number, 
  toRound: number
): MultipleResultGameEvent<Symbol[][]> {
    
  const numberOfIgnoredFloats = fromRound * NUMBER_OF_FLOATS_PER_ROUND
  const numberOfFloats = (toRound - fromRound + 1) * NUMBER_OF_FLOATS_PER_ROUND

  const { floats, hmacsUsed } = getFloatsForGameSeedStartingFromOffset(
    gameSeed, numberOfFloats, numberOfIgnoredFloats)

  const rounds = []
  for (let i = fromRound; i <= toRound; i++) {
    const symbols = OUTCOMES_FOR_REELS.map((outcomesForReel, j) => {
      const index = Math.floor(floats[rounds.length * NUMBER_OF_FLOATS_PER_ROUND + j] * outcomesForReel)

      return [
        inBounds(ScarabSlotReels[j], index - 1),
        inBounds(ScarabSlotReels[j], index),
        inBounds(ScarabSlotReels[j], index + 1)
      ]
    })
    rounds.push(symbols)
  }
  return { results: rounds, hmacsUsed }
}

function inBounds(array: any[], index: number): any {
  if (index < 0) {
    return array[array.length + index]
  } else if (index >= array.length) {
    return array[index - array.length]
  }
  return array[index]
}

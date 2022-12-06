let remainingWords = WORDS
let curRow = 1
let hasWon = false

const divs = document.querySelector('#help-button').parentElement
let buttons
let keysMap = {}

const letters = 'abcdefghijklmnopqrstuvwxyz'

const getButtons = () => {
  return Array.from(document.querySelectorAll('button')).filter((el) => {
    return el.hasAttribute('data-key')
  })
}

const makeKeys = (buttons) => {
  buttons.forEach((button) => {
    const key = button.getAttribute('data-key')
    if (key === '←') {
      keysMap['backspace'] = button
    } else if (key === '↵') {
      keysMap['enter'] = button
    } else keysMap[key] = button
  })
}

const writeWord = (word) => {
  word.split('').forEach((letter) => {
    keysMap[letter].click()
  })
  keysMap['enter'].click()
}

const correctLetters = []
const filterWords = (label, index) => {
  if (!label || label === 'empty') return
  const [letter, result] = label.split(' ')
  if (!letter || !result) return

  if (result === 'correct') {
    correctLetters.push(letter)
    remainingWords = remainingWords.filter((word) => word[index] === letter)
  }
  if (result === 'present') {
    correctLetters.push(letter)
    remainingWords = remainingWords.filter(
      (word) => word[index] !== letter && word.includes(letter)
    )
  }
  if (result === 'absent') {
    remainingWords = remainingWords.filter(
      (word) => word.indexOf(letter) !== index
    )
  }
}

const filterWordsAbsent = (label, index) => {
  if (!label || label === 'empty') return
  const [letter, result] = label.split(' ')
  if (!letter || !result) return

  if (result === 'absent' && !correctLetters.find((l) => l === letter)) {
    remainingWords = remainingWords.filter((word) => !word.includes(letter))
  }
}

const checkRow = (row) => {
  const label = `Row ${row}`
  const currentRow = document.querySelector('[aria-label="' + label + '"]')
  Array.from(currentRow.children).forEach((node, index) => {
    const target = node.children[0]
    filterWords(target.getAttribute('aria-label'), index)
  })
  Array.from(currentRow.children).forEach((node, index) => {
    const target = node.children[0]
    filterWordsAbsent(target.getAttribute('aria-label'), index)
  })
}

const checkIfWon = (row) => {
  const label = `Row ${row}`
  const currentRow = document.querySelector('[aria-label="' + label + '"]')
  return (
    Array.from(currentRow.children).filter((node, index) => {
      const target = node.children[0]
      const label = target.getAttribute('aria-label')
      const [letter, result] = label.split(' ')
      return result === 'correct'
    }).length === 5
  )
}

const chooseWord = () => {
  const randomIndex = Math.floor(Math.random() * remainingWords.length)
  console.log('WORD:', remainingWords[randomIndex])
  return remainingWords[randomIndex]
}

let numTries = 0
function play(interval) {
  console.log('try ', numTries + 1)
  for (let i = 1; i < 7; i++) {
    checkRow(i)
  }
  console.log('remainingWords', remainingWords.length)
  writeWord(chooseWord())
  for (let i = 1; i < 7; i++) {
    const won = checkIfWon(i)
    if (won) {
      console.log('hooray')
      hasWon = true
      clearInterval(interval)
      return
    }
  }
  numTries++
  if (numTries === 6) {
    console.log('sad panda')
    clearInterval(interval)
  }
}

function clickHandler() {
  let interval
  try {
    play()
    if (hasWon) return
    interval = setInterval(() => play(interval), 2500)
  } catch (e) {
    console.error(e)
    clearInterval(interval)
  }
}

let button = document.createElement('button')
button.innerHTML = 'Solve me'
button.onclick = clickHandler

divs.appendChild(button)

buttons = getButtons()
makeKeys(buttons)

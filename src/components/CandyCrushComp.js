import React, { useEffect, useState, useRef } from 'react'
import blueCandy from "../images/blue-candy.png"
import greenCandy from "../images/green-candy.png"
import orangeCandy from "../images/orange-candy.png"
import yellowCandy from "../images/yellow-candy.png"
import redCandy from "../images/red-candy.png"
import purpleCandy from "../images/purple-candy.png"
import blankImg from "../images/blank.png"

const width = 8;
const candyColors = [
    blueCandy,
    greenCandy,
    orangeCandy,
    yellowCandy,
    redCandy,
    purpleCandy
]

const CandyCrushComp = () => {

    const [candies, setCandies] = useState([])
    const [score, setScore] = useState(0)
    const [candyDragged, setCandyDragged] = useState(null)
    const [candyToReplace, setCandyToReplace] = useState(null)
    const currentCandies = useRef();

    const updateScore = (num) => {
        setScore(prevScore => prevScore + num);
    }

    const animateRow = (row) => {
        const elem = document.createElement("div");
        elem.classList.add("animate");
        elem.style.left = 0;
        elem.style.top = `${row * 70 + 35 + 20}px`;
        elem.style.width = 0;
        elem.style.height = "5px";

        document.querySelector(".game").append(elem);

        setTimeout(() => {
            elem.classList.add("animateRow")
            setTimeout(() => {
                elem.remove();
            }, 100)
        }, 100)
    }

    const animateColumn = (col) => {
        const elem = document.createElement("div");
        elem.classList.add("animate");
        elem.style.top = 0;
        elem.style.left = `${col * 70 + 35 + 20}px`;
        elem.style.height = 0;
        elem.style.width = "5px";

        document.querySelector(".game").append(elem);

        setTimeout(() => {
            elem.classList.add("animateColumn")
            setTimeout(() => {
                elem.remove();
            }, 100)
        }, 100)
    }

    const playSound = (id) => {
        document.querySelector(`#${id}`).play();
    }

    const setColToBlank = (index) => {
        const col = index % width;
        for (let i = 0; i < width; i++) {
            currentCandies.current[col + i * width].color = blankImg;
            currentCandies.current[col + i * width].modifier = '';
        }
        updateScore(width);
        animateColumn(col);
        playSound("line_blast");
    }

    const setRowToBlank = (index) => {
        const row = Math.floor(index / width);
        for (let i = row * width; i < (row * width + width); i++) {
            currentCandies.current[i].color = blankImg;
            currentCandies.current[i].modifier = '';
        }
        updateScore(width);
        animateRow(row);
        playSound("line_blast");
    }

    const checkForColumns = (num, indexes = null) => {
        for (let i = 0; i < (width * width - (num - 1) * width); i++) {
            const columns = [];

            for (let j = 0; j < num; j++) {
                columns.push(i + j * width)
            }

            const decidedColor = currentCandies.current[i].color
            const isBlank = decidedColor === blankImg;

            if (isBlank) continue;
            if (columns.every(square => currentCandies.current[square].color === decidedColor)) {
                updateScore(num)

                let specialCandyIndex = -1;
                if (num > 3) {
                    specialCandyIndex = columns.findIndex(col => indexes?.includes(col))
                    if (specialCandyIndex === - 1) specialCandyIndex
                     = 0;
                    playSound("striped_candy_created");
                }

                for (let j = 0; j < columns.length; j++) {
                    if (j === specialCandyIndex) {
                        currentCandies.current[columns[j]].modifier = 'horizontal';
                        continue;
                    }

                    if (currentCandies.current[columns[j]].modifier) {
                        if (currentCandies.current[columns[j]].modifier === 'vertical') {
                            setColToBlank(columns[j])
                        }
                        if (currentCandies.current[columns[j]].modifier === 'horizontal') {
                            setRowToBlank(columns[j])
                        }
                    }
                    else {
                        currentCandies.current[columns[j]].color = blankImg;
                        currentCandies.current[columns[j]].modifier = '';
                    }

                }
                return true;
            }
        }
    }

    const checkForRows = (num, indexes = null) => {

        for (let i = 0; i < width * width; i++) {
            const rows = [];

            for (let j = 0; j < num; j++) {
                rows.push(i + j)
            }
            const decidedColor = currentCandies.current[i].color;

            const isBlank = decidedColor === blankImg;
            if ((width - (i % width) < num) || isBlank) {
                continue;
            }

            if (rows.every(square => currentCandies.current[square].color === decidedColor)) {
                updateScore(num);

                let specialCandyIndex = -1;
                if (num > 3) {
                    specialCandyIndex = rows.findIndex(row => indexes?.includes(row))
                    if (specialCandyIndex === - 1) specialCandyIndex = 0;
                    playSound("striped_candy_created");
                }


                for (let j = 0; j < rows.length; j++) {

                    if (j === specialCandyIndex) {
                        currentCandies.current[rows[j]].modifier = 'vertical';
                        continue;
                    }

                    if (currentCandies.current[rows[j]].modifier) {
                        if (currentCandies.current[rows[j]].modifier === 'vertical') {
                            setColToBlank(rows[j])
                        }
                        if (currentCandies.current[rows[j]].modifier === 'horizontal') {
                            setRowToBlank(rows[j])
                        }
                    }
                    else {
                        currentCandies.current[rows[j]].color = blankImg;
                        currentCandies.current[rows[j]].modifier = '';
                    }
                }
                return true;

            }
        }
    }

    const moveIntoSquareBelow = () => {
        for (let i = 0; i < width * width - width; i++) {
            const isFirstRow = i < width;
            if (isFirstRow && currentCandies.current[i].color === blankImg) {

                const randomColors = candyColors[Math.floor(Math.random() * candyColors.length)]
                currentCandies.current[i].color = randomColors;
                currentCandies.current[i].modifier = '';
            }

            if (currentCandies.current[i + width].color === blankImg) {
                currentCandies.current[i + width].color = currentCandies.current[i].color;
                currentCandies.current[i + width].modifier = currentCandies.current[i].modifier;
                currentCandies.current[i].color = blankImg;
                currentCandies.current[i].modifier = '';
            }
        }
    }

    const dragStart = (e) => {
        console.log("dragStart", e.target)
        setCandyDragged(e.target)
    }

    const dragDrop = (e) => {
        console.log("dragDrop", e.target)
        setCandyToReplace(e.target)
    }

    const dragEnd = (e) => { 
        const draggedCandyIndex = parseInt(candyDragged.getAttribute('data-index'))
        const replaceCandyIndex = parseInt(candyToReplace.getAttribute('data-index'))

        const validMoves = [
            draggedCandyIndex - 1,
            draggedCandyIndex - width,
            draggedCandyIndex + 1,
            draggedCandyIndex + width
        ]

        const validMove = validMoves.includes(replaceCandyIndex)
        if (!validMove) return;

        // Check for 2 special Candies //
        if (currentCandies.current[replaceCandyIndex].modifier && currentCandies.current[draggedCandyIndex].modifier) {
            setRowToBlank(replaceCandyIndex)
            setColToBlank(replaceCandyIndex)
            return;
        }

        currentCandies.current[replaceCandyIndex].color = candyDragged.getAttribute('data-src')
        currentCandies.current[replaceCandyIndex].modifier = candyDragged.getAttribute('data-modifier')

        currentCandies.current[draggedCandyIndex].color = candyToReplace.getAttribute('data-src')
        currentCandies.current[draggedCandyIndex].modifier = candyToReplace.getAttribute('data-modifier')

        const isAColumnOfFour = checkForColumns(4, [draggedCandyIndex, replaceCandyIndex])
        const isARowOfFour = checkForRows(4, [draggedCandyIndex, replaceCandyIndex])
        const isAColumnOfThree = checkForColumns(3)
        const isARowOfThree = checkForRows(3)

        if (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree) {
            setCandyDragged(null)
            setCandyToReplace(null)
        }
        else {
            currentCandies.current[replaceCandyIndex].color = candyToReplace.getAttribute('data-src');
            currentCandies.current[replaceCandyIndex].modifier = candyToReplace.getAttribute('data-modifier');

            currentCandies.current[draggedCandyIndex].color = candyDragged.getAttribute('data-src');
            currentCandies.current[draggedCandyIndex].modifier = candyDragged.getAttribute('data-modifier');
            playSound("negative_switch")
        }

    }

    const createBoard = () => {
        const randomCandies = [];
        for (let i = 0; i < width * width; i++) {
            const randomColors = candyColors[Math.floor(Math.random() * candyColors.length)]
            randomCandies.push({ color: randomColors })
        }
        setCandies(randomCandies)
        currentCandies.current = randomCandies;
        // console.log(currentCandies.current);
    }


    useEffect(() => {
        createBoard()

        const timer = setInterval(() => {
            checkForColumns(4)
            checkForRows(4)
            checkForColumns(3)
            checkForRows(3)
            moveIntoSquareBelow()
            setCandies([...currentCandies.current])
        }, 100)
        return () => clearInterval(timer)
    }, [])

    return (
        <>
            <div className='score-board'>
                <span>Score : </span><b>{score}</b>
            </div>

            <div className='game'>
                {
                    candies.map(({ color, modifier }, index) => {
                        return (
                            <div
                                key={index}
                                className={`img-container ${modifier ? modifier : ''}`}
                                data-index={index}
                                data-src={color}
                                data-modifier={modifier}
                                draggable={true}
                                onDragStart={dragStart}
                                onDragOver={e => e.preventDefault()}
                                onDragEnter={e => e.preventDefault()}
                                onDragLeave={e => e.preventDefault()}
                                onDrop={dragDrop}
                                onDragEnd={dragEnd}
                            >
                                <img src={color} />
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default CandyCrushComp






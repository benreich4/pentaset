$(document).ready(function() {
    // var shapes = ["rect", "oval", "triangle", "star"];
    // var numbers = [1,2,3,4];
    // var colors = ["red", "blue", "green", "purple"]
    // var backgrounds = ["powderBlue", "tan", "silver", "white"]

    var shapes = ["rect", "oval", "triangle"];
    var numbers = [1,2,3];
    var colors = ["red", "blue", "green"]
    var backgrounds = ["powderBlue", "tan", "silver"]
    var fills = ["empty", "stripe", "full"]

    function getDeck()
    {
        let deck = new Array();

        for(let i = 0; i < shapes.length; i++)
        {
            for(let j = 0; j < numbers.length; j++)
            {
                for(let k = 0; k < colors.length; k++) 
                {
                    for (let a = 0; a < backgrounds.length; a ++)
                    {
                        for (let b = 0; b < fills.length; b++) 
                        {
                            let card = { Shape: shapes[i], Number: numbers[j], Color: colors[k], Background: backgrounds[a], Fill: fills[b] };
                            deck.push(card);
                        }
                    }
                }
            }
        }

        return deck;
    }


    function shuffle(deck)
    {
        // for 1000 turns
        // switch the values of two random cards
        for (let i = 0; i < 1000; i++)
        {
            let location1 = Math.floor((Math.random() * deck.length));
            let location2 = Math.floor((Math.random() * deck.length));
            let tmp = deck[location1];

            deck[location1] = deck[location2];
            deck[location2] = tmp;
        }
    }

    function renderCard(el, card) {
        let innerShape = document.createElement("div");
        let shape = document.createElement("div");
        let shapes = document.createElement("div");
        shapes.className = "shapes"
        shapes.className = "shapes-num-" + card.Number;
        el.className = "card " + card.Background;
        shape.className = "shape " + card.Shape + " " + card.Color + " " + card.Fill;
        
        el.setAttribute("background", card.Background);
        el.setAttribute("shape", card.Shape);
        el.setAttribute("color", card.Color);
        el.setAttribute("fill", card.Fill);
        el.setAttribute("number", card.Number);

        innerShape.className = "inner-shape";
        shape.appendChild(innerShape.cloneNode(true));
        for(let j = 0; j < card.Number; j++) {
            shapes.appendChild(shape.cloneNode(true));
        }  
        el.appendChild(shapes)
    }

    function renderDeck(deck){
        document.getElementById("deck").innerHTML = "";
        $(".set-counter").html("1")
        for(let i = 0; i < 4; i++)
        {
            let row = document.createElement("div");
            row.className = "row"
            for(let j = 0; j < 4; j++) 
            {
                let card = document.createElement("div");
                renderCard(card, deck[(i*4)+j])
                row.appendChild(card)
            }
            document.getElementById("deck").appendChild(row);
        }
    }

    function incrementSet() {
        let n = parseInt($(".set-counter").html(),10);
        $(".set-counter").html(n + 1);
    }

    function incrementSetCounter() {
        $(".sets-avail").html(numSets()  + " sets available");
    }

    function replace(cards) {
        cards.forEach(function(card) {
            $(".card.selected").each(function(i, c) { 
                shuffle(deck)
                c.innerHTML = ""
                renderCard(c, deck[0]);
            })
        })
        // sync()
    }

    // function sync() {
    //     existingCards = $(".card").toArray().map(function(c) {
    //         let background = $(c).attr("background")
    //         let shape = $(c).attr("shape")
    //         let color = $(c).attr("color")
    //         let fill = $(c).attr("fill")
    //         let number = $(c).attr("number")

    //         let card = { Shape: shape, Number: number, Color: color, Background: background, Fill: fill };
    //         return card; 
    //     })
    // }

    function numSets() {
        let cs = $(".card").toArray()
        let c = 0
        for (i = 0; i < cs.length; i ++) {
            for (j = i + 1; j < cs.length; j ++) {
                for (k = j + 1; k < cs.length; k ++) {
                    if (isSet([cs[i], cs[j], cs[k]])) {
                        c++;
                        console.log(i + " " + j + " " + k)
                    }
                }
            }
        }
        return c;
    }


    function isSet(cs) {
        let colors = [...new Set(cs.map(function(x) { return $(x).attr("color") }))].length
        let backgrounds = [...new Set(cs.map(function(x) { return $(x).attr("background") }))].length
        let shapes = [...new Set(cs.map(function(x) { return $(x).attr("shape") }))].length
        let fills = [...new Set(cs.map(function(x) { return $(x).attr("fill") }))].length
        let numbers = [...new Set(cs.map(function(x) { return $(x).attr("number") }))].length

        return colors != 2 && backgrounds != 2 && shapes != 2 && fills != 2 && numbers != 2;
    }

    var deck = getDeck();
    shuffle(deck)
    var existingCards = deck.slice(0,16);
    renderDeck(existingCards);
    incrementSetCounter();

    function cardTouched() {
        $(this).toggleClass("selected")
        if($(".card.selected").length == 3) {
            if(isSet($(".card.selected").toArray())) {
                replace($(".card.selected").toArray())
                incrementSet();
                incrementSetCounter();
            }
        }
    }

    $(".card").bind("touchstart mousedown", cardTouched);
})
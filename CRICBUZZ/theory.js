

setTimeout(function(){
    console.log("what's Up??");
}, 5000);
console.log("Hey Dude...");

async function temp(){
    console.log("1");
    setTimeout(function(){
        console.log("2");
    }, 1000);
    console.log("3");
    setTimeout(function(){
        console.log("4");
    }, 1000);
}

temp();
console.log("5");
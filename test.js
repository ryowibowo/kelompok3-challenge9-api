const arr = [
    {
        "name":"c",
        "score":"90"
    },
    {
        "name":"b",
        "score":"20"
    },
    {
        "name":"d",
        "score":"100"
    },
    {
        "name":"a",
        "score":"80"
    },
]

let namesort=[...arr].sort((a,b)=>{
if(a.name>b.name){
    return 1;
}else if(a.name<b.name){
    return -1;
}
return 0
}
)

let scoresort=[...arr].sort((a,b)=>{
    return b.score - a.score
})

console.log(namesort)
console.log(scoresort)
console.log(arr)
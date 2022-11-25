function solution(n) {
    var arr = []
    for (let i = 1; i <= n; i++) {
        if (i % 2 !== 0 && i % 3 !== 0 && i % 5 !== 0 && i % 7 !== 0) {
            arr.push(i)
        }
    }
    console.log(arr)
    return n - arr.length
}

console.log(solution(5))
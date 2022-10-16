let random = 'ggcggaacagtgccatttgtatgctattgtagtcataccaatataaccgatctaataagcaatataccagacaagtggagtgaaacgataggacctacgttatactcggtcaatctataccttcaaagctaatgtactcaaagccgttaaacagggtaatggtgtaaatgtcgaatggcttacgttgaggcagagcagggttgggctgctcaggccgtcctgctgttacacttactcacgtgaatgacctctgcaacatttgggtagtcgtagatctactctaggaggttatgaggtgttgaaaaagcgtggccattagttcaaaatggtcatgtaacataagtgatagccggttatgcccatctttttccggggcagtctttctaaccgtacgcgcggccagtatcttcgaggctgtctagtggggtacgcgtgtgtaccttgggtacttgaaatgtatggcccccgtggtcctttgaatcttttcgatattgattatacaatagatatgcccgttttgcagatatgccaatctcggtcgatgtcctggcgacagtggccaccgtctgccttactaacctttcccagctaccggtggggcgtgccaaatttattgtaagaccggccattgtattccgatacccacggagctcgcctaacgtgtagcagttattctcgagataatgttctagcaaaactgacgactgccttgggttaaaagggcatgcgcttcctgtccttattggcccccattttccgagtagctcacagtttcatcgttatgaaataagttgtactcaatgggactaagggctattccgcgaattggctcgattggtccgtaccgaatgcgatggctagaggatgtatatctatccagacacggtccccctagacaatgtatgattatccgcgttacagggatcagggaacgaatgaggatcccgaccgtggcatggccggccagtcatgagctccccgatattgtagttaggcgcacctatcgagcattccgggaatgcgtggatgactaactgctagggcgcgctactacggaagcttcgtaaacactattgtgtgcctcattcgaccaccggtgctagccatcagagcgattcccgcgaaccgacgtgagacgtccggctgagccacgaaagacaattaggtggggatccagttccgcatatgggggggaactacgtccagttggatatcgcaacttgcatcactacatggacagattgtgaaataaaagcagctaggcggcccatcgtaaccttttctcagaggttcgtgagaggctttcgcctacaaacgctaaccgtaagcattgtcttacgctctctatgaagtatggacccactagggatgaccgtctttcagtgacgaaaacatagccatatgtcgcttagtaacagccaaggaaggcgcccccaatggttaaataccctatagggaaacgaatactcctccgacgtccgctcacaacaccgccgaaatagtaattacaaagcgcttgaccagaataatagggtcacgggaactttttcggtgccggtattcccggttagtcaactgttgctgggtggtcagtaactgtgttacagctccacggagattgtgcgccagcgctatccgaaaattgtctcattaccaacttatagctaacctaggcgggttctcctttggtttatatagttatgtcgtatgactcagtttgttacgaattgggacagtcataattggcgttcatagatgccaatgttcttctgtatggtatacggatcatgcttacgacagtgaccgggcatgaaaatgcacgcatctgcgacttacagcccacatgagtcctacgtagtgagcatctggagcagtgcaatggtacgctggcaggctagagatccattcggggcaccttggttgacgcggcgaggcgttgacccccctcttcaagctaggtgcgctactttctatcccaacgccaccccggacgattcagc'

function toUpperCaseFunc(string) {
    return string.toUpperCase()
}

function splitFunc(string) {
    return string.match(/.{1,3}/g)
}

function prettyFunc(string) {
    let upper = toUpperCaseFunc(string)
    let split = splitFunc(upper)
    for (let i = 0; i < split.length; i++) {
        if (split[i] === "ATG") {
            split[i] = `<span style="font-weigth: bold; color: green;">${split[i]}</span>`
        }
        else if (split[i] === "TAA" || split[i] === "TAG" || split[i] === "TGA") {
            split[i] = `<span style="background-color: yellow;">${split[i]}</span>`
        }
    }
    return split.join(" ")
}

function DNAComplementary(string) {
    let complementary = string
    complementary = complementary.replaceAll("a", "T")
    complementary = complementary.replaceAll("t", "A")
    complementary = complementary.replaceAll("c", "G")
    complementary = complementary.replaceAll("g", "C")
    let split = splitFunc(complementary)
    return split.join(" ")
}

function stats(string) {
    string = toUpperCaseFunc(string)
    let split = splitFunc(string)
    let stats = []
    for (let i = 0; i < split.length; i++) {
        if (checkRepeat(split[i], stats) === -1) {
            stats.push([split[i], 1])
        }
        else {
            stats[checkRepeat(split[i], stats)][1]++
        }
    }
    let sortedArray = stats.sort((a, b) => b[1] - a[1])
    document.write("<div>")
    for (let i = 0; i < sortedArray.length; i++) {
        if (i%5===0 || i === 0){
            var color = (Math.round(Math.random() * 0xFFFFFF)).toString(16)
        }
        document.write(`<div style="background-color: #${color}">${sortedArray[i][0]} - ${sortedArray[i][1]}</div>`)
    }
    document.write("</div>")
}

function checkRepeat(string, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][0] === string) {
            return i
        }
    }
    return -1
}

stats(random)
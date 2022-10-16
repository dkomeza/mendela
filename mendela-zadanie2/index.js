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
    namesDict = {ATA: 0, TGA : 0, ACT : 0, ATG : 0, AGT : 0, TTA : 0, GGA : 0, TAC : 0, GCA : 0, AAA : 0, TGT : 0, TAA : 0, AGC : 0, TAT : 0, GTT : 0, TAG : 0, CCC : 0}
    const keys = Object.keys(namesDict);
    keys.forEach((key, index) => {
        let regex = new RegExp(key,"g");
        namesDict[key] = string.match(regex) ? string.match(regex).length : 0
    });
    keysSorted = Object.entries(namesDict).sort((a, b) => a[1] - b[1]);
    document.write("<table style='border-spacing: 0;'>")
    for (let i = 0; i < keysSorted.length; i++) {
        if (i%5===0 || i === 0){
            var color = (Math.round(Math.random() * 16_777_215)).toString(16)
        }
        document.write(`<tr style="background-color: #${color}"><th>${keysSorted[i][0]}</th><td>${keysSorted[i][1]}</td></tr>`)
    }
    document.write("</table>")
    return keys
}

stats(random)
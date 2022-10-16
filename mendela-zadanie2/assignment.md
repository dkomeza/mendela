<pre>Linki do potrzebnej wiedzy:
	Łańcuchy (Stringi):
		<a href="https://www.w3schools.com/jsref/jsref_obj_string.asp" target="_blank">JS String - przeglądnij wszystkie metody, właściwości i wrapery tego obiektu</a>
		a zwłaszcza: length, charAt(), indexOf() / search(), lastIndexOf(), replace(), slice(), split(), substr(), substring(), toLowerCase(), toString(), toUpperCase(), trim()
	
	Tablice:
		<a href="https://www.w3schools.com/js/js_arrays.asp" target="_blank">deklarowanie tablic itp.</a>
		<a href="https://www.w3schools.com/jsref/jsref_obj_array.asp" target="_blank">JS Array - przeglądnij wszystkie metody i właściwości</a>
		a zwłaszcza: length, concat(), <sup>*</sup>findIndex() / <sup>*</sup>find(), <sup>*</sup>forEach(), includes(), indexOf(), join(), lastIndexOf(), pop(), push(), reverse(), shift(), slice(), sort(), splice(), unshift()
		<a href="https://www.w3schools.com/js/js_array_sort.asp" target="_blank">sortowanie tablic</a>
		
Zadanie:
	Przy pomocy <a href="https://www.bioinformatics.org/sms2/random_dna.html">strony</a> wygeneruj nić DNA o długości minimum 2 tysięcy znaków (podzielną przez trzy).
	Napisz skrypt, który w wprowadzonej przez użytkownika sekwencji:

		- zamieni wszystkie znaki na duże,
		- podzieli wizualnie dna na tryplety
		- wytłuści i zaznaczy kolorem zielonym (użyj wrapperów) kodony "ATG"
		- doda żółte tło kodonom "TAA", "TAG" i "TGA"
		- dopisze nić komplementarną
		- poda statystykę występowania poszczególnych kodonów, posortuje ją malejąco,
		- pokoloruje każdą kolejną piątkę dowolnym losowym kolorem (Math.random())

	przykładowo dla wejścia (prompt):
	tgaactatgataataagtttaggatacgcaaaatgttaaagctatgttccctagtga

	wypisze:
	tgaactatgataataagtttaggatacgcaaaatgttaaagctatgttccctagtga
	<span class="taa">TGA</span> ACT <span class="atg">ATG</span> ATA ATA AGT TTA GGA TAC GCA AAA TGT <span class="taa">TAA</span> AGC TAT GTT CCC <span class="taa">TAG</span> <span class="taa">TGA</span><br>
	ACT TGA TAC TAT TAT TCA AAT CCT ATG CGT TTT ACA ATT TCG ATA CAA GGG ATC ACT
	acttgatactattattcaaatcctatgcgttttacaatttcgatacaagggatcact
	
	<span style="background-color:#ab25c9;">ATA - 2</span>
	<span style="background-color:#ab25c9;">TGA - 2</span>
	<span style="background-color:#ab25c9;">ACT - 1</span>
	<span style="background-color:#ab25c9;">ATG - 1</span>
	<span style="background-color:#ab25c9;">AGT - 1</span>
	<span style="background-color:#c2c6f0;">TTA - 1</span>
	<span style="background-color:#c2c6f0;">GGA - 1</span>
	<span style="background-color:#c2c6f0;">TAC - 1</span>
	<span style="background-color:#c2c6f0;">GCA - 1</span>
	<span style="background-color:#c2c6f0;">AAA - 1</span>
	<span style="background-color:#f0cb51;">TGT - 1</span>
	<span style="background-color:#f0cb51;">TAA - 1</span>
	<span style="background-color:#f0cb51;">AGC - 1</span>
	<span style="background-color:#f0cb51;">TAT - 1</span>
	<span style="background-color:#f0cb51;">GTT - 1</span>
	<span style="background-color:#b4ffb7;">TAG - 1</span>
	<span style="background-color:#b4ffb7;">CCC - 1</span>
	
	
Pomoce:
	Zasady azotowe:
		T - Tymina
		C - Cytozyna
		G - Guanina
		A - Adenina

	Nić komplementarna:
		A &lt;-&gt; T
		C &lt;-&gt; G

	
</pre>

#!/bin/bash

echo 'Plot'
cd plot;
gnuplot plot.gp;
cd ..;

echo 'Compiling md'
pandoc project.md capitulos/*.md apendices/*.md bibliografia/bibliografia.md -f markdown -s -o memoria.pdf -V fontsize=12pt --bibliography bibliografia/bibliografia.bib --reference-links --toc -V lang=es -V documentclass=report --variable urlcolor=blue -V lof --csl=ieee.csl;

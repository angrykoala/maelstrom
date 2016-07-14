set xlabel "Time"
set xdata time

set term png size 800,600
set timefmt "%d/%m/%Y"
set format x "%m/%Y"

set ylabel "Lines of Code"


# LOC Plot
set key left top title " "

set output "loc.png"
set xrange ["10/10/2015":"20/06/2016"]

set title "Maelstrom Loc"
plot "world.dat" using 1:2 w lines title "World LOC" lw 2 , "web.dat" using 1:2 w lines title "Web LOC" lw 2 ,"users.dat" using 1:2 w lines title "Users LOC" lw 2,"bot.dat" using 1:2 w lines title "Bot LOC" lw 2 


# Gantt Plot

set ylabel "Story Points"

set key right top title " "

set output "burndown.png"
set xrange ["10/10/2015":"20/06/2016"]

set title "Burndown Chart"
plot "world.dat" using 1:4 w lines title "World" lw 2 , "web.dat" using 1:3 w lines title "Web" lw 2 ,"users.dat" using 1:3 w lines title "Users" lw 2,"bot.dat" using 1:3 w lines title "Bot" lw 2 


# World Plot
set key center top title " "

set xrange ["25/10/2015":"20/06/2016"]
set y2range ["0":"100"]

set ytics nomirror
set y2tics

set ylabel "Lines of Code"
set y2label "Coverage %"

set output "world.png"

set title "Maelstrom World"
plot "world.dat" using 1:2 w lines title "LOC" lw 2, "world.dat" using 1:3 w lines title "Coverage (%)" axes x1y2 lw 2

#set autoscale y  
#fit f1(x) "world.dat" via a0,a1,a2

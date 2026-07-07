# Usage: 'make' to build the project, 'make clean' to remove build artifacts.
all: 
	nasm -f elf64 -o main.o main.asm
	ld main.o -o main
	./main

clean:
	rm -f main.o main
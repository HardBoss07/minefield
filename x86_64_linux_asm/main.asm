;; ========================================================================
;; PROJECT: Minefield Game
;; ARCH: Linux x86-64 (NASM)
;; ========================================================================

;; Syscall & Constant Definitions
%define SYS_READ    0
%define SYS_WRITE   1
%define SYS_EXIT    60
%define STDIN       0
%define STDOUT      1

%define ROWS        8
%define COLS        12
%define MINES       5


section .rodata
    ;; Strings
    msg_prompt  db "Make your move:", 10, "W: Up", 10, "A: Left", 10, "S: Down", 10, "D: Right", 10, 0
    msg_wall_l  db "Ouch! You hit the left wall.", 10, 0
    msg_wall_r  db "Ouch! You hit the right wall.", 10, 0
    msg_ceil    db "Ouch! You hit the ceiling.", 10, 0
    msg_mine    db "Uh Oh!", 10, "You've lost by running into a mine!", 10, 0
    
    msg_win     db 10, "===================================", 10
                db "    Congratulations, you won!", 10
                db "===================================", 10, 0

section .text
    global _start

_start:
;; ========================================================================
;; PROJECT: Minefield Game
;; ARCH: Linux x86-64 (NASM)
;; ========================================================================

;; Syscall & Constant Definitions
%define SYS_READ    0
%define SYS_WRITE   1
%define SYS_EXIT    60
%define SYS_TIME    201
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

section .bss
    game_field resb ROWS * COLS
    lcg_state  resb 1

section .text
    global _start

_start:
    ; 1. Seed the RNG with current system time
    mov rax, SYS_TIME
    xor rdi, rdi
    syscall
    mov [lcg_state], rax

    ; 2. Place mines randomly
    mov r12, MINES
.place_mines:
    test r12, r12
    jz .mines_done              ; If MINES = 0, we are done

    ; Get random row (0 to ROWS-1)
    mov rdi, ROWS
    call lcg_range
    mov r10, rax                ; r10 = random row

    ; Get random col (0 to COLS-1)
    mov rdi, COLS
    call lcg_range
    mov r11, rax                ; r11 = random col

    ; Calculate 1D array offset: (row * COLS) + col
    mov rax, r10
    mov rcx, COLS
    mul rcx
    add rax, r11

    ; Check if mine is already placed here
    cmp byte [game_field + rax], 1
    je .place_mines             ; If mine is already there just loop through it again

    ; Place mine and decrement counter
    mov byte [game_field + rax], 1
    dec r12
    jmp .place_mines

.mines_done:

    ; 3. Initialize player state in global registers
    ; I keep these in registers so I don't have to deal with the stack
    mov r15, 0                  ; Player Row (starts at top: 0)
    mov r14, COLS / 2           ; Player Col (starts in middle: 6)
    mov r13, 'v'                ; Player Phase (looking down)

    ; 4. Print the inital game board
    call print_game

    ; 5. Print an extra newline for clean formatting, then the prompt
    mov rdi, 10
    call print_char

    mov rdi, msg_prompt
    call print_string

    ; 6. Exit cleanly
    mov rax, SYS_EXIT
    xor rdi, rdi                ; return code 0
    syscall


;; ========================================================================
;; SUBROUTINES
;; ========================================================================

; -------------------------------------------------------------------------
; print_game
; Iterates trhough ROWS and COLS. If the current cooridate matches
; (r15, r14), it prints the player character (r13). Otherwise it prints '.'
; -------------------------------------------------------------------------
print_game:
    xor r8, r8                  ; r8 = row iterator (0)
.row_loop:
    cmp r8, ROWS
    jge .row_done               ; FIXED: jge instead of jpe
    xor r9, r9                  ; r9 = col iterator (0)
.col_loop:
    cmp r9, COLS
    jge .col_done               ; FIXED: jge instead of jpe

    ; Check if current coordinate is the player
    cmp r8, r15
    jne .print_dot
    cmp r9, r14
    jne .print_dot

    ; Coordinate matches player, print the player phase character
    mov rdi, r13
    call print_char
    mov rdi, ' '            
    call print_char
    jmp .next_col

.print_dot:
    ; Print a dot followed by an empty space
    mov rdi, '.'
    call print_char
    mov rdi, ' '
    call print_char

.next_col:
    inc r9
    jmp .col_loop

.col_done:
    mov rdi, 10                 ; Print newline at end of row
    call print_char
    inc r8
    jmp .row_loop

.row_done:
    ret

; -------------------------------------------------------------------------
; print_string(char* str)
; Calculates the length of a null-terminated string and calls sys_write
; Input: rdi = pointer to string
; -------------------------------------------------------------------------
print_string:
    mov rsi, rdi                ; rsi = string pointer for syscall
    xor rdx, rdx                ; rdx = length counter (starts at 0)
.len_loop:
    cmp byte [rsi + rdx], 0     ; check if current char is null (0)
    je .do_print
    inc rdx
    jmp .len_loop
.do_print:
    mov rax, SYS_WRITE          ; syscall 1
    mov rdi, STDOUT             ; file descriptor 1
    syscall
    ret

; -------------------------------------------------------------------------
; print_char(char c)
; Writes a single charater to STDOUT
; Input: rdi character value (e.g. '.')
; -------------------------------------------------------------------------
print_char:
    push rdi                    ; Push char onto stack to get memory address
    mov rax, SYS_WRITE
    mov rsi, rsp                ; Point rsi to the top of stack
    mov rdi, STDOUT
    mov rdx, 1                  ; Write exactly 1 byte
    syscall
    pop rdi                     ; Restore stack to avoid memory corruption
    ret

; -------------------------------------------------------------------------
; lcg_range(max) -> random [0, max-1]
; Uses standard 64-bit LCG math: state = (state * a + c) % max
; Input: rdi = max range
; Output: rax = random number
; -------------------------------------------------------------------------
lcg_range:
    mov rax, [lcg_state]
    mov rcx, 6364136223846793005    ; LCG Multiplier
    mul rcx                         ; RDX:RAX = RAX * RCX
    add rax, 1442695040888963407    ; LCG Increment
    mov [lcg_state], rax
    
    xor rdx, rdx                    ; Clear RDX before division
    div rdi                         ; Divide RDX:RAX by RDI. Remainder goes to RDX
    mov rax, rdx                    ; Return the remainder (modulo)
    ret

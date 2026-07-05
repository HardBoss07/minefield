# Polyglot Minefield Game

A simple, text-based terminal minefield game written across multiple programming languages. The primary goal of this repository is to explore and compare language implementations, memory paradigms, and zero-dependency environments by building the exact same logic repeatedly.

Every version implements a custom **64-bit Linear Congruential Generator (LCG)** using Knuth's MMIX constants, seeded by high-resolution system time to ensure cross-platform randomness without relying on external package ecosystems.

## Project Structure & Source Code

This repository isolates each language into its own directory. Where compilation or configuration structures are expected by a standard toolchain (such as Cargo for Rust), the base project scaffolding is provided.

- **[Rust](./rust/)** \* Source: [`rust/src/main.rs`](./rust/src/main.rs)
  - Manifest: [`rust/Cargo.toml`](./rust/Cargo.toml) (Standard Cargo configuration)
- **[C](./c/)**
  - Source: [`c/main.c`](./c/main.c)
- **[C++](./cpp/)**
  - Source: [`cpp/main.cpp`](./cpp/main.cpp)
- **[Java](./java/)**
  - Source: [`java/src/main/java/dev/m4tt3o/minefield/Main.java`](./java/src/main/java/dev/m4tt3o/minefield/Main.java)
  - Manifest: [`java/pom.xml`](./java/pom.xml) (Standard Maven configuration)
- **[Kotlin](./kotlin/)**
  - Source: [`kotlin/src/main/kotlin/Main.kt`](./kotlin/src/main/kotlin/Main.kt)
  - Manifest: [`kotlin/pom.xml`](./kotlin/pom.xml) (Standard Maven configuration)
- **[Python](./python/)**
  - Source: [`python/main.py`](./python/main.py)
- **[JavaScript](./javascript/)**
  - Source: [`javascript/main.js`](./javascript/main.js)
- **[TypeScript](./typescript/)**
  - Source: [`typescript/main.ts`](./typescript/main.ts)

## How to Play

Your character (`v`, `<`, or `>`) spawns at the top center of the grid. Your objective is to cross the minefield and safely step past the bottom row (`ROWS`) without detonating a hidden mine.

### Controls

- **W**: Move Up
- **A**: Move Left
- **S**: Move Down
- **D**: Move Right

## Quick Start (Running Each Version)

Ensure your standard compiler or interpreter toolchains are available in your environment path.

### Rust

```bash
cd rust
cargo run
# Or compile manually out-of-source:
# rustc src/main.rs -o minefield && ./minefield
```

### C

```bash
cd c
gcc -O2 main.c -o minefield && ./minefield
```

### C++

```bash
cd cpp
g++ -O2 main.cpp -o minefield && ./minefield
```

### Java

```bash
cd java
# Compile manually out-of-source:
javac src/main/java/dev/m4tt3o/minefield/Main.java -d target/classes
java -cp target/classes dev.m4tt3o.minefield.Main

# Or run via Maven:
# mvn clean compile exec:java -Dexec.mainClass="dev.m4tt3o.minefield.Main"
```

### Kotlin

```bash
cd kotlin
# Compile manually out-of-source:
kotlinc src/main/kotlin/Main.kt -include-runtime -d target/minefield.jar
java -jar target/minefield.jar

# Or run via Maven:
# mvn clean compile exec:java -Dexec.mainClass="MainKt"
```

### Python

```bash
cd python
python3 main.py
```

### Node.js (JavaScript)

```bash
cd javascript
node main.js
```

### Node.js (TypeScript)

```bash
cd typescript
npx tsx main.ts
```

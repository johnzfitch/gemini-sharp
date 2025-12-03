# Gemini Sharp

A privacy-focused, enhanced Gemini CLI with custom themes and standalone executables.

## Downloads

Download the latest release for your platform:

| Platform | Download |
|----------|----------|
| Linux x64 | [gsharp-linux-x64.tar.gz](https://github.com/johnzfitch/gemini-sharp/releases/latest/download/gsharp-linux-x64.tar.gz) |
| Linux ARM64 | [gsharp-linux-arm64.tar.gz](https://github.com/johnzfitch/gemini-sharp/releases/latest/download/gsharp-linux-arm64.tar.gz) |
| macOS Apple Silicon | [gsharp-mac-arm64.tar.gz](https://github.com/johnzfitch/gemini-sharp/releases/latest/download/gsharp-mac-arm64.tar.gz) |
| macOS Intel | [gsharp-mac-x64.tar.gz](https://github.com/johnzfitch/gemini-sharp/releases/latest/download/gsharp-mac-x64.tar.gz) |
| Windows x64 | [gsharp-win-x64.zip](https://github.com/johnzfitch/gemini-sharp/releases/latest/download/gsharp-win-x64.zip) |

## Installation

### Linux / macOS

```bash
# Download and extract
curl -L https://github.com/johnzfitch/gemini-sharp/releases/latest/download/gsharp-linux-x64.tar.gz | tar xz

# Run
./linux-x64/gsharp
```

### Windows

1. Download `gsharp-win-x64.zip`
2. Extract the archive
3. Run `gsharp.exe`

## Features

- **Privacy-focused**: Telemetry disabled, no remote experiments
- **Custom themes**: 15+ Gogh color schemes included
- **Single-file executable**: No Node.js required
- **Cross-platform**: Linux, macOS, and Windows support

## Commands

```bash
gsharp              # Start interactive mode
gsharp "prompt"     # Run with a prompt
gsharp --help       # Show help
gsharp --version    # Show version
```

## Aliases

The executable responds to:
- `gsharp` (recommended)
- `gemini-sharp`
- `gemini`

## Source

Built from [johnzfitch/gemini-cli](https://github.com/johnzfitch/gemini-cli), a privacy-enhanced fork of Google's Gemini CLI.

## License

Apache-2.0

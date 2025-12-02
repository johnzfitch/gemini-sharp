# Gemini XO - Privacy-Enhanced Fork

This is a privacy-enhanced fork of
[Google's Gemini CLI](https://github.com/google-gemini/gemini-cli).

## <img src="icons/shield.png" width="24" height="24"> Privacy Enhancements

This fork adds granular privacy controls for users who want to use OAuth
authentication without enabling Google's remote telemetry and experiment
systems.

### New Privacy Settings

| Setting                                                                                | Purpose                                                                        |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| <img src="icons/eye.png" width="16" height="16"> `privacy.disableRemoteExperiments`    | Prevents Google from remotely enabling/disabling features via experiment flags |
| <img src="icons/lock.png" width="16" height="16"> `privacy.disableCodeAssistTelemetry` | Disables Clearcut telemetry logging when using OAuth authentication            |

### Configuration

Add to `~/.gemini/settings.json`:

```json
{
  "privacy": {
    "usageStatisticsEnabled": false,
    "disableRemoteExperiments": true,
    "disableCodeAssistTelemetry": true
  },
  "telemetry": {
    "enabled": false,
    "logPrompts": false,
    "useCollector": false
  }
}
```

### What This Protects Against

1. **Remote Experiments** - Google's Code Assist server can remotely
   enable/disable features in the CLI. With `disableRemoteExperiments: true`,
   your CLI behavior is fully local.

2. **Clearcut Telemetry** - Even with OAuth, usage data can be sent to
   `play.googleapis.com`. With `disableCodeAssistTelemetry: true`, this is
   blocked.

3. **Usage Statistics** - Aggregate usage data collection is disabled with
   `usageStatisticsEnabled: false`.

## <img src="icons/palette.png" width="24" height="24"> Theme Support

This fork includes 362 [Gogh](https://github.com/Gogh-Co/Gogh) color schemes
converted for Gemini CLI. Popular themes included:

- gogh-dracula
- gogh-nord
- gogh-gruvbox-dark
- gogh-tokyo-night
- gogh-catppuccin-mocha
- gogh-one-dark
- gogh-solarized-dark
- gogh-monokai-dark
- gogh-rose-pine
- gogh-tomorrow-night

Use `/theme` in Gemini CLI to switch themes.

## <img src="icons/settings.png" width="24" height="24"> Installation

```bash
# Clone this fork
git clone https://github.com/johnzfitch/gemini-xo.git
cd gemini-xo

# Install dependencies
npm install

# Build
npm run build
npm run bundle

# Link globally
ln -sf $(pwd)/bundle/gemini.js ~/.local/bin/gemini
```

## Upstream Sync

This fork stays in sync with upstream `google-gemini/gemini-cli` while
maintaining privacy enhancements.

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream (privacy settings will be preserved)
git merge upstream/main
```

## License

Apache 2.0 - Same as upstream Gemini CLI.

# Speedr 10x

A powerful browser user script that speeds up page timers by 10x to skip ads, accelerate videos, and bypass waiting times on any website.

## Features

- ⚡ **10x Speed Acceleration**: Speeds up timers, animations, and countdowns by 10x
- 🎬 **Video Playback Control**: Automatically speeds up videos to 10x when enabled
- 🎮 **Easy Controls**: Toggle between normal and 10x speed with a simple click or keyboard shortcut
- 🌐 **Universal Compatibility**: Works on any website with minimal exceptions
- 🔄 **Frame Support**: Applies speed changes to iframes and embedded content
- 🖥️ **Visual Indicator**: Shows current speed status with a subtle on-screen display

## Installation

### Prerequisites

1. Install a user script manager extension for your browser:
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/)

### Installing the Script

1. Click the "Install" button on this page or copy the script code
2. Your user script manager will prompt you to install the script
3. Click "Install" or "OK" to confirm

Alternatively, you can manually create a new script in your user script manager and paste the code.

## Usage

Once installed, you'll see a small "10x Speed: OFF" button in the top-right corner of any webpage.

- **Click the button** to toggle between normal speed and 10x speed
- **Keyboard shortcut**: Press `Alt+X` to toggle speed modes

When enabled, the button will turn green and show "10x Speed: ON".

## How It Works

The script hooks into the browser's timer functions (`setTimeout`, `setInterval`) and the `Date` object to modify the page's perceived passage of time. It also automatically detects and speeds up HTML5 video elements.

## Dependencies

This script requires the [Everything-Hook](https://greasyfork.org/scripts/372672-everything-hook) library (automatically included).

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Credits

Based on the TimerHooker project by Tiger 27.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

This script is provided for educational and convenience purposes only. Some websites may not function correctly with timer acceleration. Use at your own risk.

# <mark>Goodbye!...for now</mark>

Hello, This project is temporarily, no longer being supported. We will archive this project. And keep you updated with any changes.

# Bypass Censorship Extension

Cross-browser extension for Firefox and Chrome that suggests available
reverse-proxy urls and/or mirrors for sites that may be censored. This extension
and its list of mirrors is curated by
[BypassCensorship.org](https://bypasscensorship.org).

This was originally a fork of the
[RSF Censorship Detector](https://git.abolivier.bzh/babolivier/rsf-censorship-detector)
extension developped by [Brendan Abolivier](https://github.com/babolivier) and
[Clément Salaün](https://github.com/altitude) during the **Collateral Freedom**
hackaton organised by [Reporters Without Borders](https://en.rsf.org/) and
[An Daol Vras](http://lacantine-brest.net/) but has since been completely rewritten. To learn more about RSF's
**Collateral Freedom** initiative, visit their site
[here](https://rsf.org/collateral-freedom).

## Install

Click one of the buttons below to install this extension for Chrome or Firefox. Afterwards, you can choose to pin the extension to your toolbar.

![Chrome Web Store](https://img.shields.io/chrome-web-store/v/gdbljocmlhlhlmlcakjmmjeledigpfdl?logo=googlechrome&style=for-the-badge)

![Mozilla Add-on](https://img.shields.io/amo/v/bypass-censorship?logo=firefox&style=for-the-badge)

## Usage

The extension will add an icon next to your address bar. Most of the time, this
icon will stay unchanged, and clicking it will show a message saying that no
replication of the current tab's website has been set up by
[BypassCensorship.org](https://bypasscensorship.org).

![Screenshot 1](https://github.com/OpenTechFund/bypass-censorship-extension/blob/master/screenshots/chrome/sc1.png)

When connecting (or trying to connect) to a website for which a replicated
version has been set up by [BypassCensorship.org](https://bypasscensorship.org),
the extension's icon will turn red. Clicking it will open a pop-up page with a
button.

![Screenshot 2](https://github.com/OpenTechFund/bypass-censorship-extension/raw/master/screenshots/chrome/sc2.png)

If you click the button 'Take me to a mirror', it will bring you to the replicated website. (Alternatively, it also gives you the option to use [Tor](https://torproject.org)).

![Screenshot 3](https://github.com/OpenTechFund/bypass-censorship-extension/raw/master/screenshots/chrome/sc3.png)

The green icon means that you are currently on a mirror.

## Short Links

If you are a user that has been given an API key, you can use it to generate a special short link for any mirror URL and copy it to the clipboard. To enable that:

1. Right-click the extension button and click *Manage extension*
2. Scroll down the resulting page and click on *Extension options*
3. Paste the API key in the resulting popup.

![Screenshot 4](https://github.com/OpenTechFund/bypass-censorship-extension/raw/master/screenshots/chrome/sc4.png)

Now going back, when you click on the extension button and a mirror is available, after a moment the button will display a checkmark and a short link directly to the mirrored page will be ready to paste from your clipboard.

![Screenshot 5](https://github.com/OpenTechFund/bypass-censorship-extension/raw/master/screenshots/chrome/sc5.png)

## Contribute

If you want to contribute, please feel free to do so. The first thing to do may
be to check
[the repo's issues](https://github.com/OpenTechFund/bypass-censorship-extension/issues).
When you've found something to contribute on, just fork this repository, make
your changes, and send a pull-request.

## Build

To build a development version of the extension from source, first run
`npm install` to install the dependencies, then run the command below to create
a development build and load it in Firefox:

```
npm run build:dev
npm run start:firefox
```

To build a zip bundle for publication extension, run the command below to create
a production build in the `dist/prod` directory:

```
npm run build
```

And then run the following command to automatically bundle it in the `dist/xpi`
directory:

```
npm run build:xpi
```

## License

[<img src="https://www.gnu.org/graphics/agplv3-155x51.png" alt="AGPLv3" >](http://www.gnu.org/licenses/agpl-3.0.html)

The Bypass Censorship Extension is a free software project licensed under the
GNU Affero General Public License v3.0 (AGPLv3) by the
[Open Technology Fund](https://opentech.fund).

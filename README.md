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

Click one of the buttons below to install this extension for Chrome or Firefox.

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

If you click the button, it will bring you to the replicated website.

![Screenshot 3](https://github.com/OpenTechFund/bypass-censorship-extension/raw/master/screenshots/chrome/sc3.png)

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

import OptionsSync from 'webext-options-sync';

const DEFAULT_MIRROR_LIST = 'https://raw.githubusercontent.com/OpenTechFund/bypass-mirrors/master/mirrorSites.json';

window.options = new OptionsSync({
	defaults: {
		mirror_lists: DEFAULT_MIRROR_LIST,
	},

	// List of functions that are called when the extension is updated
	migrations: [
		// Integrated utility that drops any properties that don't appear in the defaults
		OptionsSync.migrations.removeUnused
	]
});

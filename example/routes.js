module.exports = [
	// custom routes - mapping URLs to specific controller methods
	['map', 'get', '/customPath', 'index', 'custom'],
	['map', 'post', '/customPath/:id', 'index', 'custom'],
	['map', 'get', '/customPath/:id/latest', 'index', 'customLatest']
];

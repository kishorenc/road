module.exports = [
	// custom routes - mapping URLs to specific controller methods
	['get', '/customPath', 'index', 'custom'],
	['post', '/customPath/:id', 'index', 'custom'],
	['get', '/customPath/:id/latest', 'index', 'customLatest']
];

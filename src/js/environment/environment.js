export const STATIC = window.location.port === '40333' || window.location.host === 'actarian.github.io';
export const DEVELOPMENT = ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1;
export const PRODUCTION = !DEVELOPMENT;
export const ENV = {
	STATIC,
	DEVELOPMENT,
	PRODUCTION,
	RESOURCE: '/Modules/Events/Client/docs/',
	STATIC_RESOURCE: './',
	API: '/api',
	STATIC_API: (DEVELOPMENT && !STATIC) ? '/Modules/Events/Client/docs/api' : '/api',
};
export function getApiUrl(url, useStatic) {
	const base = (useStatic || STATIC) ? ENV.STATIC_API : ENV.API;
	const json = (useStatic || STATIC) ? '.json' : '';
	return `${base}${url}${json}`;
}
export function getResourceRoot() {
	return STATIC ? ENV.STATIC_RESOURCE : ENV.RESOURCE;
}
export function getSlug(url) {
	if (!url) {
		return url;
	}
	if (url.indexOf('/ws-events') !== 0) {
		return url;
	}
	if (STATIC) {
		console.log(url);
		return url;
	}
	url = url.replace('/ws-events/', '');
	url = url.replace('.html', '');
	return `/it/it/${url}`;
}

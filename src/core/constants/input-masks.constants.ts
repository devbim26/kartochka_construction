export const phoneNumberMask = {
	mask: '+375(__)___-__-__',
	replacement: { _: /\d/ },
	showMask: true,
};

export const approvalCodeMask = {
	mask: '_-_-_-_',
	replacement: { _: /\d/ },
	showMask: true,
};

export const dateMask = {
	mask: '____-__-__',
	replacement: { _: /\d/ },
	showMask: true,
};

export const accountMask = {
	mask: 'BY__ ____ ____ ____ ____ ____ ____',
	replacement: { _: /\d/ },
	showMask: true,
};
